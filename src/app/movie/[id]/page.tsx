import { MovieDetailsProps } from "@/app/types";
import MovieDetails from "@/components/MovieDetails";
import MediaNotFound from "@/components/media-not-found";
import MovieDetailsSkeleton from "@/components/movie-details-skeleton";
import { fetchById } from "@/services/tmdbApi";
import { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/siteConfig";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const id = params.id;
    const movie = (await fetchById(+id, "movie")) as MovieDetailsProps;

    if (!movie) {
      return {
        title: `Movie Not Found | ${siteConfig.name}`,
        description: "The requested movie could not be found.",
      };
    }

    const releaseYear = new Date(movie.release_date).getFullYear();
    const title = `${movie.title} (${releaseYear}) | ${siteConfig.name}`;
    const description = movie.overview || `Details about ${movie.title}`;
    const imageUrl = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
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
            alt: `Poster for ${movie.title}`,
          },
        ],
        type: "video.movie",
        siteName: siteConfig.name,
        url: `${siteConfig.url}/movie/${id}`,
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
        movie.title,
        ...movie.genres.map((genre) => genre.name),
      ],
      other: {
        "og:release_date": movie.release_date,
        "og:rating": movie.vote_average.toString(),
        "og:duration": `${movie.runtime} minutes`,
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: `Error | ${siteConfig.name}`,
      description: "An error occurred while fetching movie details.",
    };
  }
}

export default async function Page({ params }: Props) {
  try {
    const movie = await fetchById(+params.id, "movie");

    if (!movie) {
      return <MediaNotFound isMovie={true} />;
    }

    return (
      <Suspense fallback={<MovieDetailsSkeleton />}>
        <MovieDetails movie={movie as MovieDetailsProps} />
      </Suspense>
    );
  } catch (error) {
    console.error("Error fetching movie details:", error);
    notFound();
  }
}
