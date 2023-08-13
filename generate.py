#!/usr/bin/env python

import argparse
import enum
import logging
import os
import pathlib
import re
import shutil
import subprocess
import sys
import typing


class Colors(enum.StrEnum):
    """ ANSI color codes """
    BLACK = "\033[0;30m"
    RED = "\033[0;31m"
    GREEN = "\033[0;32m"
    BROWN = "\033[0;33m"
    BLUE = "\033[0;34m"
    PURPLE = "\033[0;35m"
    CYAN = "\033[0;36m"
    LIGHT_GRAY = "\033[0;37m"
    DARK_GRAY = "\033[1;30m"
    LIGHT_RED = "\033[1;31m"
    LIGHT_GREEN = "\033[1;32m"
    YELLOW = "\033[1;33m"
    LIGHT_BLUE = "\033[1;34m"
    LIGHT_PURPLE = "\033[1;35m"
    LIGHT_CYAN = "\033[1;36m"
    LIGHT_WHITE = "\033[1;37m"
    BOLD = "\033[1m"
    FAINT = "\033[2m"
    ITALIC = "\033[3m"
    UNDERLINE = "\033[4m"
    BLINK = "\033[5m"
    NEGATIVE = "\033[7m"
    CROSSED = "\033[9m"
    END = "\033[0m"
    # cancel SGR codes if we don't write to a terminal
    if not __import__("sys").stdout.isatty():
        for _ in dir():
            if isinstance(_, str) and _[0] != "_":
                locals()[_] = ""
    else:
        # set Windows console in VT mode
        if __import__("platform").system() == "Windows":
            kernel32 = __import__("ctypes").windll.kernel32
            kernel32.SetConsoleMode(kernel32.GetStdHandle(-11), 7)
            del kernel32


def green(s: str) -> str:
    return f"{Colors.GREEN}{s}{Colors.END}"


def red(s: str) -> str:
    return f"{Colors.RED}{s}{Colors.END}"


INITPYI_TEMPLATE = """
{imports}

__all__ = [
{symbols}
]
""".strip()


PROTOCOL_TEMPLATE = """
import typing


@typing.runtime_checkable
class Protocol(typing.Protocol):
    def __call__(self) -> None:
        ...
""".strip()

PROTOCOL_ASYNC_TEMPLATE = """
import typing


@typing.runtime_checkable
class Protocol(typing.Protocol):
    async def __call__(self) -> None:
        ...
""".strip()

ADAPTER_TEMPLATE = """
from injector import singleton

from {package} import protocols


@singleton
class Adapter(protocols.{name}.Protocol):
    def __call__(self) -> None:
        pass
""".strip()


ADAPTER_TEST_TEMPLATE = """
from {package}.adapters.{name} import Adapter


def test_{name}() -> None:
    pass
""".strip()

ADAPTER_ASYNC_TEMPLATE = """
from injector import singleton

from {package} import protocols


@singleton
class Adapter(protocols.{name}.Protocol):
    def __call__(self) -> None:
        pass
""".strip()


ADAPTER_ASYNC_TEST_TEMPLATE = """
import pytest

from {package}.adapters.{name} import Adapter


@pytest.mark.asyncio
async def test_{name}() -> None:
    pass
""".strip()


BINDINGS_TEMPLATE = """
from injector import Binder

from {package} import adapters, protocols

__all__ = ["configure"]


def configure(binder: Binder) -> None:
{bindings}
""".strip()

BINDINGS_MOCK_TEMPLATE = """
from unittest import mock

from injector import Binder


def configure_mocks(binder: Binder) -> None:
    pass
""".strip()

BINDINGS_TEST_TEMPLATE = """
from injector import Injector

from {package} import adapters, protocols

from .bindings import configure
from .bindings_mocks import configure_mocks


def test_configure() -> None:
    injector = Injector([configure_mocks, configure])

{bindings_asserts}
""".strip()


COMBINATOR_TEMPLATE = """
from dataclasses import dataclass

from injector import inject, singleton

from {package} import protocols


@singleton
@inject
@dataclass
class Combinator:
    def __call__(self) -> None:
        pass
""".strip()


COMBINATOR_TEST_TEMPLATE = """
from unittest import mock

from {package} import protocols
from {package}.combinators.{name} import Combinator


def test_{name}() -> None:
    # Setup data

    # Setup mocks
    manager = mock.Mock()

    # Instantiate combinator
    combinator = Combinator()

    # Execute combinator
    output = combinator()

    # Assert output (if available)
    assert output == None

    # Assert depndency calls
    assert manager.mock_calls == []
""".strip()


