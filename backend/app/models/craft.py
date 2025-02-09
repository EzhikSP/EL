from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.models.player import Base

class CraftItem(Base):
    __tablename__ = "craft_items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    # Добавьте остальные необходимые поля
