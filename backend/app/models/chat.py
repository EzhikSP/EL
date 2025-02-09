from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean
from sqlalchemy.sql import func
from app.models.player import Base

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("players.id"), nullable=False)
    channel = Column(String, nullable=False)  # global, location, district, clan
    text = Column(String, nullable=False)
    is_moderation = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
