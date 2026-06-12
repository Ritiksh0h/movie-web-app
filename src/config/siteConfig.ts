export const siteConfig = {
	name: "FlickScout",
	title: "Discover, Watch, and Explore the Best of Entertainment",
	url: `https://flickscout-ritikshah.vercel.app`,
	ogImage: `https://flickscout-ritikshah.vercel.app/flickscout-og.png`,
	ogImageSmall: `https://flickscout-ritikshah.vercel.app/flickscout-og-small.png`,
	description:
	  "FlickScout is your ultimate destination for movie and TV show trailers, recommendations, and in-depth entertainment exploration. Discover the latest trends, search for your favorites, and dive into a world of cinematic wonder.",
	creator: {
	  name: "Ritik Shah",
	  role: "Web Developer",
	  portfolio: "https://ritikshah.vercel.app",
	},
	features: [
	  "Movie and TV show trailers",
	  "Personalized recommendations",
	  "Advanced search capabilities",
	  "Detailed categorization",
	  "User ratings and reviews",
	  "Trending and popular content",
	],
	links: {
	  github: "https://github.com/FlickScout/flickscout",
	  issues: "https://github.com/FlickScout/flickscout/issues",
	  twitter: "https://twitter.com/FlickScout",
	  instagram: "https://instagram.com/FlickScout",
	  youtube: "https://youtube.com/FlickScout",
	},
	categories: {
	  movies: [
		"Trending",
		"Now Playing",
		"Popular",
		"Top Rated",
		"Upcoming",
		"New & Popular",
	  ],
	  tvShows: [
		"Trending",
		"On the Air",
		"Popular",
		"Top Rated",
		"New & Popular",
	  ],
	},
  };
  
  export type SiteConfig = typeof siteConfig;