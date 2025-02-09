import React, { useState } from "react";
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";

function ChatPanel({ messages, onSend }) {
  const [channel, setChannel] = useState("global");

  return (
    <div className="chat-panel">
      <div className="chat-channels">
        {/* Пример переключения каналов */}
        <button onClick={() => setChannel("global")}>Общий</button>
        <button onClick={() => setChannel("location")}>Локальный</button>
        <button onClick={() => setChannel("district")}>Район</button>
        <button onClick={() => setChannel("clan")}>Клан</button>
      </div>
      <ChatWindow messages={messages} />
      <ChatInput onSend={(text) => onSend(text, channel)} />
    </div>
  );
}

export default ChatPanel;
