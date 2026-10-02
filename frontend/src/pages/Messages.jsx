import { useState, useEffect, useContext, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { createSocket } from "../socket";

export default function Messages() {
  const { user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();

  const [conversations, setConversations] = useState([]);
  const [active, setActive] = useState(null); // { _id, name }
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const activeRef = useRef(null);
  const bottomRef = useRef(null);

  const loadConversations = async () => {
    try {
      const res = await api.get("/chat");
      setConversations(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadMessages = async (id) => {
    try {
      const res = await api.get(`/chat/${id}`);
      setMessages(res.data);
      loadConversations();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load messages");
    }
  };

  // Product page se aaye ho to us seller ki chat khol do
  useEffect(() => {
    loadConversations();
    const to = searchParams.get("to");
    if (to) {
      setActive({ _id: to, name: searchParams.get("name") || "Seller" });
    }
  }, []);

  useEffect(() => {
    activeRef.current = active;
    if (active) loadMessages(active._id);
  }, [active?._id]);

  // Real-time messages
  useEffect(() => {
    const socket = createSocket();

    socket.on("newMessage", (m) => {
      if (activeRef.current && m.sender === activeRef.current._id) {
        setMessages((prev) => [...prev, m]);
        api.get(`/chat/${m.sender}`).catch(() => {}); // read mark
      }
      loadConversations();
    });

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !active) return;
    setError("");
    try {
      const res = await api.post(`/chat/${active._id}`, { text });
      setMessages((prev) => [...prev, res.data]);
      setText("");
      loadConversations();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send");
    }
  };

  const displayName = (u) => u.shopName || u.name;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Messages</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-3 h-[70vh] overflow-hidden">
        {/* Conversations list */}
        <div className="border-r border-gray-100 overflow-y-auto">
          {conversations.length === 0 && (
            <p className="p-5 text-gray-400 text-sm">No conversations yet.</p>
          )}
          {conversations.map((c) => (
            <button
              key={c.user._id}
              onClick={() => setActive({ _id: c.user._id, name: displayName(c.user) })}
              className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 ${
                active?._id === c.user._id ? "bg-rose-50" : ""
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-800">{displayName(c.user)}</span>
                {c.unread > 0 && (
                  <span className="text-xs bg-rose-600 text-white rounded-full px-2 py-0.5">
                    {c.unread}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-400 truncate">{c.lastMessage}</p>
            </button>
          ))}
        </div>

        {/* Chat window */}
        <div className="md:col-span-2 flex flex-col h-full min-h-0">
          {!active ? (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              Select a conversation
            </div>
          ) : (
            <>
              <div className="p-4 border-b border-gray-100 font-semibold text-gray-800">
                {active.name}
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
                {messages.length === 0 && (
                  <p className="text-center text-gray-400 text-sm mt-6">
                    Say hello!
                  </p>
                )}
                {messages.map((m) => {
                  const mine = m.sender === user._id;
                  return (
                    <div key={m._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
                          mine
                            ? "bg-rose-600 text-white"
                            : "bg-white border border-gray-200 text-gray-800"
                        }`}
                      >
                        {m.text}
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              {error && <p className="text-sm text-red-500 px-4 pt-2">{error}</p>}

              <form onSubmit={handleSend} className="p-3 border-t border-gray-100 flex gap-2">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2"
                />
                <button
                  type="submit"
                  className="bg-rose-600 text-white px-5 py-2 rounded-xl hover:bg-rose-700 transition font-medium"
                >
                  Send
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}