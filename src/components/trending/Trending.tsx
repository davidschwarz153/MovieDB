import { mainContext } from "@/context/MainProvider";
import { useContext } from "react";
import { IMovie } from "../interfaces/Interface";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Star } from "lucide-react";

export default function Trending() {
    const { trendingMovies } = useContext(mainContext);

    return (
        <section className="mt-6 px-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Trending Movies</h2>
                <span className="text-red-500 cursor-pointer">See all</span>
            </div>

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
                        <div className="relative rounded-2xl overflow-hidden shadow-lg">
                            <img
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={movie.title}
                                className="w-full h-[35vh] object-cover"
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
        </section>
    );
}
