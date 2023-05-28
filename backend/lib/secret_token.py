from secrets import token_urlsafe


def generate() -> str:
    return token_urlsafe(32)
