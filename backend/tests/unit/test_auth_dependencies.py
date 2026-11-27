from datetime import timedelta
from types import SimpleNamespace

import pytest
from fastapi import HTTPException

from app.api.v1.auth import get_current_user, get_current_active_user, require_role
from app.core.security import create_access_token
from app.models.user import UserRole


class FakeDB:
    """Stands in for AsyncSession; records whether a query was made."""
    def __init__(self, user=None):
        self.user, self.queried = user, False

    async def execute(self, _query):
        self.queried = True
        user = self.user
        return SimpleNamespace(scalars=lambda: SimpleNamespace(first=lambda: user))


async def test_no_token_returns_none_without_db_query():
    db = FakeDB()
    assert await get_current_user(db=db, token=None) is None
    assert db.queried is False


async def test_garbage_token_returns_none():
    assert await get_current_user(db=FakeDB(), token="not.a.jwt") is None


async def test_expired_token_returns_none():
    token = create_access_token(1, timedelta(seconds=-5))
    assert await get_current_user(db=FakeDB(), token=token) is None


async def test_valid_token_returns_user():
    user = SimpleNamespace(id=7, role=UserRole.STUDENT)
    assert await get_current_user(db=FakeDB(user), token=create_access_token(7)) is user


async def test_active_user_raises_401_when_missing():
    with pytest.raises(HTTPException) as exc:
        await get_current_active_user(current_user=None)
    assert exc.value.status_code == 401


async def test_active_user_passes_through():
    user = SimpleNamespace(id=1)
    assert await get_current_active_user(current_user=user) is user


@pytest.mark.parametrize("role,allowed", [
    (UserRole.ADMIN, True), (UserRole.STAFF, True),
    (UserRole.TEACHER, False), (UserRole.STUDENT, False), (UserRole.PUBLIC, False),
])
async def test_require_role(role, allowed):
    checker = require_role([UserRole.STAFF, UserRole.ADMIN])
    user = SimpleNamespace(role=role)
    if allowed:
        assert await checker(current_user=user) is user
    else:
        with pytest.raises(HTTPException) as exc:
            await checker(current_user=user)
        assert exc.value.status_code == 403
