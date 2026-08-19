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
      <div className="w-64 border-r p-4">
        <p className="text-gray-500">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="w-64 border-r h-screen overflow-y-auto">
      <div className="p-4 border-b font-bold">Chats</div>
      <div>
        {users.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`w-full flex items-center gap-3 p-3 hover:bg-gray-100 transition-colors ${
              selectedUser?._id === user._id ? "bg-gray-100" : ""
            }`}
          >
            <div className="relative">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.fullName}
                className="w-10 h-10 rounded-full object-cover"
              />
              {onlineUsers.includes(user._id) && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>
            <div className="text-left">
              <p className="font-medium">{user.fullName}</p>
              <p className="text-xs text-gray-500">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </p>
            </div>
          </button>
        ))}
        {users.length === 0 && (
          <p className="text-center text-gray-400 p-4">No users found</p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;