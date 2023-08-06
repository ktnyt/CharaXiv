from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class PasswordResetRequest(BaseModel, strict=True):
    user_id: UUID
    created_at: datetime
