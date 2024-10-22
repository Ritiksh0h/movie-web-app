import MovieDetailsSkeleton from "@/components/movie-details-skeleton";
import { fetchById } from "@/services/tmdbApi";
import { Suspense } from "react";
import TVShowDetails from "@/components/TvShowDetails";
import MediaNotFound from "@/components/media-not-found";
import { TvShowDetailsProps } from "@/app/types";

export default async function Page({ params }: { params: { id: string } }) {
  const tv = await fetchById(+params.id, "tv");

  if (!tv) {
    return <MediaNotFound isMovie={false} />;
  }

  return (
    <Suspense fallback={<MovieDetailsSkeleton />}>
      <div>
        <TVShowDetails tv={tv as TvShowDetailsProps} />
      </div>
    </Suspense>
  );
}
