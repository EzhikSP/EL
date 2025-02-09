import threading
import asyncio
from fastapi import WebSocket

class BattleWebSocketServer:
    def __init__(self):
        self.active_connections = []

    async def handler(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        try:
            while True:
                data = await websocket.receive_text()
                # Реализуйте логику для WebSocket-боя
                for connection in self.active_connections:
                    await connection.send_text(f"Бой: {data}")
        except Exception as e:
            print("Battle WebSocket disconnected:", e)
        finally:
            self.active_connections.remove(websocket)

    def start_server(self):
        # Запуск сервера для боёв
        pass

battle_ws_instance = BattleWebSocketServer()

def start():
    thread = threading.Thread(target=lambda: asyncio.run(battle_ws_instance.start_server()))
    thread.start()
