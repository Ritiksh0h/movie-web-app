"use client";

import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  fetchTrending,
  fetchNowPlayingMovies,
  fetchPopular,
  fetchTop,
  fetchUpcomingMovies,
} from "@/services/tmdbApi";
import MediaList from "@/components/media-list";
import { motion } from "framer-motion";
import { Movie } from "../types";

export const dynamic = "force-dynamic";
export const revalidate = 0; //Very important
export const fetchCache = "force-no-store";

const categories = [
  { value: "trending", label: "Trending" },
  { value: "nowPlaying", label: "Now Playing" },
  { value: "popular", label: "Popular" },
  { value: "topRated", label: "Top Rated" },
  { value: "upcoming", label: "Upcoming" },
];

export default function MoviesPage() {
  const [category, setCategory] = useState<string>("trending");
  const [page, setPage] = useState<number>(1);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMovies = useCallback(async (category: string, page: number) => {
    setIsLoading(true);
    setError(null);
    try {
      let result;
      switch (category) {
        case "trending":
          result = await fetchTrending("day", "movie", page);
          break;
        case "nowPlaying":
          result = await fetchNowPlayingMovies(page);
          break;
        case "popular":
          result = await fetchPopular("movie", page);
          break;
        case "topRated":
          result = await fetchTop("movie", page);
          break;
        case "upcoming":
          result = await fetchUpcomingMovies(page);
          break;
        default:
          throw new Error("Invalid category");
      }
      if (result !== null) {
        setMovies(result.results as Movie[]);
        setTotalPages(result.total_pages);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      setError("Failed to fetch movies. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMovies(category, page);
  }, [category, page, fetchMovies]);

  const handleCategoryChange = useCallback((newCategory: string) => {
    setCategory(newCategory);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <section className="relative h-[40vh] mb-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20"
        />
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="absolute inset-0 flex items-center justify-center text-5xl font-bold text-primary-foreground"
        >
          Discover Movies
        </motion.h1>
      </section>
      <div className="container mx-auto px-4 py-8">
        <Tabs
          value={category}
          onValueChange={handleCategoryChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-5 mb-8">
            {categories.map((cat) => (
              <TabsTrigger key={cat.value} value={cat.value}>
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <>
            {categories.map((cat) => (
              <TabsContent key={cat.value} value={cat.value}>
                <div>
                  <MediaList
                    media={movies}
                    totalPages={totalPages}
                    currentPage={page}
                    onPageChange={handlePageChange}
                    mediaType="movie"
                    isLoading={isLoading}
                    error={error || undefined}
                  />
                </div>
              </TabsContent>
            ))}
          </>
        </Tabs>
      </div>
    </main>
  );
}
