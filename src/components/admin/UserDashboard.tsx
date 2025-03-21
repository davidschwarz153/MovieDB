import React, { useState } from "react";
import { User } from "../../types/user";
import { useUser } from "../../context/UserContext";

export default function UserDashboard() {
  const { users, updateUser } = useUser();
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const handleUserUpdate = async (userId: string, data: Partial<User>) => {
    try {
      await updateUser(data);
      setSuccessMessage("User updated successfully");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setError("Failed to update user");
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <div className="grid gap-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-gray-800 rounded-lg p-4 flex items-center justify-between"
          >
            <div>
              <h2 className="text-lg font-semibold">{user.name}</h2>
              <p className="text-gray-400">{user.email}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  handleUserUpdate(user.id, {
                    status: user.status === "active" ? "banned" : "active",
                  })
                }
                className={`px-3 py-1 rounded ${
                  user.status === "active"
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {user.status === "active" ? "Ban" : "Unban"}
              </button>
              <button
                onClick={() =>
                  handleUserUpdate(user.id, {
                    role: user.role === "admin" ? "user" : "admin",
                  })
                }
                className="px-3 py-1 rounded bg-blue-500 hover:bg-blue-600"
              >
                {user.role === "admin" ? "Remove Admin" : "Make Admin"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
