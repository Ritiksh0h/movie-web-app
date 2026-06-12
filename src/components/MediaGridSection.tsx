"use client";
import React, { useRef } from "react";
import { Movie, Tv } from "@/app/types";
import MediaCard from "./media-card";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MediaGridSectionProps {
  title:            string;
  media:            (Movie | Tv)[];
  mediaType?:       "movie" | "tv";
  contentMediaType: boolean;
}

export const MediaGridSection: React.FC<MediaGridSectionProps> = ({
  title,
  media,
  mediaType,
  contentMediaType,
}) => {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!rowRef.current) return;
    const amount = rowRef.current.offsetWidth * 0.75;
    rowRef.current.scrollBy({ left: dir === "right" ? amount : -amount, behavior: "smooth" });
  };

  const getType = (item: Movie | Tv): "movie" | "tv" => {
    if (contentMediaType && item.media_type) return item.media_type;
    return mediaType || "movie";
  };

  if (!media?.length) return null;

  return (
    <section className="py-6 group/section">
      <div className="px-6 md:px-12 mb-3">
        <h2 className="text-lg font-bold text-white">{title}</h2>
      </div>

      <div className="relative px-6 md:px-12">
        <button
          onClick={() => scroll("left")}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20
            h-full w-12 flex items-center justify-center
            bg-gradient-to-r from-[#0d0d0d]/90 to-transparent
            opacity-0 group-hover/section:opacity-100 transition-opacity"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-8 w-8 text-white" />
        </button>

        <div
          ref={rowRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: "none" }}
        >
          {media.map((item) => (
            <div
              key={item.id}
              className="flex-shrink-0 w-[calc(50%-4px)] sm:w-[calc(33%-5px)] md:w-[calc(25%-6px)] lg:w-[calc(20%-6px)]"
            >
              <MediaCard item={item} type={getType(item)} />
            </div>
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20
            h-full w-12 flex items-center justify-center
            bg-gradient-to-l from-[#0d0d0d]/90 to-transparent
            opacity-0 group-hover/section:opacity-100 transition-opacity"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-8 w-8 text-white" />
        </button>
      </div>
    </section>
  );
};
