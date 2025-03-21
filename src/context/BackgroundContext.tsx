/**
 * BackgroundContext Component
 * 
 * This context manages dynamic background images for the application.
 * It fetches random movie backdrops from TMDB API and provides
 * loading states and error handling for background image management.
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

/**
 * BackgroundContextType Interface
 * Defines the shape of the context and available methods
 */
interface BackgroundContextType {
  backgroundImage: string | null;     // Current background image URL
  isLoading: boolean;                 // Loading state for image fetch
  error: string | null;               // Error message if fetch fails
  refreshBackground: () => Promise<void>; // Manual refresh trigger
}

// TMDB API configuration
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

/**
 * BackgroundProvider Component
 * Manages background image state and provides image-related functionality
 */
export function BackgroundProvider({ children }: { children: ReactNode }) {
  // State management for background image
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches a random movie backdrop from TMDB API
   * Uses trending movies endpoint for reliable results
   * Falls back to poster_path if backdrop is unavailable
   */
  const fetchRandomBackground = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch trending movies
      const response = await axios.get(`${BASE_URL}/trending/movie/day`, {
        params: { api_key: API_KEY }
      });

      if (!response.data.results || response.data.results.length === 0) {
        throw new Error('No movies found');
      }

      // Select random movie from results
      const randomIndex = Math.floor(Math.random() * response.data.results.length);
      const movie = response.data.results[randomIndex];

      // Use backdrop_path or fall back to poster_path
      const imagePath = movie.backdrop_path || movie.poster_path;
      if (!imagePath) {
        throw new Error('No image available for selected movie');
      }

      // Set the background image URL
      const imageUrl = `${IMAGE_BASE_URL}${imagePath}`;
      console.log('Setting background image:', imageUrl);
      setBackgroundImage(imageUrl);
    } catch (err) {
      // Handle different types of errors
      if (axios.isAxiosError(err)) {
        setError(`API Error: ${err.response?.data?.status_message || err.message}`);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to fetch background image. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Initialize background image on component mount
   */
  useEffect(() => {
    fetchRandomBackground();
  }, []);

  return (
    <BackgroundContext.Provider
      value={{
        backgroundImage,
        isLoading,
        error,
        refreshBackground: fetchRandomBackground,
      }}
    >
      {children}
    </BackgroundContext.Provider>
  );
}

/**
 * Custom hook for accessing BackgroundContext
 * @returns BackgroundContextType - Background context value
 * @throws Error if used outside of BackgroundProvider
 */
export function useBackground() {
  const context = useContext(BackgroundContext);
  if (context === undefined) {
    throw new Error('useBackground must be used within a BackgroundProvider');
  }
  return context;
} 