import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  getUserConversations,
  getConversationMessages,
  sendConversationMessage,
  startConversation,
} from "../../api/userAPI";
import { toast } from "react-toastify";

type ConversationItem = {
  id: number;
  other_user_id: number;
  other_user_name: string;
  other_user_photo?: string;
  last_message?: string;
  unread_count?: number;
};

type ChatMessage = {
  id?: number;
  from: string;
  text: string;
  sender_id?: number;
};

export default function Conversations() {
  const { user } = useAuth();
  const location = useLocation();
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadConversations = async () => {
    try {
      const data: any = await getUserConversations();
      setConversations(Array.isArray(data) ? data : []);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Failed to load conversations", error);
      toast.error("Could not load conversations.");
      return [];
    }
  };

  const loadMessages = async (conversationId: number) => {
    try {
      const data: any = await getConversationMessages(conversationId);
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load messages", error);
      toast.error("Could not load messages.");
    }
  };

  useEffect(() => {
    const init = async () => {
      const otherUserId = location.state?.otherUserId;
      let list = await loadConversations();
      if (otherUserId) {
        try {
          const conv: any = await startConversation(Number(otherUserId));
          list = await loadConversations();
          if (conv?.id) {
            setActiveId(conv.id);
            await loadMessages(conv.id);
            return;
          }
        } catch (error) {
          console.error("Failed to start conversation", error);
        }
      }
      if (list.length > 0) {
        setActiveId(list[0].id);
        await loadMessages(list[0].id);
      }
    };
    init();
  }, [location.state?.otherUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSelect = async (id: number) => {
    setActiveId(id);
    await loadMessages(id);
  };

  const handleSend = async () => {
    if (!input.trim() || !activeId) return;
    const text = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { from: "me", text }]);
    try {
      const saved: any = await sendConversationMessage(activeId, text);
      setMessages((prev) => {
        const withoutOptimistic = prev.slice(0, -1);
        return [...withoutOptimistic, saved];
      });
      await loadConversations();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not send message.");
    }
  };

  const active = conversations.find((c) => c.id === activeId);

  return (
    <div className="flex flex-1 gap-4 px-4 py-6 mx-auto bg-white rounded shadow h-[70vh]" style={{ minWidth: "50em" }}>
      <div className="w-64 border-r overflow-y-auto pr-3">
        <h2 className="font-semibold mb-3">Conversations</h2>
        {conversations.length === 0 && (
          <p className="text-sm text-gray-500">No conversations yet.</p>
        )}
        {conversations.map((conv) => (
          <button
            key={conv.id}
            onClick={() => handleSelect(conv.id)}
            className={`w-full text-left p-2 rounded mb-1 ${activeId === conv.id ? "bg-cyan-100" : "hover:bg-gray-100"}`}
          >
            <div className="font-medium truncate">{conv.other_user_name}</div>
            <div className="text-xs text-gray-500 truncate">{conv.last_message}</div>
          </button>
        ))}
      </div>
      <div className="flex flex-col flex-1">
        <div className="mb-4">
          <p className="font-semibold">{active?.other_user_name || "Select a conversation"}</p>
        </div>
        <div className="flex-1 overflow-y-auto mb-4 bg-gray-50 p-4 rounded">
          {messages.map((msg, idx) => (
            <div
              key={msg.id || idx}
              className={`mb-3 flex ${msg.from === "me" || msg.from === user?.name ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-lg min-w-xs ${
                  msg.from === "me" || msg.from === user?.name
                    ? "bg-gray-100 text-gray-900"
                    : "bg-green-100 text-green-900"
                }`}
              >
                <span>{msg.text}</span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex gap-2">
          <input
            className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none"
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={!activeId}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            onClick={handleSend}
            disabled={!activeId}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
