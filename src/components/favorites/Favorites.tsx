// Favorites

import { useState, useEffect } from "react";
import { IMovie } from "../interfaces/Interface";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import {
  Star,
  LayoutGrid,
  LayoutList,
  SortAsc,
  ArrowUpDown,
} from "lucide-react";

export default function Favorites() {
  const navigate = useNavigate();
  const { user } = useAuth();
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

  const handleMovieClick = (movieId: number) => {
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
    <section className="px-2 sm:px-4 py-6 sm:py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 mb-4 sm:mb-8">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-1 h-6 sm:h-8 bg-gradient-to-b from-gray-600 to-gray-900 rounded-full" />
          <h2 className="text-lg sm:text-xl font-bold text-white">Favorites</h2>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <div className="flex bg-gray-900/30 backdrop-blur-sm rounded-full p-0.5 sm:p-1 w-full sm:w-auto justify-center sm:justify-start">
            <button
              className={`p-1.5 sm:p-2 rounded-full transition-all duration-300 ${
                viewMode === "list"
                  ? "bg-gray-600 text-white"
                  : "text-gray-200 hover:text-white"
              }`}
              onClick={() => setViewMode("list")}
              title="List view"
            >
              <LayoutList size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
            <button
              className={`p-1.5 sm:p-2 rounded-full transition-all duration-300 ${
                viewMode === "grid"
                  ? "bg-gray-600 text-white"
                  : "text-gray-200 hover:text-white"
              }`}
              onClick={() => setViewMode("grid")}
              title="Grid view"
            >
              <LayoutGrid size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
          </div>
          <div className="flex flex-col sm:flex-row bg-gray-900/30 backdrop-blur-sm rounded-full p-0.5 sm:p-1 text-xs sm:text-sm w-full sm:w-auto justify-center sm:justify-start gap-1 sm:gap-2">
            <button
              className={`px-3 py-1 rounded-full transition-all duration-300 flex items-center justify-center gap-1 bg-gray-900/30 backdrop-blur-sm text-gray-200 hover:text-white ${
                sortBy === "rating" ? "bg-gray-600 text-white" : ""
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
              className={`px-3 py-1 rounded-full transition-all duration-300 flex items-center justify-center gap-1 bg-gray-900/30 backdrop-blur-sm text-gray-200 hover:text-white ${
                sortBy === "name" ? "bg-gray-600 text-white" : ""
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
              className={`px-3 py-1 rounded-full transition-all duration-300 flex items-center justify-center gap-1 bg-gray-900/30 backdrop-blur-sm text-gray-200 hover:text-white ${
                sortBy === "date" ? "bg-gray-600 text-white" : ""
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
      </div>

      {viewMode === "list" ? (
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
                  <img
                    src="/Vector.png"
                    alt="Favorites"
                    onClick={(e) => toggleFavorite(e, movie)}
                    className={`w-5 h-5 sm:w-6 sm:h-6 cursor-pointer transition-all duration-300 ${
                      favorites[movie.id]
                        ? "brightness-200 filter-none drop-shadow-[0_0_8px_rgba(34,197,94,0.5)] hover:brightness-[3] hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                        : "brightness-75 opacity-50 hover:brightness-200 hover:drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]"
                    }`}
                  />
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
                ${favorites[movie.id] ? "ring-1 ring-green-500/50" : ""}`}
            >
              <div className="relative h-[300px] sm:h-[450px]">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-full object-cover cursor-pointer transition-transform duration-500 group-hover:scale-105"
                  onClick={() => handleMovieClick(movie.id)}
                />
                <div className="absolute top-2 right-2">
                  <img
                    src="/Vector.png"
                    alt="Favorites"
                    onClick={(e) => toggleFavorite(e, movie)}
                    className={`w-7 h-7 cursor-pointer transition-all duration-300 ${
                      favorites[movie.id]
                        ? "brightness-200 filter-none drop-shadow-[0_0_8px_rgba(34,197,94,0.5)] hover:brightness-[3] hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                        : "brightness-75 opacity-50 hover:brightness-200 hover:drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]"
                    }`}
                  />
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
    </section>
  );
}
