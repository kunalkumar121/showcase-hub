import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Plus, Check } from "lucide-react";
import { type Title } from "@/services/api";
import { useApp } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";

interface Props {
  title: Title;
  index?: number;
}

export default function MovieCard({ title, index = 0 }: Props) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist, addToHistory } = useApp();
  const navigate = useNavigate();
  const inList = isInWatchlist(title.id);
  const imageUrl = title.primaryImage?.url;
  const rating = title.rating?.aggregateRating;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { rootMargin: "200px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleClick = () => {
    addToHistory(title);
    navigate(`/title/${title.id}`);
  };

  const toggleWatchlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    inList ? removeFromWatchlist(title.id) : addToWatchlist(title);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
      onClick={handleClick}
      className="flex-shrink-0 w-[140px] md:w-[180px] cursor-pointer group"
    >
      <div className="relative aspect-[2/3] rounded-md overflow-hidden bg-secondary">
        {visible && imageUrl ? (
          <img
            src={imageUrl}
            alt={title.primaryTitle}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
            {title.primaryTitle?.[0]}
          </div>
        )}
        <div className="absolute inset-0 bg-background/0 group-hover:bg-background/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Play size={32} className="text-foreground drop-shadow-lg" fill="currentColor" />
        </div>
        <button
          onClick={toggleWatchlist}
          className="absolute top-2 right-2 bg-background/60 backdrop-blur rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background/80"
        >
          {inList ? <Check size={14} className="text-primary" /> : <Plus size={14} className="text-foreground" />}
        </button>
      </div>
      <div className="mt-2 px-0.5">
        <p className="text-xs font-medium text-foreground truncate">{title.primaryTitle}</p>
        <p className="text-[10px] text-muted-foreground">
          {title.startYear}{rating ? ` · ★${rating}` : ""}
        </p>
      </div>
    </motion.div>
  );
}
