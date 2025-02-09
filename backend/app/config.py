import os
from dotenv import load_dotenv

load_dotenv()  # Загружаем переменные окружения из .env

SECRET_KEY = os.getenv("SECRET_KEY", "my_super_secret_key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# Пример строки подключения к PostgreSQL (асинхронный драйвер asyncpg)
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://user:password@localhost/dbname")
