import React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CalendarIcon,
  ClockIcon,
  DollarSignIcon,
  GlobeIcon,
  LanguagesIcon,
  PlayCircleIcon,
  StarIcon,
} from "lucide-react";
import { MovieDetailsProps } from "@/app/types";
import { MediaGridSection } from "./MediaGridSection";
import { fetchRecommendations, fetchSimilar } from "../services/tmdbApi";

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const MovieDetails: React.FC<MovieDetailsProps> = async ({ movie }) => {
  const recommendations = await fetchRecommendations(movie.id, "movie");
  const similar = await fetchSimilar(movie.id, "movie");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="container mx-auto px-4 py-4 mt-10">
      <div className="relative mb-4 rounded-xl overflow-hidden">
        <Image
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          width={1920}
          height={1080}
          className="w-full h-[50vh] object-cover"
        />
        <div className="absolute inset-0 bg-primary/20 flex items-end">
          <div className="p-6">
            <h1 className="text-4xl font-bold mb-2 text-primary-foreground">
              {movie.title}
            </h1>
            <p className="text-xl text-primary-foreground/80 italic">
              {movie.tagline}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{movie.overview}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <CalendarIcon className="w-5 h-5 mr-2" />
                  <span>Release Date: {formatDate(movie.release_date)}</span>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="w-5 h-5 mr-2" />
                  <span>Runtime: {movie.runtime} minutes</span>
                </div>
                <div className="flex items-center">
                  <StarIcon className="w-5 h-5 mr-2" />
                  <span>
                    Rating: {movie.vote_average.toFixed(1)} ({movie.vote_count}{" "}
                    votes)
                  </span>
                </div>
                <div className="flex items-center">
                  <LanguagesIcon className="w-5 h-5 mr-2" />
                  <span>
                    Language:{" "}
                    {movie.spoken_languages
                      .map((lang) => lang.english_name)
                      .join(", ")}
                  </span>
                </div>
                <div className="flex items-center">
                  <DollarSignIcon className="w-5 h-5 mr-2" />
                  <span>Budget: {formatCurrency(movie.budget)}</span>
                </div>
                <div className="flex items-center">
                  <DollarSignIcon className="w-5 h-5 mr-2" />
                  <span>Revenue: {formatCurrency(movie.revenue)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Production</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Production Companies</h3>
                  <div className="flex flex-wrap gap-4">
                    {movie.production_companies.map((company) => (
                      <div key={company.id} className="text-center">
                        {company.logo_path ? (
                          <Image
                            src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                            alt={company.name}
                            width={100}
                            height={50}
                            className="object-contain mb-2"
                          />
                        ) : (
                          <div className="w-[100px] h-[50px] bg-muted flex items-center justify-center mb-2">
                            <span className="text-xs text-muted-foreground">
                              No logo
                            </span>
                          </div>
                        )}
                        <p className="text-sm">{company.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">Production Countries</h3>
                  <div className="flex flex-wrap gap-2">
                    {movie.production_countries.map((country) => (
                      <Badge key={country.iso_3166_1} variant="secondary">
                        {country.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Videos</CardTitle>
            </CardHeader>
            <CardContent className="">
              <ScrollArea className="h-[400px]">
                <Tabs defaultValue="all">
                  <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="trailer">Trailers</TabsTrigger>
                    <TabsTrigger value="teaser">Teasers</TabsTrigger>
                  </TabsList>
                  <TabsContent value="all">
                    <VideoGrid videos={movie.videos.results} />
                  </TabsContent>
                  <TabsContent value="trailer">
                    <VideoGrid
                      videos={movie.videos.results.filter(
                        (v) => v.type.toLowerCase() === "trailer"
                      )}
                    />
                  </TabsContent>
                  <TabsContent value="teaser">
                    <VideoGrid
                      videos={movie.videos.results.filter(
                        (v) => v.type.toLowerCase() === "teaser"
                      )}
                    />
                  </TabsContent>
                </Tabs>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                width={500}
                height={750}
                className="w-full h-auto rounded-lg"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Info</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-semibold">Status</span>
                    <span>{movie.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Original Title</span>
                    <span>{movie.original_title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Original Language</span>
                    <span>{movie.original_language}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Popularity</span>
                    <span>{movie.popularity.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Genres</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {movie.genres.map((genre) => (
                        <Badge key={genre.id} variant="outline">
                          {genre.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-4">
            <Button asChild variant="default">
              <a
                href={movie.homepage}
                target="_blank"
                rel="noopener noreferrer"
              >
                <GlobeIcon className="w-4 h-4 mr-2" />
                Official Website
              </a>
            </Button>
            <Button asChild variant="secondary">
              <a
                href={`https://www.imdb.com/title/${movie.imdb_id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                IMDB
              </a>
            </Button>
          </div>
        </div>
      </div>
      <div className="space-y-4 mt-4">
        <Separator />
        {similar !== null && (
          <MediaGridSection
            title="Similar"
            media={similar.results}
            contentMediaType={false}
            mediaType="tv"
          />
        )}
        {recommendations !== null && (
          <MediaGridSection
            title="Recommended"
            media={recommendations.results}
            contentMediaType={true}
            mediaType="tv"
          />
        )}
      </div>
    </div>
  );
};

const VideoGrid: React.FC<{
  videos: MovieDetailsProps["movie"]["videos"]["results"];
}> = ({ videos }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {videos.map((video) => (
      <Card key={video.id} className="overflow-hidden">
        <div className="aspect-video relative">
          <Image
            src={`https://img.youtube.com/vi/${video.key}/maxresdefault.jpg`}
            alt={video.name}
            layout="fill"
            objectFit="cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              asChild
              variant="secondary"
              size="icon"
              className="rounded-full"
            >
              <a
                href={`https://www.youtube.com/watch?v=${video.key}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <PlayCircleIcon className="w-12 h-12" />
                <span className="sr-only">Play {video.name}</span>
              </a>
            </Button>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold line-clamp-1">{video.name}</h3>
          <p className="text-sm text-muted-foreground">
            {formatDate(video.published_at)}
          </p>
        </CardContent>
      </Card>
    ))}
  </div>
);

export default MovieDetails;
