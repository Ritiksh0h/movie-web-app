// services/tmdbApi.ts
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
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;

export const fetchPopular = async (
  media_type: "movie" | "tv",
  page: number = 1
): Promise<MovieResponse | TvResponse | null> => {
  try {
    const response = await fetch(
      `${BASE_URL}/${media_type}/popular?api_key=${API_KEY}&language=en-US&page=${page}`
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch popular ${media_type}s, status: ${response.status}`
      );
    }

    return await response.json();
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
    const response = await fetch(
      `${BASE_URL}/${media_type}/top_rated?api_key=${API_KEY}&language=en-US&page=${page}`
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch top-rated ${media_type}s, status: ${response.status}`
      );
    }

    return await response.json();
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
    const response = await fetch(
      `${BASE_URL}/trending/${media_type}/${time_window}?api_key=${API_KEY}&language=en-US&page=${page}`
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch trending ${media_type}s, status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching trending:", error);
    return null;
  }
};

export const fetchNowPlayingMovies = async (
  page: number = 1
): Promise<MovieResponse | null> => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=${page}`
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch now playing movies, status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching now playing movies:", error);
    return null;
  }
};

export const fetchUpcomingMovies = async (
  page: number = 1
): Promise<MovieResponse | null> => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=en-US&page=${page}`
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch upcoming movies, status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching upcoming movies:", error);
    return null;
  }
};

export const fetchOnAirTv = async (
  page: number = 1
): Promise<TvResponse | null> => {
  try {
    const response = await fetch(
      `${BASE_URL}/tv/on_the_air?api_key=${API_KEY}&language=en-US&page=${page}`
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch on-air TV shows, status: ${response.status}`
      );
    }

    return await response.json();
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
    const response = await fetch(
      `${BASE_URL}/${media_type}/${movieId}?api_key=${API_KEY}&language=en-US`
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch ${media_type} details, status: ${response.status}`
      );
    }

    return await response.json();
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
    const response = await fetch(
      `${BASE_URL}/${mediaType}/${mediaId}/videos?api_key=${API_KEY}&language=en-US`
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch ${mediaType} trailer, status: ${response.status}`
      );
    }

    const data = await response.json();
    const trailer = data.results.find(
      (video: { type: string }) => video.type === "Trailer"
    );

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
    const response = await fetch(
      `${BASE_URL}/${media_type}/${id}?api_key=${API_KEY}&append_to_response=videos%2Cimages&language=en-US`
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch ${media_type} by ID, status: ${response.status}`
      );
    }

    // console.log(await response.json());

    return await response.json();
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
    const response = await fetch(
      `${BASE_URL}/${media_type}/${id}/recommendations?api_key=${API_KEY}&language=en-US&page=${page}`
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch ${media_type} recommendations, status: ${response.status}`
      );
    }

    return await response.json();
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
    const response = await fetch(
      `${BASE_URL}/${media_type}/${id}/similar?api_key=${API_KEY}&language=en-US&page=${page}`
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch similar ${media_type}s, status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching similar ${media_type}s:`, error);
    return null;
  }
};

export const searchTMDB = async (
  query: string,
  searchType: SearchType = "multi"
): Promise<MultiSearchResult | IdSearchResult | null> => {
  try {
    let endpoint: string;
    let params: Record<string, string>;

    if (searchType === "id") {
      const [externalSource, externalId] = query.split(":") as [
        ExternalSource,
        string
      ];
      endpoint = `${BASE_URL}/find/${externalId}`;
      params = {
        api_key: API_KEY!,
        external_source: externalSource,
        language: "en-US",
      };
    } else {
      endpoint = `${BASE_URL}/search/multi`;
      params = {
        api_key: API_KEY!,
        query,
        include_adult: "false",
        language: "en-US",
        page: "1",
      };
    }

    const url = new URL(endpoint);
    url.search = new URLSearchParams(params).toString();

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Failed to search TMDB, status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error searching TMDB:", error);
    return null;
  }
};

export const getImageUrl = (path: string, size: string = "w500"): string => {
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

export function getGenreNames(genreIds: number[]): string[] {
  // Ensure genreIds is an array
  if (!Array.isArray(genreIds)) {
    return ["Unknown"]; // Or handle it differently, e.g., return an empty array.
  }
  return genreIds.map((id) => {
    const genre = genres.find((g) => g.id === id);
    return genre ? genre.name : "Unknown";
  });
}
