import typing
from uuid import UUID

from injector import Injector
from starlette.authentication import (AuthCredentials, AuthenticationBackend,
                                      AuthenticationError, BaseUser,
                                      UnauthenticatedUser)
from starlette.requests import HTTPConnection

from charaxiv import combinators, integrations, settings


class SessionAuthBackend(AuthenticationBackend):
    async def authenticate(self, conn: HTTPConnection) -> typing.Tuple[AuthCredentials, BaseUser]:
        userid = conn.session.get(settings.SESSION_USERID_KEY)
        if userid is None:
            return AuthCredentials(), UnauthenticatedUser()

        assert integrations.starlette.INJECTOR_KEY in conn.scope, "InjectorMiddleware must be installed to access injector"
        injector = conn.scope[integrations.starlette.INJECTOR_KEY]
        assert type(injector) is Injector

        exec = injector.get(combinators.user_authenticate.Combinator)

        try:
            user = await exec(userid=UUID(userid))
        except combinators.user_authenticate.UserWithIDNotFoundException as e:
            conn.session.pop(settings.SESSION_USERID_KEY)
            raise AuthenticationError("User not found") from e

        return AuthCredentials(user.group.value), integrations.starlette.AppUser(
            user,
            identity=lambda user: str(user.id),
            display_name=lambda user: user.username,
        )
