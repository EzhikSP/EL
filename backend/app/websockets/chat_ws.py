from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.auth_utils import verify_token, logger  # Используем функцию из auth_utils.py

router = APIRouter()

# Настройка логирования
logger.info("!!!!!!!!!!!!!!!!    1    !!!!!!!!!!!!!!!!")

class ChatWebSocketServer:
    def __init__(self):
        self.active_connections = {}

    async def handler(self, websocket: WebSocket, token: str):
        logger.info(f"verify_token2")
        username = "Unknown"
        try:
            # Проверяем токен и получаем имя пользователя
            username = await verify_token(token)
            logger.info(f"Успешная верификация токена для пользователя: {username}")
        except Exception as e:
            logger.error(f"Ошибка верификации токена: {e}")
            await websocket.close(code=1008, reason="Invalid token")
            return

        await websocket.accept()
        self.active_connections[websocket] = username
        logger.info(f"{username} подключился к чату.")

        try:
            while True:
                data = await websocket.receive_text()
                message = {
                    "sender": username,
                    "text": data,
                    "isModeration": False,
                }
                for connection in self.active_connections:
                    await connection.send_json(message)
        except WebSocketDisconnect:
            logger.info(f"{username} отключился.")
        except Exception as e:
            logger.error(f"Ошибка в WebSocket: {e}")
        finally:
            del self.active_connections[websocket]
            logger.info(f"Соединение с {username} закрыто.")

chat_ws_instance = ChatWebSocketServer()

@router.websocket("/chat/ws")
async def websocket_endpoint(websocket: WebSocket, token: str = ""):
    """WebSocket маршрут чата"""
    logger.info(f"Новое подключение к WebSocket. Токен: {token}")
    print("WebSocket endpoint вызван")  # Проверка, что метод выполняется
    await chat_ws_instance.handler(websocket, token)