import { useContext, useState, useEffect } from "react";
import { mainContext } from "../../context/MainProvider";
import {
  Star,
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
  ArrowUpDown,
  SortAsc,
  LayoutList,
  LayoutGrid,
} from "lucide-react";
import { IMovie } from "../interfaces/Interface";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

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

export default function SearchCategories() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    filteredMovies,
    setFilteredMovies,
    fetchMovieDetails,
    isSearching,
    setIsSearching,
    searchMovies,
    filterMoviesByGenre,
  } = useContext(mainContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<{ [key: number]: boolean }>({});
  const [sortBy, setSortBy] = useState<"rating" | "name" | "date">("rating");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [sortedMovies, setSortedMovies] = useState<IMovie[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");

  // Эффект для сброса поиска при изменении isSearching
  useEffect(() => {
    if (!isSearching) {
      setSearchTerm("");
      setSelectedCategory(null);
      setFilteredMovies([]);
    }
  }, [isSearching, setFilteredMovies]);

  // Загружаем состояние избранного при монтировании
  useEffect(() => {
    if (user) {
      const userFavorites = JSON.parse(
        localStorage.getItem(`favorites_${user.id}`) || "[]"
      );
      const favoritesMap = userFavorites.reduce(
        (acc: { [key: number]: boolean }, movie: IMovie) => {
          acc[movie.id] = true;
          return acc;
        },
        {}
      );
      setFavorites(favoritesMap);
    }
  }, [user]);

  // Add sorting effect
  useEffect(() => {
    const sortMovies = () => {
      const sorted = [...filteredMovies];
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
  }, [filteredMovies, sortBy, sortDirection]);

  const toggleFavorite = (e: React.MouseEvent, movie: IMovie) => {
    e.stopPropagation();
    if (!user) return;

    const userFavorites = JSON.parse(
      localStorage.getItem(`favorites_${user.id}`) || "[]"
    );
    let newFavorites;

    if (favorites[movie.id]) {
      newFavorites = userFavorites.filter((f: IMovie) => f.id !== movie.id);
      setFavorites((prev) => ({ ...prev, [movie.id]: false }));
    } else {
      newFavorites = [...userFavorites, movie];
      setFavorites((prev) => ({ ...prev, [movie.id]: true }));
    }

    localStorage.setItem(`favorites_${user.id}`, JSON.stringify(newFavorites));
  };

  // Обработчик изменения поискового запроса
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length >= 2) {
      setIsSearching(true);
      searchMovies(value);
    } else if (value.length === 0) {
      if (selectedCategory) {
        filterMoviesByGenre(selectedCategory);
      } else {
        setIsSearching(false);
        setFilteredMovies([]);
      }
    }
  };

  const handleCategoryClick = (categoryId: number) => {
    const newCategory = categoryId === selectedCategory ? null : categoryId;
    setSelectedCategory(newCategory);

    if (newCategory !== null) {
      filterMoviesByGenre(categoryId);
    } else {
      if (searchTerm.length >= 2) {
        searchMovies(searchTerm);
      } else {
        setIsSearching(false);
        setFilteredMovies([]);
      }
    }
  };

  const handleMovieClick = async (movieId: number) => {
    await fetchMovieDetails(movieId);
    navigate(`/movie/${movieId}`);
  };

  const handleSortClick = (newSortBy: "rating" | "name" | "date") => {
    if (sortBy === newSortBy) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(newSortBy);
      setSortDirection("desc");
    }
  };

  return (
    <div className="flex flex-col gap-4 p-2 sm:p-4 mb-4 bg-gradient-to-b from-gray-900/10 to-transparent">
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Search Movie ..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full p-2 sm:p-3 pl-3 sm:pl-4 pr-8 sm:pr-10 text-sm sm:text-base text-gray-900 bg-gray-100 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
        />
        <svg
          className="absolute top-2.5 sm:top-3 right-2 sm:right-3 text-gray-400"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
        <div className="relative w-full overflow-x-auto pb-2 hide-scrollbar">
          <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 px-2 sm:px-4 md:px-0 min-w-max mx-auto max-w-[95vw] md:max-w-[80vw] lg:max-w-[1000px]">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full transition-all duration-300 flex items-center gap-1 text-xs sm:text-sm whitespace-nowrap ${
                    selectedCategory === category.id
                      ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                      : "bg-gray-900/30 text-gray-200 hover:text-white hover:bg-gray-900/50"
                  }`}
                >
                  <Icon size={14} />
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {isSearching && filteredMovies.length > 0 && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <div className="flex bg-gray-900/30 backdrop-blur-sm rounded-full p-1 w-full sm:w-auto justify-center sm:justify-start">
              <button
                className={`p-2 rounded-full transition-all duration-300 ${
                  viewMode === "list"
                    ? "bg-gray-600 text-white"
                    : "text-gray-200 hover:text-white"
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
                    : "text-gray-200 hover:text-white"
                }`}
                onClick={() => setViewMode("grid")}
                title="Grid view"
              >
                <LayoutGrid size={18} />
              </button>
            </div>
            <div className="flex flex-col sm:flex-row p-1 text-xs sm:text-sm w-full sm:w-auto justify-center sm:justify-start gap-1 sm:gap-2">
              <button
                className={`px-3 py-1 rounded-full transition-all duration-300 flex items-center gap-1 bg-gray-900/30 backdrop-blur-sm ${
                  sortBy === "rating"
                    ? "bg-gray-600 text-white"
                    : "text-gray-200 hover:text-white"
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
                className={`px-3 py-1 rounded-full transition-all duration-300 flex items-center gap-1 bg-gray-900/30 backdrop-blur-sm ${
                  sortBy === "name"
                    ? "bg-gray-600 text-white"
                    : "text-gray-200 hover:text-white"
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
                className={`px-3 py-1 rounded-full transition-all duration-300 flex items-center gap-1 bg-gray-900/30 backdrop-blur-sm ${
                  sortBy === "date"
                    ? "bg-gray-600 text-white"
                    : "text-gray-200 hover:text-white"
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

      {isSearching && filteredMovies.length > 0 && (
        <>
          {viewMode === "list" ? (
            <div className="flex flex-col gap-2 sm:gap-4 mt-4">
              {sortedMovies.map((movie: IMovie) => (
                <div
                  key={movie.id}
                  className="flex gap-2 sm:gap-4 bg-black/60 backdrop-blur-md rounded-xl p-2 sm:p-4 shadow-lg hover:shadow-gray-500/20 transition-all duration-300"
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-16 h-24 sm:w-20 sm:h-28 md:w-24 md:h-32 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform duration-300"
                    onClick={() => handleMovieClick(movie.id)}
                  />
                  <div className="flex flex-col justify-between py-1 flex-1 min-w-0">
                    <div
                      className="cursor-pointer"
                      onClick={() => handleMovieClick(movie.id)}
                    >
                      <h3 className="font-bold text-sm sm:text-base text-white hover:text-gray-200 transition-colors truncate">
                        {movie.title}
                      </h3>
                      <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-300 mt-1">
                        <span>
                          {new Date(movie.release_date).getFullYear()}
                        </span>
                        <span>•</span>
                        <span>Action</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2 sm:mt-0">
                      <div className="flex items-center text-yellow-500">
                        <Star size={14} className="sm:w-4 sm:h-4" />
                        <span className="ml-1 text-xs sm:text-sm text-white">
                          {movie.vote_average.toFixed(1)}
                        </span>
                      </div>
                      {user && (
                        <img
                          src="/Vector.png"
                          alt="Favorites"
                          onClick={(e) => toggleFavorite(e, movie)}
                          className={`w-4 h-4 sm:w-5 sm:h-5 cursor-pointer transition-all duration-300 ${
                            favorites[movie.id]
                              ? "brightness-200 filter-none drop-shadow-[0_0_8px_rgba(34,197,94,0.5)] hover:brightness-[3] hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                              : "brightness-75 opacity-50 hover:brightness-200 hover:drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]"
                          }`}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 mt-4">
              {sortedMovies.map((movie: IMovie) => (
                <div
                  key={movie.id}
                  className="bg-black/60 backdrop-blur-md rounded-xl overflow-hidden shadow-lg hover:shadow-gray-500/20 transition-all duration-300 group"
                >
                  <div className="relative">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      className="w-full h-[300px] sm:h-[400px] object-cover cursor-pointer transition-transform duration-500 group-hover:scale-105"
                      onClick={() => handleMovieClick(movie.id)}
                    />
                    {user && (
                      <img
                        src="/Vector.png"
                        alt="Favorites"
                        onClick={(e) => toggleFavorite(e, movie)}
                        className={`absolute top-2 right-2 w-6 h-6 sm:w-7 sm:h-7 cursor-pointer transition-all duration-300 ${
                          favorites[movie.id]
                            ? "brightness-200 filter-none drop-shadow-[0_0_8px_rgba(34,197,94,0.5)] hover:brightness-[3] hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                            : "brightness-75 opacity-50 hover:brightness-200 hover:drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]"
                        }`}
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <h3
                      className="font-bold text-base sm:text-lg text-white hover:text-gray-200 transition-colors cursor-pointer mb-2 line-clamp-2"
                      onClick={() => handleMovieClick(movie.id)}
                    >
                      {movie.title}
                    </h3>
                    <div className="flex items-center justify-between text-gray-300 text-sm">
                      <span>{new Date(movie.release_date).getFullYear()}</span>
                      <div className="flex items-center text-yellow-500">
                        <Star size={16} className="sm:w-5 sm:h-5" />
                        <span className="ml-1 text-white">
                          {movie.vote_average.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
