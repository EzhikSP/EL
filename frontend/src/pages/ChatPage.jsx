import React, { useState, useEffect } from "react";
import ChatPanel from "../components/Chat/ChatPanel";
import OnlineUsersList from "../components/Chat/OnlineUsersList";
import { initChat, subscribeToMessages, sendMessage } from "../services/chatService";

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("🔍 Токен перед подключением к WebSocket:", token); // ✅ Логируем токен

    if (!token) {
      console.error("❌ Ошибка: Токен отсутствует в localStorage!");
      return;
    }

    initChat();  // Запускаем WebSocket
  // }, []);

    // Подписываемся на получение новых сообщений
    const unsubscribe = subscribeToMessages((newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Здесь можно также подписаться на обновления списка онлайн-пользователей

    return () => {
      unsubscribe();
    };
  }, []);

  const handleSend = (text, channel = "global") => {
    sendMessage({ channel, text });
  };

  return (
    <div className="chat-page">
      <ChatPanel messages={messages} onSend={handleSend} />
      <OnlineUsersList users={onlineUsers} />
    </div>
  );
}

export default ChatPage;
