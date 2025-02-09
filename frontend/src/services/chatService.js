let socket;

export function initChat() {
  const token = localStorage.getItem("token"); // Загружаем токен

  if (!token) {
    console.error("Ошибка: отсутствует токен для WebSocket (initChat)");
    return;
  }

  const wsUrl = `ws://localhost:8000/chat/ws?token=${encodeURIComponent(token)}`;
  socket = new WebSocket(wsUrl);

  socket.onopen = () => {
    console.log("✅ WebSocket подключён");
  };

  socket.onerror = (error) => {
    console.error("❌ WebSocket ошибка:", error);
  };

  socket.onclose = (event) => {
    console.warn(`⚠ WebSocket закрыт, код: ${event.code}, причина: ${event.reason}`);
  };
}

export function subscribeToMessages(callback) {
  if (!socket) {
    console.error("Ошибка: WebSocket не инициализирован");
    return () => {};
  }

  const handleMessage = (event) => {
    console.log("Пришло сообщение:", event.data); // <== Логируем входящее сообщение
    try {
      const data = JSON.parse(event.data);
      callback(data);
    } catch (error) {
      console.error("Ошибка обработки сообщения из WebSocket:", error);
    }
  };


  socket.addEventListener("message", handleMessage);

  return () => {
    socket.removeEventListener("message", handleMessage);
  };
}

export function sendMessage(message) {
  if (!socket) {
    console.error("Ошибка: WebSocket не подключён");
    return;
  }

  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  } else {
    console.warn("Попытка отправить сообщение, но WebSocket не открыт");
  }
}

export function closeChat() {
  if (socket) {
    socket.close();
    console.log("WebSocket соединение закрыто вручную");
  }
}