COMBINATOR_ASYNC_TEST_TEMPLATE = """
from unittest import mock

import pytest

from {package} import protocols
from {package}.combinators.{name} import Combinator


@pytest.mark.asyncio
async def test_{name}() -> None:
    # Setup data

    # Setup mocks
    manager = mock.Mock()

    # Instantiate combinator
    # combinator = Combinator()

    # Execute combinator
    # output = await combinator()

    # Assert output (if available)
    # assert output == None

    # Assert depndency calls
    assert manager.mock_calls == []
""".strip()


VIEW_TEMPLATE = """
from starlette.endpoints import HTTPEndpoint


class Endpoint(HTTPEndpoint):
    pass
""".strip()


VIEW_TEST_TEMPLATE = """
import pytest
from starlette.applications import Starlette
from starlette.routing import Route
from starlette.status import HTTP_405_METHOD_NOT_ALLOWED
from starlette.testclient import TestClient

from {package}.application.endpoints.{name} import Endpoint


@pytest.mark.parametrize("method", ["get", "post", "put", "patch", "delete"])
def test_{name}__405(method: str) -> None:
    app = Starlette(routes=[Route("/", endpoint=Endpoint)])

    with TestClient(app) as client:
        out = client.request(method, "/")
        assert out.status_code == HTTP_405_METHOD_NOT_ALLOWED
""".strip()


def check_name(name: str) -> None:
    if not re.compile("^[A-Za-z][A-Za-z0-9_]*$").match(name):
        raise Exception(f"invalid name: {name}")


