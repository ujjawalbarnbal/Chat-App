import { useChatStore } from "../store/useChatStore.js";
import Sidebar from "../components/Sidebar.jsx";
import ChatContainer from "../components/ChatContainer.jsx";
import { useAuthStore } from "../store/useAuthStore.js";
import { Link } from "react-router-dom";
import { MessageCircle, LogOut } from "lucide-react";

const HomePage = () => {
  const { authUser, logout } = useAuthStore();

  return (
    <div className="h-screen flex flex-col">
      <div className="px-5 py-2.5 border-b border-gray-200 flex items-center justify-between bg-[#075E54] text-white">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" strokeWidth={2.2} />
          <span className="font-semibold text-sm">Chatty</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img
              src={authUser?.profilePic || "/avatar.png"}
              alt={authUser?.fullName}
              className="w-7 h-7 rounded-full object-cover border border-white/30"
            />
            <span className="text-xs font-medium hidden sm:inline">{authUser?.fullName}</span>
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors"
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