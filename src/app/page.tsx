import { Suspense } from "react";
import {
  fetchNowPlayingMovies,
  fetchPopularMovies,
  fetchPopularTv,
  fetchTopMovies,
  fetchTopTv,
  fetchUpcomingMovies,
} from "@/services/tmdbApi";
import { Skeleton } from "@/components/ui/skeleton";
import { UpcomingMovies } from "@/components/UpcomingMovies";
import { MediaGridSection } from "@/components/MediaGridSection";
import { HeroSection } from "@/components/HeroSection";

async function MediaGrids() {
  const [popularMovies, topMovies, popularTv, topTv, upcomingMovies] =
    await Promise.all([
      fetchPopularMovies(),
      fetchTopMovies(),
      fetchPopularTv(),
      fetchTopTv(),
      fetchUpcomingMovies(),
    ]);

  return (
    <>
      <MediaGridSection
        title="Popular Movies"
        media={popularMovies.results}
        mediaType="movie"
      />
      <MediaGridSection
        title="Top Rated Movies"
        media={topMovies.results}
        mediaType="movie"
      />
      <MediaGridSection
        title="Popular TV Shows"
        media={popularTv.results}
        mediaType="tv"
      />
      <MediaGridSection
        title="Top Rated TV Shows"
        media={topTv.results}
        mediaType="tv"
      />
      <UpcomingMovies movies={upcomingMovies.results} />
    </>
  );
}

export default async function Page() {
  const nowPlayingMovies = await fetchNowPlayingMovies();

  return (
    <main className="flex-1">
      <HeroSection movies={nowPlayingMovies.results} />
      <Suspense fallback={<MediaGridsSkeleton />}>
        <MediaGrids />
      </Suspense>
    </main>
  );
}

function MediaGridsSkeleton() {
  return (
    <>
      {[...Array(4)].map((_, index) => (
        <section key={index} className="py-8 container mx-auto px-4">
          <Skeleton className="w-48 h-8 mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} className="h-[300px] w-full" />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
