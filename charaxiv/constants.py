from uuid import UUID

import uuid6

UUID7_MAX: UUID = uuid6.UUID(int=(1 << 128) - 1, version=7)

CHARACTER_LIST_LIMIT_MAX = 50
