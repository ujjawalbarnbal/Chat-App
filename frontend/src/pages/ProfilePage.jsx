import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore.js";

const ProfilePage = () => {
  const { authUser, updateProfile, isUpdatingProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold mb-6">Profile</h2>

        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <img
              src={selectedImg || authUser?.profilePic || "/avatar.png"}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
            />
            <label
              htmlFor="avatar-upload"
              className={`absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 p-2 rounded-full cursor-pointer text-white text-xs ${
                isUpdatingProfile ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              {isUpdatingProfile ? "..." : "Edit"}
              <input
                type="file"
                id="avatar-upload"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUpdatingProfile}
              />
            </label>
          </div>
          <p className="text-sm text-gray-500">
            {isUpdatingProfile ? "Uploading..." : "Click the edit icon to update your photo"}
          </p>
        </div>

        <div className="mt-6 text-left space-y-3">
          <div>
            <p className="text-xs text-gray-500">Full Name</p>
            <p className="font-medium">{authUser?.fullName}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Email</p>
            <p className="font-medium">{authUser?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;