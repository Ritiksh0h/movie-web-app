"use client";

import React, { useCallback, useState, useEffect } from "react";
import { motion } from "framer-motion";
import MediaList from "@/components/media-list";
import { fetchTrending } from "@/services/tmdbApi";
import { Movie, Tv, MovieResponse, TvResponse } from "../types";

export const dynamic = "force-dynamic";
export const revalidate = 0; //Very important
export const fetchCache = "force-no-store";

export default function Page() {
  // State for movies and TV shows
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tvShows, setTvShows] = useState<Tv[]>([]);

  // Pagination states
  const [moviePage, setMoviePage] = useState(1);
  const [tvPage, setTvPage] = useState<number>(1);
  const [movieTotalPages, setMovieTotalPages] = useState(1);
  const [tvTotalPages, setTvTotalPages] = useState(1);

  // Loading and error states
  const [isLoadingMovies, setIsLoadingMovies] = useState(true);
  const [isLoadingTv, setIsLoadingTv] = useState(true);
  const [movieError, setMovieError] = useState<string | null>(null);
  const [tvError, setTvError] = useState<string | null>(null);

  // Fetch trending movies
  const fetchMovies = useCallback(async () => {
    setIsLoadingMovies(true);
    setMovieError(null);
    try {
      const response: MovieResponse | null = (await fetchTrending(
        "day",
        "movie",
        moviePage
      )) as MovieResponse | null;
      if (response) {
        setMovies(response.results);
        setMovieTotalPages(response.total_pages);
      } else {
        setMovieError("No movie data found.");
      }
    } catch (err) {
      setMovieError("Failed to fetch movies. Please try again later.");
      console.error(err);
    } finally {
      setIsLoadingMovies(false);
    }
  }, [moviePage]);

  // Fetch trending TV shows
  const fetchTvShows = useCallback(async () => {
    setIsLoadingTv(true);
    setTvError(null);
    try {
      const response: TvResponse | null = (await fetchTrending(
        "day",
        "tv", // Correct media type for TV shows
        tvPage
      )) as TvResponse | null;
      if (response) {
        setTvShows(response.results);
        setTvTotalPages(response.total_pages);
      } else {
        setTvError("No TV data found.");
      }
    } catch (err) {
      setTvError("Failed to fetch TV shows. Please try again later.");
      console.error(err);
    } finally {
      setIsLoadingTv(false);
    }
  }, [tvPage]);

  // Fetch movies and TV shows on page load or when pages change
  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  useEffect(() => {
    fetchTvShows();
  }, [fetchTvShows]);

  // Handlers for pagination
  const handleMoviePageChange = useCallback((newPage: number) => {
    setMoviePage(newPage);
  }, []);

  const handleTvPageChange = useCallback((newPage: number) => {
    setTvPage(newPage);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative h-[40vh] mb-8 flex items-center justify-center"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20" />
        <h1 className="text-5xl font-bold text-primary-foreground text-center z-10">
          Discover New and Popular
        </h1>
      </motion.section>

      {/* Movies Section */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold mb-6">Movies</h2>
          <MediaList
            media={movies}
            totalPages={movieTotalPages}
            currentPage={moviePage}
            onPageChange={handleMoviePageChange}
            mediaType="movie"
            isLoading={isLoadingMovies}
            error={movieError || undefined} // Show error if it exists
          />
        </motion.div>
      </div>

      {/* TV Shows Section */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold mb-6">TV Shows</h2>
          <MediaList
            media={tvShows}
            totalPages={tvTotalPages}
            currentPage={tvPage}
            onPageChange={handleTvPageChange}
            mediaType="tv"
            isLoading={isLoadingTv}
            error={tvError || undefined} // Show error if it exists
          />
        </motion.div>
      </div>
    </main>
  );
}
