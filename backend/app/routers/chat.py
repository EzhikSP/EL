from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query, HTTPException
import json
from jose import JWTError
from app.auth_utils import verify_token
from app.models.chat import ChatMessage
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()

# Простой пример WebSocket для чата
@router.websocket("/ws")
async def chat_endpoint(websocket: WebSocket, token: str = Query(...)):
    try:
        username = verify_token(token)
    except JWTError:
        await websocket.close(code=4003)
        return

    await websocket.accept()
    try:
        while True:
            data_text = await websocket.receive_text()
            try:
                data = json.loads(data_text)
            except json.JSONDecodeError:
                await websocket.send_text("Неверный формат сообщения. Ожидается JSON.")
                continue

            # Здесь можно добавить логику маршрутизации по каналам (global, location, district, clan)
            # и сохранить сообщение в БД
            await websocket.send_text(f"{username}: {data.get('text', '')}")
    except WebSocketDisconnect:
        print(f"{username} отключился от чата.")
