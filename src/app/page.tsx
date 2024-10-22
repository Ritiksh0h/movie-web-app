import { Suspense } from "react";
import {
  fetchNowPlayingMovies,
  fetchPopular,
  fetchTop,
  fetchUpcomingMovies,
} from "@/services/tmdbApi";
import { Skeleton } from "@/components/ui/skeleton";
import { UpcomingMovies } from "@/components/UpcomingMovies";
import { MediaGridSection } from "@/components/MediaGridSection";
import { HeroSection } from "@/components/HeroSection";

export default async function Page() {
  // Fetch all the data and handle possible errors by returning empty arrays if needed
  const nowPlayingMovies = (await fetchNowPlayingMovies()) || { results: [] };
  const popularMovies = (await fetchPopular("movie")) || { results: [] };
  const topMovies = (await fetchTop("movie")) || { results: [] };
  const popularTv = (await fetchPopular("tv")) || { results: [] };
  const topTv = (await fetchTop("tv")) || { results: [] };
  const upcomingMovies = (await fetchUpcomingMovies()) || { results: [] };

  // Render the page
  return (
    <main className="flex-1">
      {nowPlayingMovies.results.length > 0 ? (
        <HeroSection movies={nowPlayingMovies.results} />
      ) : (
        <p className="text-center py-8">No Now Playing Movies Available</p>
      )}
      
      <Suspense fallback={<MediaGridsSkeleton />}>
        {popularMovies.results.length > 0 && (
          <MediaGridSection
            title="Popular Movies"
            media={popularMovies.results}
            mediaType="movie"
            contentMediaType={false}
          />
        )}
        
        {topMovies.results.length > 0 && (
          <MediaGridSection
            title="Top Rated Movies"
            media={topMovies.results}
            mediaType="movie"
            contentMediaType={false}
          />
        )}

        {popularTv.results.length > 0 && (
          <MediaGridSection
            title="Popular TV Shows"
            media={popularTv.results}
            contentMediaType={false}
            mediaType="tv"
          />
        )}

        {topTv.results.length > 0 && (
          <MediaGridSection
            title="Top Rated TV Shows"
            media={topTv.results}
            contentMediaType={false}
            mediaType="tv"
          />
        )}

        {upcomingMovies.results.length > 0 ? (
          <UpcomingMovies movies={upcomingMovies.results} />
        ) : (
          <p className="text-center py-8">No Upcoming Movies Available</p>
        )}
      </Suspense>
    </main>
  );
}

// Skeleton component for loading state
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
