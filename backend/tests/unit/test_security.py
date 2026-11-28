import time
from datetime import timedelta

import pytest
from jose import jwt, JWTError

from app.core.config import settings
from app.core.security import get_password_hash, verify_password, create_access_token


def test_hash_is_not_plain_text():
    hashed = get_password_hash("secret123")
    assert hashed != "secret123"
    assert hashed.startswith("$2")  # bcrypt


def test_same_password_gives_different_hashes():
    assert get_password_hash("secret123") != get_password_hash("secret123")  # random salt


def test_verify_correct_password():
    assert verify_password("secret123", get_password_hash("secret123"))


def test_verify_wrong_password():
    assert not verify_password("wrong", get_password_hash("secret123"))


def test_token_subject_is_string_user_id():
    payload = jwt.decode(create_access_token(42), settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    assert payload["sub"] == "42"


def test_token_default_expiry_matches_settings():
    payload = jwt.decode(create_access_token(1), settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    expected = time.time() + settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    assert abs(payload["exp"] - expected) < 60


def test_token_custom_expiry():
    payload = jwt.decode(create_access_token(1, timedelta(minutes=5)), settings.SECRET_KEY,
                         algorithms=[settings.ALGORITHM], options={"verify_exp": False})
    default = jwt.decode(create_access_token(1), settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    assert payload["exp"] < default["exp"]


def test_expired_token_is_rejected():
    token = create_access_token(1, timedelta(seconds=-10))
    with pytest.raises(JWTError):
        jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])


def test_token_signed_with_other_key_is_rejected():
    token = create_access_token(1)
    with pytest.raises(JWTError):
        jwt.decode(token, "another-key", algorithms=[settings.ALGORITHM])
