from pydantic import BaseModel, Field
from typing import Optional

from datetime import datetime

class MessageCreate(BaseModel):
    content: str = Field(..., max_length=500)
    alias: str = Field(..., max_length=50)
    expires_in_minutes: Optional[int] = None
    
class MessageOut(BaseModel):
    content: str
    alias: str
    created_at: datetime
    
    class Config:
        orm_mode = True
