import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore.js";
import { useAuthStore } from "../store/useAuthStore.js";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  if (isUsersLoading) {
    return (
      <div className="w-72 border-r border-white/10 bg-[#12122b] p-4">
        <p className="text-sm text-gray-500">Loading chats...</p>
      </div>
    );
  }

  return (
    <div className="w-72 border-r border-white/10 bg-[#12122b] h-screen overflow-y-auto flex flex-col">
      <div className="px-4 py-4 border-b border-white/10">
        <h2 className="text-sm font-semibold text-white">Chats</h2>
        <p className="text-xs text-gray-500 mt-0.5">{users.length} contacts</p>
      </div>
      <div className="flex-1">
        {users.map((user) => {
          const isOnline = onlineUsers.includes(user._id);
          const isSelected = selectedUser?._id === user._id;
          return (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-colors border-l-2 ${
                isSelected
                  ? "bg-purple-500/10 border-purple-500"
                  : "border-transparent hover:bg-white/5"
              }`}
            >
              <div className="relative shrink-0">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.fullName}
                  className="w-11 h-11 rounded-full object-cover"
                />
                {isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-[#12122b]" />
                )}
              </div>
              <div className="text-left min-w-0">
                <p className="font-medium text-sm text-white truncate">{user.fullName}</p>
                <p className={`text-xs mt-0.5 ${isOnline ? "text-green-400" : "text-gray-500"}`}>
                  {isOnline ? "Online" : "Offline"}
                </p>
              </div>
            </button>
          );
        })}
        {users.length === 0 && (
          <p className="text-center text-sm text-gray-500 p-6">No contacts yet</p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;