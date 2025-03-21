import { useContext, useState, useEffect } from "react";
import { mainContext } from "../../context/MainProvider";
import { IMovie, Genre, Language } from "../interfaces/Interface";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import DownloadButton from "../DownloadButton";
import { ArrowLeft, Star, Play } from "lucide-react";

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
    if (!user || !selectedMovie) return;

    const userFavorites = JSON.parse(
      localStorage.getItem(`favorites_${user.id}`) || "[]"
    );

    let newFavorites;
    if (isFavorite) {
      newFavorites = userFavorites.filter(
        (f: IMovie) => f.id !== selectedMovie.id
      );
      setIsFavorite(false);
    } else {
      newFavorites = [...userFavorites, selectedMovie];
      setIsFavorite(true);
    }

    localStorage.setItem(`favorites_${user.id}`, JSON.stringify(newFavorites));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900/90 to-gray-800/90">
      <div className="relative min-h-screen">
        <div className="absolute inset-0">
          <img
            src={`https://image.tmdb.org/t/p/original${selectedMovie.backdrop_path}`}
            alt={selectedMovie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/90 to-gray-900"></div>
        </div>

        {/* Back Button and Favorite Button */}
        <div className="absolute top-4 left-4 right-4 z-10 flex justify-between">
          <button
            onClick={() => navigate(-1)}
            className="bg-black/60 p-2 rounded-full hover:bg-black/80 transition-colors backdrop-blur-sm"
          >
            <ArrowLeft className="text-white" size={24} />
          </button>
          {user && (
            <button
              onClick={toggleFavorite}
              className="relative transform hover:scale-110 transition-all duration-300 active:scale-95"
            >
              <img
                src="/Vector.png"
                alt="Favorites"
                className={`w-8 h-8 cursor-pointer transition-all duration-300 ${
                  isFavorite
                    ? "brightness-200 filter-none drop-shadow-[0_0_8px_rgba(34,197,94,0.5)] hover:brightness-[3] hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                    : "brightness-75 opacity-50 hover:brightness-200 hover:drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]"
                }`}
              />
            </button>
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
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950/40 via-gray-950/60 to-gray-950" />
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
            <div className="mt-8">
              <button
                onClick={() => setShowTrailer(true)}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full transition-colors"
              >
                <Play size={24} />
                <span>Watch Trailer</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailer && movieTrailer && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <div className="relative w-full max-w-4xl aspect-video">
            <iframe
              src={`https://www.youtube.com/embed/${movieTrailer}`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
