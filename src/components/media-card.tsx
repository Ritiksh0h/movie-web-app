"use client";

import React, { useRef, useState } from "react";
import { Play, Info, Plus, Check, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getImageUrl, fetchMediaTrailer, getGenreNames } from "@/services/tmdbApi";
import { useWatchlist } from "@/hooks/use-watchlist";

interface MediaItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  genre_ids: number[];
  overview: string;
  release_date?: string;
  first_air_date?: string;
}

interface MediaCardProps {
  item: MediaItem;
  type: "movie" | "tv";
}

export default function MediaCard({ item, type }: MediaCardProps) {
  const [isHovered, setIsHovered]   = useState(false);
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null);
  const hoverTimeout = useRef<NodeJS.Timeout>();
  const leaveTimeout = useRef<NodeJS.Timeout>();

  const { add, remove, has } = useWatchlist();
  const inList = has(item.id);

  const title       = item.title || item.name || "";
  const releaseYear = new Date(item.release_date || item.first_air_date || "").getFullYear();
  const rating      = item.vote_average.toFixed(1);
  const genres      = getGenreNames(item.genre_ids).slice(0, 2);
  const detailHref  = `/${type}/${item.id}`;

  const handleMouseEnter = () => {
    clearTimeout(leaveTimeout.current);
    hoverTimeout.current = setTimeout(async () => {
      setIsHovered(true);
      if (!trailerUrl) {
        const url = await fetchMediaTrailer(item.id, type);
        setTrailerUrl(url);
      }
    }, 600);
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimeout.current);
    leaveTimeout.current = setTimeout(() => setIsHovered(false), 200);
  };

  const toggleWatchlist = () => {
    if (inList) {
      remove(item.id);
    } else {
      add({ id: item.id, title, poster_path: item.poster_path, type });
    }
  };

  return (
    <div
      className="relative w-full group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative overflow-hidden rounded-md aspect-[2/3] bg-[#141414] transition-transform duration-200 group-hover:scale-105">
        {item.poster_path ? (
          <Image
            src={getImageUrl(item.poster_path)}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 40vw, 20vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-white/20 text-xs text-center p-2">
            {title}
          </div>
        )}
        <div className="absolute top-2 left-2 flex items-center gap-0.5 bg-black/70 rounded px-1.5 py-0.5">
          <Star className="h-2.5 w-2.5 text-yellow-400 fill-yellow-400" />
          <span className="text-[10px] font-semibold text-white">{rating}</span>
        </div>
      </div>

      {isHovered && (
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 z-[60]
            w-[280px] rounded-xl overflow-hidden shadow-2xl
            bg-[#141414] border border-white/10
            animate-in fade-in zoom-in-95 duration-150"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="relative w-full aspect-video bg-black">
            {trailerUrl ? (
              <iframe
                src={`${trailerUrl}?autoplay=1&mute=1&controls=0&modestbranding=1&loop=1`}
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                title={`${title} trailer`}
              />
            ) : item.backdrop_path ? (
              <Image
                src={getImageUrl(item.backdrop_path, "w500")}
                alt={title}
                fill
                className="object-cover"
              />
            ) : null}
          </div>

          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="font-bold text-sm text-white truncate max-w-[60%]">{title}</p>
              <span className="text-[10px] text-white/50">{releaseYear}</span>
            </div>

            <div className="flex items-center gap-1.5 mb-2 flex-wrap">
              <div className="flex items-center gap-0.5">
                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                <span className="text-xs text-white font-semibold">{rating}</span>
              </div>
              {genres.map((g) => (
                <span key={g} className="text-[10px] text-white/50 before:content-['•'] before:mr-1.5">
                  {g}
                </span>
              ))}
            </div>

            <p className="text-[11px] text-white/60 line-clamp-2 mb-3 leading-relaxed">
              {item.overview}
            </p>

            <div className="flex items-center gap-2">
              <Link
                href={detailHref}
                className="flex-1 flex items-center justify-center gap-1.5
                  bg-white text-black rounded-md py-1.5 text-xs font-bold
                  hover:bg-white/90 transition-colors"
              >
                <Play className="h-3 w-3 fill-black" />
                Play
              </Link>
              <Link
                href={detailHref}
                className="flex items-center justify-center w-8 h-8
                  rounded-full border border-white/40 text-white
                  hover:border-white transition-colors"
                title="More info"
              >
                <Info className="h-3.5 w-3.5" />
              </Link>
              <button
                onClick={toggleWatchlist}
                className="flex items-center justify-center w-8 h-8
                  rounded-full border border-white/40 text-white
                  hover:border-white transition-colors"
                title={inList ? "Remove from watchlist" : "Add to watchlist"}
              >
                {inList ? (
                  <Check className="h-3.5 w-3.5 text-green-400" />
                ) : (
                  <Plus className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
