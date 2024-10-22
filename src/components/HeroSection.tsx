"use client";
import Image from "next/image";
import {
  PlayCircle,
  Info,
  VolumeOff,
  Volume2,
  PauseCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchMediaTrailer, getImageUrl } from "../services/tmdbApi";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { useEffect, useRef, useState } from "react";
import { Movie } from "@/app/types";
import Link from "next/link";

// ?height=800&width=1600&text=Inception

interface HeroSectionProps {
  movies: Movie[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({ movies }) => {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
    >
      <CarouselContent>
        {movies.map((movie) => (
          <MovieCarouselCard key={movie.id} movie={movie} />
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

interface MovieCarouselCardPropt {
  movie: Movie;
}

const MovieCarouselCard: React.FC<MovieCarouselCardPropt> = ({ movie }) => {
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!trailerUrl) {
      fetchMediaTrailer(movie.id, "movie").then(setTrailerUrl);
    }
  }, [movie.id, trailerUrl]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.src = `${trailerUrl}?autoplay=${
        isPlaying ? 1 : 0
      }&mute=${isMuted ? 1 : 0}&controls=0&modestbranding=1&loop=1`;
    }
  }, [isMuted, trailerUrl, isPlaying]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <CarouselItem key={movie.id}>
      <section className="relative h-[56.25vw] max-h-[80vh]">
        {trailerUrl ? (
          <iframe
            width="1550"
            height="200"
            title={`${movie.title} trailer`}
            src={trailerUrl}
            ref={videoRef}
            allow="autoplay; encrypted-media"
            className="rounded-b-xl h-full w-full"
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

        <div className="absolute inset-0 rounded-b-lg bg-black/30" />
        <div className="absolute bottom-8 left-16 p-4 space-y-4">
          <h1 className="text-5xl font-bold max-w-xl text-secondary">
            {movie.title}
          </h1>
          <p className="text-lg max-w-lg text-secondary">{movie.overview}</p>
          <div className="flex space-x-4">
            <Button
              className="text-xl"
              size="lg"
              variant="default"
              onClick={togglePlayPause}
            >
              {isPlaying ? (
                <PauseCircle size={28} className="mr-2" />
              ) : (
                <PlayCircle size={28} className="mr-2" />
              )}
              {isPlaying ? "Pause" : "Play"}
            </Button>
            <Button
              className="bg-background/80"
              size={"lg"}
              variant={"secondary"}
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <VolumeOff /> : <Volume2 />}
            </Button>
            <Button
              className="text-xl bg-background/80"
              size="lg"
              variant="secondary"
            >
              <Link href={`/movies/${movie.id}`} className="flex gap-2 items-center" >
                <Info size={28} className="mr-2" />
                More Info
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </CarouselItem>
  );
};
