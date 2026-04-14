import { useMemo } from "react";
import HeroBanner from "@/components/HeroBanner";
import MovieRow from "@/components/MovieRow";

const ROWS = [
  { title: "Trending Now", params: { sort: "numVotes.desc", limit: 20 } },
  { title: "Top Rated", params: { sort: "averageRating.desc", limit: 20 } },
  { title: "Action Movies", params: { genre: "Action", titleType: "movie", limit: 20 } },
  { title: "Comedy", params: { genre: "Comedy", titleType: "movie", limit: 20 } },
  { title: "Drama Series", params: { genre: "Drama", titleType: "tvSeries", limit: 20 } },
  { title: "Sci-Fi", params: { genre: "Sci-Fi", limit: 20 } },
  { title: "Thriller", params: { genre: "Thriller", titleType: "movie", limit: 20 } },
  { title: "Horror", params: { genre: "Horror", limit: 20 } },
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
