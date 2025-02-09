import React from "react";

function ChatMessage({ message }) {
  if (!message) return null;
  const { sender, text, isModeration } = message;
  const style = isModeration ? { color: "red" } : { color: "black" };

  let parsedText = text; // По умолчанию просто текст
  try {
    const parsed = JSON.parse(text); // Пробуем парсить JSON
    if (parsed.text) {
      parsedText = parsed.text; // Если есть поле text, берем его
    }
  } catch (e) {
    console.warn("Ошибка парсинга JSON в чате:", e);
  }

  return (
      <div style={style} className="chat-message">
        <strong>{sender}: </strong>{parsedText}
      </div>
  );
}

export default ChatMessage;
