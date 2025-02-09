from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Location(Base):
    """Модель локации"""
    __tablename__ = "locations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    region_id = Column(Integer, ForeignKey("regions.id"), nullable=False)
    type = Column(String, nullable=False)
    north_id = Column(Integer, ForeignKey("locations.id"), nullable=True)
    south_id = Column(Integer, ForeignKey("locations.id"), nullable=True)
    east_id = Column(Integer, ForeignKey("locations.id"), nullable=True)
    west_id = Column(Integer, ForeignKey("locations.id"), nullable=True)
    danger_level = Column(Integer, default=0)

    # Связь с регионами
    region = relationship("Region", back_populates="locations")

    # Связь со зданиями
    buildings = relationship("Building", back_populates="location", cascade="all, delete-orphan")


class Building(Base):
    """Модель здания"""
    __tablename__ = "buildings"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)
    location_id = Column(Integer, ForeignKey("locations.id"), nullable=False)

    # Связь с локацией
    location = relationship("Location", back_populates="buildings")

class Region(Base):
    __tablename__ = "regions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)

    locations = relationship("Location", back_populates="region")  # Обратная связь