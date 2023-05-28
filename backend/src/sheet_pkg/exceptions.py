from src import core_pkg


class SheetNotFound(core_pkg.exceptions.CoreException):
    def __init__(self, sheet_id: str) -> None:
        super().__init__(f'Sheet not found: {sheet_id}')


class SheetNotWritable(core_pkg.exceptions.CoreException):
    def __init__(self, sheet_id: str) -> None:
        super().__init__(f'Sheet not writable: {sheet_id}')


class SheetImageNotFound(core_pkg.exceptions.CoreException):
    def __init__(self, sheet_id: str, path: str) -> None:
        super().__init__(f'Sheet image not found: {sheet_id} {path}')
