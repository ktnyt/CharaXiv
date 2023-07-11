from datetime import datetime

from pydantic import BaseModel, EmailStr


class Registration(BaseModel):
    email: EmailStr
    created_at: datetime
