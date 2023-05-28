from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

from app.modules import api_ctrl

urlpatterns = [
    path('api/', include([
        path('sentry-debug', lambda request: 1 / 0),
        path('csrf_token', api_ctrl.csrf_views.CSRFTokenView.as_view()),
        path('user/', include([
            path('authenticated', api_ctrl.user_views.AuthenticatedView.as_view()),
            path('name_taken', api_ctrl.user_views.UsernameTakenView.as_view()),
            path('login', api_ctrl.user_views.LoginView.as_view()),
            path('logout', api_ctrl.user_views.LogoutView.as_view()),
            path('register', api_ctrl.user_views.RegisterView.as_view()),
            path('activate', api_ctrl.user_views.ActivateView.as_view()),
            path('password_reset/request', api_ctrl.user_views.RequestPasswordResetView.as_view()),
            path('password_reset/resolve', api_ctrl.user_views.ResolvePasswordResetView.as_view()),
        ])),
        path('sheet', api_ctrl.sheet_views.SheetIndexView.as_view()),
        path('sheet/', include([
            path('<str:sheet_id>', api_ctrl.sheet_views.SheetItemView.as_view()),
            path('<str:sheet_id>/images', api_ctrl.sheet_views.SheetImagesView.as_view()),
        ])),
    ])),
    path('admin/', admin.site.urls),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
