import React, { useState,useEffect } from "react";
import { BoltIcon } from "@heroicons/react/24/solid"; // Or use any robot SVG/icon
const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
import "./ChatBotWidget.css";
import ReactMarkdown from "react-markdown";

const ChatBotWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [messages, setMessages] = useState<{from: string, text: string}[]>([]);

   useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ from: "bot", text: "Hi! How can I help you?" }]);
    }
  }, [open]);
  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages([...messages, {from: "user", text: input}]);
    setInput("");
    setThinking(true); // Start thinking
    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setMessages(msgs => [...msgs, {from: "bot", text: data.response}]);
    } catch (e) {
      setMessages(msgs => [...msgs, {from: "bot", text: "Sorry, something went wrong."}]);
    }
    setThinking(false); // Stop thinking
  };

    return (
    <div className="chatbot-widget">
      {open && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <span>ChatBot</span>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>
          <div className="chatbot-body">
  {messages.map((msg, i) => (
    <div
      key={i}
      className={`chat-message ${msg.from === "user" ? "user-message" : "bot-message"}`}
      style={{ marginBottom: "16px" }}
    >
      {msg.from === "bot" ? (
        <ReactMarkdown>{msg.text}</ReactMarkdown>
      ) : (
        <span>{msg.text}</span>
      )}
    </div>
  ))}
  {thinking && (
    <div className="chat-message bot-message" style={{ fontStyle: "italic", color: "#888" }}>
      thinking...
    </div>
  )}
</div>
          <div className="chatbot-footer">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder="Type your message..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
      <button className="chatbot-fab" onClick={() => setOpen(!open)}>
        <BoltIcon className="w-8 h-8" />
      </button>
    </div>
  );
};

export default ChatBotWidget;