// services/tmdbApi.ts

const API_KEY = "daa8c89ea5a3b2f19e6cd81aacc2f71f";
const BASE_URL = "https://api.themoviedb.org/3";

// const options = {
//   method: "GET",
//   headers: {
//     accept: "application/json",
//     Authorization:
//       "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYWE4Yzg5ZWE1YTNiMmYxOWU2Y2Q4MWFhY2MyZjcxZiIsIm5iZiI6MTcyODk5NjA1MS45MjQ5NjMsInN1YiI6IjYyMGNlMDQyZDk0MDM1MDA2YTY1YjFiYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ydm3tV91UIFr4210QACupbj1xtHwVg8hO4G5hocF6Iw",
//   },
// };

const genres = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Sci-Fi" },
  { id: 10770, name: "TV Movie" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
];

export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  overview: string;
  genre_ids: number[];
}

export interface Tv {
  adult: false;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  first_air_date: string;
  name: string;
  vote_average: number;
  vote_count: number;
}

interface MovieResponse {
  results: Movie[];
  total_pages: number;
  page: number;
}

interface TvResponse {
  results: Tv[];
  total_pages: number;
  page: number;
}

export const fetchPopularMovies = async (
  page: number = 1
): Promise<MovieResponse> => {
  const response = await fetch(
    `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`
  );
  return await response.json();
};

export const fetchTopMovies = async (
  page: number = 1
): Promise<MovieResponse> => {
  const response = await fetch(
    `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=${page}`
  );
  return await response.json();
};

export const fetchTrendingMovies = async (
  time_window: "day" | "week" = "day",
  page: number = 1
): Promise<MovieResponse> => {
  const response = await fetch(
    `${BASE_URL}/trending/movie/${time_window}?api_key=${API_KEY}&language=en-US&page=${page}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch trending movies");
  }

  return await response.json();
};

export const fetchNowPlayingMovies = async (
  page: number = 1
): Promise<MovieResponse> => {
  const response = await fetch(
    `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=${page}`
  );
  return await response.json();
};

export const fetchUpcomingMovies = async (
  page: number = 1
): Promise<MovieResponse> => {
  const response = await fetch(
    `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=en-US&page=${page}`
  );
  return await response.json();
};

export const fetchPopularTv = async (page: number = 1): Promise<TvResponse> => {
  const response = await fetch(
    `${BASE_URL}/tv/popular?api_key=${API_KEY}&language=en-US&page=${page}`
  );
  return await response.json();
};

export const fetchTopTv = async (page: number = 1): Promise<TvResponse> => {
  const response = await fetch(
    `${BASE_URL}/tv/top_rated?api_key=${API_KEY}&language=en-US&page=${page}`
  );
  return await response.json();
};
export const fetchOnAirTv = async (page: number = 1): Promise<TvResponse> => {
  const response = await fetch(
    `${BASE_URL}/tv/on_the_air?api_key=${API_KEY}&language=en-US&page=${page}`
  );
  return await response.json();
};

export const fetchTrendingTv = async (
  time_window: "day" | "week" = "day",
  page: number = 1
): Promise<TvResponse> => {
  const response = await fetch(
    `${BASE_URL}/trending/tv/${time_window}?api_key=${API_KEY}&language=en-US&page=${page}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch trending movies");
  }

  return await response.json();
};

export const fetchMovieDetails = async (movieId: number): Promise<Movie> => {
  const response = await fetch(
    `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`
  );
  return await response.json();
};

export const fetchMovieTrailer = async (
  movieId: number
): Promise<string | null> => {
  const response = await fetch(
    `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`
  );
  const data = await response.json();
  const trailer = data.results.find((video: any) => video.type === "Trailer");
  return trailer ? `https://www.youtube.com/embed/${trailer.key}` : null;
};
export const fetchTvShowTrailer = async (
  movieId: number
): Promise<string | null> => {
  const response = await fetch(
    `${BASE_URL}/tv/${movieId}/videos?api_key=${API_KEY}&language=en-US`
  );
  const data = await response.json();
  const trailer = data.results.find((video: any) => video.type === "Trailer");
  return trailer ? `https://www.youtube.com/embed/${trailer.key}` : null;
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
      throw new Error(`HTTP error! status: ${response.status}`);
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
