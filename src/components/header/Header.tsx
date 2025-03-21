import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { mainContext } from "../../context/MainProvider";
import { useUser } from "../../context/UserContext";
import { LogOut, LogIn } from "lucide-react";

export default function Header() {
  const { currentUser, logout } = useUser();
  const navigate = useNavigate();
  const { setIsSearching } = useContext(mainContext);

  const handleLogout = () => {
    logout();
    navigate("/home");
  };

  const handleLogoClick = () => {
    setIsSearching(false);
    navigate("/home");
  };

  return (
    <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-10 px-6 md:px-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          {currentUser && (
            <h1 className="text-xl md:text-2xl font-bold">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-gray-50">
                {currentUser.name}
              </span>
            </h1>
          )}
        </div>

        <div
          className="absolute left-1/2 transform -translate-x-1/2 cursor-pointer transition-transform duration-300 hover:scale-105"
          onClick={handleLogoClick}
        >
          <img
            src="/kinologo.png"
            alt="Movie DB Logo"
            className="h-24 md:h-32 filter brightness-150"
          />
        </div>

        {currentUser ? (
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-300 hover:shadow-gray-500/50 flex items-center gap-2"
          >
            <LogOut size={20} />
            Logout
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-300 hover:shadow-gray-500/50 flex items-center gap-2"
          >
            <LogIn size={20} />
            Login
          </button>
        )}
      </div>
    </header>
  );
}
