"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Info,
  Play,
  Plus,
  ThumbsDown,
  ThumbsUp,
  Volume2,
  VolumeOff,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getImageUrl,
  fetchMediaTrailer,
  getGenreNames,
} from "@/services/tmdbApi";
import Link from "next/link";

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
  const [isHovered, setIsHovered] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLIFrameElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const img = new window.Image();
    img.src = getImageUrl(item.poster_path);
    img.onload = () => setIsLoading(false);
  }, [item.poster_path]);

  useEffect(() => {
    if (isHovered && !trailerUrl) {
      fetchMediaTrailer(item.id, type).then(setTrailerUrl);
    }
  }, [isHovered, item.id, trailerUrl, type]);

  useEffect(() => {
    if (isHovered && videoRef.current && trailerUrl) {
      videoRef.current.src = `${trailerUrl}?autoplay=1&mute=${
        isMuted ? 1 : 0
      }&controls=0&modestbranding=1&loop=1`;
    }
  }, [isHovered, isMuted, trailerUrl]);

  const handleMouseEnter = () => {
    hoverTimeoutRef.current = setTimeout(() => setIsHovered(true), 500);
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimeoutRef.current);
    setIsHovered(false);
  };

  const title = item.title || item.name || "";
  const releaseYear = new Date(
    item.release_date || item.first_air_date || ""
  ).getFullYear();

  if (isLoading) {
    return (
      <Card className="w-[250px] h-[375px]">
        <CardContent className="p-0">
          <Skeleton className="w-full h-full rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div
      className="relative w-[250px]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Card className="w-full h-[375px] rounded-lg overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105">
        <CardContent className="p-0 h-full">
          <Image
            src={getImageUrl(item.poster_path)}
            alt={title}
            width={250}
            height={375}
            className="w-full h-full object-cover"
          />
        </CardContent>
      </Card>
      {isHovered && (
        <Card className="absolute top-0 left-0 w-[300px] h-auto z-50 shadow-xl">
          <CardContent className="p-0">
            <div className="relative">
              {trailerUrl ? (
                <iframe
                  width="300"
                  height="169"
                  title={`${title} trailer`}
                  src={trailerUrl}
                  ref={videoRef}
                  allow="autoplay; encrypted-media"
                  className="rounded-t-lg"
                ></iframe>
              ) : (
                <Image
                  src={getImageUrl(item.backdrop_path)}
                  alt={title}
                  width={300}
                  height={169}
                  className="w-full object-cover rounded-t-lg"
                />
              )}
              <Button
                className="absolute bottom-2 left-2"
                size="icon"
                variant="secondary"
                onClick={() => setIsMuted(!isMuted)}
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
                  <VolumeOff className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
          <CardHeader className="p-4">
            <CardTitle className="text-lg font-bold">
              {title}
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({releaseYear})
              </span>
            </CardTitle>
            <div className="flex items-center text-sm flex-wrap gap-2 mt-2">
              <Badge variant="secondary">{item.vote_average.toFixed(1)}</Badge>
              {getGenreNames(item.genre_ids)
                .slice(0, 2)
                .map((genre) => (
                  <Badge key={genre} variant="outline">
                    {genre}
                  </Badge>
                ))}
            </div>
          </CardHeader>
          <CardDescription className="px-4 text-sm line-clamp-2">
            {item.overview}
          </CardDescription>
          <CardFooter className="flex justify-between p-4">
            <Button size="sm">
              <Play className="h-4 w-4 mr-2" />
              Play
            </Button>
            <div className="flex gap-2">
              <Button size={"icon"} variant="ghost">
                <Link
                  href={`/${type}/${item.id}`}
                  className="flex gap-2 items-center"
                >
                  <Info className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" aria-label="Add to list">
                <Plus className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Like">
                <ThumbsUp className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Dislike">
                <ThumbsDown className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
