import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { searchTitles, type Title } from "@/services/api";
import { useApp } from "@/context/AppContext";

export default function SearchBar({ onClose }: { onClose?: () => void }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Title[]>([]);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const navigate = useNavigate();
  const { setLastSearch } = useApp();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const doSearch = useCallback(async (q: string) => {
    if (q.length < 2) { setSuggestions([]); return; }
    setLoading(true);
    try {
      const data = await searchTitles(q);
      setSuggestions((data.results || []).slice(0, 8));
    } catch { setSuggestions([]); }
    setLoading(false);
  }, []);

  useEffect(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => doSearch(query), 500);
    return () => clearTimeout(timeoutRef.current);
  }, [query, doSearch]);

  const handleSelect = (title: Title) => {
    setLastSearch(query);
    navigate(`/title/${title.id}`);
    onClose?.();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setLastSearch(query);
      navigate(`/search?q=${encodeURIComponent(query)}`);
      onClose?.();
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search titles..."
          className="bg-secondary/80 border border-border rounded px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground w-48 md:w-64 focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </form>
      {(suggestions.length > 0 || loading) && (
        <div className="absolute top-full mt-1 left-0 right-0 bg-card border border-border rounded shadow-lg z-50 max-h-80 overflow-auto">
          {loading && <div className="px-3 py-2 text-sm text-muted-foreground">Searching...</div>}
          {suggestions.map(s => (
            <button
              key={s.id}
              onClick={() => handleSelect(s)}
              className="w-full flex items-center gap-3 px-3 py-2 hover:bg-accent transition-colors text-left"
            >
              {s.primaryImage && (
                <img src={s.primaryImage} alt="" className="w-8 h-12 object-cover rounded" loading="lazy" />
              )}
              <div>
                <div className="text-sm font-medium text-foreground">{s.primaryTitle}</div>
                <div className="text-xs text-muted-foreground">{s.startYear} · {s.titleType}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
