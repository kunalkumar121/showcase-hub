import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { searchTitles, type Title } from "@/services/api";
import MovieCard from "@/components/MovieCard";

export default function SearchPage() {
  const [params] = useSearchParams();
  const query = params.get("q") || "";
  const [results, setResults] = useState<Title[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const data = await searchTitles(query);
        if (!cancelled) setResults(data.titles || []);
      } catch (e) { console.error(e); }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [query]);

  return (
    <div className="min-h-screen bg-background pt-20 pb-16 px-4 md:px-12">
      <h1 className="text-2xl font-bold text-foreground mb-2">Search results for "{query}"</h1>
      <p className="text-sm text-muted-foreground mb-8">{results.length} results found</p>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : results.length === 0 ? (
        <p className="text-muted-foreground text-center py-20">No results found. Try a different search.</p>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3">
          {results.map((t, i) => <MovieCard key={t.id} title={t} index={i} />)}
        </div>
      )}
    </div>
  );
}
