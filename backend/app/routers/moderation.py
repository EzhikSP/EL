from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.player import Player
from pydantic import BaseModel

router = APIRouter()

class ModerationCommand(BaseModel):
    target_username: str

async def get_db() -> AsyncSession:
    async with Depends(get_db) as session:
        yield session

@router.post("/ban")
async def ban_user(cmd: ModerationCommand, db: AsyncSession = Depends(get_db)):
    result = await db.execute(Player.__table__.select().where(Player.username == cmd.target_username))
    target_user = result.scalar_one_or_none()
    if not target_user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    target_user.is_banned = True
    await db.commit()
    return {"detail": f"Пользователь {cmd.target_username} забанен"}

@router.post("/mute")
async def mute_user(cmd: ModerationCommand, db: AsyncSession = Depends(get_db)):
    result = await db.execute(Player.__table__.select().where(Player.username == cmd.target_username))
    target_user = result.scalar_one_or_none()
    if not target_user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    target_user.is_muted = True
    await db.commit()
    return {"detail": f"Пользователь {cmd.target_username} заглушен"}

@router.post("/unmute")
async def unmute_user(cmd: ModerationCommand, db: AsyncSession = Depends(get_db)):
    result = await db.execute(Player.__table__.select().where(Player.username == cmd.target_username))
    target_user = result.scalar_one_or_none()
    if not target_user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    target_user.is_muted = False
    await db.commit()
    return {"detail": f"Пользователь {cmd.target_username} разблокирован для чата"}

@router.post("/unban")
async def unban_user(cmd: ModerationCommand, db: AsyncSession = Depends(get_db)):
    result = await db.execute(Player.__table__.select().where(Player.username == cmd.target_username))
    target_user = result.scalar_one_or_none()
    if not target_user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    target_user.is_banned = False
    await db.commit()
    return {"detail": f"Пользователь {cmd.target_username} разблокирован"}
