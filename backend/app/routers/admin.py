from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import datetime, timedelta
from app.database import get_db
from app.models.player import Player
from app.auth_utils import verify_admin

router = APIRouter()


async def clear_expired_punishments(db: AsyncSession):
    """
    Очищает истекшие баны и мюты.
    """
    now = datetime.utcnow()
    result = await db.execute(select(Player).where(
        (Player.ban_until <= now) | (Player.mute_until <= now)
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

    await db.commit()


@router.get("/players")
async def list_players(db: AsyncSession = Depends(get_db), admin: Player = Depends(verify_admin)):
    """Список всех игроков (доступно только админам)."""
    result = await db.execute(select(Player))
    players = result.scalars().all()
    return [{"id": p.id, "username": p.username, "is_banned": p.is_banned, "is_admin": p.is_admin} for p in players]


@router.post("/ban/{player_id}")
async def ban_player(player_id: int, reason: str, duration_minutes: int,
                     db: AsyncSession = Depends(get_db), admin: Player = Depends(verify_admin)):
    """Блокировка игрока с указанием причины и срока (админами)."""
    await clear_expired_punishments(db)

    result = await db.execute(select(Player).where(Player.id == player_id))
    player = result.scalar_one_or_none()

    if not player:
        raise HTTPException(status_code=404, detail="Игрок не найден")

    if not reason.strip():
        raise HTTPException(status_code=400, detail="Не указана причина блокировки")

    player.is_banned = True
    player.ban_until = datetime.utcnow() + timedelta(minutes=duration_minutes)
    player.ban_reason = reason

    await db.commit()
    return {"message": f"Игрок {player.username} заблокирован до {player.ban_until}", "reason": reason}


@router.post("/unban/{player_id}")
async def unban_player(player_id: int, db: AsyncSession = Depends(get_db), admin: Player = Depends(verify_admin)):
    """Разблокировка игрока (админами)."""
    result = await db.execute(select(Player).where(Player.id == player_id))
    player = result.scalar_one_or_none()

    if not player:
        raise HTTPException(status_code=404, detail="Игрок не найден")

    player.is_banned = False
    player.ban_until = None
    player.ban_reason = None
    await db.commit()
    return {"message": f"Игрок {player.username} разблокирован"}


@router.post("/mute/{player_id}")
async def mute_player(player_id: int, reason: str, duration_minutes: int,
                      db: AsyncSession = Depends(get_db), admin: Player = Depends(verify_admin)):
    """Замутить игрока с указанием причины и срока (админами)."""
    await clear_expired_punishments(db)

    result = await db.execute(select(Player).where(Player.id == player_id))
    player = result.scalar_one_or_none()

    if not player:
        raise HTTPException(status_code=404, detail="Игрок не найден")

    if not reason.strip():
        raise HTTPException(status_code=400, detail="Не указана причина мута")

    player.is_muted = True
    player.mute_until = datetime.utcnow() + timedelta(minutes=duration_minutes)
    player.mute_reason = reason

    await db.commit()
    return {"message": f"Игрок {player.username} замучен до {player.mute_until}", "reason": reason}


@router.post("/unmute/{player_id}")
async def unmute_player(player_id: int, db: AsyncSession = Depends(get_db), admin: Player = Depends(verify_admin)):
    """Размутить игрока (админами)."""
    result = await db.execute(select(Player).where(Player.id == player_id))
    player = result.scalar_one_or_none()

    if not player:
        raise HTTPException(status_code=404, detail="Игрок не найден")

    player.is_muted = False
    player.mute_until = None
    player.mute_reason = None
    await db.commit()
    return {"message": f"Игрок {player.username} размучен"}


@router.get("/check_punishments")
async def check_punishments(db: AsyncSession = Depends(get_db)):
    """Принудительно проверяет и очищает истекшие баны/муты."""
    await clear_expired_punishments(db)
    return {"message": "Просроченные наказания очищены"}
