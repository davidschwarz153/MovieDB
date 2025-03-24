import { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

interface UserSettings {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  avatar: string;
}

export default function Settings() {
  const { currentUser, updateUser } = useUser();
  const navigate = useNavigate();
  const [settings, setSettings] = useState<UserSettings>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    avatar: "",
  });
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    // Split name into first and last name
    const [firstName, lastName] = currentUser.name.split(" ");
    setSettings((prev) => ({
      ...prev,
      firstName: firstName || "",
      lastName: lastName || "",
      email: currentUser.email,
      avatar: currentUser.avatar || "",
    }));
  }, [currentUser, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess("");
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings((prev) => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (settings.password !== settings.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await updateUser({
        name: `${settings.firstName} ${settings.lastName}`.trim(),
        email: settings.email,
        ...(settings.password && { password: settings.password }),
        ...(settings.avatar && { avatar: settings.avatar }),
      });

      setSuccess("Settings updated successfully");

      // Redirect to home page after successful update
      setTimeout(() => {
        navigate("/Home");
      }, 1000); // Wait 1 second to show success message
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update settings"
      );
    }
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-gray-800/50 rounded-xl shadow-lg p-6 space-y-8">
        <h1 className="text-2xl font-bold text-white text-center">
          User Settings
        </h1>

        {error && (
          <div className="bg-red-500/10 border-l-4 border-red-500 p-4 text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border-l-4 border-green-500 p-4 text-green-400">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center">
            <div className="relative group">
              <img
                src={settings.avatar || "/default-avatar.png"}
                alt="User Avatar"
                className="w-32 h-32 rounded-full object-cover border-4 border-purple-500/30"
              />
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                <span className="text-white text-sm">Change Avatar</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={settings.firstName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={settings.lastName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={settings.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              New Password
            </label>
            <input
              type="password"
              name="password"
              value={settings.password}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="Leave blank to keep current password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={settings.confirmPassword}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="Leave blank to keep current password"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
