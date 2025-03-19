import { Link } from "react-router-dom";

export default function Nav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full bg-gradient-to-r from-gray-600 via-gray-800 to-gray-900 flex justify-between items-center px-6 md:px-20 py-4 md:py-6 z-[9999] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.3)]">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-600 via-gray-800 to-gray-900"></div>
      <div className="relative z-10 flex justify-between items-center w-full">
        <Link to="/Home" className="cursor-pointer transform hover:scale-130">
          <img src="/Home.png" alt="Home" />
        </Link>

        <Link
          to="/favorites"
          className="transform hover:scale-130 transition-transform duration-300"
        >
          <img
            src="/Vector.png"
            alt="Favorites"
            className="w-4 h-4 md:w-6 md:h-6 brightness-300"
          />
        </Link>

        <div className="transform hover:scale-130 transition-transform duration-300 cursor-not-allowed opacity-50">
          <img
            src="/Vector (1).png"
            alt="All Movies"
            className="w-4 h-4 md:w-6 md:h-6 brightness-300"
          />
        </div>

        <Link
          to="/Profil"
          className="transform hover:scale-130 transition-transform duration-300"
        >
          <img
            src="/Profile.png"
            alt="Profile"
            className="w-4 h-4 md:w-6 md:h-6 brightness-300"
          />
        </Link>
      </div>
    </nav>
  );
}
