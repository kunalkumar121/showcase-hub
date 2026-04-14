import { useState, useEffect, useCallback, useRef } from "react";
import { listTitles, type Title } from "@/services/api";
import MovieCard from "@/components/MovieCard";
import SkeletonRow from "@/components/SkeletonRow";

interface Props {
  titleType: string;
  pageTitle: string;
  genres: string[];
}

export default function CategoryPage({ titleType, pageTitle, genres }: Props) {
  const [titles, setTitles] = useState<Title[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState("");
  const loaderRef = useRef<HTMLDivElement>(null);

  const fetchTitles = useCallback(async (p: number, genre: string, append: boolean) => {
    setLoading(true);
    try {
      const data = await listTitles({
        titleType,
        genre: genre || undefined,
        sort: "numVotes.desc",
        page: p,
        limit: 30,
      });
      const results = data.results || [];
      setTitles(prev => append ? [...prev, ...results] : results);
      setHasMore(!!data.hasNextPage);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, [titleType]);

  useEffect(() => {
    setPage(1);
    fetchTitles(1, selectedGenre, false);
  }, [selectedGenre, fetchTitles]);

  useEffect(() => {
    const el = loaderRef.current;
    if (!el || !hasMore) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !loading) {
        const next = page + 1;
        setPage(next);
        fetchTitles(next, selectedGenre, true);
      }
    }, { rootMargin: "400px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, [page, loading, hasMore, selectedGenre, fetchTitles]);

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <div className="px-4 md:px-12">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">{pageTitle}</h1>
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedGenre("")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${!selectedGenre ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"}`}
          >
            All
          </button>
          {genres.map(g => (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${selectedGenre === g ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"}`}
            >
              {g}
            </button>
          ))}
        </div>
        {titles.length === 0 && loading ? (
          <SkeletonRow title="" />
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3">
            {titles.map((t, i) => <MovieCard key={t.id} title={t} index={i} />)}
          </div>
        )}
        <div ref={loaderRef} className="h-10" />
        {loading && titles.length > 0 && (
          <div className="text-center py-4 text-muted-foreground text-sm">Loading more...</div>
        )}
      </div>
    </div>
  );
}
