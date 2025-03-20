import { mainContext } from "@/context/MainProvider";
import { useContext, useState, useEffect } from "react";
import { IMovie } from "../interfaces/Interface";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import "swiper/css";

import "swiper/css/pagination";
import {
  Star,
  ChevronRight,
  ChevronDown,
  LayoutGrid,
  LayoutList,
} from "lucide-react";

export default function Trending() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { trendingMovies, fetchMovieDetails, isSearching } =
    useContext(mainContext);
  const [showAll, setShowAll] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [favorites, setFavorites] = useState<{ [key: number]: boolean }>({});

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

  useEffect(() => {
    if (!isSearching) {
      setShowAll(false);
    }
  }, [isSearching]);

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
  };

  const renderListView = () => (
    <div className="flex flex-col gap-4 mt-4">
      {trendingMovies.map((movie: IMovie) => (
        <div
          key={movie.id}
          className="flex gap-4 bg-black/40 backdrop-blur-md rounded-xl p-4 shadow-lg transition-all duration-300"
        >
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-20 h-28 md:w-24 md:h-32 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={() => handleMovieClick(movie.id)}
          />
          <div className="flex flex-col justify-between py-1 flex-1">
            <div>
              <h3
                className="font-bold text-white hover:text-purple-200 transition-colors cursor-pointer"
                onClick={() => handleMovieClick(movie.id)}
              >
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
                <Star size={18} />
                <span className="ml-1.5 text-white text-base">
                  {movie.vote_average.toFixed(1)} / 10
                </span>
              </div>
              {user && (
                <img
                  src="/Vector.png"
                  alt="Favorites"
                  onClick={(e) => toggleFavorite(e, movie)}
                  className={`w-6 h-6 cursor-pointer transition-all duration-300 ${
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
  );

  const renderGridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
      {trendingMovies.map((movie: IMovie) => (
        <div
          key={movie.id}
          className={`bg-black/40 backdrop-blur-md rounded-xl overflow-hidden shadow-lg transition-all duration-300 group h-[600px]
            ${favorites[movie.id] ? "ring-1 ring-green-500/50" : ""}`}
        >
          <div className="relative h-[450px]">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-full object-cover cursor-pointer transition-transform duration-500 group-hover:scale-105"
              onClick={() => handleMovieClick(movie.id)}
            />
            <div className="absolute top-2 right-2">
              {user && (
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
              )}
            </div>
          </div>
          <div className="p-6 h-[150px] flex flex-col justify-between">
            <div>
              <h3
                className="font-bold text-xl text-white hover:text-purple-200 transition-colors cursor-pointer mb-3"
                onClick={() => handleMovieClick(movie.id)}
              >
                {movie.title}
              </h3>
              <p className="text-purple-100/70 text-sm line-clamp-2">
                {movie.overview}
              </p>
            </div>
            <div className="flex items-center justify-between text-purple-200/80 text-sm">
              <span>{new Date(movie.release_date).getFullYear()}</span>
              <div className="flex items-center text-yellow-500">
                <Star size={18} />
                <span className="ml-1.5 text-white text-base">
                  {movie.vote_average.toFixed(1)} / 10
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section className="px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-gradient-to-b from-purple-600 to-purple-900 rounded-full" />
          <h2 className="text-xl font-bold text-white">Trending Movies</h2>
        </div>
        <div className="flex items-center gap-4">
          {showAll && (
            <div className="flex bg-purple-900/30 backdrop-blur-sm rounded-full p-1">
              <button
                className={`p-2 rounded-full transition-all duration-300 ${
                  viewMode === "list"
                    ? "bg-purple-600 text-white"
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
                    ? "bg-purple-600 text-white"
                    : "text-purple-200 hover:text-white"
                }`}
                onClick={() => setViewMode("grid")}
                title="Grid view"
              >
                <LayoutGrid size={18} />
              </button>
            </div>
          )}
          <button
            className="flex items-center gap-2 px-4 py-2 bg-purple-900/30 backdrop-blur-sm rounded-full text-white hover:bg-purple-800/40 transition-all duration-300 group"
            onClick={() => setShowAll(!showAll)}
          >
            <span className="text-sm font-medium">
              {showAll ? "Show less" : "See all"}
            </span>
            {showAll ? (
              <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
            ) : (
              <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            )}
          </button>
        </div>
      </div>

      {showAll ? (
        viewMode === "list" ? (
          renderListView()
        ) : (
          renderGridView()
        )
      ) : (
        <Swiper
          modules={[Pagination, Autoplay, Navigation]}
          spaceBetween={15}
          slidesPerView={1.2}
          pagination={{ clickable: true }}
          navigation={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: { slidesPerView: 1.5 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="mt-4"
        >
          {trendingMovies.map((movie: IMovie) => (
            <SwiperSlide key={movie.id}>
              <div className="relative rounded-2xl overflow-hidden shadow-lg group h-[500px]">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-full object-cover cursor-pointer transition-transform duration-500 group-hover:scale-110"
                  onClick={() => handleMovieClick(movie.id)}
                />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3
                    className="text-white text-lg font-bold cursor-pointer hover:text-purple-200 transition-colors mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
                    onClick={() => handleMovieClick(movie.id)}
                  >
                    {movie.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-yellow-400">
                      <Star
                        size={18}
                        className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
                      />
                      <span className="text-white ml-1.5 text-base drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                        {movie.vote_average.toFixed(1)} / 10
                      </span>
                    </div>
                    {user && (
                      <img
                        src="/Vector.png"
                        alt="Favorites"
                        onClick={(e) => toggleFavorite(e, movie)}
                        className={`w-6 h-6 cursor-pointer transition-all duration-300 ${
                          favorites[movie.id]
                            ? "brightness-200 filter-none drop-shadow-[0_0_8px_rgba(34,197,94,0.5)] hover:brightness-[3] hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                            : "brightness-75 opacity-50 hover:brightness-200 hover:drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]"
                        }`}
                      />
                    )}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </section>
  );
}
