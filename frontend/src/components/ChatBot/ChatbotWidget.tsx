import React, { useState } from "react";
import { BoltIcon } from "@heroicons/react/24/solid"; // Using BoltIcon as a robot alternative

import "./ChatBotWidget.css";

const ChatBotWidget: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="chatbot-widget">
      {open && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <span>ChatBot</span>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>
          <div className="chatbot-body">
            {/* Chat messages go here */}
            <p>Hello! How can I help you?</p>
          </div>
          <div className="chatbot-footer">
            <input type="text" placeholder="Type your message..." />
            <button>Send</button>
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