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
    <div className="min-h-screen bg-[#0a0a1a] px-4 py-8">
      <div className="max-w-md mx-auto">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-300 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to chats
        </Link>

        <div className="bg-[#12122b] border border-white/10 rounded-3xl p-8 text-center">
          <h2 className="text-lg font-bold text-white mb-6">Your Profile</h2>

          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <img
                src={selectedImg || authUser?.profilePic || "/avatar.png"}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border-4 border-purple-500/20"
              />
              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 bg-gradient-to-br from-purple-500 to-pink-500 w-9 h-9 rounded-full cursor-pointer text-white flex items-center justify-center hover:opacity-90 transition-opacity ${
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
            <p className="text-xs text-gray-500">
              {isUpdatingProfile ? "Uploading..." : "Tap the camera to update your photo"}
            </p>
          </div>

          <div className="mt-8 text-left space-y-4">
            <div className="pb-3 border-b border-white/10">
              <p className="text-xs text-gray-500 mb-0.5">Full Name</p>
              <p className="text-sm font-medium text-white">{authUser?.fullName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Email</p>
              <p className="text-sm font-medium text-white">{authUser?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;