def protocol_main(args: argparse.Namespace) -> int:
    name = typing.cast(str, args.name)
    check_name(name)
    package = typing.cast(str, args.package)
    async_ = typing.cast(bool, args.async_)
    force = typing.cast(bool, args.force)
    delete = typing.cast(bool, args.delete)
    no_open = typing.cast(bool, args.no_open)
    create_adapter = not typing.cast(bool, args.no_adapter)

    logger = logging.getLogger(__name__)
    logger.setLevel(logging.INFO)
    logger.addHandler(logging.StreamHandler())

    root = pathlib.Path(package)
    if not root.exists():
        logger.error(f"directory {root} does not exist")
        return 1

    protocols_dir = root / "protocols"
    protocol_file = protocols_dir / f"{name}.py"
    protocol_write = True

    if delete:
        protocol_file.unlink()
    else:
        if not force and protocol_file.exists():
            choice = input(f"Protocol file for {name} exists: overwrite? [yN]: ")
            protocol_write = choice.lower() in ["y", "yes"]
        if protocol_write:
            template = PROTOCOL_ASYNC_TEMPLATE if async_ else PROTOCOL_TEMPLATE
            with open(protocol_file, "w") as f:
                print(template, file=f)
            logger.info(f"protocol {name} created")
        else:
            logger.info(f"protocol {name} skipped")

    protocol_modules = sorted([file.name.removesuffix(".py") for file in protocols_dir.glob("*.py") if file.name != "__init__.py" and not file.name.endswith("_tests.py")])
    protocol_imports = "\n".join([f"from . import {filename} as {filename}" for filename in protocol_modules])
    protocol_symbols = "\n".join([f"    \"{filename}\"," for filename in protocol_modules])
    protocol_initpy = INITPYI_TEMPLATE.format(imports=protocol_imports, symbols=protocol_symbols)
    protocol_initpyi = protocols_dir / "__init__.pyi"

    if protocol_write:
        with open(protocol_initpyi, "w") as f:
            print(protocol_initpy, file=f)
        logger.info("protocol imports updated")
    else:
        logger.info("protocol imports skipped")

    adapters_dir = root / "adapters"
    adapter_file = adapters_dir / f"{name}.py"
    adapter_write = True

    if delete:
        adapter_file.unlink()
    else:
        if not force and adapter_file.exists():
            choice = input(f"Adapter file for {name} exists: overwrite? [yN]: ")
            adapter_write = choice.lower() in ["y", "yes"]
        if create_adapter and adapter_write:
            with open(adapter_file, "w") as f:
                template = ADAPTER_ASYNC_TEMPLATE if async_ else ADAPTER_TEMPLATE
                print(ADAPTER_TEMPLATE.format(name=name, package=package), file=f)
            logger.info(f"adapter {name} created")
        else:
            logger.info(f"adapter {name} skipped")

        adapter_test = adapters_dir / f"{name}_tests.py"
        if create_adapter and not adapter_test.exists():
            template = ADAPTER_ASYNC_TEST_TEMPLATE if async_ else ADAPTER_TEST_TEMPLATE
            with open(adapter_test, "w") as f:
                print(template.format(name=name, package=package), file=f)

    adapter_modules = sorted([file.name.removesuffix(".py") for file in adapters_dir.glob("*.py") if file.name != "__init__.py" and not file.name.endswith("_tests.py")])
    adapter_imports = "\n".join([f"from . import {filename} as {filename}" for filename in adapter_modules])
    adapter_symbols = "\n".join([f"    \"{filename}\"," for filename in adapter_modules])
    adapter_initpy = INITPYI_TEMPLATE.format(imports=adapter_imports, symbols=adapter_symbols)
    adapter_initpyi = adapters_dir / "__init__.pyi"

    if create_adapter and adapter_write:
        with open(adapter_initpyi, "w") as f:
            print(adapter_initpy, file=f)
        logger.info("adapter imports updated")
    else:
        logger.info("adapter imports skipped")

    bindings_list = list(set(protocol_modules) & set(adapter_modules))
    bindings = "\n".join([f"    binder.bind(protocols.{name}.Protocol, to=adapters.{name}.Adapter)" for name in bindings_list])
    bindings_file = root / "bindings.py"
    bindings_asserts = "\n\n".join([(
        f"    {name} = injector.get(protocols.{name}.Protocol)\n"
        f"    assert type({name}) == adapters.{name}.Adapter\n"
        f"    assert isinstance({name}, protocols.{name}.Protocol)"
    ) for name in bindings_list])
    bindings_mock = root / "bindings_mocks.py"
    bindings_test = root / "bindings_tests.py"

    if create_adapter:
        with open(bindings_file, "w") as f:
            print(BINDINGS_TEMPLATE.format(package=package, bindings=bindings), file=f)
        if not bindings_mock.exists():
            with open(bindings_mock, "w") as f:
                print(BINDINGS_MOCK_TEMPLATE, file=f)
        with open(bindings_test, "w") as f:
            print(BINDINGS_TEST_TEMPLATE.format(package=package, bindings_asserts=bindings_asserts), file=f)
        logger.info("bindings updated")

    if not delete and not no_open and shutil.which("code") is not None:
        if create_adapter:
            subprocess.run(["code", protocol_file, adapter_file, adapter_test])
        else:
            subprocess.run(["code", protocol_file])

    return 0


def combinator_main(args: argparse.Namespace) -> int:
    name = typing.cast(str, args.name)
    check_name(name)
    package = typing.cast(str, args.package)
    async_ = typing.cast(bool, args.async_)
    force = typing.cast(bool, args.force)
    no_open = typing.cast(bool, args.no_open)

    logger = logging.getLogger(__name__)
    logger.setLevel(logging.INFO)
    logger.addHandler(logging.StreamHandler())

    root = pathlib.Path(package)
    if not root.exists():
        logger.error(f"directory {root} does not exist")
        return 1

    combinators_dir = root / "combinators"
    combinator_file = combinators_dir / f"{name}.py"

    combinator_write = True
    if not force and combinator_file.exists():
        choice = input(f"Combinator file for {name} exists: overwrite? [yN]: ")
        combinator_write = choice.lower() in ["y", "yes"]
    if combinator_write:
        with open(combinator_file, "w") as f:
            print(COMBINATOR_TEMPLATE.format(package=package), file=f)
        logger.info(f"combinator {name} created")
    else:
        logger.info(f"combinator {name} skipped")

    combinator_test = combinators_dir / f"{name}_tests.py"
    if not combinator_test.exists():
        template = COMBINATOR_ASYNC_TEST_TEMPLATE if async_ else COMBINATOR_TEST_TEMPLATE
        with open(combinator_test, "w") as f:
            print(template.format(name=name, package=package), file=f)

    combinator_modules = sorted([file.name.removesuffix(".py") for file in combinators_dir.glob("*.py") if file.name != "__init__.py" and not file.name.endswith("_tests.py")])
    combinator_imports = "\n".join([f"from . import {filename} as {filename}" for filename in combinator_modules])
    combinator_symbols = "\n".join([f"    \"{filename}\"," for filename in combinator_modules])
    combinator_initpy = INITPYI_TEMPLATE.format(imports=combinator_imports, symbols=combinator_symbols)
    combinator_initpyi = combinators_dir / "__init__.pyi"

    if combinator_write:
        with open(combinator_initpyi, "w") as f:
            print(combinator_initpy, file=f)
        logger.info("combinator imports updated")
    else:
        logger.info("combinator imports skipped")

    if not no_open and shutil.which("code") is not None:
        subprocess.run(["code", combinator_file, combinator_test])

    return 0


