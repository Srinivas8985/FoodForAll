import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Send, User, MessageSquare } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Chat = () => {
    const { user, api } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const scrollRef = useRef();

    useEffect(() => {
        const getConversations = async () => {
            try {
                if (user) {
                    const res = await api.get(`/chat/conversation/${user._id}`);
                    setConversations(res.data);
                }
            } catch (err) {
                console.error("Failed to fetch conversations", err);
            }
        };
        getConversations();
    }, [user, api]);

    useEffect(() => {
        const getMessages = async () => {
            if (currentChat) {
                try {
                    const res = await api.get(`/chat/message/${currentChat._id}`);
                    setMessages(res.data);
                } catch (err) {
                    console.error(err);
                }
            }
        };
        getMessages();

        // Polling for new messages every 3 seconds
        const interval = setInterval(getMessages, 3000);
        return () => clearInterval(interval);
    }, [currentChat, api]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const receiverId = currentChat.members.find(member => member !== user._id);

        try {
            const message = {
                conversationId: currentChat._id,
                sender: user._id,
                text: newMessage,
            };

            const res = await api.post("/chat/message", message);
            setMessages([...messages, res.data]);
            setNewMessage("");

            // Scroll to bottom
            scrollRef.current?.scrollIntoView({ behavior: "smooth" });
        } catch (err) {
            console.error(err);
            toast.error("Failed to send message");
        }
    };

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="min-h-screen bg-transparent pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-6xl mx-auto h-[80vh] flex gap-4 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-white/50">
                {/* Conversations List */}
                <div className="w-1/3 border-r border-gray-100 bg-gray-50/50 flex flex-col">
                    <div className="p-4 border-b border-gray-100">
                        <h2 className="font-bold text-gray-700 flex items-center gap-2">
                            <MessageSquare className="w-5 h-5" /> Chats
                        </h2>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {conversations.length === 0 ? (
                            <div className="p-4 text-center text-gray-500 text-sm">No conversations yet.</div>
                        ) : (
                            conversations.map((c) => (
                                <div
                                    key={c._id}
                                    onClick={() => setCurrentChat(c)}
                                    className={`p-4 cursor-pointer hover:bg-white transition-colors border-b border-gray-50 flex items-center gap-3 ${currentChat?._id === c._id ? "bg-white border-l-4 border-l-primary-500 shadow-sm" : ""}`}
                                >
                                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                                        <User className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-900 truncate">{c.otherUser?.name || "User"}</p>
                                        <p className="text-xs text-gray-500 uppercase">{c.otherUser?.role}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Chat Window */}
                <div className="flex-1 flex flex-col">
                    {currentChat ? (
                        <>
                            <div className="p-4 border-b border-gray-100 bg-white shadow-sm flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center text-secondary-600">
                                        <User className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-bold text-gray-900">{currentChat.otherUser?.name}</h3>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
                                {messages.map((m) => (
                                    <div ref={scrollRef} key={m._id} className={`flex ${m.sender === user._id ? "justify-end" : "justify-start"}`}>
                                        <div className={`max-w-[70%] p-3 rounded-2xl shadow-sm text-sm ${m.sender === user._id ? "bg-primary-600 text-white rounded-tr-none" : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"}`}>
                                            <p>{m.text}</p>
                                            <p className={`text-[10px] mt-1 text-right ${m.sender === user._id ? "text-primary-100" : "text-gray-400"}`}>{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-4 bg-white border-t border-gray-100">
                                <form onSubmit={handleSubmit} className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Type a message..."
                                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all placeholder:text-gray-400"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                    />
                                    <button
                                        disabled={!newMessage.trim()}
                                        type="submit"
                                        className="p-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-primary-500/30"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <MessageSquare className="w-10 h-10 text-gray-300" />
                            </div>
                            <p className="text-xl font-medium text-gray-500">Select a conversation to start chatting</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat;
