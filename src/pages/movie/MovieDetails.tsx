import React, { useState, useEffect } from "react";
import { Play, Star, X } from "lucide-react";
import { useParams } from "react-router-dom";
import { IMovie } from "@/components/interfaces/Interface";
import { mainContext } from "@/context/MainProvider";
import { useContext } from "react";

interface MovieVideo {
  key: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
}

interface MovieDetails extends IMovie {
  videos?: {
    results: MovieVideo[];
  };
}

const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { fetchMovieDetails, selectedMovie } = useContext(mainContext);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    const loadMovie = async () => {
      if (id) {
        try {
          const movieData = await fetchMovieDetails(parseInt(id));

          // Находим официальный трейлер
          const officialTrailer = movieData.videos?.results.find(
            (video) =>
              video.type === "Trailer" &&
              video.official &&
              video.site === "YouTube"
          );

          if (officialTrailer) {
            setTrailerKey(officialTrailer.key);
          }
        } catch (error) {
          console.error("Error loading movie:", error);
        }
      }
    };

    loadMovie();
  }, [id, fetchMovieDetails]);

  const handleTrailerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (trailerKey) {
      setShowTrailer(true);
    }
  };

  const handleCloseTrailer = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowTrailer(false);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowTrailer(false);
  };

  if (!selectedMovie) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/3">
            <div className="relative group">
              <img
                src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`}
                alt={selectedMovie.title}
                className="w-full rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105"
              />
              {trailerKey && (
                <button
                  onClick={handleTrailerClick}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"
                >
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
                    <Play size={32} className="text-white" />
                  </div>
                </button>
              )}
            </div>
          </div>
          <div className="lg:w-2/3">
            <h1 className="text-3xl font-bold mb-4">{selectedMovie.title}</h1>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center text-yellow-400">
                <Star size={20} />
                <span className="ml-2">
                  {selectedMovie.vote_average.toFixed(1)} / 10
                </span>
              </div>
              <span>{new Date(selectedMovie.release_date).getFullYear()}</span>
            </div>
            <p className="text-gray-300 mb-6">{selectedMovie.overview}</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedMovie.genres?.map((genre) => (
                <span
                  key={genre.id}
                  className="px-3 py-1 bg-purple-900/30 rounded-full text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>
            {trailerKey && (
              <button
                onClick={handleTrailerClick}
                className="flex items-center gap-2 px-6 py-3 bg-red-600 rounded-full hover:bg-red-700 transition-colors duration-300"
              >
                <Play size={20} />
                <span>Watch Trailer</span>
              </button>
            )}
          </div>
        </div>

        {showTrailer && trailerKey && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={handleOverlayClick}
          >
            <div className="relative w-full max-w-4xl aspect-video">
              <button
                onClick={handleCloseTrailer}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors duration-300"
              >
                <X size={32} />
              </button>
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                title="Movie Trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-lg"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
