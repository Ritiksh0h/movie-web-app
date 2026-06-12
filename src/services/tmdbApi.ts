import {
  Movie,
  MovieResponse,
  TvResponse,
  SearchType,
  ExternalSource,
  MultiSearchResult,
  IdSearchResult,
  MovieDetailsProps,
  genres,
  TvShowDetailsProps,
} from "@/app/types";

const SERVER_BASE_URL = "https://api.themoviedb.org/3";

async function tmdbFetch<T>(
  path: string,
  params: Record<string, string> = {}
): Promise<T> {
  let url: string;

  if (typeof window === "undefined") {
    // Server-side: call TMDB directly with the secret key
    const API_KEY = process.env.TMDB_API_KEY;
    const urlObj = new URL(`${SERVER_BASE_URL}${path}`);
    urlObj.searchParams.set("api_key", API_KEY!);
    urlObj.searchParams.set("language", "en-US");
    for (const [k, v] of Object.entries(params)) urlObj.searchParams.set(k, v);
    url = urlObj.toString();
  } else {
    // Client-side: proxy through our secure API route
    const urlObj = new URL("/api/tmdb", window.location.origin);
    urlObj.searchParams.set("path", path);
    for (const [k, v] of Object.entries(params)) urlObj.searchParams.set(k, v);
    url = urlObj.toString();
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB fetch failed: ${res.status}`);
  return res.json();
}

export const fetchPopular = async (
  media_type: "movie" | "tv",
  page: number = 1
): Promise<MovieResponse | TvResponse | null> => {
  try {
    return await tmdbFetch(`/${media_type}/popular`, { page: String(page) });
  } catch (error) {
    console.error("Error fetching popular:", error);
    return null;
  }
};

export const fetchTop = async (
  media_type: "movie" | "tv",
  page: number = 1
): Promise<MovieResponse | TvResponse | null> => {
  try {
    return await tmdbFetch(`/${media_type}/top_rated`, { page: String(page) });
  } catch (error) {
    console.error("Error fetching top-rated:", error);
    return null;
  }
};

export const fetchTrending = async (
  time_window: "day" | "week" = "day",
  media_type: "movie" | "tv",
  page: number = 1
): Promise<MovieResponse | TvResponse | null> => {
  try {
    return await tmdbFetch(`/trending/${media_type}/${time_window}`, {
      page: String(page),
    });
  } catch (error) {
    console.error("Error fetching trending:", error);
    return null;
  }
};

export const fetchNowPlayingMovies = async (
  page: number = 1
): Promise<MovieResponse | null> => {
  try {
    return await tmdbFetch("/movie/now_playing", { page: String(page) });
  } catch (error) {
    console.error("Error fetching now playing movies:", error);
    return null;
  }
};

export const fetchUpcomingMovies = async (
  page: number = 1
): Promise<MovieResponse | null> => {
  try {
    return await tmdbFetch("/movie/upcoming", { page: String(page) });
  } catch (error) {
    console.error("Error fetching upcoming movies:", error);
    return null;
  }
};

export const fetchOnAirTv = async (
  page: number = 1
): Promise<TvResponse | null> => {
  try {
    return await tmdbFetch("/tv/on_the_air", { page: String(page) });
  } catch (error) {
    console.error("Error fetching on-air TV shows:", error);
    return null;
  }
};

export const fetchDetails = async (
  movieId: number,
  media_type: "movie" | "tv"
): Promise<Movie | null> => {
  try {
    return await tmdbFetch(`/${media_type}/${movieId}`);
  } catch (error) {
    console.error(`Error fetching ${media_type} details:`, error);
    return null;
  }
};

export const fetchMediaTrailer = async (
  mediaId: number,
  mediaType: "movie" | "tv"
): Promise<string | null> => {
  try {
    const data = await tmdbFetch<{ results: { type: string; key: string }[] }>(
      `/${mediaType}/${mediaId}/videos`
    );
    const trailer = data.results.find((v) => v.type === "Trailer");
    return trailer ? `https://www.youtube.com/embed/${trailer.key}` : null;
  } catch (error) {
    console.error(`Error fetching ${mediaType} trailer:`, error);
    return null;
  }
};

export const fetchById = async (
  id: number,
  media_type: "movie" | "tv"
): Promise<MovieDetailsProps | TvShowDetailsProps | null> => {
  try {
    return await tmdbFetch(`/${media_type}/${id}`, {
      append_to_response: "videos,images",
    });
  } catch (error) {
    console.error(`Error fetching ${media_type} by ID:${id}`, error);
    return null;
  }
};

export const fetchRecommendations = async (
  id: number,
  media_type: "movie" | "tv",
  page: number = 1
): Promise<MovieResponse | TvResponse | null> => {
  try {
    return await tmdbFetch(`/${media_type}/${id}/recommendations`, {
      page: String(page),
    });
  } catch (error) {
    console.error(`Error fetching ${media_type} recommendations:`, error);
    return null;
  }
};

export const fetchSimilar = async (
  id: number,
  media_type: "movie" | "tv",
  page: number = 1
): Promise<MovieResponse | TvResponse | null> => {
  try {
    return await tmdbFetch(`/${media_type}/${id}/similar`, {
      page: String(page),
    });
  } catch (error) {
    console.error(`Error fetching similar ${media_type}s:`, error);
    return null;
  }
};

export const fetchByGenre = async (
  media_type: "movie" | "tv",
  genreId: string,
  page: number = 1
): Promise<MovieResponse | TvResponse | null> => {
  try {
    return await tmdbFetch(`/discover/${media_type}`, {
      with_genres: genreId,
      page: String(page),
    });
  } catch (error) {
    console.error(`Error fetching ${media_type} by genre:`, error);
    return null;
  }
};

export const searchTMDB = async (
  query: string,
  searchType: SearchType = "multi"
): Promise<MultiSearchResult | IdSearchResult | null> => {
  try {
    if (searchType === "id") {
      const [externalSource, externalId] = query.split(":") as [
        ExternalSource,
        string
      ];
      return await tmdbFetch(`/find/${externalId}`, {
        external_source: externalSource,
      });
    } else {
      return await tmdbFetch("/search/multi", {
        query,
        include_adult: "false",
        page: "1",
      });
    }
  } catch (error) {
    console.error("Error searching TMDB:", error);
    return null;
  }
};

export const getImageUrl = (path: string, size: string = "w500"): string => {
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

export function getGenreNames(genreIds: number[]): string[] {
  if (!Array.isArray(genreIds)) return ["Unknown"];
  return genreIds.map((id) => {
    const genre = genres.find((g) => g.id === id);
    return genre ? genre.name : "Unknown";
  });
}
