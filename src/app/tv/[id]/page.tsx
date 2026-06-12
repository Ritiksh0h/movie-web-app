import MovieDetailsSkeleton from "@/components/movie-details-skeleton";
import { fetchById } from "@/services/tmdbApi";
import { Suspense } from "react";
import TVShowDetails from "@/components/TvShowDetails";
import MediaNotFound from "@/components/media-not-found";
import { TvShowDetailsProps } from "@/app/types";
import { Metadata } from "next";
import { siteConfig } from "@/config/siteConfig";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const id = params.id;
    const tv = (await fetchById(+id, "tv")) as TvShowDetailsProps;

    if (!tv) {
      return {
        title: `tv Not Found | ${siteConfig.name}`,
        description: "The requested tv could not be found.",
      };
    }

    const releaseYear = new Date(tv.first_air_date).getFullYear();
    const title = `${tv.name} (${releaseYear}) | ${siteConfig.name}`;
    const description = tv.overview || `Details about ${tv.name}`;
    const imageUrl = tv.poster_path
      ? `https://image.tmdb.org/t/p/w500${tv.poster_path}`
      : siteConfig.ogImageSmall;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [
          {
            url: imageUrl,
            width: 500,
            height: 750,
            alt: `Poster for ${tv.name}`,
          },
        ],
        type: "video.movie",
        siteName: siteConfig.name,
        url: `${siteConfig.url}/tv/${id}`,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [imageUrl],
        creator: `@${siteConfig.links.twitter.split("/").pop()}`,
      },
      authors: [
        { name: siteConfig.creator.name, url: siteConfig.creator.portfolio },
      ],
      keywords: [
        ...siteConfig.features,
        tv.name,
        ...tv.genres.map((genre) => genre.name),
      ],
      other: {
        "og:release_date": tv.first_air_date,
        "og:rating": tv.vote_average.toString(),
        "og:duration": `${tv.episode_run_time} minutes`,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: `Error | ${siteConfig.name}`,
      description: "An error occurred while fetching tv details.",
    };
  }
}

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
