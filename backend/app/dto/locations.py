from pydantic import BaseModel
from typing import Optional

class LocationBase(BaseModel):
    name: str
    region_id: int
    type: str
    danger_level: int

class LocationCreate(LocationBase):
    """Схема для создания новой локации"""
    pass

class LocationUpdate(LocationBase):
    """Схема для обновления существующей локации"""
    name: Optional[str] = None
    region_id: Optional[int] = None
    type: Optional[str] = None
    danger_level: Optional[int] = None

class LocationResponse(LocationBase):
    """Схема для отображения локации"""
    id: int
    north_id: Optional[int]
    south_id: Optional[int]
    east_id: Optional[int]
    west_id: Optional[int]

    class Config:
        from_attributes = True  # Включаем работу с SQLAlchemy моделями
