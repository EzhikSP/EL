from pydantic import BaseModel


class BuildingBase(BaseModel):
    name: str
    type: str
    location_id: int

class BuildingCreate(BuildingBase):
    """Схема для создания нового здания"""
    pass

class BuildingResponse(BuildingBase):
    """Схема для отображения здания"""
    id: int

    class Config:
        from_attributes = True  # Включаем работу с SQLAlchemy моделями
