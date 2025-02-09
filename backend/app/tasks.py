from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import async_session
from app.models.player import Player

async def check_punishments():
    """Автоматически снимает истекшие баны и мьюты."""
    async with async_session() as db:  # Создаем сессию вручную
        now = datetime.utcnow()
        result = await db.execute(select(Player).where(
            (Player.ban_until.is_not(None) & (Player.ban_until <= now)) |
            (Player.mute_until.is_not(None) & (Player.mute_until <= now))
        ))
        players = result.scalars().all()

        for player in players:
            if player.ban_until and player.ban_until <= now:
                player.is_banned = False
                player.ban_until = None
                player.ban_reason = None
            if player.mute_until and player.mute_until <= now:
                player.is_muted = False
                player.mute_until = None
                player.mute_reason = None

        await db.commit()  # Сохраняем изменения
