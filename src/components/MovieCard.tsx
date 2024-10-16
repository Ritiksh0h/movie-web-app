// components/MovieCard.tsx
"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Play,
  Plus,
  ThumbsDown,
  ThumbsUp,
  Volume2,
  VolumeOff,
} from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Movie, getImageUrl, fetchMovieTrailer } from "../services/tmdbApi";

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (isHovered && !trailerUrl) {
      fetchMovieTrailer(movie.id).then(setTrailerUrl);
    }
  }, [isHovered, movie.id, trailerUrl]);

  useEffect(() => {
    if (isHovered && videoRef.current) {
      videoRef.current.src = `${trailerUrl}?autoplay=1&mute=${
        isMuted ? 1 : 0
      }&controls=0&modestbranding=1&loop=1`;
    }
  }, [isHovered, isMuted, trailerUrl]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="h-96 rounded overflow-hidden z-0">
        <Image
          height={350}
          width={250}
          src={getImageUrl(movie.poster_path)}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
      </Card>
      {isHovered && (
        <Card className="absolute inset-0 space-y-4 transition-opacity duration-300 w-[350px] h-[386px] top-0 -left-5 right-0 bottom-0 z-50">
          <div className="relative">
            {trailerUrl ? (
              <iframe
                width="350"
                height="200"
                title={`${movie.title} trailer`}
                src={trailerUrl}
                ref={videoRef}
                allow="autoplay; encrypted-media"
                className="rounded-t-xl"
              ></iframe>
            ) : (
              <Image
                height={350}
                width={250}
                src={getImageUrl(movie.backdrop_path)}
                alt={movie.title}
                className="w-full h-1/2 object-cover rounded-t-xl"
              />
            )}
            <Button
              className="absolute bottom-2 left-2"
              size={"icon"}
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? (
                <VolumeOff className="h-6 w-6" />
              ) : (
                <Volume2 className="h-6 w-6" />
              )}
            </Button>
          </div>
          <CardHeader className="py-0">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-bold">
                {movie.title}
                <span className="m-1 text-muted-foreground text-sm font-thin">
                  ({new Date(movie.release_date).getFullYear()})
                </span>
              </CardTitle>
              {/* <span className="text-muted-foreground text-sm">{duration}</span> */}
            </div>
            <div className="flex items-center text-sm flex-wrap gap-2">
              <Badge variant={"outline"}>{movie.vote_average.toFixed(1)}</Badge>
              {movie.genre_ids.map((g, index) => (
                <Badge key={index} variant={"secondary"}>
                  {g}
                </Badge>
              ))}
            </div>
            <CardDescription className="text-sm truncate">
              {movie.overview}
            </CardDescription>
          </CardHeader>

          <CardFooter className="flex gap-2 px-4">
            <Button variant={"ghost"} size={"icon"}>
              <Play />
            </Button>
            <Button variant={"ghost"} size={"icon"}>
              <Plus />
            </Button>
            <Button variant={"ghost"} size={"icon"}>
              <ThumbsUp />
            </Button>
            <Button variant={"ghost"} size={"icon"}>
              <ThumbsDown />
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default MovieCard;
