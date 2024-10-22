import MovieDetails from "@/components/MovieDetails";
import MediaNotFound from "@/components/media-not-found";
import MovieDetailsSkeleton from "@/components/movie-details-skeleton";
import { fetchById } from "@/services/tmdbApi";
import { Suspense } from "react";

export default async function Page({ params }: { params: { id: string } }) {
  const movie = await fetchById(+params.id, "movie");

  if (!movie) {
    return <MediaNotFound isMovie={true} />;
  }

  return (
    <Suspense fallback={<MovieDetailsSkeleton />}>
      <div>
        <MovieDetails movie={movie} />
      </div>
    </Suspense>
  );
}
