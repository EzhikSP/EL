# Medieval RPG Backend

Это серверная часть для Medieval RPG, реализованная с использованием FastAPI.

## Структура проекта

- **app/** – основное приложение:
  - **main.py** – точка входа
  - **database.py** – настройки подключения к БД
  - **config.py** – конфигурация проекта
  - **models/** – SQLAlchemy модели (Player, ChatMessage, Battle, CraftItem, Location)
  - **routers/** – API-модули (auth, chat, moderation, battle, craft, world)
  - **services/** – бизнес-логика приложения
  - **websockets/** – реализация WebSocket-серверов для чатов и боевой системы
- **requirements.txt** – список зависимостей
- **Dockerfile** – для контейнеризации
- **.env** – переменные окружения

## Запуск

1. Создайте и активируйте виртуальное окружение.
2. Установите зависимости:
   ```bash
   pip install -r requirements.txt