def type_main(args: argparse.Namespace) -> int:
    name = typing.cast(str, args.name)
    check_name(name)
    package = typing.cast(str, args.package)
    force = typing.cast(bool, args.force)
    no_open = typing.cast(bool, args.no_open)

    logger = logging.getLogger(__name__)
    logger.setLevel(logging.INFO)
    logger.addHandler(logging.StreamHandler())

    root = pathlib.Path(package)
    if not root.exists():
        logger.error(f"directory {root} does not exist")
        return 1

    types_dir = root / "types"
    type_file = types_dir / f"{name}.py"

    type_write = True
    if not force and type_file.exists():
        choice = input(f"Combinator file for {name} exists: overwrite? [yN]: ")
        type_write = choice.lower() in ["y", "yes"]
    if type_write:
        with open(type_file, "w") as f:
            print("", file=f)
        logger.info(f"type {name} created")
    else:
        logger.info(f"type {name} skipped")

    type_modules = sorted([file.name.removesuffix(".py") for file in types_dir.glob("*.py") if file.name != "__init__.py" and not file.name.endswith("_tests.py")])
    type_imports = "\n".join([f"from . import {filename} as {filename}" for filename in type_modules])
    type_symbols = "\n".join([f"    \"{filename}\"," for filename in type_modules])
    type_initpy = INITPYI_TEMPLATE.format(imports=type_imports, symbols=type_symbols)
    type_initpyi = types_dir / "__init__.pyi"

    if type_write:
        with open(type_initpyi, "w") as f:
            print(type_initpy, file=f)
        logger.info("type imports updated")
    else:
        logger.info("type imports skipped")

    if not no_open and shutil.which("code") is not None:
        subprocess.run(["code", type_file])

    return 0


def endpoint_main(args: argparse.Namespace) -> int:
    name = typing.cast(str, args.name)
    check_name(name)
    package = typing.cast(str, args.package)
    force = typing.cast(bool, args.force)
    no_open = typing.cast(bool, args.no_open)

    logger = logging.getLogger(__name__)
    logger.setLevel(logging.INFO)
    logger.addHandler(logging.StreamHandler())

    root = pathlib.Path(package)
    if not root.exists():
        logger.error(f"directory {root} does not exist")
        return 1

    endpoints_dir = root / "application/endpoints"
    endpoint_file = endpoints_dir / f"{name}.py"

    endpoint_write = True
    if not force and endpoint_file.exists():
        choice = input(f"View file for {name} exists: overwrite? [yN]: ")
        endpoint_write = choice.lower() in ["y", "yes"]
    if endpoint_write:
        with open(endpoint_file, "w") as f:
            print(VIEW_TEMPLATE.format(package=package, name=name), file=f)
        logger.info(f"endpoint {name} created")
    else:
        logger.info(f"endpoint {name} skipped")

    endpoint_modules = sorted([file.name.removesuffix(".py") for file in endpoints_dir.glob("*.py") if file.name != "__init__.py" and not file.name.endswith("_tests.py")])
    endpoint_imports = "\n".join([f"from . import {filename} as {filename}" for filename in endpoint_modules])
    endpoint_symbols = "\n".join([f"    \"{filename}\"," for filename in endpoint_modules])
    endpoint_initpy = INITPYI_TEMPLATE.format(imports=endpoint_imports, symbols=endpoint_symbols)
    endpoint_initpyi = endpoints_dir / "__init__.pyi"

    if endpoint_write:
        with open(endpoint_initpyi, "w") as f:
            print(endpoint_initpy, file=f)
        logger.info("endpoint imports updated")
    else:
        logger.info("endpoint imports skipped")

    endpoint_test = endpoints_dir / f"{name}_tests.py"
    if not endpoint_test.exists():
        with open(endpoint_test, "w") as f:
            print(VIEW_TEST_TEMPLATE.format(name=name, package=package), file=f)

    if not no_open and shutil.which("code") is not None:
        subprocess.run(["code", endpoint_file, endpoint_test])

    return 0


def reshim_main(args: argparse.Namespace) -> int:
    package = typing.cast(str, args.package)

    logger = logging.getLogger(__name__)
    logger.setLevel(logging.INFO)
    logger.addHandler(logging.StreamHandler())

    root = pathlib.Path(package)
    if not root.exists():
        logger.error(f"directory {root} does not exist")
        return 1

    protocols_dir = root / "protocols"
    protocol_modules = sorted([file.name.removesuffix(".py") for file in protocols_dir.glob("*.py") if file.name != "__init__.py" and not file.name.endswith("_tests.py")])
    protocol_imports = "\n".join([f"from . import {filename} as {filename}" for filename in protocol_modules])
    protocol_symbols = "\n".join([f"    \"{filename}\"," for filename in protocol_modules])
    protocol_initpy = INITPYI_TEMPLATE.format(imports=protocol_imports, symbols=protocol_symbols)
    protocol_initpyi = protocols_dir / "__init__.pyi"

    with open(protocol_initpyi, "w") as f:
        print(protocol_initpy, file=f)

    adapters_dir = root / "adapters"
    adapter_modules = sorted([file.name.removesuffix(".py") for file in adapters_dir.glob("*.py") if file.name != "__init__.py" and not file.name.endswith("_tests.py")])
    adapter_imports = "\n".join([f"from . import {filename} as {filename}" for filename in adapter_modules])
    adapter_symbols = "\n".join([f"    \"{filename}\"," for filename in adapter_modules])
    adapter_initpy = INITPYI_TEMPLATE.format(imports=adapter_imports, symbols=adapter_symbols)
    adapter_initpyi = adapters_dir / "__init__.pyi"

    with open(adapter_initpyi, "w") as f:
        print(adapter_initpy, file=f)

    bindings_list = list(set(protocol_modules) & set(adapter_modules))
    bindings = "\n".join([f"    binder.bind(protocols.{name}.Protocol, to=adapters.{name}.Adapter)" for name in bindings_list])
    bindings_file = root / "bindings.py"
    bindings_asserts = "\n\n".join([(
        f"    {name} = injector.get(protocols.{name}.Protocol)\n"
        f"    assert type({name}) == adapters.{name}.Adapter\n"
        f"    assert isinstance({name}, protocols.{name}.Protocol)"
    ) for name in bindings_list])
    bindings_mock = root / "bindings_mocks.py"
    bindings_test = root / "bindings_tests.py"

    with open(bindings_file, "w") as f:
        print(BINDINGS_TEMPLATE.format(package=package, bindings=bindings), file=f)
    if not bindings_mock.exists():
        with open(bindings_mock, "w") as f:
            print(BINDINGS_MOCK_TEMPLATE, file=f)
    with open(bindings_test, "w") as f:
        print(BINDINGS_TEST_TEMPLATE.format(package=package, bindings_asserts=bindings_asserts), file=f)

    combinators_dir = root / "combinators"
    combinator_modules = sorted([file.name.removesuffix(".py") for file in combinators_dir.glob("*.py") if file.name != "__init__.py" and not file.name.endswith("_tests.py")])
    combinator_imports = "\n".join([f"from . import {filename} as {filename}" for filename in combinator_modules])
    combinator_symbols = "\n".join([f"    \"{filename}\"," for filename in combinator_modules])
    combinator_initpy = INITPYI_TEMPLATE.format(imports=combinator_imports, symbols=combinator_symbols)
    combinator_initpyi = combinators_dir / "__init__.pyi"

    with open(combinator_initpyi, "w") as f:
        print(combinator_initpy, file=f)

    types_dir = root / "types"
    type_modules = sorted([file.name.removesuffix(".py") for file in types_dir.glob("*.py") if file.name != "__init__.py" and not file.name.endswith("_tests.py")])
    type_imports = "\n".join([f"from . import {filename} as {filename}" for filename in type_modules])
    type_symbols = "\n".join([f"    \"{filename}\"," for filename in type_modules])
    type_initpy = INITPYI_TEMPLATE.format(imports=type_imports, symbols=type_symbols)
    type_initpyi = types_dir / "__init__.pyi"

    with open(type_initpyi, "w") as f:
        print(type_initpy, file=f)

    endpoints_dir = root / "application/endpoints"
    endpoint_modules = sorted([file.name.removesuffix(".py") for file in endpoints_dir.glob("*.py") if file.name != "__init__.py" and not file.name.endswith("_tests.py")])
    endpoint_imports = "\n".join([f"from . import {filename} as {filename}" for filename in endpoint_modules])
    endpoint_symbols = "\n".join([f"    \"{filename}\"," for filename in endpoint_modules])
    endpoint_initpy = INITPYI_TEMPLATE.format(imports=endpoint_imports, symbols=endpoint_symbols)
    endpoint_initpyi = endpoints_dir / "__init__.pyi"

    with open(endpoint_initpyi, "w") as f:
        print(endpoint_initpy, file=f)

    return 0


