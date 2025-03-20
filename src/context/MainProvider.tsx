import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { IMovie } from "../components/interfaces/Interface";

export const mainContext = createContext<{
  trendingMovies: IMovie[];
  filteredMovies: IMovie[];
  setFilteredMovies: (movies: IMovie[]) => void;
  selectedMovie: IMovie | null;
  setSelectedMovie: (movie: IMovie | null) => void;
  isSearching: boolean;
  setIsSearching: (isSearching: boolean) => void;
  searchMovies: (query: string) => void;
  filterMoviesByGenre: (genreId: number) => void;
  selectedGenre: number | null;
  clearSelectedGenre: () => void;
  fetchMovieDetails: (movieId: number) => Promise<void>;
  loading: boolean;
  movieTrailer: string | null;
  getAllMovies: () => Promise<void>;
  loadMoreMovies: () => void;
  currentPage: number;
  totalPages: number;
}>({
  trendingMovies: [],
  filteredMovies: [],
  setFilteredMovies: () => {},
  selectedMovie: null,
  setSelectedMovie: () => {},
  isSearching: false,
  setIsSearching: () => {},
  searchMovies: () => {},
  filterMoviesByGenre: () => {},
  selectedGenre: null,
  clearSelectedGenre: () => {},
  fetchMovieDetails: async () => {},
  loading: false,
  movieTrailer: null,
  getAllMovies: async () => {},
  loadMoreMovies: () => {},
  currentPage: 1,
  totalPages: 1,
});

export default function MainProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [filteredMovies, setFilteredMovies] = useState<IMovie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<IMovie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<IMovie | null>(null);
  const [movieTrailer, setMovieTrailer] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);

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
      setFilteredMovies((prevMovies) =>
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
    try {
      let url = `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`;

      if (selectedGenre) {
        url += `&with_genres=${selectedGenre}`;
      }

      const res = await axios.get(url, {
        headers: API_HEADERS,
      });
      setFilteredMovies(res.data.results);
    } catch (error) {
      console.error("Ошибка при поиске фильмов:", error);
      setFilteredMovies([]);
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

  const filterMoviesByGenre = async (genreId: number) => {
    setSelectedGenre(genreId);
    try {
      const res = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&language=en-US&include_adult=false`,
        {
          headers: API_HEADERS,
        }
      );
      setFilteredMovies(res.data.results);
      setIsSearching(true);
    } catch (error) {
      console.error("Ошибка при фильтрации фильмов по жанру:", error);
    }
  };

  const clearSelectedGenre = () => {
    setSelectedGenre(null);
    setFilteredMovies([]);
    setIsSearching(false);
  };

  useEffect(() => {
    fetchTrendingMovies();
  }, []);

  useEffect(() => {
    if (!isSearching && !selectedGenre) {
      fetchTrendingMovies();
    }
  }, [isSearching, selectedGenre]);

  useEffect(() => {
    if (isSearching || selectedGenre) {
      getAllMovies();
    }
  }, [currentPage, isSearching, selectedGenre]);

  return (
    <mainContext.Provider
      value={{
        trendingMovies,
        filteredMovies,
        setFilteredMovies,
        loading,
        selectedMovie,
        setSelectedMovie,
        isSearching,
        setIsSearching,
        movieTrailer,
        searchMovies,
        getAllMovies,
        loadMoreMovies,
        currentPage,
        totalPages,
        filterMoviesByGenre,
        selectedGenre,
        clearSelectedGenre,
        fetchMovieDetails,
      }}
    >
      {children}
    </mainContext.Provider>
  );
}
