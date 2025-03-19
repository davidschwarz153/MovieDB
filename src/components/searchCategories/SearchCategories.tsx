import { useContext, useState } from "react";
import { mainContext } from "../../context/MainProvider";
import { Search, Star, Bookmark } from "lucide-react";
import { IMovie } from "../interfaces/Interface";
import { useNavigate } from "react-router-dom";

const categories = [
    { id: 28, name: "Action" },
    { id: 35, name: "Comedy" },
    { id: 27, name: "Horror" },
];

export default function SearchCategories() {
    const navigate = useNavigate();
    const { filteredMovies, setFilteredMovies, fetchMovieDetails, isSearching, setIsSearching, searchMovies } = useContext(mainContext) as {
        filteredMovies: IMovie[];
        setFilteredMovies: (movies: IMovie[]) => void;
        fetchMovieDetails: (movieId: number) => Promise<void>;
        isSearching: boolean;
        setIsSearching: (value: boolean) => void;
        searchMovies: (query: string) => Promise<void>;
    };
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        setIsSearching(term.length > 0 || selectedCategory !== null);
        
        if (term.length >= 2) {
            await searchMovies(term);
        }
    };

    const handleCategoryClick = (categoryId: number) => {
        const newCategory = categoryId === selectedCategory ? null : categoryId;
        setSelectedCategory(newCategory);
        setIsSearching(searchTerm.length > 0 || newCategory !== null);
        
        if (newCategory !== null && filteredMovies.length > 0) {
            const filtered = filteredMovies.filter(movie => 
                movie.genre_ids.includes(newCategory)
            );
            setFilteredMovies(filtered);
        } else if (searchTerm.length >= 2) {
            searchMovies(searchTerm);
        }
    };

    const handleMovieClick = async (movieId: number) => {
        await fetchMovieDetails(movieId);
        navigate(`/movie/${movieId}`);
    };

    return (
        <div className="flex flex-col gap-4 p-4">
            <h1 className="text-xl font-bold">Genres / Search</h1>
            
            <div className="relative w-full">
                <input
                    type="text"
                    placeholder="Search Movie ..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full p-3 pl-4 pr-10 text-gray-700 bg-gray-100 rounded-xl shadow-sm focus:outline-none"
                />
                <Search className="absolute top-3 right-3 text-gray-400" size={20} />
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => handleCategoryClick(category.id)}
                        className={`px-6 py-2 rounded-full shadow-sm whitespace-nowrap ${
                            selectedCategory === category.id
                                ? "bg-red-500 text-white"
                                : "bg-gray-100 text-gray-700"
                        } transition-all`}
                    >
                        {category.name}
                    </button>
                ))}
            </div>

            {isSearching && filteredMovies.length > 0 && (
                <div className="flex flex-col gap-4 mt-2">
                    {filteredMovies.map((movie: IMovie) => (
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
            )}
        </div>
    );
}
