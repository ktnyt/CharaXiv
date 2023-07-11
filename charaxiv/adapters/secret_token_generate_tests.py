from charaxiv.adapters.secret_token_generate import Adapter


def test_secret_token_generate() -> None:
    adapter = Adapter()
    out = adapter()
    assert len(out) == 43
