import { useChatStore } from "../store/useChatStore.js";
import Sidebar from "../components/Sidebar.jsx";
import ChatContainer from "../components/ChatContainer.jsx";
import { useAuthStore } from "../store/useAuthStore.js";

const HomePage = () => {
  const { selectedUser } = useChatStore();
  const { authUser, logout } = useAuthStore();

  return (
    <div className="h-screen flex flex-col">
      <div className="p-3 border-b flex items-center justify-between bg-white">
        <span className="font-bold">Chatty</span>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">{authUser?.fullName}</span>
          <button
            onClick={logout}
            className="text-sm bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
          >
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