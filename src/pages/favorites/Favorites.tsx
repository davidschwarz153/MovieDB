import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Movie } from "../../types/movie";
import {
  Star,
  ArrowUp,
  SortAsc,
  ArrowUpDown,
  Film,
  Laugh,
  Skull,
  Shield,
  Compass,
  Clapperboard,
  Video,
  Drama,
  Users,
  Wand2,
  History,
  Siren,
  Tv2,
  Mountain,
  X,
  LayoutGrid,
  LayoutList,
} from "lucide-react";
import { mainContext } from "../../context/MainProvider";
import { useContext } from "react";

const categories = [
  {
    id: 28,
    name: "Action",
    icon: Compass,
    color: "from-red-500 to-orange-500",
  },
  {
    id: 35,
    name: "Comedy",
    icon: Laugh,
    color: "from-yellow-500 to-amber-500",
  },
  { id: 27, name: "Horror", icon: Skull, color: "from-purple-500 to-pink-500" },
  { id: 80, name: "Crime", icon: Shield, color: "from-blue-500 to-indigo-500" },
  {
    id: 12,
    name: "Adventure",
    icon: Mountain,
    color: "from-green-500 to-emerald-500",
  },
  {
    id: 16,
    name: "Animation",
    icon: Clapperboard,
    color: "from-cyan-500 to-sky-500",
  },
  {
    id: 99,
    name: "Documentary",
    icon: Video,
    color: "from-slate-500 to-gray-500",
  },
  { id: 18, name: "Drama", icon: Drama, color: "from-rose-500 to-pink-500" },
  {
    id: 10751,
    name: "Family",
    icon: Users,
    color: "from-teal-500 to-cyan-500",
  },
  {
    id: 14,
    name: "Fantasy",
    icon: Wand2,
    color: "from-violet-500 to-purple-500",
  },
  {
    id: 36,
    name: "History",
    icon: History,
    color: "from-amber-500 to-yellow-500",
  },
  { id: 53, name: "Thriller", icon: Siren, color: "from-red-500 to-rose-500" },
  { id: 10770, name: "TV Movie", icon: Tv2, color: "from-blue-500 to-sky-500" },
  {
    id: 37,
    name: "Western",
    icon: Film,
    color: "from-orange-500 to-amber-500",
  },
];

