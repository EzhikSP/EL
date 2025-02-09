from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from app.database import engine
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Player(Base):
    __tablename__ = "players"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)  # Захэшированный пароль
    email = Column(String, unique=True, index=True, nullable=False)
    character_class = Column(String, nullable=False)
    race = Column(String, nullable=False)
    is_admin = Column(Boolean, default=False)
    is_banned = Column(Boolean, default=False)
    is_muted = Column(Boolean, default=False)
    ban_until = Column(DateTime, nullable=True)
    mute_until = Column(DateTime, nullable=True)
    ban_reason = Column(Text, nullable=True)
    mute_reason = Column(Text, nullable=True)
    location = Column(String, nullable=True)
    district = Column(String, nullable=True)
    clan = Column(String, nullable=True)
