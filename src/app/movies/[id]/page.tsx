import MovieDetails from "@/components/MovieDetails";
import MovieDetailsSkeleton from "@/components/movie-details-skeleton";
import { fetchById } from "@/services/tmdbApi";
import { Suspense } from "react";

export default async function Page({ params }: { params: { id: string } }) {
  const movie = await fetchById(+params.id, "tv");

  return (
    <Suspense fallback={<MovieDetailsSkeleton />}>
      <div>{movie !== null && <MovieDetails movie={movie} />}</div>
    </Suspense>
  );
}
