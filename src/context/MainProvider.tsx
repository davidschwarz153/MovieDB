import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { IMovie } from "../components/interfaces/Interface";

export const mainContext = createContext<any>(null);

export default function MainProvider({ children }: { children: React.ReactNode }) {
    const [allMovies, setAllMovies] = useState<IMovie[]>([]);
    const [filteredMovies, setFilteredMovies] = useState<IMovie[]>([]);
    const [trendingMovies, setTrendingMovies] = useState<IMovie[]>([]);
    const [selectedMovie, setSelectedMovie] = useState<IMovie | null>(null);
    const [movieTrailer, setMovieTrailer] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isSearching, setIsSearching] = useState<boolean>(false);

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

    // Holt die Details eines einzelnen Films
    const fetchMovieDetails = async (movieId: number) => {
        try {
            const res = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
                params: { language: "en-US" },
                headers: API_HEADERS
            });
            setSelectedMovie(res.data);
            // Hole auch direkt den Trailer
            await fetchMovieTrailer(movieId);
        } catch (error) {
            console.error("Fehler beim Laden der Film-Details:", error);
        }
    };

    // Holt den Trailer eines Films
    const fetchMovieTrailer = async (movieId: number) => {
        try {
            const res = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/videos`, {
                params: { language: "en-US" },
                headers: API_HEADERS
            });
            const trailers = res.data.results;
            // Suche nach einem offiziellen Trailer
            const trailer = trailers.find((video: any) => 
                video.type === "Trailer" && video.site === "YouTube"
            );
            if (trailer) {
                setMovieTrailer(trailer.key);
            } else {
                setMovieTrailer(null);
            }
        } catch (error) {
            console.error("Fehler beim Laden des Trailers:", error);
            setMovieTrailer(null);
        }
    };

    // Sucht Filme in der TMDB API
    const searchMovies = async (query: string) => {
        if (!query) {
            setFilteredMovies(allMovies);
            return;
        }
        
        try {
            setLoading(true);
            const res = await axios.get("https://api.themoviedb.org/3/search/movie", {
                params: { 
                    query,
                    language: "en-US",
                    include_adult: false,
                    page: 1
                },
                headers: API_HEADERS
            });
            setFilteredMovies(res.data.results);
        } catch (error) {
            console.error("Fehler bei der Filmsuche:", error);
            setFilteredMovies([]);
        } finally {
            setLoading(false);
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
            error,
            selectedMovie,
            fetchMovieDetails,
            isSearching,
            setIsSearching,
            movieTrailer,
            searchMovies
        }}>
            {children}
        </mainContext.Provider>
    );
}
