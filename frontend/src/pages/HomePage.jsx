import Sidebar from "../components/Sidebar.jsx";
import ChatContainer from "../components/ChatContainer.jsx";
import { useAuthStore } from "../store/useAuthStore.js";
import { Link } from "react-router-dom";
import { MessageCircle, LogOut } from "lucide-react";

const HomePage = () => {
  const { authUser, logout } = useAuthStore();

  return (
    <div className="h-screen flex flex-col bg-[#0a0a1a]">
      <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between bg-[#12122b]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <MessageCircle className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm text-white">Chatty</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img
              src={authUser?.profilePic || "/avatar.png"}
              alt={authUser?.fullName}
              className="w-7 h-7 rounded-full object-cover border border-purple-400/40"
            />
            <span className="text-xs font-medium text-gray-300 hidden sm:inline">{authUser?.fullName}</span>
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-xs bg-white/5 hover:bg-white/10 text-gray-300 px-3 py-1.5 rounded-full transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <ChatContainer />
      </div>
    </div>
  );
};

export default HomePage;