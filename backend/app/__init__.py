from __future__ import annotations

import contextlib
from typing import Callable, Generator, Type

from injector import Binder, Module

__all__ = ['ModuleSet', 'configurator']


InstallableModuleType = Callable[[Binder], None] | Module | Type[Module]


class ModuleSet(Module):
    modules: list[InstallableModuleType]

    def __init__(self, *modules: InstallableModuleType) -> None:
        self.modules = list(modules)

    def add(self, *modules: InstallableModuleType) -> ModuleSet:
        self.modules.append(ModuleSet(*modules))
        return self

    @contextlib.contextmanager
    def use(self, *modules: InstallableModuleType) -> Generator[ModuleSet, None, None]:
        try:
            self.add(*modules)
            yield self
        finally:
            self.modules.pop()

    def configure(self, binder: Binder) -> None:
        for module in self.modules:
            binder.install(module)


configurator = ModuleSet()
