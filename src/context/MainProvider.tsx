import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { IMovie } from "../components/interfaces/Interface";

export const mainContext = createContext<any>(null);

export default function MainProvider({ children }: { children: React.ReactNode }) {
    const [allMovies, setAllMovies] = useState<IMovie[]>([]);
    const [filteredMovies, setFilteredMovies] = useState<IMovie[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);


    const fetchMovies = async (page: number) => {
        try {
            setLoading(true);
            setError(null);

            const options = {
                method: "GET",
                url: "https://api.themoviedb.org/3/movie/top_rated",
                params: { language: "en-US", page: page },
                headers: {
                    accept: "application/json",
                    Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyOGNjZWZjZjM2NDdkY2I0MmM1MDhkNWFiMmE4Y2I4MyIsIm5iZiI6MTc0MjI5MDc0OS40OTUwMDAxLCJzdWIiOiI2N2Q5M2YzZDFiYjRiNWM1OGJjNmEzNmEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.euHZNMVWsgJAiwPOISC8gHcNGf8XQ4U5AhiqBUkPEDY`
                },
            };

            const res = await axios.request(options);
            setAllMovies(res.data.results);
            setFilteredMovies(res.data.results);
            
        } catch (error) {
            setError("Fehler beim Laden der Filme");
            console.error("API Fehler:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMovies(1);
    }, []);

    return (
        <mainContext.Provider value={{ 
            allMovies, 
            filteredMovies, 
            setFilteredMovies, 
            loading, 
            error
        }}>
            {children}
        </mainContext.Provider>
    );
}
