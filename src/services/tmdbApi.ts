// services/tmdbApi.ts

const API_KEY = "daa8c89ea5a3b2f19e6cd81aacc2f71f";
const BASE_URL = "https://api.themoviedb.org/3";

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

export const fetchPopularMovies = async (): Promise<Movie[]> => {
  const response = await fetch(
    `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
  );
  const data = await response.json();
  return data.results;
};

export const fetchTopMovies = async (): Promise<Movie[]> => {
  const response = await fetch(
    `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`
  );
  const data = await response.json();
  return data.results;
};

export const fetchNowPlaying = async (): Promise<Movie[]> => {
  const response = await fetch(
    `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`
  );
  const data = await response.json();
  return data.results;
};

export const fetchUpcomingMovies = async (): Promise<Movie[]> => {
  const response = await fetch(
    `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1`
  );
  const data = await response.json();
  return data.results;
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

export const getImageUrl = (path: string, size: string = "w500"): string => {
  return `https://image.tmdb.org/t/p/${size}${path}`;
};
