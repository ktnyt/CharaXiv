from starlette.routing import Mount, Route

from . import endpoints

routes = [
    Mount("/api", routes=[
        Route("/user", endpoints.user_index.Endpoint, name="user_index"),
        Route("/session", endpoints.user_session.Endpoint, name="user_session"),
        Route("/password_reset", endpoints.password_reset.Endpoint, name="password_reset")
    ]),
]
