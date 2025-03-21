import { Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { LayoutDashboard } from "lucide-react";
import { useEffect } from "react";

export default function Nav() {
  const { isAdmin, currentUser } = useUser();

  useEffect(() => {
    console.log("Current user in Nav:", currentUser);
  }, [currentUser]);

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full bg-gradient-to-r from-gray-800/95 via-gray-900/95 to-gray-800/95 backdrop-blur-md flex justify-between items-center px-4 md:px-12 py-2 md:py-3 z-[99999] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.3)] border-t border-gray-700/30 px-18">
      <div className="relative z-10 flex justify-between items-center w-full max-w-7xl mx-auto">
        <Link
          to="/Home"
          className="relative cursor-pointer transform hover:scale-110 transition-transform duration-300 active:scale-95"
        >
          <img
            src="/Home.png"
            alt="Home"
            className="w-20 h-20 md:w-20 md:h-10 brightness-200 object-contain"
          />
        </Link>

        <Link
          to="/favorites"
          className="relative transform hover:scale-110 transition-transform duration-300 active:scale-95"
        >
          <img
            src="/Vector.png"
            alt="Favorites"
            className="w-4 h-4 md:w-6 md:h-6 cursor-pointer transition-all duration-300 brightness-200 filter-none drop-shadow-[0_0_8px_rgba(34,197,94,0.5)] hover:brightness-[3] hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]"
          />
        </Link>

        {isAdmin && (
          <Link
            to="/dashboard"
            className="relative transform hover:scale-110 transition-transform duration-300 active:scale-95"
            title="Admin Dashboard"
          >
            <LayoutDashboard className="w-4 h-4 md:w-6 md:h-6 text-gray-200" />
          </Link>
        )}

        <div className="relative transform hover:scale-110 transition-transform duration-300 cursor-not-allowed opacity-50">
          <img
            src="/Vector (1).png"
            alt="All Movies"
            className="w-4 h-4 md:w-6 md:h-6 brightness-200"
          />
        </div>

        {currentUser && (
          <div className="flex items-center gap-2">
            <Link
              to="/settings"
              className="relative transform hover:scale-110 transition-transform duration-300 active:scale-95 flex items-center gap-2"
              title="User Settings"
            >
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center overflow-hidden border-2 border-gray-600">
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.log("Avatar load error:", currentUser.avatar);
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        currentUser.name
                      )}&background=7c3aed&color=fff`;
                    }}
                  />
                ) : (
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      currentUser.name
                    )}&background=7c3aed&color=fff`}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <span className="text-gray-300 text-sm hidden md:inline">
                {currentUser.name}
              </span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
