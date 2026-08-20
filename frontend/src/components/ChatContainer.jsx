import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore.js";
import { useAuthStore } from "../store/useAuthStore.js";
import { Send } from "lucide-react";

const ChatContainer = () => {
  const {
    messages,
    selectedUser,
    getMessages,
    isMessagesLoading,
    sendMessage,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser, onlineUsers } = useAuthStore();
  const [text, setText] = useState("");
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
      subscribeToMessages();
    }
    return () => unsubscribeFromMessages();
  }, [selectedUser, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendMessage({ text });
    setText("");
  };

  if (!selectedUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#0a0a1a] text-gray-500">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-3">
          <Send className="w-6 h-6 text-gray-600" />
        </div>
        <p className="text-sm">Select a contact to start chatting</p>
      </div>
    );
  }

  const isOnline = onlineUsers.includes(selectedUser._id);

  return (
    <div className="flex-1 flex flex-col h-screen bg-[#0a0a1a]">
      <div className="px-5 py-3 border-b border-white/10 bg-[#12122b] flex items-center gap-3">
        <img
          src={selectedUser.profilePic || "/avatar.png"}
          alt={selectedUser.fullName}
          className="w-9 h-9 rounded-full object-cover"
        />
        <div>
          <p className="font-medium text-sm text-white">{selectedUser.fullName}</p>
          <p className={`text-xs ${isOnline ? "text-green-400" : "text-gray-500"}`}>
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2">
        {isMessagesLoading ? (
          <p className="text-sm text-gray-500">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-sm text-gray-500 text-center mt-10">No messages yet — say hi 👋</p>
        ) : (
          messages.map((message) => {
            const isMine = message.senderId === authUser._id;
            return (
              <div key={message._id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs md:max-w-sm px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${
                    isMine
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-sm"
                      : "bg-white/10 text-gray-100 rounded-bl-sm"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            );
          })
        )}
        <div ref={messageEndRef} />
      </div>

      <form onSubmit={handleSend} className="px-4 py-3 border-t border-white/10 bg-[#12122b] flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message"
          className="flex-1 bg-[#0a0a1a] border border-white/10 rounded-full px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white hover:opacity-90 transition-opacity disabled:opacity-40"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default ChatContainer;