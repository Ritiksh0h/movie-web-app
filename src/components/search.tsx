"use client";

import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { searchTMDB } from "@/services/tmdbApi";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useDebounce } from "@/hooks/use-debounce";
import { MovieItem, PersonItem, TVItem } from "@/app/types";

const SearchPopup = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<(MovieItem | TVItem | PersonItem)[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const data = await searchTMDB(searchQuery);
      if (data && "results" in data) {
        setResults(data.results);
      }
    } catch (error) {
      console.error("Error searching:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    handleSearch(debouncedQuery);
  }, [debouncedQuery, handleSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (!isOpen && e.target.value.trim()) {
      setIsOpen(true);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-transparent">
          <Search className="h-6 w-6 text-white" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Search Results</h2>
        </div>
        <div className="mb-4">
          <Input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Enter your search query..."
            className="w-full"
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
              className="space-y-4 max-h-[60vh] overflow-y-auto"
            >
              {results.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="flex">
                    <Image
                      src={`https://image.tmdb.org/t/p/w92${
                        item.media_type === "person"
                          ? (item as PersonItem).profile_path
                          : (item as MovieItem | TVItem).poster_path
                      }`}
                      alt={item.title || item.name || "Media"}
                      width={92}
                      height={138}
                      className="object-cover"
                    />
                    <CardContent className="p-4 flex-grow">
                      <h3 className="font-semibold text-sm mb-1">
                        {item.title || item.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mb-1">
                        {item.media_type === "movie"
                          ? "Movie"
                          : item.media_type === "tv"
                          ? "TV Show"
                          : "Person"}
                      </p>
                      {item.media_type !== "person" && (
                        <p className="text-xs line-clamp-2">{item.overview}</p>
                      )}
                    </CardContent>
                  </div>
                </Card>
              ))}

              {results.length === 0 && !isLoading && query && (
                <p className="text-center text-muted-foreground">
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
  <div className="space-y-4">
    {[...Array(3)].map((_, index) => (
      <div key={index} className="flex animate-pulse">
        <div className="bg-gray-300 w-[92px] h-[138px]" />
        <div className="flex-grow p-4">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-300 rounded w-1/2 mb-2" />
          <div className="h-3 bg-gray-300 rounded w-full" />
          <div className="h-3 bg-gray-300 rounded w-full mt-1" />
        </div>
      </div>
    ))}
  </div>
);

export default SearchPopup;
