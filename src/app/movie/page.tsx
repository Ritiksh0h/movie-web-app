"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  fetchTrending,
  fetchNowPlayingMovies,
  fetchPopular,
  fetchTop,
  fetchUpcomingMovies,
  fetchByGenre,
} from "@/services/tmdbApi";
import MediaList from "@/components/media-list";
import { motion } from "framer-motion";
import { Movie } from "../types";
import { GenreFilter } from "@/components/GenreFilter";
import { useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic";
export const fetchCache = "default-cache";

const categories = [
  { value: "trending",   label: "Trending" },
  { value: "nowPlaying", label: "Now Playing" },
  { value: "popular",    label: "Popular" },
  { value: "topRated",   label: "Top Rated" },
  { value: "upcoming",   label: "Upcoming" },
];

function MoviesContent() {
  const searchParams = useSearchParams();
  const activeGenre  = searchParams.get("genre");

  const [category, setCategory]   = useState<string>("trending");
  const [page, setPage]           = useState<number>(1);
  const [movies, setMovies]       = useState<Movie[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError]         = useState<string | null>(null);

  const fetchMovies = useCallback(async (cat: string, pg: number, genre: string | null) => {
    setIsLoading(true);
    setError(null);
    try {
      let result;
      if (genre) {
        result = await fetchByGenre("movie", genre, pg);
      } else {
        switch (cat) {
          case "trending":   result = await fetchTrending("day", "movie", pg); break;
          case "nowPlaying": result = await fetchNowPlayingMovies(pg); break;
          case "popular":    result = await fetchPopular("movie", pg); break;
          case "topRated":   result = await fetchTop("movie", pg); break;
          case "upcoming":   result = await fetchUpcomingMovies(pg); break;
          default: throw new Error("Invalid category");
        }
      }
      if (result !== null) {
        setMovies(result.results as Movie[]);
        setTotalPages(result.total_pages);
      }
    } catch (err) {
      console.error("Error fetching movies:", err);
      setError("Failed to fetch movies. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMovies(category, page, activeGenre);
  }, [category, page, activeGenre, fetchMovies]);

  const handleCategoryChange = useCallback((newCategory: string) => {
    setCategory(newCategory);
    setPage(1);
  }, []);

  return (
    <>
      <div className="mb-4">
        <GenreFilter mediaType="movie" />
      </div>
      <div className="container mx-auto px-4 py-4">
        <Tabs value={category} onValueChange={handleCategoryChange} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            {categories.map((cat) => (
              <TabsTrigger key={cat.value} value={cat.value}>{cat.label}</TabsTrigger>
            ))}
          </TabsList>
          <>
            {categories.map((cat) => (
              <TabsContent key={cat.value} value={cat.value}>
                <MediaList
                  media={movies}
                  totalPages={totalPages}
                  currentPage={page}
                  onPageChange={setPage}
                  mediaType="movie"
                  isLoading={isLoading}
                  error={error || undefined}
                />
              </TabsContent>
            ))}
          </>
        </Tabs>
      </div>
    </>
  );
}

export default function MoviesPage() {
  return (
    <main className="min-h-screen bg-background">
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
          className="absolute inset-0 flex items-center justify-center text-5xl font-bold text-white"
        >
          Discover Movies
        </motion.h1>
      </section>
      <Suspense fallback={null}>
        <MoviesContent />
      </Suspense>
    </main>
  );
}
