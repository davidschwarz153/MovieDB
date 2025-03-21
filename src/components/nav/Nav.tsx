import { Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { LayoutDashboard } from "lucide-react";

export default function Nav() {
  const { isAdmin, currentUser } = useUser();

  const displayName = currentUser 
    ? (isAdmin ? "Admin" : currentUser.name) 
    : "";

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full bg-gradient-to-r from-gray-800/95 via-gray-900/95 to-gray-800/95 backdrop-blur-md flex justify-between items-center px-4 md:px-12 py-3 md:py-4 z-[99999] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.3)] border-t border-gray-700/30">
      <div className="relative z-10 flex justify-between items-center w-full max-w-7xl mx-auto">
        <Link 
          to="/Home" 
          className="relative cursor-pointer transform hover:scale-110 transition-transform duration-300 active:scale-95"
        >
          <img src="/Home.png" alt="Home" className="w-5 h-5 md:w-6 md:h-6 brightness-200" />
        </Link>

        <Link
          to="/favorites"
          className="relative transform hover:scale-110 transition-transform duration-300 active:scale-95"
        >
          <img
            src="/Vector.png"
            alt="Favorites"
            className="w-5 h-5 md:w-6 md:h-6 brightness-200"
          />
        </Link>

        {isAdmin && (
          <Link
            to="/dashboard"
            className="relative transform hover:scale-110 transition-transform duration-300 active:scale-95"
            title="Admin Dashboard"
          >
            <LayoutDashboard className="w-5 h-5 md:w-6 md:h-6 text-gray-200" />
          </Link>
        )}

        <div className="relative transform hover:scale-110 transition-transform duration-300 cursor-not-allowed opacity-50">
          <img
            src="/Vector (1).png"
            alt="All Movies"
            className="w-5 h-5 md:w-6 md:h-6 brightness-200"
          />
        </div>

        <div className="flex items-center gap-2">
          {displayName && (
            <span className="text-gray-300 text-xs md:text-sm font-medium">
              {displayName}
            </span>
          )}
          <Link
            to="/Profil"
            className="relative transform hover:scale-110 transition-transform duration-300 active:scale-95"
          >
            <img
              src="/Profile.png"
              alt="Profile"
              className="w-5 h-5 md:w-6 md:h-6 brightness-200"
            />
          </Link>
        </div>
      </div>
    </nav>
  );
}