def path_walk(root: pathlib.Path) -> typing.Generator[pathlib.Path, None, None]:
    for child in root.iterdir():
        if not child.is_dir():
            yield child
        else:
            for item in path_walk(child):
                yield item


def rename_main(args: argparse.Namespace) -> int:
    package = typing.cast(str, args.package)
    oldpattern = re.compile(typing.cast(str, args.oldpattern))
    newpattern = fr"{typing.cast(str, args.newpattern)}"
    scopes = typing.cast(typing.List[str], args.scope)
    no_dry = typing.cast(bool, args.no_dry)
    no_replace = typing.cast(bool, args.no_replace)

    root = pathlib.Path(package)

    modified: typing.List[typing.Tuple[pathlib.Path, pathlib.Path]] = []

    if len(scopes) == 0 or "protocols" in scopes:
        protocols_dir = root / "protocols"
        for before in protocols_dir.glob("*.py"):
            if before.stem != "__init__":
                after = before.with_stem(re.sub(oldpattern, newpattern, before.stem))
                if after.absolute() != before.absolute():
                    modified.append((before, after))

    if len(scopes) == 0 or "adapters" in scopes:
        adapters_dir = root / "adapters"
        for before in adapters_dir.glob("*.py"):
            if before.stem != "__init__":
                after = before.with_stem(re.sub(oldpattern, newpattern, before.stem))
                if after.absolute() != before.absolute():
                    modified.append((before, after))

    if len(scopes) == 0 or "combinators" in scopes:
        combinators_dir = root / "combinators"
        for before in combinators_dir.glob("*.py"):
            if before.stem != "__init__":
                after = before.with_stem(re.sub(oldpattern, newpattern, before.stem))
                if after.absolute() != before.absolute():
                    modified.append((before, after))

    if len(scopes) == 0 or "types" in scopes:
        types_dir = root / "types"
        for before in types_dir.glob("*.py"):
            if before.stem != "__init__":
                after = before.with_stem(re.sub(oldpattern, newpattern, before.stem))
                if after.absolute() != before.absolute():
                    modified.append((before, after))

    if len(scopes) == 0 or "application" in scopes:
        endpoints_dir = root / "application/endpoints"
        for before in endpoints_dir.glob("*.py"):
            if before.stem != "__init__":
                after = before.with_stem(re.sub(oldpattern, newpattern, before.stem))
                if after.absolute() != before.absolute():
                    modified.append((before, after))

    if len(modified) > 0:
        print("renamed files")
        for before, after in modified:
            print(f"{before} => {after}")
            if no_dry:
                before.rename(after)
    else:
        print("no files to be renamed")
    print()

    if not no_replace:
        print("modified lines:")
        for file in path_walk(root):
            if str(file.parent).endswith("__pycache__"):
                continue

            with open(file) as f:
                changed_lines: typing.List[typing.Tuple[int, str, str]] = []
                lines: typing.List[str] = []

                stems = set([(before.stem, after.stem) for (before, after) in modified])

                for i, line in enumerate(f):
                    original_line = line.rstrip()
                    replaced_line = original_line
                    for before_stem, after_stem in stems:
                        replaced_line = replaced_line.replace(before_stem, after_stem)
                    if replaced_line != original_line:
                        changed_lines.append((i, original_line, replaced_line))
                    lines.append(replaced_line)

                if len(changed_lines) > 0:
                    print(file)
                    for i, before_line, after_line in changed_lines:
                        delete = red(f"- {before_line}")
                        insert = green(f"+ {after_line}")
                        print(f"{i: 4}  {delete}")
                        print(f"{i: 4}  {insert}")
                    print()

            if no_dry and len(changed_lines) > 0:
                with open(file, 'w') as f:
                    for line in lines:
                        print(line.rstrip(), file=f)

    if no_dry:
        return reshim_main(args)

    return 0


