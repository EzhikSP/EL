import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.auth_utils import logger
from app.database import async_session
from app.routers import auth, admin, chat, moderation, battle, craft, world, locations
from app.websockets import chat_ws, battle_ws
from app.tasks import check_punishments
from app.websockets import chat_ws

app = FastAPI(title="Medieval RPG Backend")

# CORS для доступа с фронтенда
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # В продакшене ограничьте список доменов
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def schedule_punishment_check():
    """Запускает проверку наказаний каждые 5 минут."""
    while True:
        try:
            await check_punishments()
        except Exception as e:
            print(f"[Ошибка в schedule_punishment_check]: {e}")
        await asyncio.sleep(300)  # 5 минут

@app.on_event("startup")
async def on_startup():
    """Инициализация базы данных при старте + запуск фоновой задачи."""
    print("Сервер запущен!")
    asyncio.create_task(schedule_punishment_check())  # Запускаем проверку наказаний

@app.on_event("shutdown")
async def on_shutdown():
    """Очистка ресурсов при выключении сервера."""
    await async_session.close_all()  # Закрываем соединения с БД

# Подключаем роутеры
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(admin.router, prefix="/admin", tags=["Admin"])
# app.include_router(chat.router, prefix="/chat", tags=["Chat"])
# app.include_router(chat_ws.router, prefix="/chat")
app.include_router(chat_ws.router, prefix="/chat", tags=["Chat"])
app.include_router(moderation.router, prefix="/moderation", tags=["Moderation"])
app.include_router(battle.router, prefix="/battle", tags=["Battle"])
app.include_router(craft.router, prefix="/craft", tags=["Craft"])
app.include_router(world.router, prefix="/world", tags=["World"])
app.include_router(locations.router, prefix="/locations", tags=["Locations"])

@app.get("/")
def root():
    return {"message": "Welcome to the Medieval RPG Backend!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
