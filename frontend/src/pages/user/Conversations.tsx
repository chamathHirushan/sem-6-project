import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

// Extended dummy users with more details
const users = {
  employee: {
    id: "u101",
    name: "Alice Johnson",
    profilePic: "https://randomuser.me/api/portraits/women/44.jpg",
    role: "Frontend Developer"
  },
  employer: {
    id: "u202",
    name: "Bob Smith",
    profilePic: "https://randomuser.me/api/portraits/men/46.jpg",
    role: "Hiring Manager"
  },
  employee2: {
    id: "u103",
    name: "Carol Davis",
    profilePic: "https://randomuser.me/api/portraits/women/55.jpg",
    role: "UX Designer"
  },
  employer2: {
    id: "u204",
    name: "David Wilson",
    profilePic: "https://randomuser.me/api/portraits/men/32.jpg",
    role: "Product Manager"
  }
};

// Extended dummy threads data with more variety
const dummyThreads: Record<string, any[]> = {
  "thread-1": [
    { from: "employee", text: "Hello! I am interested in the job opening." },
    { from: "employer", text: "Hi Alice! Can you tell me about your experience?" },
    { from: "employee", text: "Sure, I have 3 years of experience in web development." },
    { from: "employer", text: "That's great! Are you available for an interview this week?" },
    { from: "employee", text: "Yes, I am available on Thursday or Friday." },
  ],
  "thread-2": [
    { from: "employee", text: "Hi, is the designer position still open?" },
    { from: "employer", text: "Yes, it is! Can you share your portfolio?" },
    { from: "employee", text: "Absolutely, here's the link: behance.net/alicejohnson" },
    { from: "employer", text: "Impressive work! Let's schedule a call." },
  ],
  "thread-3": [
    { from: "employee2", text: "I'm interested in learning more about the UX role." },
    { from: "employer2", text: "Great! What's your experience with user research?" },
    { from: "employee2", text: "I've conducted usability testing for 5+ projects." },
  ],
  "thread-4": [
    { from: "employee", text: "Following up on our previous discussion." },
    { from: "employer", text: "Thanks for reaching out! The position is still available." },
  ]
};

// Thread metadata for better organization
const threadMetadata: Record<string, { participants: string[], title: string }> = {
  "thread-1": { 
    participants: ["employee", "employer"], 
    title: "Frontend Developer Position" 
  },
  "thread-2": { 
    participants: ["employee", "employer"], 
    title: "Designer Position Discussion" 
  },
  "thread-3": { 
    participants: ["employee2", "employer2"], 
    title: "UX Designer Role" 
  },
  "thread-4": { 
    participants: ["employee", "employer"], 
    title: "Follow-up Discussion" 
  }
};

export default function Conversations() {
  const { threadId = "thread-1" } = useParams<{ threadId: string }>();
  const { user } = useAuth();
  
  // Get thread metadata
  const currentThreadMeta = threadMetadata[threadId];
  const participants = currentThreadMeta?.participants || ["employee", "employer"];
  
  // Use threadId to select the right conversation
  const [messages, setMessages] = useState(dummyThreads[threadId] || []);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Update messages when threadId changes
  useEffect(() => {
    setMessages(dummyThreads[threadId] || []);
  }, [threadId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // For demo, assume user.role is either "employee" or "employer"
  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { from: user.role, text: input }]);
    setInput("");
  };

  // Get participant users for this thread
  const [user1Key, user2Key] = participants;
  const user1 = users[user1Key as keyof typeof users];
  const user2 = users[user2Key as keyof typeof users];

  return (
    <div className="flex flex-col w-full max-w-6xl px-4 py-6 mx-auto bg-white rounded shadow h-[70vh] min-w-0">
      {/* Thread Header with participant info */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg">{currentThreadMeta?.title || `Thread ${threadId}`}</h3>
          <span className="text-xs text-gray-400 bg-white px-2 py-1 rounded">ID: {threadId}</span>
        </div>
        
        <div className="flex items-center gap-4">
          {/* User 1 */}
          <div className="flex items-center gap-2">
            <img src={user1?.profilePic} alt={user1?.name} className="w-10 h-10 rounded-full border-2 border-blue-200" />
            <div>
              <div className="font-semibold text-sm">{user1?.name}</div>
              <div className="text-xs text-gray-500">{user1?.role}</div>
              <div className="text-xs text-gray-400">ID: {user1?.id}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-1 text-gray-400">
            <span className="text-sm">↔</span>
            <span className="text-xs">conversation</span>
          </div>
          
          {/* User 2 */}
          <div className="flex items-center gap-2">
            <img src={user2?.profilePic} alt={user2?.name} className="w-10 h-10 rounded-full border-2 border-green-200" />
            <div>
              <div className="font-semibold text-sm">{user2?.name}</div>
              <div className="text-xs text-gray-500">{user2?.role}</div>
              <div className="text-xs text-gray-400">ID: {user2?.id}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto mb-4 bg-gray-50 p-4 rounded">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No messages in this thread yet.</p>
            <p className="text-sm">Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const sender = users[msg.from as keyof typeof users];
            const isCurrentUser = msg.from === user.role;
            return (
              <div
                key={idx}
                className={`mb-3 flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
              >
                <div className="flex items-end gap-2 max-w-lg">
                  {!isCurrentUser && (
                    <img src={sender?.profilePic} alt={sender?.name} className="w-8 h-8 rounded-full" />
                  )}
                  <div
                    className={`px-4 py-2 rounded-lg ${
                      isCurrentUser
                        ? "bg-blue-100 text-blue-900"
                        : "bg-green-100 text-green-900"
                    }`}
                  >
                    <span className="block text-xs font-medium mb-1">
                      {sender?.name} <span className="text-gray-400">({sender?.id})</span>
                    </span>
                    <span>{msg.text}</span>
                  </div>
                  {isCurrentUser && (
                    <img src={sender?.profilePic} alt={sender?.name} className="w-8 h-8 rounded-full" />
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex gap-2">
        <input
          className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
}