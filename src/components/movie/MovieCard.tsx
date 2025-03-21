import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { IMovie } from "../interfaces/Interface";

interface MovieCardProps {
  movie: IMovie;
  onMovieClick?: (movieId: number) => void;
}

export default function MovieCard({ movie, onMovieClick }: MovieCardProps) {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (user) {
      const favorites = JSON.parse(
        localStorage.getItem(`favorites_${user.id}`) || "[]"
      );
      setIsFavorite(favorites.some((f: IMovie) => f.id === movie.id));
    }
  }, [user, movie.id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;

    const favorites = JSON.parse(
      localStorage.getItem(`favorites_${user.id}`) || "[]"
    );
    let newFavorites;

    if (isFavorite) {
      newFavorites = favorites.filter((f: IMovie) => f.id !== movie.id);
      console.log("Removing from favorites:", movie.title);
    } else {
      newFavorites = [...favorites, movie];
      console.log("Adding to favorites:", movie.title);
    }

    localStorage.setItem(`favorites_${user.id}`, JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };

  return (
    <div
      className="relative group cursor-pointer"
      onClick={() => onMovieClick?.(movie.id)}
    >
      <div className="absolute top-2 right-2 z-[9999]">
        <button
          onClick={toggleFavorite}
          className="bg-black/60 p-2 rounded-full hover:bg-black/80 transition-colors backdrop-blur-sm"
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <img
            src="/Vector.png"
            alt="Favorites"
            className={`w-6 h-6 cursor-pointer transition-all duration-300 ${
              isFavorite
                ? "brightness-200 filter-none drop-shadow-[0_0_8px_rgba(34,197,94,0.5)] hover:brightness-[3] hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                : "brightness-75 opacity-50 hover:brightness-200 hover:drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]"
            }`}
          />
        </button>
      </div>
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="w-full h-full object-cover rounded-lg"
      />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 rounded-lg"></div>
    </div>
  );
}
