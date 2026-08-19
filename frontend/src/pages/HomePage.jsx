import { useAuthStore } from "../store/useAuthStore.js";

const HomePage = () => {
  const { authUser, logout } = useAuthStore();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome, {authUser?.fullName}!</h1>
        <p className="text-gray-600 mb-4">Chat interface coming soon.</p>
        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default HomePage;