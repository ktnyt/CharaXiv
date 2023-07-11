from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class PasswordResetRequest(BaseModel, strict=True):
    userid: UUID
    created_at: datetime
