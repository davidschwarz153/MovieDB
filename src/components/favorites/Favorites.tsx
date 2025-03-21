import { useState, useEffect } from "react";
import { IMovie } from "../interfaces/Interface";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { mainContext } from "../../context/MainProvider";
import { useContext } from "react";
import {
  Star,
  LayoutGrid,
  LayoutList,
  SortAsc,
  ArrowUpDown,
  Heart,
} from "lucide-react";

export default function Favorites() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { fetchMovieDetails } = useContext(mainContext);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [favorites, setFavorites] = useState<{ [key: number]: boolean }>({});
  const [sortBy, setSortBy] = useState<"rating" | "name" | "date">("rating");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [sortedMovies, setSortedMovies] = useState<IMovie[]>([]);

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
      setSortedMovies(userFavorites);
    }
  }, [user]);

  useEffect(() => {
    const sortMovies = () => {
      const sorted = [...sortedMovies];
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
  }, [sortBy, sortDirection]);

  const handleMovieClick = async (movieId: number) => {
    await fetchMovieDetails(movieId);
    navigate(`/movie/${movieId}`);
  };

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
    setSortedMovies(newFavorites);
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
    <section className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Favorites</h1>
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
                className={`p-2 rounded-full transition-all duration-300 ${
                  sortBy === "rating"
                    ? "bg-gray-600 text-white"
                    : "text-purple-200 hover:text-white"
                }`}
                onClick={() => handleSortClick("rating")}
                title="Sort by rating"
              >
                <Star size={18} />
              </button>
              <button
                className={`p-2 rounded-full transition-all duration-300 ${
                  sortBy === "name"
                    ? "bg-gray-600 text-white"
                    : "text-purple-200 hover:text-white"
                }`}
                onClick={() => handleSortClick("name")}
                title="Sort by name"
              >
                <SortAsc size={18} />
              </button>
              <button
                className={`p-2 rounded-full transition-all duration-300 ${
                  sortBy === "date"
                    ? "bg-gray-600 text-white"
                    : "text-purple-200 hover:text-white"
                }`}
                onClick={() => handleSortClick("date")}
                title="Sort by date"
              >
                <ArrowUpDown size={18} />
              </button>
            </div>
          </div>
        </div>

        {sortedMovies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-300 text-lg">
              You haven't added any movies to your favorites yet.
            </p>
          </div>
        ) : viewMode === "list" ? (
          <div className="flex flex-col gap-2 sm:gap-4 mt-4">
            {sortedMovies.map((movie: IMovie) => (
              <div
                key={movie.id}
                className="flex gap-2 sm:gap-4 bg-black/40 backdrop-blur-md rounded-xl p-2 sm:p-4 shadow-lg transition-all duration-300"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-16 h-24 sm:w-20 sm:h-28 md:w-24 md:h-32 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform duration-300"
                  onClick={() => handleMovieClick(movie.id)}
                />
                <div className="flex flex-col justify-between py-1 flex-1 min-w-0">
                  <div>
                    <h3
                      className="font-bold text-sm sm:text-base text-white hover:text-gray-200 transition-colors cursor-pointer truncate"
                      onClick={() => handleMovieClick(movie.id)}
                    >
                      {movie.title}
                    </h3>
                    <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-300 mt-1">
                      <span>{new Date(movie.release_date).getFullYear()}</span>
                      <span>•</span>
                      <span>Action</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2 sm:mt-0">
                    <div className="flex items-center text-yellow-500">
                      <Star size={14} className="sm:w-[18px] sm:h-[18px]" />
                      <span className="ml-1 text-white text-sm sm:text-base">
                        {movie.vote_average.toFixed(1)} / 10
                      </span>
                    </div>
                    <button
                      onClick={(e) => toggleFavorite(e, movie)}
                      className="p-2 hover:bg-red-500/20 rounded-full transition-colors"
                      title={
                        favorites[movie.id]
                          ? "Remove from favorites"
                          : "Add to favorites"
                      }
                    >
                      <Heart
                        size={20}
                        className={`transition-colors ${
                          favorites[movie.id]
                            ? "fill-red-500 text-red-500"
                            : "text-gray-400 hover:text-red-500"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 mt-4 sm:mt-8">
            {sortedMovies.map((movie: IMovie) => (
              <div
                key={movie.id}
                className={`bg-black/40 backdrop-blur-md rounded-xl overflow-hidden shadow-lg transition-all duration-300 group h-[450px] sm:h-[600px]
                  ${favorites[movie.id] ? "ring-1 ring-red-500/50" : ""}`}
              >
                <div className="relative h-[300px] sm:h-[450px]">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-full object-cover cursor-pointer transition-transform duration-500 group-hover:scale-105"
                    onClick={() => handleMovieClick(movie.id)}
                  />
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={(e) => toggleFavorite(e, movie)}
                      className="p-2 bg-black/60 rounded-full hover:bg-red-500/20 transition-colors backdrop-blur-sm"
                      title={
                        favorites[movie.id]
                          ? "Remove from favorites"
                          : "Add to favorites"
                      }
                    >
                      <Heart
                        size={24}
                        className={`transition-colors ${
                          favorites[movie.id]
                            ? "fill-red-500 text-red-500"
                            : "text-gray-400 hover:text-red-500"
                        }`}
                      />
                    </button>
                  </div>
                </div>
                <div className="p-6 h-[150px] flex flex-col justify-between">
                  <div>
                    <h3
                      className="font-bold text-base sm:text-xl text-white hover:text-gray-200 transition-colors cursor-pointer mb-2 sm:mb-3 line-clamp-2"
                      onClick={() => handleMovieClick(movie.id)}
                    >
                      {movie.title}
                    </h3>
                    <p className="text-gray-100/70 text-xs sm:text-sm line-clamp-2">
                      {movie.overview}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-gray-200/80 text-xs sm:text-sm">
                    <span>{new Date(movie.release_date).getFullYear()}</span>
                    <div className="flex items-center text-yellow-500">
                      <Star size={16} className="sm:w-[18px] sm:h-[18px]" />
                      <span className="ml-1 text-white text-sm sm:text-base">
                        {movie.vote_average.toFixed(1)} / 10
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
