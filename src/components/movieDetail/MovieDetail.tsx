import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IMovie, Genre, Language } from "../interfaces/Interface";
import { useAuth } from "../../context/AuthContext";
import { mainContext } from "../../context/MainProvider";
import { useContext } from "react";
import { Heart, Play, X, Star } from "lucide-react";

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { selectedMovie, fetchMovieDetails } = useContext(mainContext);
  const [showTrailer, setShowTrailer] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (id) {
      fetchMovieDetails(parseInt(id));
    }
  }, [id]);

  useEffect(() => {
    if (user && selectedMovie) {
      const userFavorites = JSON.parse(
        localStorage.getItem(`favorites_${user.id}`) || "[]"
      );
      setIsFavorite(userFavorites.some((movie: IMovie) => movie.id === selectedMovie.id));
    }
  }, [user, selectedMovie]);

  const toggleFavorite = () => {
    if (!user || !selectedMovie) return;

    const userFavorites = JSON.parse(
      localStorage.getItem(`favorites_${user.id}`) || "[]"
    );

    let newFavorites;
    if (isFavorite) {
      newFavorites = userFavorites.filter(
        (movie: IMovie) => movie.id !== selectedMovie.id
      );
    } else {
      newFavorites = [...userFavorites, selectedMovie];
    }

    localStorage.setItem(`favorites_${user.id}`, JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };

  if (!selectedMovie) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${selectedMovie.backdrop_path})`,
          zIndex: 0,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black"></div>
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3">
              <img
                src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`}
                alt={selectedMovie.title}
                className="w-full rounded-lg shadow-lg"
              />
            </div>
            <div className="w-full md:w-2/3 text-white">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-4xl font-bold">{selectedMovie.title}</h1>
                <div className="flex gap-2">
                  <button
                    onClick={toggleFavorite}
                    className="p-2 bg-black/60 rounded-full hover:bg-red-500/20 transition-colors backdrop-blur-sm"
                    title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Heart
                      size={24}
                      className={`transition-colors ${
                        isFavorite
                          ? "fill-red-500 text-red-500"
                          : "text-gray-400 hover:text-red-500"
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => setShowTrailer(true)}
                    className="p-2 bg-black/60 rounded-full hover:bg-purple-500/20 transition-colors backdrop-blur-sm"
                    title="Play trailer"
                  >
                    <Play size={24} className="text-gray-400 hover:text-purple-500" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center text-yellow-500">
                  <Star size={20} />
                  <span className="ml-1">{selectedMovie.vote_average.toFixed(1)} / 10</span>
                </div>
                <span>{new Date(selectedMovie.release_date).getFullYear()}</span>
              </div>
              <p className="text-lg mb-8">{selectedMovie.overview}</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMovie.genres?.map((genre) => (
                      <span
                        key={genre.id}
                        className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMovie.spoken_languages?.map((lang) => (
                      <span
                        key={lang.iso_639_1}
                        className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm"
                      >
                        {lang.english_name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showTrailer && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <div className="relative w-full max-w-4xl mx-4">
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300"
            >
              <X size={32} />
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${selectedMovie.videos?.results[0]?.key}`}
              title="Movie Trailer"
              className="w-full aspect-video rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}
