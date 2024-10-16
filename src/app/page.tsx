import { UpcomingMovies } from "@/components/UpcomingMovies";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { Footer } from "@/components/Footer";
import { MovieGridSection } from "@/components/MovieGridSection";
import {
  fetchNowPlaying,
  fetchPopularMovies,
  fetchTopMovies,
  fetchUpcomingMovies,
} from "@/services/tmdbApi";

// const API_KEY = "daa8c89ea5a3b2f19e6cd81aacc2f71f";
// const BASE_URL = "https://api.themoviedb.org/3";
// const options = {
//   method: "GET",
//   headers: {
//     accept: "application/json",
//     Authorization:
//       "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYWE4Yzg5ZWE1YTNiMmYxOWU2Y2Q4MWFhY2MyZjcxZiIsIm5iZiI6MTcyODk5NjA1MS45MjQ5NjMsInN1YiI6IjYyMGNlMDQyZDk0MDM1MDA2YTY1YjFiYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ydm3tV91UIFr4210QACupbj1xtHwVg8hO4G5hocF6Iw",
//   },
// };

export default async function Page() {
  const popularMovies = await fetchPopularMovies();
  const topMovies = await fetchTopMovies();
  const upcomingMovies = await fetchUpcomingMovies();
  const nowPlayingMovies = await fetchNowPlaying() 

  return (
    <div className="">
      <Navbar />
      <main className="flex-1">
        <HeroSection movies={nowPlayingMovies} />
        <MovieGridSection title="Popular movies" movies={popularMovies} />
        <MovieGridSection title="Top Rated movies" movies={topMovies} />
        <UpcomingMovies movies={upcomingMovies} />
      </main>
      <Footer />
    </div>
  );
}
