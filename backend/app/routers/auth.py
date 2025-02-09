import re
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from sqlalchemy import select, exists
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.player import Player
from app.config import SECRET_KEY
from app.auth_utils import create_access_token
from passlib.context import CryptContext

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

USERNAME_REGEX = re.compile(r"^[a-zA-Zа-яА-Я0-9_\-=*!$]+$")
START_LOCATION = "Город новичков"

class UserLogin(BaseModel):
    username: str
    password: str

class UserRegister(BaseModel):
    username: str
    password: str
    confirm_password: str
    email: EmailStr
    character_class: str
    race: str

@router.post("/login")
async def login(user: UserLogin, db: AsyncSession = Depends(get_db)):
    db_user = await db.execute(select(Player).where(Player.username == user.username))
    db_user = db_user.scalar_one_or_none()

    if not db_user or not pwd_context.verify(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="Неверный логин или пароль")

    if db_user.is_banned:
        raise HTTPException(status_code=403, detail="Пользователь забанен")

    access_token = create_access_token(data={"sub": db_user.username, "is_admin": db_user.is_admin})
    return {"access_token": access_token, "token_type": "bearer", "is_admin": db_user.is_admin}

@router.post("/register")
async def register(user: UserRegister, db: AsyncSession = Depends(get_db)):
    if not USERNAME_REGEX.match(user.username):
        raise HTTPException(status_code=400, detail="Логин содержит недопустимые символы")

    if user.password != user.confirm_password:
        raise HTTPException(status_code=400, detail="Пароли не совпадают")

    user_exists = await db.execute(select(exists().where((Player.username == user.username) | (Player.email == user.email))))
    if user_exists.scalar():
        raise HTTPException(status_code=400, detail="Пользователь с таким логином или email уже существует")

    hashed_password = pwd_context.hash(user.password)

    new_user = Player(
        username=user.username,
        password=hashed_password,
        email=user.email,
        character_class=user.character_class,
        race=user.race,
        location=START_LOCATION,
        is_admin=False
    )

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    access_token = create_access_token(data={"sub": new_user.username, "is_admin": new_user.is_admin})
    return {"access_token": access_token, "token_type": "bearer", "is_admin": new_user.is_admin}
