import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface UserProfile {
  nickname: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string | null;
}

export default function Profil() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    nickname: user?.name || "",
    firstName: "",
    lastName: "",
    email: user?.email || "",
    avatar: user?.avatar || null,
  });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditSave = () => {
    if (isEditing) {
      if (password && password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      // Update user data
      updateUser({
        name: profile.nickname,
        email: profile.email,
        avatar: profile.avatar,
        ...(password && { password }), // Update password only if it was changed
      });

      setError("");
      navigate("/home");
    } else {
      setIsEditing(true);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            User Profile
          </h1>
          <button
            onClick={handleEditSave}
            className={`px-6 py-2 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
              isEditing
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {isEditing ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Save
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="space-y-8">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-4xl font-bold overflow-hidden shadow-lg">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  profile.nickname[0]
                )}
              </div>
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-white p-3 rounded-full shadow-lg cursor-pointer hover:bg-gray-50 transition-colors group-hover:opacity-100">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </label>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nickname
              </label>
              <input
                type="text"
                value={profile.nickname}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, nickname: e.target.value }))
                }
                disabled={!isEditing}
                className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                value={profile.firstName}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, firstName: e.target.value }))
                }
                disabled={!isEditing}
                className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                value={profile.lastName}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, lastName: e.target.value }))
                }
                disabled={!isEditing}
                className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, email: e.target.value }))
              }
              disabled={!isEditing}
              className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 transition-colors"
            />
          </div>

          {isEditing && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
