import { useState } from "react";
import { useUser } from "../../context/UserContext";
import { User } from "../../types/user";
import { Ban, UserCheck, Trash2, AlertCircle } from "lucide-react";

export default function UserManagement() {
  const {
    users,
    user: currentUser,
    deleteUser,
    banUser,
    unbanUser,
  } = useUser();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [action, setAction] = useState<"delete" | "ban" | "unban" | null>(null);

  const handleAction = async () => {
    if (!selectedUser) return;

    try {
      switch (action) {
        case "delete":
          await deleteUser(selectedUser.id);
          break;
        case "ban":
          await banUser(selectedUser.id);
          break;
        case "unban":
          await unbanUser(selectedUser.id);
          break;
      }
      setShowConfirmation(false);
      setSelectedUser(null);
      setAction(null);
    } catch (error) {
      console.error("Failed to perform action:", error);
    }
  };

  const confirmAction = (
    user: User,
    actionType: "delete" | "ban" | "unban"
  ) => {
    setSelectedUser(user);
    setAction(actionType);
    setShowConfirmation(true);
  };

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-slate-400">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 pt-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">User Management</h1>
        <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-700">
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-700/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center">
                            {user.avatar ? (
                              <img
                                src={user.avatar}
                                alt=""
                                className="h-10 w-10 rounded-full"
                              />
                            ) : (
                              <span className="text-white text-lg">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">
                            {user.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-300">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-slate-100 text-slate-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        {user.id !== currentUser.id && (
                          <>
                            {user.status === "active" ? (
                              <button
                                onClick={() => confirmAction(user, "ban")}
                                className="text-yellow-400 hover:text-yellow-500"
                                title="Ban User"
                              >
                                <Ban size={18} />
                              </button>
                            ) : (
                              <button
                                onClick={() => confirmAction(user, "unban")}
                                className="text-green-400 hover:text-green-500"
                                title="Unban User"
                              >
                                <UserCheck size={18} />
                              </button>
                            )}
                            <button
                              onClick={() => confirmAction(user, "delete")}
                              className="text-red-400 hover:text-red-500"
                              title="Delete User"
                            >
                              <Trash2 size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showConfirmation && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-white mb-4">
              Confirm Action
            </h3>
            <p className="text-slate-300 mb-6">
              {action === "delete"
                ? `Are you sure you want to delete ${selectedUser.name}'s account? This action cannot be undone.`
                : action === "ban"
                ? `Are you sure you want to ban ${selectedUser.name}? They will not be able to access their account.`
                : `Are you sure you want to unban ${selectedUser.name}? They will regain access to their account.`}
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowConfirmation(false);
                  setSelectedUser(null);
                  setAction(null);
                }}
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAction}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  action === "delete"
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : action === "ban"
                    ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
