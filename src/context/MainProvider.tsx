import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { IMovie } from "../components/interfaces/Interface";

export const mainContext = createContext<any>(null);

export default function MainProvider({ children }: { children: React.ReactNode }) {
    const [allMovies, setAllMovies] = useState<IMovie[]>([]);
    const [filteredMovies, setFilteredMovies] = useState<IMovie[]>([]);
    const [trendingMovies, setTrendingMovies] = useState<IMovie[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const API_HEADERS = {
        accept: "application/json",
        Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyOGNjZWZjZjM2NDdkY2I0MmM1MDhkNWFiMmE4Y2I4MyIsIm5iZiI6MTc0MjI5MDc0OS40OTUwMDAxLCJzdWIiOiI2N2Q5M2YzZDFiYjRiNWM1OGJjNmEzNmEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.euHZNMVWsgJAiwPOISC8gHcNGf8XQ4U5AhiqBUkPEDY`
    };

    // Holt die besten Filme
    const fetchMovies = async (page: number) => {
        try {
            setLoading(true);
            setError(null);
            const res = await axios.get("https://api.themoviedb.org/3/movie/top_rated", {
                params: { language: "en-US", page },
                headers: API_HEADERS
            });
            setAllMovies(res.data.results);
            setFilteredMovies(res.data.results);
        } catch (error) {
            setError("Fehler beim Laden der Filme");
            console.error("API Fehler:", error);
        } finally {
            setLoading(false);
        }
    };

    // Holt die aktuellen Trend-Filme
    const fetchTrendingMovies = async () => {
        try {
            const res = await axios.get("https://api.themoviedb.org/3/trending/movie/day", {
                params: { language: "en-US" },
                headers: API_HEADERS
            });
            setTrendingMovies(res.data.results);
        } catch (error) {
            console.error("Fehler beim Laden der Trend-Filme:", error);
        }
    };

    useEffect(() => {
        fetchMovies(1);
        fetchTrendingMovies();
    }, []);

    return (
        <mainContext.Provider value={{ 
            allMovies, 
            filteredMovies, 
            setFilteredMovies, 
            trendingMovies, 
            loading, 
            error
        }}>
            {children}
        </mainContext.Provider>
    );
}
