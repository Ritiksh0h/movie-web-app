"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  fetchTrending,
  fetchOnAirTv,
  fetchPopular,
  fetchTop,
  fetchByGenre,
} from "@/services/tmdbApi";
import { motion } from "framer-motion";
import MediaList from "@/components/media-list";
import { Tv } from "../types";
import { GenreFilter } from "@/components/GenreFilter";
import { useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic";
export const fetchCache = "default-cache";

const categories = [
  { value: "trending", label: "Trending" },
  { value: "onAir",    label: "On the Air" },
  { value: "popular",  label: "Popular" },
  { value: "topRated", label: "Top Rated" },
];

function TvContent() {
  const searchParams = useSearchParams();
  const activeGenre  = searchParams.get("genre");

  const [category, setCategory]   = useState<string>("trending");
  const [page, setPage]           = useState<number>(1);
  const [tv, setTv]               = useState<Tv[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError]         = useState<string | null>(null);

  const fetchTv = useCallback(async (cat: string, pg: number, genre: string | null) => {
    setIsLoading(true);
    setError(null);
    try {
      let result;
      if (genre) {
        result = await fetchByGenre("tv", genre, pg);
      } else {
        switch (cat) {
          case "trending": result = await fetchTrending("day", "tv", pg); break;
          case "onAir":    result = await fetchOnAirTv(pg); break;
          case "popular":  result = await fetchPopular("tv", pg); break;
          case "topRated": result = await fetchTop("tv", pg); break;
          default: throw new Error("Invalid category");
        }
      }
      if (result !== null) {
        setTv(result.results as Tv[]);
        setTotalPages(result.total_pages);
      }
    } catch (err) {
      console.error("Error fetching TV shows:", err);
      setError("Failed to fetch TV shows. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTv(category, page, activeGenre);
  }, [category, page, activeGenre, fetchTv]);

  const handleCategoryChange = useCallback((newCategory: string) => {
    setCategory(newCategory);
    setPage(1);
  }, []);

  return (
    <>
      <div className="mb-4">
        <GenreFilter mediaType="tv" />
      </div>
      <div className="container mx-auto px-4 py-4">
        <Tabs value={category} onValueChange={handleCategoryChange} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            {categories.map((cat) => (
              <TabsTrigger key={cat.value} value={cat.value}>{cat.label}</TabsTrigger>
            ))}
          </TabsList>
          <>
            {categories.map((cat) => (
              <TabsContent key={cat.value} value={cat.value}>
                <MediaList
                  media={tv}
                  totalPages={totalPages}
                  currentPage={page}
                  onPageChange={setPage}
                  mediaType="tv"
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

export default function TvPage() {
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
          Discover TV Shows
        </motion.h1>
      </section>
      <Suspense fallback={null}>
        <TvContent />
      </Suspense>
    </main>
  );
}
