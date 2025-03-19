import { useContext, useState } from "react";
import { mainContext } from "../../context/MainProvider";
import { IMovie, Genre, Language } from "../interfaces/Interface";
import { ArrowLeft, Star, Play, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MovieDetail() {
    const navigate = useNavigate();
    const { selectedMovie, movieTrailer } = useContext(mainContext) as {
        selectedMovie: IMovie;
        movieTrailer: string | null;
    };
    const [showTrailer, setShowTrailer] = useState(false);

    if (!selectedMovie) {
        return null;
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    return (
        <>
            <div className="relative min-h-screen">
                {/* Back Button */}
                <button 
                    onClick={() => navigate(-1)}
                    className="absolute top-4 left-4 z-10 bg-black/30 p-2 rounded-full"
                >
                    <ArrowLeft className="text-white" size={24} />
                </button>

                {/* Movie Poster */}
                <div className="relative h-[45vh]">
                    <img
                        src={`https://image.tmdb.org/t/p/original${selectedMovie.backdrop_path || selectedMovie.poster_path}`}
                        alt={selectedMovie.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />
                </div>

                {/* Movie Details */}
                <div className="px-4 py-6 pb-32">
                    <h1 className="text-2xl font-bold mb-2">
                        {selectedMovie.title}
                    </h1>

                    {/* Rating and Release Date */}
                    <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center">
                            <Star className="text-yellow-400" size={20} />
                            <span className="ml-1">{selectedMovie.vote_average.toFixed(1)} / 10</span>
                        </div>
                        <span>•</span>
                        <span>{formatDate(selectedMovie.release_date)}</span>
                        <span>•</span>
                        <span>{selectedMovie.runtime ? `${Math.floor(selectedMovie.runtime / 60)}h ${selectedMovie.runtime % 60}m` : 'N/A'}</span>
                    </div>

                    {/* Overview */}
                    <div className="mb-6">
                        <h2 className="text-xl font-bold mb-2">Overview</h2>
                        <p className="text-gray-700">
                            {selectedMovie.overview}
                        </p>
                    </div>

                    {/* Genres */}
                    <div className="mb-6">
                        <h2 className="text-xl font-bold mb-2">Genres</h2>
                        <div className="flex flex-wrap gap-2">
                            {selectedMovie.genres?.map((genre: Genre) => (
                                <span 
                                    key={genre.id}
                                    className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                                >
                                    {genre.name}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Languages */}
                    <div>
                        <h2 className="text-xl font-bold mb-2">Languages</h2>
                        <div className="flex flex-wrap gap-2">
                            {selectedMovie.spoken_languages?.map((language: Language) => (
                                <span 
                                    key={language.iso_639_1}
                                    className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                                >
                                    {language.english_name}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Watch Trailer Button */}
                    {movieTrailer && (
                        <button 
                            className="w-full mt-8 bg-red-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
                            onClick={() => setShowTrailer(true)}
                        >
                            <Play size={20} />
                            <span>Watch Trailer</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Trailer Modal */}
            {showTrailer && movieTrailer && (
                <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
                    <button 
                        onClick={() => setShowTrailer(false)}
                        className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full"
                    >
                        <X size={24} />
                    </button>
                    <div className="w-full h-full">
                        <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${movieTrailer}?autoplay=1`}
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </div>
            )}
        </>
    );
} 