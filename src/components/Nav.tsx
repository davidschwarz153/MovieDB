/**
 * Nav Component
 *
 * Main navigation bar component that provides:
 * - Logo and home link
 * - Search functionality
 * - User authentication status
 * - Admin dashboard access
 * - Responsive mobile menu
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Search,
  LogOut,
  User as UserIcon,
  UserCircle,
} from "lucide-react";
import { useUser } from "../context/UserContext";

export default function Nav() {
  // Navigation and user context
  const navigate = useNavigate();
  const { currentUser, logout, isAdmin } = useUser();

  // Component state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  /**
   * Handles search form submission
   * Navigates to search results page with query
   */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsMenuOpen(false);
    }
  };

  /**
   * Handles user logout
   * Clears user session and redirects to home
   */
  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-gray-900/95 backdrop-blur-sm fixed w-full z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link
              to="/"
              className="text-white text-2xl font-bold hover:text-purple-500 transition-colors"
            >
              MovieDB
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search Form */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies..."
                className="w-64 px-4 py-1 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-purple-500"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <Search size={20} />
              </button>
            </form>

            {/* User Navigation */}
            <div className="flex items-center space-x-4">
              {currentUser ? (
                <>
                  <div className="flex items-center space-x-2">
                    {currentUser.avatar ? (
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <UserCircle className="w-8 h-8 text-gray-300" />
                    )}
                    <span className="text-white">{currentUser.name}</span>
                  </div>
                  {isAdmin && (
                    <Link
                      to="/dashboard"
                      className="text-purple-500 hover:text-purple-400 transition-colors"
                    >
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-gray-300 hover:text-white transition-colors flex items-center gap-1"
                  >
                    <LogOut size={20} />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="text-white hover:text-purple-500 transition-colors flex items-center gap-1"
                >
                  <UserIcon size={20} />
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-800">
          <div className="px-4 pt-2 pb-4 space-y-3">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies..."
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-purple-500"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <Search size={20} />
              </button>
            </form>

            {/* Mobile User Navigation */}
            {currentUser ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-2 px-2">
                  {currentUser.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <UserCircle className="w-8 h-8 text-gray-300" />
                  )}
                  <p className="text-white">{currentUser.name}</p>
                </div>
                {isAdmin && (
                  <Link
                    to="/dashboard"
                    className="block px-2 py-1 text-purple-500 hover:text-purple-400 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-2 py-1 text-gray-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  <LogOut size={20} />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-2 py-1 text-white hover:text-purple-500 transition-colors flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <UserIcon size={20} />
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
