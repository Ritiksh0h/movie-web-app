"use client";
import Image from "next/image";
import { PlayCircle, Info } from "lucide-react";
import { getImageUrl } from "../services/tmdbApi";
import { useEffect, useRef, useState, useCallback } from "react";
import { Movie } from "@/app/types";
import Link from "next/link";

export const HeroSection: React.FC<{ movies: Movie[] }> = ({ movies }) => {
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout>();

  const advance = useCallback(() => {
    setCurrent((c) => (c + 1) % Math.min(movies.length, 5));
  }, [movies.length]);

  useEffect(() => {
    intervalRef.current = setInterval(advance, 8000);
    return () => clearInterval(intervalRef.current);
  }, [advance]);

  const movie = movies[current];
  if (!movie) return null;

  return (
    <section className="relative h-[56.25vw] max-h-[85vh] min-h-[500px] overflow-hidden">
      <Image
        key={movie.id}
        src={getImageUrl(movie.backdrop_path, "original")}
        alt={movie.title}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0d]/90 via-[#0d0d0d]/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent" />

      <div className="absolute bottom-[20%] left-6 md:left-12 max-w-xl">
        <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-3 drop-shadow-lg">
          {movie.title}
        </h1>
        <p className="text-sm md:text-base text-white/80 line-clamp-3 mb-6 leading-relaxed max-w-md">
          {movie.overview}
        </p>
        <div className="flex items-center gap-3">
          <Link
            href={`/movie/${movie.id}`}
            className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-md font-bold text-sm hover:bg-white/90 transition-colors"
          >
            <PlayCircle className="h-5 w-5 fill-black" />
            Play
          </Link>
          <Link
            href={`/movie/${movie.id}`}
            className="flex items-center gap-2 bg-white/20 text-white px-6 py-2.5 rounded-md font-semibold text-sm hover:bg-white/30 transition-colors backdrop-blur-sm"
          >
            <Info className="h-5 w-5" />
            More Info
          </Link>
        </div>
      </div>

      <div className="absolute bottom-6 right-12 flex gap-1.5">
        {movies.slice(0, 5).map((_, i) => (
          <button
            key={i}
            onClick={() => {
              clearInterval(intervalRef.current);
              setCurrent(i);
            }}
            className={`h-0.5 rounded-full transition-all duration-300 ${
              i === current ? "w-8 bg-white" : "w-3 bg-white/40"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
