"use client";
import { useState, useEffect, useCallback } from "react";

export type WatchlistItem = {
  id:          number;
  title:       string;
  poster_path: string;
  type:        "movie" | "tv";
};

export function useWatchlist() {
  const [list, setList] = useState<WatchlistItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("watchlist");
      if (stored) setList(JSON.parse(stored));
    } catch {}
  }, []);

  const add = useCallback((item: WatchlistItem) => {
    setList((prev) => {
      if (prev.some((i) => i.id === item.id)) return prev;
      const next = [...prev, item];
      localStorage.setItem("watchlist", JSON.stringify(next));
      return next;
    });
  }, []);

  const remove = useCallback((id: number) => {
    setList((prev) => {
      const next = prev.filter((i) => i.id !== id);
      localStorage.setItem("watchlist", JSON.stringify(next));
      return next;
    });
  }, []);

  const has = useCallback((id: number) => list.some((i) => i.id === id), [list]);

  return { list, add, remove, has };
}
