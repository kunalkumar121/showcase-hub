import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Check, Play, Star } from "lucide-react";
import { getTitleById, type Title } from "@/services/api";
import { useApp } from "@/context/AppContext";

export default function TitleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState<Title | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist, addToHistory } = useApp();
  const navigate = useNavigate();
  const inList = id ? isInWatchlist(id) : false;

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const data = await getTitleById(id);
        if (!cancelled) {
          setTitle(data);
          addToHistory(data);
        }
      } catch (e) { console.error(e); }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [id, addToHistory]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!title) {
    return (
      <div className="min-h-screen bg-background pt-20 flex flex-col items-center justify-center text-muted-foreground">
        <p>Title not found</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-primary hover:underline">Go back</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-[50vh] md:h-[70vh]">
        {title.primaryImage && (
          <img src={title.primaryImage} alt={title.primaryTitle} className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 netflix-gradient-banner" />
        <div className="absolute inset-0 netflix-gradient-bottom" />

        <button
          onClick={() => navigate(-1)}
          className="absolute top-20 left-4 md:left-12 z-10 bg-background/40 backdrop-blur rounded-full p-2 hover:bg-background/60 transition-colors"
        >
          <ArrowLeft size={20} className="text-foreground" />
        </button>
      </div>

      <div className="relative z-10 -mt-32 px-4 md:px-12 pb-16 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-2">{title.primaryTitle}</h1>

        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
          {title.averageRating && (
            <span className="flex items-center gap-1 text-primary font-semibold">
              <Star size={14} fill="currentColor" /> {title.averageRating}
            </span>
          )}
          {title.numVotes && <span>{title.numVotes.toLocaleString()} votes</span>}
          {title.startYear && <span>{title.startYear}{title.endYear ? `-${title.endYear}` : ""}</span>}
          {title.runtimeMinutes && <span>{title.runtimeMinutes} min</span>}
          {title.contentRating && <span className="border border-border px-1.5 py-0.5 rounded text-xs">{title.contentRating}</span>}
        </div>

        {title.genres && (
          <div className="flex flex-wrap gap-2 mb-5">
            {title.genres.map(g => (
              <span key={g} className="bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full text-xs">{g}</span>
            ))}
          </div>
        )}

        {title.description && (
          <p className="text-secondary-foreground/80 text-sm leading-relaxed mb-6">{title.description}</p>
        )}

        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-foreground text-background px-6 py-2.5 rounded font-semibold text-sm hover:bg-foreground/90 transition-colors">
            <Play size={16} fill="currentColor" /> Play
          </button>
          <button
            onClick={() => inList ? removeFromWatchlist(title.id) : addToWatchlist(title)}
            className="flex items-center gap-2 bg-secondary text-secondary-foreground px-6 py-2.5 rounded font-semibold text-sm hover:bg-accent transition-colors"
          >
            {inList ? <Check size={16} /> : <Plus size={16} />}
            {inList ? "In Watchlist" : "Add to Watchlist"}
          </button>
        </div>
      </div>
    </div>
  );
}
