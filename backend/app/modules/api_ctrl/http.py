import json
from typing import Any

from django.http import HttpResponse
from pydantic import BaseModel


class JsonResponse(HttpResponse):
    def __init__(self, obj: Any, status: int = 200) -> None:
        s = obj.json() if isinstance(obj, BaseModel) else json.dumps(obj)
        super().__init__(s, content_type='application/json', status=status)
