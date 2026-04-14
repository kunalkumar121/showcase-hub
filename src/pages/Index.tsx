import { useMemo } from "react";
import HeroBanner from "@/components/HeroBanner";
import MovieRow from "@/components/MovieRow";

const ROWS = [
  { title: "Trending Now", params: { sortBy: "SORT_BY_POPULARITY", minVoteCount: 50000 } },
  { title: "Top Rated", params: { sortBy: "SORT_BY_USER_RATING", minVoteCount: 100000 } },
  { title: "Action Movies", params: { genres: "Action", types: "MOVIE", minVoteCount: 10000 } },
  { title: "Comedy", params: { genres: "Comedy", types: "MOVIE", minVoteCount: 10000 } },
  { title: "Drama Series", params: { genres: "Drama", types: "TV_SERIES", minVoteCount: 10000 } },
  { title: "Sci-Fi", params: { genres: "Sci-Fi", minVoteCount: 10000 } },
  { title: "Thriller", params: { genres: "Thriller", types: "MOVIE", minVoteCount: 10000 } },
  { title: "Horror", params: { genres: "Horror", minVoteCount: 5000 } },
];

export default function Index() {
  const rows = useMemo(() => ROWS, []);

  return (
    <div className="min-h-screen bg-background">
      <HeroBanner />
      <div className="-mt-24 relative z-10 pb-16">
        {rows.map(row => (
          <MovieRow key={row.title} title={row.title} params={row.params} />
        ))}
      </div>
    </div>
  );
}
