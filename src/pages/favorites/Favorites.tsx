import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Movie } from "../../types/movie";
import { Star, ChevronDown, ArrowUp } from "lucide-react";
import { mainContext } from "../../context/MainProvider";
import { useContext } from "react";

type SortOption = "title" | "rating" | "date";

export default function Favorites() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { fetchMovieDetails } = useContext(mainContext);
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>("title");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    loadFavorites();
  }, [user, navigate]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const loadFavorites = () => {
    const userFavorites = JSON.parse(
      localStorage.getItem(`favorites_${user?.id}`) || "[]"
    );
    setFavorites(userFavorites);
    setLoading(false);
  };

  const removeFromFavorites = (movieId: number) => {
    if (!user) return;

    const updatedFavorites = favorites.filter((movie) => movie.id !== movieId);
    setFavorites(updatedFavorites);
    localStorage.setItem(
      `favorites_${user.id}`,
      JSON.stringify(updatedFavorites)
    );
  };

  const handleMovieClick = async (movieId: number) => {
    try {
      await fetchMovieDetails(movieId);
      navigate(`/movie/${movieId}`);
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  };

  const sortFavorites = (option: SortOption) => {
    setSortBy(option);
    setIsDropdownOpen(false);

    const sortedFavorites = [...favorites].sort((a, b) => {
      switch (option) {
        case "title":
          return a.title.localeCompare(b.title);
        case "rating":
          return b.vote_average - a.vote_average;
        case "date":
          return (
            new Date(b.release_date).getTime() -
            new Date(a.release_date).getTime()
          );
        default:
          return 0;
      }
    });

    setFavorites(sortedFavorites);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900/90 to-gray-800/90 py-8 px-4 pb-24 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            Your Favorite Movies
          </h1>

          {favorites.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg text-white hover:bg-white/20 transition-colors"
              >
                Sort by
                <ChevronDown size={20} />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-900/90 backdrop-blur-md rounded-lg shadow-lg py-2 z-10">
                  <button
                    onClick={() => sortFavorites("title")}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-800/90 transition-colors ${
                      sortBy === "title" ? "text-gray-200" : "text-white"
                    }`}
                  >
                    Title
                  </button>
                  <button
                    onClick={() => sortFavorites("rating")}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-800/90 transition-colors ${
                      sortBy === "rating" ? "text-gray-200" : "text-white"
                    }`}
                  >
                    Rating
                  </button>
                  <button
                    onClick={() => sortFavorites("date")}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-800/90 transition-colors ${
                      sortBy === "date" ? "text-gray-200" : "text-white"
                    }`}
                  >
                    Release Date
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-300 text-lg">
              You haven't added any movies to your favorites yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((movie) => (
              <div
                key={movie.id}
                className="bg-gray-900/60 backdrop-blur-md rounded-xl overflow-hidden shadow-lg hover:shadow-gray-500/20 transition-all duration-300 cursor-pointer"
                onClick={() => handleMovieClick(movie.id)}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-96 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {movie.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-yellow-500">
                      <Star size={16} />
                      <span className="ml-1 text-sm text-white">
                        {movie.vote_average.toFixed(1)}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromFavorites(movie.id);
                      }}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 right-4 bg-gray-800/80 hover:bg-gray-700/80 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-[9998] backdrop-blur-sm"
        >
          <ArrowUp size={24} />
        </button>
      )}
    </div>
  );
}
