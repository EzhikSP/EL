from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base
import os

# Читаем параметры из переменных окружения
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "game_db")
DB_USER = os.getenv("DB_USER", "game_user")
DB_PASSWORD = os.getenv("DB_PASSWORD", "password")

# Формируем строку подключения для асинхронного PostgreSQL
DATABASE_URL = f"postgresql+asyncpg://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# Создаем асинхронный движок
engine = create_async_engine(DATABASE_URL, echo=False)

# Создаем асинхронную сессию
async_session = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

# Базовый класс для моделей
Base = declarative_base()

# Функция для получения сессии
async def get_db() -> AsyncSession:
    async with async_session() as session:
        yield session
