import { useState, useEffect } from "react";
import { Play, Plus, Info } from "lucide-react";
import { listTitles, type Title } from "@/services/api";
import { useApp } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import SkeletonBanner from "./SkeletonBanner";

export default function HeroBanner() {
  const [featured, setFeatured] = useState<Title | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToWatchlist, isInWatchlist } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await listTitles({ sortBy: "SORT_BY_POPULARITY", minVoteCount: 100000 });
        if (!cancelled && data.titles?.length) {
          const withImage = data.titles.filter(r => r.primaryImage?.url);
          setFeatured(withImage[Math.floor(Math.random() * Math.min(5, withImage.length))]);
        }
      } catch (e) { console.error(e); }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <SkeletonBanner />;
  if (!featured) return null;

  const imageUrl = featured.primaryImage?.url;
  const rating = featured.rating?.aggregateRating;

  return (
    <div className="relative h-[70vh] md:h-[85vh] w-full overflow-hidden">
      {imageUrl && (
        <img src={imageUrl} alt={featured.primaryTitle} className="absolute inset-0 w-full h-full object-cover" />
      )}
      <div className="absolute inset-0 netflix-gradient-banner" />
      <div className="absolute inset-0 netflix-gradient-bottom" />

      <div className="absolute bottom-[15%] left-4 md:left-12 max-w-lg z-10 animate-slide-up">
        <h1 className="text-3xl md:text-5xl font-extrabold text-foreground mb-3 drop-shadow-lg">
          {featured.primaryTitle}
        </h1>
        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
          {rating && <span className="text-primary font-semibold">★ {rating}</span>}
          {featured.startYear && <span>{featured.startYear}</span>}
          {featured.genres?.slice(0, 3).map(g => <span key={g} className="bg-secondary/60 px-2 py-0.5 rounded text-xs">{g}</span>)}
        </div>
        {featured.plot && (
          <p className="text-sm text-secondary-foreground/80 line-clamp-3 mb-5">{featured.plot}</p>
        )}
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/title/${featured.id}`)}
            className="flex items-center gap-2 bg-foreground text-background px-5 py-2.5 rounded font-semibold text-sm hover:bg-foreground/90 transition-colors"
          >
            <Play size={16} fill="currentColor" /> Play
          </button>
          <button
            onClick={() => addToWatchlist(featured)}
            className="flex items-center gap-2 bg-secondary/60 backdrop-blur text-foreground px-5 py-2.5 rounded font-semibold text-sm hover:bg-secondary/80 transition-colors"
          >
            {isInWatchlist(featured.id) ? <Info size={16} /> : <Plus size={16} />}
            {isInWatchlist(featured.id) ? "More Info" : "My List"}
          </button>
        </div>
      </div>
    </div>
  );
}
