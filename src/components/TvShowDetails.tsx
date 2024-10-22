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
  GlobeIcon,
  LanguagesIcon,
  PlayCircleIcon,
  StarIcon,
  TvIcon,
} from "lucide-react";
import { TvShowDetailsProps } from "@/app/types";
import { fetchRecommendations, fetchSimilar } from "@/services/tmdbApi";
import { MediaGridSection } from "./MediaGridSection";

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

async function TVShowDetails({ tv }: { tv: TvShowDetailsProps }) {
  const recommendations = await fetchRecommendations(tv.id, "tv");
  const similar = await fetchSimilar(tv.id, "tv");
  return (
    <div className="container mx-auto px-4 py-4 mt-10">
      <div className="relative mb-4 rounded-xl overflow-hidden">
        <Image
          src={`https://image.tmdb.org/t/p/original${tv.backdrop_path}`}
          alt={tv.name}
          width={1920}
          height={1080}
          className="w-full h-[50vh] object-cover"
        />
        <div className="absolute inset-0 bg-primary/20 flex items-end">
          <div className="p-6">
            <h1 className="text-4xl font-bold mb-2 text-primary-foreground">
              {tv.name}
            </h1>
            <p className="text-xl text-primary-foreground/80 italic">
              {tv.tagline}
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
              <p>{tv.overview}</p>
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
                  <span>First Air Date: {formatDate(tv.first_air_date)}</span>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="w-5 h-5 mr-2" />
                  <span>Episode Runtime: {tv.episode_run_time[0]} minutes</span>
                </div>
                <div className="flex items-center">
                  <StarIcon className="w-5 h-5 mr-2" />
                  <span>
                    Rating: {tv.vote_average.toFixed(1)} ({tv.vote_count} votes)
                  </span>
                </div>
                <div className="flex items-center">
                  <LanguagesIcon className="w-5 h-5 mr-2" />
                  <span>
                    Language:{" "}
                    {tv.spoken_languages
                      .map((lang) => lang.english_name)
                      .join(", ")}
                  </span>
                </div>
                <div className="flex items-center">
                  <TvIcon className="w-5 h-5 mr-2" />
                  <span>Seasons: {tv.number_of_seasons}</span>
                </div>
                <div className="flex items-center">
                  <TvIcon className="w-5 h-5 mr-2" />
                  <span>Episodes: {tv.number_of_episodes}</span>
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
                  <h3 className="font-semibold mb-2">Created By</h3>
                  <div className="flex flex-wrap gap-2">
                    {tv.created_by.map((creator) => (
                      <Badge key={creator.id} variant="secondary">
                        {creator.name}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">Networks</h3>
                  <div className="flex flex-wrap gap-4">
                    {tv.networks.map((network) => (
                      <div key={network.id} className="text-center">
                        {network.logo_path ? (
                          <Image
                            src={`https://image.tmdb.org/t/p/w200${network.logo_path}`}
                            alt={network.name}
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
                        <p className="text-sm">{network.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">Production Companies</h3>
                  <div className="flex flex-wrap gap-4">
                    {tv.production_companies.map((company) => (
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
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Episodes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tv.last_episode_to_air && (
                  <div>
                    <h3 className="font-semibold mb-2">Last Episode Aired</h3>
                    <p>
                      S{tv.last_episode_to_air.season_number}E
                      {tv.last_episode_to_air.episode_number}:{" "}
                      {tv.last_episode_to_air.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(tv.last_episode_to_air.air_date)}
                    </p>
                    <p className="text-sm mt-2">
                      {tv.last_episode_to_air.overview}
                    </p>
                  </div>
                )}
                {tv.next_episode_to_air && (
                  <div>
                    <h3 className="font-semibold mb-2">Next Episode</h3>
                    <p>
                      S{tv.next_episode_to_air.season_number}E
                      {tv.next_episode_to_air.episode_number}:{" "}
                      {tv.next_episode_to_air.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(tv.next_episode_to_air.air_date)}
                    </p>
                    <p className="text-sm mt-2">
                      {tv.next_episode_to_air.overview}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Videos</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <Tabs defaultValue="all">
                  <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="trailer">Trailers</TabsTrigger>
                    <TabsTrigger value="teaser">Teasers</TabsTrigger>
                  </TabsList>
                  <TabsContent value="all">
                    <VideoGrid videos={tv.videos.results} />
                  </TabsContent>
                  <TabsContent value="trailer">
                    <VideoGrid
                      videos={tv.videos.results.filter(
                        (v) => v.type.toLowerCase() === "trailer"
                      )}
                    />
                  </TabsContent>
                  <TabsContent value="teaser">
                    <VideoGrid
                      videos={tv.videos.results.filter(
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
                src={`https://image.tmdb.org/t/p/w500${tv.poster_path}`}
                alt={tv.name}
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
                    <span>{tv.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Type</span>
                    <span>{tv.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Original Language</span>

                    <span>{tv.spoken_languages[0].name}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Genres</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tv.genres.map((genre) => (
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
              <a href={tv.homepage} target="_blank" rel="noopener noreferrer">
                <GlobeIcon className="w-4 h-4 mr-2" />
                Official Website
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
}

const VideoGrid: React.FC<{
  videos: TvShowDetailsProps["videos"]["results"];
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

export default TVShowDetails;
