import { Movie } from "@/services/tmdbApi";
import MovieCard from "./MovieCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

interface MovieGridSectionProps {
  title: string;
  movies: Movie[];
}

export const MovieGridSection: React.FC<MovieGridSectionProps> = ({
  title,
  movies,
}) => {
  return (
    <section className="py-8 container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="">
        <Carousel
          opts={{
            align: "start",
            loop: true,
            slidesToScroll: "auto",
            
          }}
        >
          <CarouselContent>
            {Array.isArray(movies) && movies.length > 0 ? (
              movies.map((movie) => (
                <CarouselItem
                  key={movie.id}
                  className="pl-2 md:basis-1/3 lg:basis-1/5"
                >
                  <MovieCard movie={movie} />
                </CarouselItem>
              ))
            ) : (
              <p className="col-span-full text-center text-muted-foreground">
                No movies available.
              </p>
            )}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        {/* {Array.isArray(movies) && movies.length > 0 ? (
          movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
        ) : (
          <p className="col-span-full text-center text-muted-foreground">
            No movies available.
          </p>
        )} */}
      </div>
    </section>
  );
};
