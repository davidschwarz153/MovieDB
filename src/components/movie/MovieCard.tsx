import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Movie } from "../../types/movie";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (user) {
      const favorites = JSON.parse(
        localStorage.getItem(`favorites_${user.id}`) || "[]"
      );
      setIsFavorite(favorites.some((f: Movie) => f.id === movie.id));
    }
  }, [user, movie.id]);

  const toggleFavorite = () => {
    if (!user) return;

    const favorites = JSON.parse(
      localStorage.getItem(`favorites_${user.id}`) || "[]"
    );
    let newFavorites;

    if (isFavorite) {
      newFavorites = favorites.filter((f: Movie) => f.id !== movie.id);
    } else {
      newFavorites = [...favorites, movie];
    }

    localStorage.setItem(`favorites_${user.id}`, JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="relative">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full h-auto object-cover"
        />
        {user && (
          <button
            onClick={toggleFavorite}
            className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${
              isFavorite
                ? "bg-green-500 hover:bg-green-600"
                : "bg-gray-400 hover:bg-gray-500"
            }`}
          >
            <img src="/Vector.png" alt="Favorites" className="w-5 h-5" />
          </button>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-2">
          {movie.title}
        </h3>
        <p className="text-sm text-gray-600 mb-2">{movie.release_date}</p>
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-yellow-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.363 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-sm text-gray-600">
            {movie.vote_average.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
}
