from django.http import HttpRequest, HttpResponse
from django.middleware import csrf
from django.views import View


class CSRFTokenView(View):
    def get(self, request: HttpRequest) -> HttpResponse:
        return HttpResponse(csrf.get_token(request))