def help_main(args: argparse.Namespace) -> int:
    print(parser.parse_args([args.command, "--help"]))
    return 0


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="code generator")
    subparsers = parser.add_subparsers()

    protocol_parser = subparsers.add_parser("protocol", help="generate a protocol, its adapter, and binding")
    protocol_parser.add_argument("name", type=str, help="name of the dependency to generate")
    protocol_parser.add_argument("--package", type=str, default=os.environ.get("PACKAGE_NAME", ""), help="package to generate files in")
    protocol_parser.add_argument("--async", dest="async_", action="store_true", help="generate async files")
    protocol_parser.add_argument("--force", "-f", action="store_true", help="overwrite existing file")
    protocol_parser.add_argument("--delete", action="store_true", help="delete the protocol, adapter, and binding")
    protocol_parser.add_argument("--no-open", action="store_true", help="do not open the files after generation")
    protocol_parser.add_argument("--no-adapter", "-A", action="store_true", help="only create protocol")
    protocol_parser.set_defaults(handler=protocol_main)

    combinator_parser = subparsers.add_parser("combinator", help="generate a combinator")
    combinator_parser.add_argument("name", type=str, help="name of the dependency to generate")
    combinator_parser.add_argument("--package", type=str, default=os.environ.get("PACKAGE_NAME", ""), help="package to generate files in")
    combinator_parser.add_argument("--async", dest="async_", action="store_true", help="generate async files")
    combinator_parser.add_argument("--force", "-f", action="store_true", help="overwrite existing file")
    combinator_parser.add_argument("--no-open", action="store_true", help="do not open the files after generation")
    combinator_parser.set_defaults(handler=combinator_main)

    type_parser = subparsers.add_parser("type", help="generate a type")
    type_parser.add_argument("name", type=str, help="name of the dependency to generate")
    type_parser.add_argument("--package", type=str, default=os.environ.get("PACKAGE_NAME", ""), help="package to generate files in")
    type_parser.add_argument("--force", "-f", action="store_true", help="overwrite existing file")
    type_parser.add_argument("--no-open", action="store_true", help="do not open the files after generation")
    type_parser.set_defaults(handler=type_main)

    endpoint_parser = subparsers.add_parser("endpoint", help="generate a endpoint")
    endpoint_parser.add_argument("name", type=str, help="name of the dependency to generate")
    endpoint_parser.add_argument("--package", type=str, default=os.environ.get("PACKAGE_NAME", ""), help="package to generate files in")
    endpoint_parser.add_argument("--force", "-f", action="store_true", help="overwrite existing file")
    endpoint_parser.add_argument("--no-open", action="store_true", help="do not open the files after generation")
    endpoint_parser.set_defaults(handler=endpoint_main)

    reshim_parser = subparsers.add_parser("reshim", help="reshim modules")
    reshim_parser.add_argument("--package", type=str, default=os.environ.get("PACKAGE_NAME", ""), help="package to generate files in")
    reshim_parser.set_defaults(handler=reshim_main)

    rename_parser = subparsers.add_parser("rename", help="rename a module")
    rename_parser.add_argument("oldpattern", type=str, help="regex pattern to specify the old files")
    rename_parser.add_argument("newpattern", type=str, help="regex pattern to specify the new files")
    rename_parser.add_argument("--package", type=str, default=os.environ.get("PACKAGE_NAME", ""), help="package to generate files in")
    rename_parser.add_argument("--scope", type=str, action="extend", nargs="*", default=[], help="scope of module to rename")
    rename_parser.add_argument("--no-dry", action="store_true", help="execute rename")
    rename_parser.add_argument("--no-replace", action="store_true", help="do not replace occurences in files")
    rename_parser.set_defaults(handler=rename_main)

    help_parser = subparsers.add_parser("help", help="command help")
    help_parser.add_argument("command", help="command to show help for")
    help_parser.set_defaults(handler=help_main)

    args = parser.parse_args()
    sys.exit(args.handler(args))
