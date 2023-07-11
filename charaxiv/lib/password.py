import random
import string

rng = random.SystemRandom()


def generate(
        *,
        length: int = 12,
        lower: bool = True,
        upper: bool = True,
        digit: bool = True,
        symbol: bool = True,
) -> str:
    alphabet = ""
    required = []
    if lower:
        alphabet += string.ascii_lowercase
        required.append(rng.choice(string.ascii_lowercase))
    if upper:
        alphabet += string.ascii_uppercase
        required.append(rng.choice(string.ascii_uppercase))
    if digit:
        alphabet += string.digits
        required.append(rng.choice(string.digits))
    if symbol:
        alphabet += string.punctuation
        required.append(rng.choice(string.punctuation))

    chars = [rng.choice(alphabet) for _ in range(length)]
    indices = set[int]()

    while len(indices) < len(required):
        indices.add(rng.randint(0, len(chars) - 1))

    for i, index in enumerate(indices):
        chars[index] = required[i]

    return "".join(chars)
