import { Calendar } from "lucide-react";
import { Badge } from "./ui/badge";
import Image from "next/image";
import { Movie, getGenreNames, getImageUrl } from "@/services/tmdbApi";

interface UpcomingMoviesProps {
  movies: Movie[];
}

export const UpcomingMovies: React.FC<UpcomingMoviesProps> = ({ movies }) => {
  return (
    <section className="py-8 container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {Array.isArray(movies) && movies.length > 0 ? (
          movies.map((movie) => (
            <div key={movie.id} className="relative">
              <Image
                src={getImageUrl(movie.poster_path)}
                width={100}
                height={150}
                alt={`Upcoming Movie ${movie.title}`}
                className="rounded-md w-full h-96"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg" />
              <div className="absolute bottom-2 left-4 space-y-1">
                <h3 className="font-bold text-lg text-white">{movie.title}</h3>
                <div className="flex gap-2">
                  {getGenreNames(movie.genre_ids).slice(0, 3).map((g, index) => (
                    <Badge key={index} variant={"secondary"}>
                      {g}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center text-sm text-muted">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>Release: {movie.release_date}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-muted-foreground">
            No upcoming movies.
          </p>
        )}
      </div>
    </section>
  );
};
