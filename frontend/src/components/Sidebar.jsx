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
      <div className="w-72 border-r border-gray-200 bg-white p-4">
        <p className="text-sm text-gray-400">Loading chats...</p>
      </div>
    );
  }

  return (
    <div className="w-72 border-r border-gray-200 bg-white h-screen overflow-y-auto flex flex-col">
      <div className="px-4 py-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-800">Chats</h2>
        <p className="text-xs text-gray-400 mt-0.5">{users.length} contacts</p>
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
                  ? "bg-[#e9f5f0] border-[#075E54]"
                  : "border-transparent hover:bg-gray-50"
              }`}
            >
              <div className="relative shrink-0">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.fullName}
                  className="w-11 h-11 rounded-full object-cover"
                />
                {isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#25D366] rounded-full border-2 border-white" />
                )}
              </div>
              <div className="text-left min-w-0">
                <p className="font-medium text-sm text-gray-800 truncate">{user.fullName}</p>
                <p className={`text-xs mt-0.5 ${isOnline ? "text-[#25D366]" : "text-gray-400"}`}>
                  {isOnline ? "Online" : "Offline"}
                </p>
              </div>
            </button>
          );
        })}
        {users.length === 0 && (
          <p className="text-center text-sm text-gray-400 p-6">No contacts yet</p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;