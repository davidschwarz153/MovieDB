import { useContext, useState } from "react";
import { mainContext } from "../../context/MainProvider";
import { Search } from "lucide-react";

const categories = [
    { id: 28, name: "Action" },
    { id: 35, name: "Comedy" },
    { id: 27, name: "Horror" },
];

export default function SearchCategories() {
    interface Movie {
        title: string;
        genre_ids: number[];
    }
    
    const { allMovies, setFilteredMovies } = useContext(mainContext) as {
        allMovies: Movie[];
        setFilteredMovies: (movies: Movie[]) => void;
    };
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        filterMovies(term, selectedCategory);
    };

    const handleCategoryClick = (categoryId: number) => {
        const newCategory = categoryId === selectedCategory ? null : categoryId;
        setSelectedCategory(newCategory);
        filterMovies(searchTerm, newCategory);
    };

    const filterMovies = (term: string, categoryId: number | null) => {
        let filtered = allMovies;

        if (term) {
            filtered = filtered.filter((movie) =>
                movie.title.toLowerCase().includes(term)
            );
        }

        if (categoryId !== null) {
            filtered = filtered.filter((movie) =>
                movie.genre_ids.includes(categoryId)
            );
        }

        setFilteredMovies(filtered);
    };

    return (
        <div className="flex flex-col items-center gap-4 p-4">
         
            <div className="relative w-full max-w-md">
                <input
                    type="text"
                    placeholder="Search Movie ..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full p-3 pl-4 pr-10 text-gray-700 border rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
                <Search className="absolute top-3 right-3 text-gray-400" size={20} />
            </div>

            
            <div className="flex gap-4">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => handleCategoryClick(category.id)}
                        className={`px-6 py-2 rounded-full shadow-sm ${
                            selectedCategory === category.id
                                ? "bg-gray-800 text-white"
                                : "bg-gray-100 text-gray-700"
                        } transition-all`}
                    >
                        {category.name}
                    </button>
                ))}
            </div>
        </div>
    );
}
