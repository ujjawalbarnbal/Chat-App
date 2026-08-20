import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import { Link } from "react-router-dom";
import { ArrowLeft, Camera } from "lucide-react";

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
    <div className="min-h-screen bg-[#f0f2f0] px-4 py-8">
      <div className="max-w-md mx-auto">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to chats
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Your Profile</h2>

          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <img
                src={selectedImg || authUser?.profilePic || "/avatar.png"}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border-4 border-[#e9f5f0]"
              />
              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 bg-[#075E54] hover:bg-[#064840] w-9 h-9 rounded-full cursor-pointer text-white flex items-center justify-center transition-colors ${
                  isUpdatingProfile ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                <Camera className="w-4 h-4" />
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
            <p className="text-xs text-gray-400">
              {isUpdatingProfile ? "Uploading..." : "Tap the camera to update your photo"}
            </p>
          </div>

          <div className="mt-8 text-left space-y-4">
            <div className="pb-3 border-b border-gray-100">
              <p className="text-xs text-gray-400 mb-0.5">Full Name</p>
              <p className="text-sm font-medium text-gray-800">{authUser?.fullName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Email</p>
              <p className="text-sm font-medium text-gray-800">{authUser?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;