"use client";

import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  fetchTrending,
  fetchOnAirTv,
  fetchPopular,
  fetchTop,
} from "@/services/tmdbApi";
import { motion } from "framer-motion";
import MediaList from "@/components/media-list";
import { Tv } from "../types";

const categories = [
  { value: "trending", label: "Trending" },
  { value: "onAir", label: "On the Air" },
  { value: "popular", label: "Popular" },
  { value: "topRated", label: "Top Rated" },
];

export default function TvPage() {
  const [category, setCategory] = useState<string>("trending");
  const [page, setPage] = useState<number>(1);
  const [tv, setTv] = useState<Tv[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTv = useCallback(async (category: string, page: number) => {
    setIsLoading(true);
    setError(null);
    try {
      let result;
      switch (category) {
        case "trending":
          result = await fetchTrending("day", "tv", page);
          break;
        case "onAir":
          result = await fetchOnAirTv(page);
          break;
        case "popular":
          result = await fetchPopular("tv", page);
          break;
        case "topRated":
          result = await fetchTop("tv", page);
          break;
        default:
          throw new Error("Invalid category");
      }
      if (result !== null) {
        setTv(result.results as Tv[]);
        setTotalPages(result.total_pages);
      }
    } catch (error) {
      console.error("Error fetching TV shows:", error);
      setError("Failed to fetch TV shows. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTv(category, page);
  }, [category, page, fetchTv]);

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
          Discover TV Shows
        </motion.h1>
      </section>
      <div className="container mx-auto px-4 py-8">
        <Tabs
          value={category}
          onValueChange={handleCategoryChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4 mb-8">
            {categories.map((cat) => (
              <TabsTrigger key={cat.value} value={cat.value}>
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <>
            {categories.map((cat) => (
              <TabsContent key={cat.value} value={cat.value}>
                <MediaList
                  media={tv}
                  totalPages={totalPages}
                  currentPage={page}
                  onPageChange={handlePageChange}
                  mediaType="tv"
                  isLoading={isLoading}
                  error={error || undefined}
                />
              </TabsContent>
            ))}
          </>
        </Tabs>
      </div>
    </main>
  );
}
