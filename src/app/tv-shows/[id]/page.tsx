import MovieDetailsSkeleton from "@/components/movie-details-skeleton";
import { fetchById } from "@/services/tmdbApi";
import { Suspense } from "react";
import TVShowDetails from "@/components/TvShowDetails";

export default async function Page({ params }: { params: { id: string } }) {
  const tv = await fetchById(+params.id, "tv");

  return (
    <Suspense fallback={<MovieDetailsSkeleton />}>
      <div>{tv !== null && <TVShowDetails tv={tv} />}</div>
    </Suspense>
  );
}