export default function Favorites() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { fetchMovieDetails } = useContext(mainContext);
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"rating" | "name" | "date">("rating");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [sortedMovies, setSortedMovies] = useState<Movie[]>([]);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isGenresOpen, setIsGenresOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const genresRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const sortMovies = () => {
      const sorted = [...favorites];
      const direction = sortDirection === "asc" ? 1 : -1;

      switch (sortBy) {
        case "rating":
          sorted.sort((a, b) => direction * (b.vote_average - a.vote_average));
          break;
        case "name":
          sorted.sort((a, b) => direction * a.title.localeCompare(b.title));
          break;
        case "date":
          sorted.sort(
            (a, b) =>
              direction *
              (new Date(b.release_date).getTime() -
                new Date(a.release_date).getTime())
          );
          break;
      }
      setSortedMovies(sorted);
    };
    sortMovies();
  }, [favorites, sortBy, sortDirection]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        genresRef.current &&
        !genresRef.current.contains(event.target as Node)
      ) {
        setIsGenresOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
    setSortedMovies(userFavorites);
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

  const handleSortClick = (newSortBy: "rating" | "name" | "date") => {
    if (sortBy === newSortBy) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(newSortBy);
      setSortDirection("desc");
    }
  };

  const handleCategoryClick = (categoryId: number) => {
    const newCategory = categoryId === selectedCategory ? null : categoryId;
    setSelectedCategory(newCategory);

    if (newCategory !== null) {
      const filteredFavorites = favorites.filter((movie) =>
        movie.genre_ids?.includes(categoryId)
      );
      setSortedMovies(filteredFavorites);
    } else {
      setSortedMovies(favorites);
    }
  };

  const selectedGenre = categories.find((cat) => cat.id === selectedCategory);

  const renderListView = () => (
    <div className="flex flex-col gap-4 mt-4">
      {sortedMovies.map((movie) => (
        <div
          key={movie.id}
          className="flex gap-4 bg-black/40 backdrop-blur-md rounded-xl p-4 shadow-lg transition-all duration-300"
        >
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-20 h-28 md:w-24 md:h-32 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={() => handleMovieClick(movie.id)}
          />
          <div className="flex flex-col justify-between py-1 flex-1">
            <div>
              <h3
                className="font-bold text-white hover:text-purple-200 transition-colors cursor-pointer"
                onClick={() => handleMovieClick(movie.id)}
              >
                {movie.title}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-300 mt-1">
                <span>{new Date(movie.release_date).getFullYear()}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-yellow-500">
                <Star size={18} />
                <span className="ml-1.5 text-white text-base">
                  {movie.vote_average.toFixed(1)} / 10
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
  );

  const renderGridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
      {sortedMovies.map((movie) => (
        <div
          key={movie.id}
          className="bg-black/40 backdrop-blur-md rounded-xl overflow-hidden shadow-lg transition-all duration-300 group h-[600px]"
        >
          <div className="relative h-[450px]">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-full object-cover cursor-pointer transition-transform duration-500 group-hover:scale-105"
              onClick={() => handleMovieClick(movie.id)}
            />
            <div className="absolute top-2 right-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromFavorites(movie.id);
                }}
                className="p-2 bg-black/60 rounded-full text-gray-400 hover:text-red-500 transition-colors backdrop-blur-sm"
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
          <div className="p-6 h-[150px] flex flex-col justify-between">
            <div>
              <h3
                className="font-bold text-xl text-white hover:text-purple-200 transition-colors cursor-pointer mb-3"
                onClick={() => handleMovieClick(movie.id)}
              >
                {movie.title}
              </h3>
              <p className="text-purple-100/70 text-sm line-clamp-2">
                {movie.overview}
              </p>
            </div>
            <div className="flex items-center justify-between text-purple-200/80 text-sm">
              <span>{new Date(movie.release_date).getFullYear()}</span>
              <div className="flex items-center text-yellow-500">
                <Star size={18} />
                <span className="ml-1.5 text-white text-base">
                  {movie.vote_average.toFixed(1)} / 10
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

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
            <div className="flex items-center gap-4">
              <div className="flex bg-purple-900/30 backdrop-blur-sm rounded-full p-1">
                <button
                  className={`p-2 rounded-full transition-all duration-300 ${
                    viewMode === "list"
                      ? "bg-gray-600 text-white"
                      : "text-purple-200 hover:text-white"
                  }`}
                  onClick={() => setViewMode("list")}
                  title="List view"
                >
                  <LayoutList size={18} />
                </button>
                <button
                  className={`p-2 rounded-full transition-all duration-300 ${
                    viewMode === "grid"
                      ? "bg-gray-600 text-white"
                      : "text-purple-200 hover:text-white"
                  }`}
                  onClick={() => setViewMode("grid")}
                  title="Grid view"
                >
                  <LayoutGrid size={18} />
                </button>
              </div>
              <div className="flex bg-purple-900/30 backdrop-blur-sm rounded-full p-1">
                <button
                  onClick={() => setIsGenresOpen(!isGenresOpen)}
                  className={`px-3 py-1 rounded-full transition-all duration-300 flex items-center gap-1 text-purple-200 hover:text-white`}
                >
                  {selectedGenre ? (
                    <selectedGenre.icon size={14} />
                  ) : (
                    <Film size={14} />
                  )}
                  <span className="text-sm">
                    {selectedGenre ? selectedGenre.name : "Genres"}
                  </span>
                  <ArrowUpDown
                    size={14}
                    className={`ml-1 transition-transform duration-300 ${
                      isGenresOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>
              <div className="flex bg-purple-900/30 backdrop-blur-sm rounded-full p-1">
                <button
                  className={`px-3 py-1 rounded-full transition-all duration-300 flex items-center gap-1 ${
                    sortBy === "rating"
                      ? "bg-gray-600 text-white"
                      : "text-purple-200 hover:text-white"
                  }`}
                  onClick={() => handleSortClick("rating")}
                  title={`Rating ${
                    sortBy === "rating"
                      ? sortDirection === "asc"
                        ? "(Low to High)"
                        : "(High to Low)"
                      : ""
                  }`}
                >
                  <Star size={14} />
                  <span className="text-sm">Rating</span>
                  {sortBy === "rating" && (
                    <ArrowUpDown
                      size={14}
                      className={`ml-1 transition-transform duration-300 ${
                        sortDirection === "asc" ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>
                <button
                  className={`px-3 py-1 rounded-full transition-all duration-300 flex items-center gap-1 ${
                    sortBy === "name"
                      ? "bg-gray-600 text-white"
                      : "text-purple-200 hover:text-white"
                  }`}
                  onClick={() => handleSortClick("name")}
                  title={`Alphabetical ${
                    sortBy === "name"
                      ? sortDirection === "asc"
                        ? "(A to Z)"
                        : "(Z to A)"
                      : ""
                  }`}
                >
                  <SortAsc size={14} />
                  <span className="text-sm">A-Z</span>
                  {sortBy === "name" && (
                    <ArrowUpDown
                      size={14}
                      className={`ml-1 transition-transform duration-300 ${
                        sortDirection === "asc" ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>
                <button
                  className={`px-3 py-1 rounded-full transition-all duration-300 flex items-center gap-1 ${
                    sortBy === "date"
                      ? "bg-gray-600 text-white"
                      : "text-purple-200 hover:text-white"
                  }`}
                  onClick={() => handleSortClick("date")}
                  title={`Date ${
                    sortBy === "date"
                      ? sortDirection === "asc"
                        ? "(Old to New)"
                        : "(New to Old)"
                      : ""
                  }`}
                >
                  <span className="text-sm">Date</span>
                  {sortBy === "date" && (
                    <ArrowUpDown
                      size={14}
                      className={`ml-1 transition-transform duration-300 ${
                        sortDirection === "asc" ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {isGenresOpen && (
          <div
            ref={genresRef}
            className="absolute right-4 mt-2 w-64 bg-black/80 backdrop-blur-md rounded-xl shadow-xl z-50 border border-purple-500/20"
          >
            <div className="sticky top-0 border-b border-purple-500/20 p-3 flex justify-between items-center">
              <h3 className="font-semibold text-white">Select Genre</h3>
              <button
                onClick={() => setIsGenresOpen(false)}
                className="p-1 hover:bg-purple-500/20 rounded-full transition-colors"
              >
                <X size={16} className="text-purple-200" />
              </button>
            </div>
            <div className="p-2">
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setIsGenresOpen(false);
                  setSortedMovies(favorites);
                }}
                className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all duration-300 ${
                  !selectedCategory
                    ? "bg-purple-500/20 text-white"
                    : "hover:bg-purple-500/10 text-purple-200"
                }`}
              >
                <Film size={18} />
                <span className="font-medium">All Genres</span>
              </button>
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => {
                      handleCategoryClick(category.id);
                      setIsGenresOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all duration-300 ${
                      selectedCategory === category.id
                        ? "bg-gradient-to-r " + category.color + " text-white"
                        : "hover:bg-purple-500/10 text-purple-200"
                    }`}
                  >
                    <Icon size={18} />
                    <span className="font-medium">{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-300 text-lg">
              You haven't added any movies to your favorites yet.
            </p>
          </div>
        ) : sortedMovies.length > 0 ? (
          viewMode === "list" ? (
            renderListView()
          ) : (
            renderGridView()
          )
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-300 text-lg">
              No movies match the selected genre.
            </p>
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
