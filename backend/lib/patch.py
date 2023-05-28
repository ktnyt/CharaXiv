from typing import Any


def patch_dict(a: dict[str, Any], b: dict[str, Any]) -> Any:
    c = a.copy()
    for key, y in b.items():
        if key not in c:
            raise KeyError(f'Key {key} not found')
        x = c[key]
        if type(x) is not type(y):
            raise TypeError(f'Expected {type(x)} but got {type(y)}')
        if isinstance(y, dict):
            c[key] = patch_dict(x, y)
        else:
            c[key] = y
    return c
