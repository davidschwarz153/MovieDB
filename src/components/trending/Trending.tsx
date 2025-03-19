import { mainContext } from "@/context/MainProvider";
import { useContext, useState } from "react";
import { IMovie } from "../interfaces/Interface";
import { useNavigate } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Star, Bookmark } from "lucide-react";

export default function Trending() {
    const navigate = useNavigate();
    const { trendingMovies, fetchMovieDetails } = useContext(mainContext);
    const [showAll, setShowAll] = useState(false);

    const handleMovieClick = async (movieId: number) => {
        await fetchMovieDetails(movieId);
        navigate(`/movie/${movieId}`);
    };

    return (
        <section className="px-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Trending Movies</h2>
                <span 
                    className="text-red-500 cursor-pointer"
                    onClick={() => setShowAll(!showAll)}
                >
                    {showAll ? "Show less" : "See all"}
                </span>
            </div>

            {showAll ? (
                <div className="flex flex-col gap-4 mt-4">
                    {trendingMovies.map((movie: IMovie) => (
                        <div 
                            key={movie.id}
                            className="flex gap-4 bg-white rounded-xl p-2 shadow-sm cursor-pointer"
                            onClick={() => handleMovieClick(movie.id)}
                        >
                            <img
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={movie.title}
                                className="w-24 h-32 object-cover rounded-lg"
                            />
                            <div className="flex flex-col justify-between py-1 flex-1">
                                <div>
                                    <h3 className="font-bold text-gray-900">{movie.title}</h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                        <span>{new Date(movie.release_date).getFullYear()}</span>
                                        <span>•</span>
                                        <span>Action</span>
                                        <span>•</span>
                                        <span>2h 38m</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center text-yellow-400">
                                        <Star size={16} />
                                        <span className="ml-1 text-sm">{movie.vote_average.toFixed(1)}</span>
                                    </div>
                                    <button className="p-2 hover:bg-gray-100 rounded-full">
                                        <Bookmark size={20} className="text-gray-400" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <Swiper
                    modules={[Pagination]}
                    spaceBetween={15}
                    slidesPerView={1.2}
                    pagination={{ clickable: true }}
                    breakpoints={{
                        640: { slidesPerView: 1.5 },
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                    className="mt-4"
                >
                    {trendingMovies.map((movie: IMovie) => (
                        <SwiperSlide key={movie.id}>
                            <div 
                                className="relative rounded-2xl overflow-hidden shadow-lg cursor-pointer"
                                onClick={() => handleMovieClick(movie.id)}
                            >
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                    alt={movie.title}
                                    className="w-full h-[30vh] object-cover"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                                    <h3 className="text-white text-sm font-bold">{movie.title}</h3>
                                    <div className="flex items-center text-yellow-400 mt-1">
                                        <Star size={16} />
                                        <span className="text-white ml-1">{movie.vote_average.toFixed(1)} / 10</span>
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
