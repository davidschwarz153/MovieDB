import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { IMovie } from "../components/interfaces/Interface";

export const mainContext = createContext<any>(null);

export default function MainProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [allMovies, setAllMovies] = useState<IMovie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<IMovie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<IMovie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<IMovie | null>(null);
  const [movieTrailer, setMovieTrailer] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const API_HEADERS = {
    accept: "application/json",
    Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyOGNjZWZjZjM2NDdkY2I0MmM1MDhkNWFiMmE4Y2I4MyIsIm5iZiI6MTc0MjI5MDc0OS40OTUwMDAxLCJzdWIiOiI2N2Q5M2YzZDFiYjRiNWM1OGJjNmEzNmEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.euHZNMVWsgJAiwPOISC8gHcNGf8XQ4U5AhiqBUkPEDY`,
  };

  const getAllMovies = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://api.themoviedb.org/3/discover/movie",
        {
          params: {
            language: "en-US",
            sort_by: "popularity.desc",
            include_adult: false,
            page: currentPage,
          },
          headers: API_HEADERS,
        }
      );
      setAllMovies((prevMovies) =>
        currentPage === 1
          ? res.data.results
          : [...prevMovies, ...res.data.results]
      );
      setTotalPages(res.data.total_pages);
    } catch (error) {
      console.error("Ошибка при загрузке всех фильмов:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreMovies = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const fetchTrendingMovies = async () => {
    try {
      const res = await axios.get(
        "https://api.themoviedb.org/3/trending/movie/day",
        {
          params: { language: "en-US" },
          headers: API_HEADERS,
        }
      );
      setTrendingMovies(res.data.results);
    } catch (error) {
      console.error("Ошибка при загрузке трендовых фильмов:", error);
    }
  };

  const fetchMovieDetails = async (movieId: number) => {
    try {
      const res = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}`,
        {
          params: { language: "en-US" },
          headers: API_HEADERS,
        }
      );
      setSelectedMovie(res.data);
      await fetchMovieTrailer(movieId);
    } catch (error) {
      console.error("Ошибка при загрузке деталей фильма:", error);
    }
  };

  const fetchMovieTrailer = async (movieId: number) => {
    try {
      const res = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}/videos`,
        {
          params: { language: "en-US" },
          headers: API_HEADERS,
        }
      );
      const trailers = res.data.results;
      const trailer = trailers.find(
        (video: any) => video.type === "Trailer" && video.site === "YouTube"
      );
      if (trailer) {
        setMovieTrailer(trailer.key);
      } else {
        setMovieTrailer(null);
      }
    } catch (error) {
      console.error("Ошибка при загрузке трейлера:", error);
      setMovieTrailer(null);
    }
  };

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
          page: 1,
        },
        headers: API_HEADERS,
      });
      setFilteredMovies(res.data.results);
    } catch (error) {
      console.error("Ошибка при поиске фильмов:", error);
      setFilteredMovies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllMovies();
  }, [currentPage]);

  useEffect(() => {
    if (!isSearching) {
      fetchTrendingMovies();
    }
  }, [isSearching]);

  const filterMoviesByGenre = (genreId: number) => {
    const filtered = allMovies.filter((movie) =>
      movie.genre_ids.includes(genreId)
    );
    setFilteredMovies(filtered);
  };
  
  return (
    <mainContext.Provider
      value={{
        allMovies,
        filteredMovies,
        setFilteredMovies,
        trendingMovies,
        loading,
        selectedMovie,
        fetchMovieDetails,
        isSearching,
        setIsSearching,
        movieTrailer,
        searchMovies,
        getAllMovies,
        loadMoreMovies,
        currentPage,
        totalPages,
        filterMoviesByGenre,
      }}
    >
      {children}
    </mainContext.Provider>
  );
}
