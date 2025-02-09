from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.models.player import Base

class Battle(Base):
    __tablename__ = "battles"

    id = Column(Integer, primary_key=True, index=True)
    description = Column(String, nullable=True)
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    # Дополните модель по требованиям боевой системы
