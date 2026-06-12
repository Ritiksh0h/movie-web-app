"use client";

import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { searchTMDB } from "@/services/tmdbApi";
import Image from "next/image";
import Link from "next/link";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useDebounce } from "@/hooks/use-debounce";
import { MovieItem, PersonItem, TVItem } from "@/app/types";

const SearchPopup = () => {
  const [query, setQuery]   = useState("");
  const [results, setResults] = useState<(MovieItem | TVItem | PersonItem)[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) { setResults([]); return; }
    setIsLoading(true);
    try {
      const data = await searchTMDB(searchQuery);
      if (data && "results" in data) setResults(data.results);
    } catch (error) {
      console.error("Error searching:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { handleSearch(debouncedQuery); }, [debouncedQuery, handleSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (!isOpen && e.target.value.trim()) setIsOpen(true);
  };

  const getHref = (item: MovieItem | TVItem | PersonItem) => {
    if (item.media_type === "movie") return `/movie/${item.id}`;
    if (item.media_type === "tv")    return `/tv/${item.id}`;
    return "#";
  };

  const getImageSrc = (item: MovieItem | TVItem | PersonItem) => {
    const path =
      item.media_type === "person"
        ? (item as PersonItem).profile_path
        : (item as MovieItem | TVItem).poster_path;
    return path ? `https://image.tmdb.org/t/p/w92${path}` : null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-transparent text-white/80 hover:text-white">
          <Search className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#141414] border-white/10">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-white mb-3">Search</h2>
          <Input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Search movies, TV shows..."
            className="w-full bg-[#1f1f1f] border-white/10 text-white placeholder:text-white/40"
            autoFocus
          />
        </div>

        <AnimatePresence>
          {isLoading ? (
            <SearchSkeleton />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2 max-h-[60vh] overflow-y-auto"
            >
              {results.map((item) => (
                <Link
                  key={item.id}
                  href={getHref(item)}
                  onClick={() => setIsOpen(false)}
                >
                  <Card className="overflow-hidden hover:bg-accent/50 transition-colors cursor-pointer border-border/50 bg-[#1a1a1a]">
                    <div className="flex">
                      <div className="relative w-[60px] h-[90px] flex-shrink-0 bg-[#1a1a1a]">
                        {getImageSrc(item) ? (
                          <Image
                            src={getImageSrc(item)!}
                            alt={item.title || item.name || ""}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-white/20 text-[10px] text-center p-1">
                            No image
                          </div>
                        )}
                      </div>
                      <CardContent className="p-3 flex-grow">
                        <h3 className="font-semibold text-sm mb-0.5 line-clamp-1 text-white">
                          {item.title || item.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mb-1 capitalize">
                          {item.media_type === "movie" ? "Movie" :
                           item.media_type === "tv"    ? "TV Show" :
                           "Person"}
                        </p>
                        {item.media_type !== "person" && (
                          <p className="text-xs line-clamp-2 text-white/60">
                            {(item as MovieItem | TVItem).overview}
                          </p>
                        )}
                      </CardContent>
                    </div>
                  </Card>
                </Link>
              ))}

              {results.length === 0 && !isLoading && query && (
                <p className="text-center text-muted-foreground py-4">
                  No results found for &quot;{query}&quot;
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

const SearchSkeleton = () => (
  <div className="space-y-2">
    {[...Array(3)].map((_, index) => (
      <div key={index} className="flex animate-pulse bg-[#1a1a1a] rounded-md overflow-hidden">
        <div className="bg-white/10 w-[60px] h-[90px] flex-shrink-0" />
        <div className="flex-grow p-3">
          <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
          <div className="h-3 bg-white/10 rounded w-1/2 mb-2" />
          <div className="h-3 bg-white/10 rounded w-full" />
        </div>
      </div>
    ))}
  </div>
);

export default SearchPopup;
