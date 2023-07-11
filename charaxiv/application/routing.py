from starlette.routing import Mount, Route

from . import endpoints

routes = [
    Mount("/api", routes=[
        Route("/register", endpoints.user_register.Endpoint, name="user_register"),
        Route("/activate", endpoints.user_activate.Endpoint, name="user_activate"),
        Route("/session", endpoints.user_session.Endpoint, name="user_session"),
        Route("/password_reset", endpoints.password_reset.Endpoint, name="password_reset")
    ]),
]
