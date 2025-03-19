import { useContext, useState, useEffect } from "react";
import { mainContext } from "../../context/MainProvider";
import { Star } from "lucide-react";
import { IMovie } from "../interfaces/Interface";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const categories = [
  { id: 28, name: "Action" },
  { id: 35, name: "Comedy" },
  { id: 27, name: "Horror" },
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
  } = useContext(mainContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<{ [key: number]: boolean }>({});

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

  const toggleFavorite = (e: React.MouseEvent, movie: IMovie) => {
    e.stopPropagation(); // Предотвращаем переход на страницу фильма
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
    setIsSearching(value.length > 0);
    if (value.length > 0) {
      searchMovies(value);
    } else {
      setFilteredMovies([]);
    }
  };

  const handleCategoryClick = (categoryId: number) => {
    const newCategory = categoryId === selectedCategory ? null : categoryId;
    setSelectedCategory(newCategory);
    setIsSearching(searchTerm.length > 0 || newCategory !== null);
    if (newCategory !== null && filteredMovies.length > 0) {
      const filtered = filteredMovies.filter((movie: IMovie) =>
        movie.genre_ids.includes(newCategory)
      );
      setFilteredMovies(filtered);
    } else if (searchTerm.length >= 2) {
      searchMovies(searchTerm);
    }
  };

  const handleMovieClick = async (movieId: number) => {
    await fetchMovieDetails(movieId);
    navigate(`/movie/${movieId}`);
  };

  return (
    <div className="flex flex-col gap-4 p-4 mb-4 bg-gradient-to-b from-purple-900/10 to-transparent">
      <h1 className="text-xl font-bold text-purple-900">Genres / Search</h1>

      <div className="relative w-full">
        <input
          type="text"
          placeholder="Search Movie ..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full p-3 pl-4 pr-10 text-purple-900 bg-purple-100 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
        />
        <svg
          className="absolute top-3 right-3 text-purple-400"
          width="20"
          height="20"
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

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`px-6 py-2 rounded-full shadow-lg whitespace-nowrap transition-all duration-300 ${
              selectedCategory === category.id
                ? "bg-purple-600 text-white shadow-purple-500/50"
                : "bg-purple-100 text-purple-900 hover:bg-purple-200"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {isSearching && filteredMovies.length > 0 && (
        <div className="flex flex-col gap-4 mt-2">
          {filteredMovies.map((movie: IMovie) => (
            <div
              key={movie.id}
              className="flex gap-4 bg-black/60 backdrop-blur-md rounded-xl p-4 shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-20 h-28 md:w-24 md:h-32 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => handleMovieClick(movie.id)}
              />
              <div className="flex flex-col justify-between py-1 flex-1">
                <div
                  className="cursor-pointer"
                  onClick={() => handleMovieClick(movie.id)}
                >
                  <h3 className="font-bold text-white hover:text-purple-200 transition-colors">
                    {movie.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-300 mt-1">
                    <span>{new Date(movie.release_date).getFullYear()}</span>
                    <span>•</span>
                    <span>Action</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-yellow-500">
                    <Star size={16} />
                    <span className="ml-1 text-sm text-white">
                      {movie.vote_average.toFixed(1)}
                    </span>
                  </div>
                  {user && (
                    <img
                      src="/Vector.png"
                      alt="Favorites"
                      onClick={(e) => toggleFavorite(e, movie)}
                      className={`w-5 h-5 cursor-pointer transition-all duration-300 hover:scale-110 ${
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
      )}
    </div>
  );
}
