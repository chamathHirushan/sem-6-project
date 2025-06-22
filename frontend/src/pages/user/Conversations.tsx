import { useEffect, useState,useRef } from "react";
import { apiClient } from "../../api/client";
import {useAuth} from "../../contexts/AuthContext";

// Dummy conversation data
const dummyMessages = [
  { from: "employer", text: "Hi!, I can repair your ceiling. is that job still abailable." },
  { from: "employee", text: "yes, its available. I need it done by next week" },
  { from: "employee", text: "would it be possible for you" },
  { from: "employer", text: "Yes, I can manage it with that time" },
];

export default function Conversations() {
      const [backendData, setBackendData] = useState<string>("Loading...");
      const {user} = useAuth();
      const [messages, setMessages] = useState(dummyMessages);
      const [input, setInput] = useState("");
      const messagesEndRef = useRef<HTMLDivElement>(null);
    
      // useEffect(() => {
      //   async function fetchData() {
      //     try {
      //       const response = await apiClient.get("/user/dashboard");
      //       setBackendData(response.message || "No data received");
      //     } catch (error) {
      //       setBackendData("Error fetching data");
      //       console.error("API Error:", error);
      //     }
      //   }
    
        // fetchData();
      useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { from: user.name, text: input }]);
    setInput("");
  };
      
   return (
    <div className="flex flex-col flex-1 px-4 py-6 mx-auto bg-white rounded shadow h-[70vh]" style={{minWidth: "50em"}}>
      <div className="mb-4">
        <p className="font-semibold">
          {/* Conversation between <span className="text-blue-600">Employee</span> and <span className="text-green-600">Employer</span> */}
        </p>
      </div>
      <div className="flex-1 overflow-y-auto mb-4 bg-gray-50 p-4 rounded">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-3 flex ${msg.from === "employee" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-4 py-2 rounded-lg min-w-xs ${
                msg.from === "employee"
                  ? "bg-gray-100 text-gray-900"
                  : "bg-green-100 text-green-900"
              }`}
            >
              {/* <span className="block text-xs font-medium mb-1 capitalize">
                {msg.from}
              </span> */}
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
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
  }

