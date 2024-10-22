"use client";
import React, { useState, useRef, useEffect } from "react";
import { Movie, Tv } from "@/app/types";
import MediaCard from "./media-card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MediaGridSectionProps {
  title: string;
  media: (Movie | Tv)[];
  mediaType?: "movie" | "tv";
  contentMediaType: boolean;
}

export const MediaGridSection: React.FC<MediaGridSectionProps> = ({
  title,
  media,
  mediaType,
  contentMediaType,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsPerGroup = 5;

  useEffect(() => {
    if (containerRef.current) {
      const itemWidth = containerRef.current.offsetWidth / itemsPerGroup;
      setTranslateX(-currentIndex * itemWidth);
    }
  }, [currentIndex]);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - itemsPerGroup, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      Math.min(
        prevIndex + itemsPerGroup,
        Math.max(media.length - itemsPerGroup, 0)
      )
    );
  };

  const getMediaType = (item: Movie | Tv): "movie" | "tv" => {
    if (contentMediaType && item.media_type) {
      return item.media_type;
    }
    return mediaType || "movie";
  };


  return (
    <section className="py-4 container mx-auto px-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold ">{title}</h2>
        <div className="space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className=""
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className=""
            onClick={handleNext}
            disabled={currentIndex + itemsPerGroup >= media.length}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="relative " ref={containerRef}>
        <div
          className="flex transition-transform duration-300 ease-in-out gap-2"
          style={{ transform: `translateX(${translateX}px)` }}
        >
          {media && media.length > 0 ? (
            media.map((item) => (
              <div key={item.id} className="w-1/5 flex-shrink-0 px-2">
                {contentMediaType}
                <MediaCard
                  item={item}
                  type={getMediaType(item)} 
                />
              </div>
            ))
          ) : (
            <p className="w-full text-center text-muted-foreground">
              No {mediaType === "movie" ? "movies" : "TV shows"} available.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
