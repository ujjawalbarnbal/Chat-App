import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore.js";
import { useAuthStore } from "../store/useAuthStore.js";
import EmojiPicker from "emoji-picker-react";
import GifPicker from "./GifPicker.jsx";
import {
  Send,
  Image,
  X,
  Smile,
  Sticker,
  Download,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

const ChatContainer = () => {
  const {
    messages,
    selectedUser,
    getMessages,
    isMessagesLoading,
    sendMessage,
    subscribeToMessages,
    unsubscribeFromMessages,
    isTyping,
    emitTyping,
    emitStopTyping,
    subscribeToTyping,
    unsubscribeFromTyping,
  } = useChatStore();

  const { authUser, onlineUsers } = useAuthStore();
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const fileInputRef = useRef(null);
  const messageEndRef = useRef(null);
  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const modalRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
      subscribeToMessages();
      subscribeToTyping();
    }
    return () => {
      unsubscribeFromMessages();
      unsubscribeFromTyping();
    };
  }, [selectedUser, getMessages, subscribeToMessages, unsubscribeFromMessages, subscribeToTyping, unsubscribeFromTyping]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  useEffect(() => {
    const modalEl = modalRef.current;
    if (!modalEl || !fullscreenImage) return;

    const handleWheel = (e) => {
      e.preventDefault();
      setZoomLevel((prev) => {
        const next = prev - e.deltaY * 0.001;
        return Math.min(Math.max(next, 1), 4);
      });
    };

    modalEl.addEventListener("wheel", handleWheel, { passive: false });
    return () => modalEl.removeEventListener("wheel", handleWheel);
  }, [fullscreenImage]);

  const handleTextChange = (e) => {
    setText(e.target.value);

    if (!selectedUser) return;
    emitTyping(selectedUser._id);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      emitStopTyping(selectedUser._id);
    }, 1500);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImagePreview = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
  };

  const handleGifSelect = (gifUrl) => {
    sendMessage({ text: "", image: gifUrl });
    setShowGifPicker(false);
  };

  const handleDownload = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = "chatty-image.jpg";
    link.target = "_blank";
    link.click();
  };

  const openFullscreen = (imageUrl) => {
    setFullscreenImage(imageUrl);
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  };

  const formatDateLabel = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString([], { day: "numeric", month: "long", year: "numeric" });
  };

  const handleMouseDown = (e) => {
    if (zoomLevel <= 1) return;
    isDragging.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    setPanPosition((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    sendMessage({
      text: text.trim(),
      image: imagePreview,
    });

    setText("");
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    if (selectedUser) emitStopTyping(selectedUser._id);
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
          messages.map((message, index) => {
            const isMine = message.senderId === authUser._id;
            const showDateSeparator =
              index === 0 ||
              new Date(message.createdAt).toDateString() !==
                new Date(messages[index - 1].createdAt).toDateString();

            return (
              <div key={message._id}>
                {showDateSeparator && message.createdAt && (
                  <div className="flex justify-center my-3">
                    <span className="text-[11px] text-gray-500 bg-white/5 px-3 py-1 rounded-full">
                      {formatDateLabel(message.createdAt)}
                    </span>
                  </div>
                )}
                <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs md:max-w-sm rounded-2xl text-sm leading-relaxed overflow-hidden ${
                      isMine
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-sm"
                        : "bg-white/10 text-gray-100 rounded-bl-sm"
                    } ${message.image ? "" : "px-3.5 py-2"}`}
                  >
                    {message.image && (
                      <img
                        src={message.image}
                        alt="Shared"
                        className="max-w-full rounded-t-2xl cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => openFullscreen(message.image)}
                      />
                    )}
                    {message.text && (
                      <p className={message.image ? "px-3.5 py-2" : ""}>{message.text}</p>
                    )}
                    {message.createdAt && (
                      <p
                        className={`text-[10px] opacity-60 ${
                          message.image ? "px-3.5 pb-1.5" : "pb-0.5"
                        } ${isMine ? "text-white" : "text-gray-400"}`}
                      >
                        {new Date(message.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white/10 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 items-center">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
            </div>
          </div>
        )}

        <div ref={messageEndRef} />
      </div>

      {imagePreview && (
        <div className="px-4 pt-3 bg-[#12122b] border-t border-white/10">
          <div className="relative inline-block">
            <img src={imagePreview} alt="Preview" className="h-20 rounded-lg object-cover" />
            <button
              onClick={removeImagePreview}
              className="absolute -top-2 -right-2 w-5 h-5 bg-gray-800 rounded-full flex items-center justify-center text-white hover:bg-gray-700"
              type="button"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSend} className="px-4 py-3 border-t border-white/10 bg-[#12122b] flex items-center gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 transition-colors shrink-0"
        >
          <Image className="w-4 h-4" />
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 transition-colors shrink-0"
          >
            <Smile className="w-4 h-4" />
          </button>
          {showEmojiPicker && (
            <div className="absolute bottom-14 left-0 z-10">
              <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" />
            </div>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowGifPicker((prev) => !prev)}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 transition-colors shrink-0"
          >
            <Sticker className="w-4 h-4" />
          </button>
          {showGifPicker && (
            <div className="absolute bottom-14 left-0 z-10">
              <GifPicker onSelect={handleGifSelect} />
            </div>
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleImageSelect}
        />
        <input
          type="text"
          value={text}
          onChange={handleTextChange}
          placeholder="Type a message"
          className="flex-1 bg-[#0a0a1a] border border-white/10 rounded-full px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
        />
        <button
          type="submit"
          disabled={!text.trim() && !imagePreview}
          className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white hover:opacity-90 transition-opacity disabled:opacity-40 shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {fullscreenImage && (
        <div
          ref={modalRef}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 overflow-hidden"
          onClick={() => setFullscreenImage(null)}
        >
          <img
            src={fullscreenImage}
            alt="Full size"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{
              transform: `translate(${panPosition.x}px, ${panPosition.y}px) scale(${zoomLevel})`,
            }}
            className={`max-w-full max-h-full rounded-lg transition-transform duration-100 ${
              zoomLevel > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-default"
            }`}
          />
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setZoomLevel((prev) => Math.max(prev - 0.5, 1));
              }}
              className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setZoomLevel((prev) => Math.min(prev + 0.5, 4));
              }}
              className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDownload(fullscreenImage);
              }}
              className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={() => setFullscreenImage(null)}
              className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatContainer;