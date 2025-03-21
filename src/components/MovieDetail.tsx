/**
 * MovieDetail Component
 *
 * Displays detailed information about a specific movie, including:
 * - Movie poster and backdrop
 * - Title, release date, and runtime
 * - Overview and genres
 * - Cast and crew information
 * - Similar movies recommendations
 * - User interactions (favorites, ratings)
 */

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Heart, Star, Download, Play, X } from "lucide-react";
import { useUser } from "../context/UserContext";
import { Movie, Cast, Crew, Video } from "../types/movie";
import { formatRuntime, formatDate } from "../utils/formatters";
import DownloadButton from "./DownloadButton";

// TMDB API configuration
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";

export default function MovieDetail() {
  // Navigation and route parameters
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // User context for authentication and favorites
  const { currentUser, updateUser } = useUser();

  // Component state
  const [movie, setMovie] = useState<Movie | null>(null);
  const [cast, setCast] = useState<Cast[]>([]);
  const [crew, setCrew] = useState<Crew[]>([]);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);

  /**
   * Fetches all movie-related data on component mount
   * Includes movie details, credits, similar movies, and videos
   */
  useEffect(() => {
    const fetchMovieData = async () => {
      if (!id) return;
      setIsLoading(true);
      setError(null);

      try {
        // Fetch movie details
        const movieResponse = await axios.get(`${BASE_URL}/movie/${id}`, {
          params: { api_key: API_KEY, append_to_response: "videos" },
        });
        setMovie(movieResponse.data);

        // Find trailer video
        const videos = movieResponse.data.videos?.results || [];
        const trailer = videos.find(
          (video: Video) => video.type === "Trailer" && video.site === "YouTube"
        );
        setTrailerKey(trailer?.key || null);

        // Fetch movie credits
        const creditsResponse = await axios.get(
          `${BASE_URL}/movie/${id}/credits`,
          {
            params: { api_key: API_KEY },
          }
        );
        setCast(creditsResponse.data.cast.slice(0, 10));
        setCrew(
          creditsResponse.data.crew.filter((member: Crew) =>
            ["Director", "Producer", "Screenplay"].includes(member.job)
          )
        );

        // Fetch similar movies
        const similarResponse = await axios.get(
          `${BASE_URL}/movie/${id}/similar`,
          {
            params: { api_key: API_KEY },
          }
        );
        setSimilarMovies(similarResponse.data.results.slice(0, 6));

        // Check if movie is in user's favorites
        if (currentUser?.favorites) {
          setIsFavorite(currentUser.favorites.includes(id));
        }
      } catch (err) {
        console.error("Error fetching movie data:", err);
        setError("Failed to load movie details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieData();
  }, [id, currentUser?.favorites]);

  /**
   * Handles adding/removing movie from user's favorites
   * Updates both local state and user data in context
   */
  const handleFavoriteClick = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    try {
      const favorites = currentUser.favorites || [];
      const updatedFavorites = isFavorite
        ? favorites.filter((favId) => favId !== id)
        : [...favorites, id!];

      await updateUser({ favorites: updatedFavorites });
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error("Error updating favorites:", err);
      setError("Failed to update favorites. Please try again.");
    }
  };

  /**
   * Handles movie poster download
   * Creates a temporary link to download the image
   */
  const handleDownload = () => {
    if (!movie?.poster_path) return;

    const link = document.createElement("a");
    link.href = `${IMAGE_BASE_URL}${movie.poster_path}`;
    link.download = `${movie.title}_poster.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500" />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 text-xl">{error || "Movie not found"}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Movie Backdrop Section */}
      <div className="relative h-[60vh] w-full">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${IMAGE_BASE_URL}${movie.backdrop_path})`,
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
        </div>

        {/* Movie Title and Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-3">{movie.title}</h1>
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => setShowTrailer(true)}
                disabled={!trailerKey}
                className="flex items-center gap-2 px-3 py-1.5 bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm"
              >
                <Play size={18} />
                Watch Trailer
              </button>
              <button
                onClick={handleFavoriteClick}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
                  isFavorite
                    ? "bg-pink-600 hover:bg-pink-700"
                    : "bg-gray-600 hover:bg-gray-700"
                }`}
              >
                <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
                {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-600 rounded-lg hover:bg-gray-700 text-sm"
              >
                <Download size={18} />
                Download Poster
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Movie Details Grid */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Poster and Basic Info */}
          <div className="md:col-span-1">
            <img
              src={`${IMAGE_BASE_URL}${movie.poster_path}`}
              alt={movie.title}
              className="w-full rounded-lg shadow-xl"
            />
            <div className="mt-3 space-y-1.5">
              <p>
                <span className="text-gray-400">Release Date:</span>{" "}
                {formatDate(movie.release_date)}
              </p>
              <p>
                <span className="text-gray-400">Runtime:</span>{" "}
                {formatRuntime(movie.runtime)}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Rating:</span>
                <Star
                  className="text-yellow-500"
                  size={18}
                  fill="currentColor"
                />
                <span>{movie.vote_average.toFixed(1)}</span>
              </div>
            </div>
          </div>

          {/* Overview and Credits */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Overview</h2>
              <p className="text-gray-300 text-sm">{movie.overview}</p>
            </div>

            {/* Cast Section */}
            <div>
              <h2 className="text-xl font-semibold mb-2">Cast</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {cast.map((member) => (
                  <div key={member.id} className="text-center">
                    <img
                      src={`${IMAGE_BASE_URL}${member.profile_path}`}
                      alt={member.name}
                      className="w-full rounded-lg mb-1"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "/placeholder-avatar.png";
                      }}
                    />
                    <p className="font-medium text-sm">{member.name}</p>
                    <p className="text-xs text-gray-400">{member.character}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Crew Section */}
            <div>
              <h2 className="text-xl font-semibold mb-2">Crew</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {crew.map((member) => (
                  <div
                    key={`${member.id}-${member.job}`}
                    className="p-3 bg-gray-800 rounded-lg"
                  >
                    <p className="font-medium text-sm">{member.name}</p>
                    <p className="text-xs text-gray-400">{member.job}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Similar Movies Section */}
            <div>
              <h2 className="text-xl font-semibold mb-2">Similar Movies</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {similarMovies.map((movie) => (
                  <div
                    key={movie.id}
                    onClick={() => navigate(`/movie/${movie.id}`)}
                    className="cursor-pointer transform hover:scale-105 transition-transform"
                  >
                    <img
                      src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                      alt={movie.title}
                      className="w-full rounded-lg"
                    />
                    <p className="mt-1 font-medium text-sm">{movie.title}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Details</h2>
              <p>Release Date: {formatDate(movie.release_date)}</p>
              <p>Rating: {movie.vote_average}/10</p>
              <p>Duration: {formatRuntime(movie.runtime)}</p>
            </div>
            {currentUser && (
              <DownloadButton
                url={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                filename={`${movie.title}-poster.jpg`}
                label="Download Poster"
              />
            )}
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailer && trailerKey && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative w-full max-w-4xl mx-4">
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute -top-8 right-0 text-white hover:text-gray-300"
            >
              <X size={24} />
            </button>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}`}
                title="Movie Trailer"
                allowFullScreen
                className="w-full h-full rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
