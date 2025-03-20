import { useContext, useState, useEffect } from "react";
import { mainContext } from "../../context/MainProvider";
import { IMovie, Genre, Language } from "../interfaces/Interface";
import { ArrowLeft, Star, Play, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function MovieDetail() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { selectedMovie, movieTrailer } = useContext(mainContext) as {
    selectedMovie: IMovie;
    movieTrailer: string | null;
  };
  const [showTrailer, setShowTrailer] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (user && selectedMovie) {
      const userFavorites = JSON.parse(
        localStorage.getItem(`favorites_${user.id}`) || "[]"
      );
      setIsFavorite(
        userFavorites.some((f: IMovie) => f.id === selectedMovie.id)
      );
    }
  }, [user, selectedMovie]);

  if (!selectedMovie) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const toggleFavorite = () => {
    if (!user) return;

    const userFavorites = JSON.parse(
      localStorage.getItem(`favorites_${user.id}`) || "[]"
    );
    let newFavorites;

    if (isFavorite) {
      newFavorites = userFavorites.filter(
        (f: IMovie) => f.id !== selectedMovie.id
      );
    } else {
      newFavorites = [...userFavorites, selectedMovie];
    }

    localStorage.setItem(`favorites_${user.id}`, JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };

  return (
    <>
      <div className="relative min-h-screen bg-gradient-to-b from-purple-900/5 to-transparent">
        {/* Back Button and Favorite Button */}
        <div className="absolute top-4 left-4 right-4 z-10 flex justify-between">
          <button
            onClick={() => navigate(-1)}
            className="bg-purple-900/30 p-2 rounded-full hover:bg-purple-800/40 transition-colors"
          >
            <ArrowLeft className="text-white" size={24} />
          </button>
          {user && (
            <img
              src="/Vector.png"
              alt="Favorites"
              onClick={toggleFavorite}
              className={`w-8 h-8 cursor-pointer transition-all duration-300 hover:scale-110 ${
                isFavorite
                  ? "brightness-200 filter-none"
                  : "brightness-75 opacity-50"
              }`}
            />
          )}
        </div>

        {/* Movie Poster */}
        <div className="relative h-[45vh]">
          <img
            src={`https://image.tmdb.org/t/p/original${
              selectedMovie.backdrop_path || selectedMovie.poster_path
            }`}
            alt={selectedMovie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-500/50 to-transparent" />
        </div>

        {/* Movie Details */}
        <div className="px-4 py-6 pb-32">
          <h1 className="text-2xl font-bold text-white">
            {selectedMovie.title}
          </h1>

          {/* Rating and Release Date */}
          <div className="flex items-center gap-4 mb-4 text-white">
            <div className="flex items-center">
              <Star className="text-yellow-500" size={20} />
              <span className="ml-1">
                {selectedMovie.vote_average.toFixed(1)} / 10
              </span>
            </div>
            <span>•</span>
            <span>{formatDate(selectedMovie.release_date)}</span>
            <span>•</span>
            <span>
              {selectedMovie.runtime
                ? `${Math.floor(selectedMovie.runtime / 60)}h ${
                    selectedMovie.runtime % 60
                  }m`
                : "N/A"}
            </span>
          </div>

          {/* Overview */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-2">Overview</h2>
            <p className="text-gray-200">{selectedMovie.overview}</p>
          </div>

          {/* Genres */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-2">Genres</h2>
            <div className="flex flex-wrap gap-2">
              {selectedMovie.genres?.map((genre: Genre) => (
                <span
                  key={genre.id}
                  className="px-3 py-1 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm hover:bg-white/20 transition-colors"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Languages</h2>
            <div className="flex flex-wrap gap-2">
              {selectedMovie.spoken_languages?.map((language: Language) => (
                <span
                  key={language.iso_639_1}
                  className="px-3 py-1 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm hover:bg-white/20 transition-colors"
                >
                  {language.english_name}
                </span>
              ))}
            </div>
          </div>

          {/* Watch Trailer Button */}
          {movieTrailer && (
            <button
              className="w-full mt-8 bg-red-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-red-700 transition-colors shadow-lg hover:shadow-red-500/50"
              onClick={() => setShowTrailer(true)}
            >
              <Play size={20} />
              Watch Trailer
            </button>
          )}
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailer && movieTrailer && (
        <div className="fixed inset-0 bg-gray-500/95 z-50 flex items-center justify-center backdrop-blur-sm">
          <button
            onClick={() => setShowTrailer(false)}
            className="absolute top-4 right-4 text-white hover:text-purple-200 transition-colors"
          >
            <X size={24} />
          </button>
          <iframe
            src={`https://www.youtube.com/embed/${movieTrailer}`}
            className="w-full max-w-4xl aspect-video rounded-lg shadow-2xl"
            allowFullScreen
          />
        </div>
      )}
    </>
  );
}
