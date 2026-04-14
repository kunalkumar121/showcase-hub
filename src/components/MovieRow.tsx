import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { listTitles, type Title } from "@/services/api";
import MovieCard from "./MovieCard";
import SkeletonRow from "./SkeletonRow";

interface Props {
  title: string;
  params: {
    types?: string;
    genres?: string;
    sortBy?: string;
    sortOrder?: string;
    startYear?: number;
    minVoteCount?: number;
  };
  staticTitles?: Title[];
}

export default function MovieRow({ title, params, staticTitles }: Props) {
  const [titles, setTitles] = useState<Title[]>(staticTitles || []);
  const [loading, setLoading] = useState(!staticTitles);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (staticTitles) return;
    let cancelled = false;
    (async () => {
      try {
        const data = await listTitles(params);
        if (!cancelled) setTitles(data.titles || []);
      } catch (e) { console.error(e); }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [params, staticTitles]);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -600 : 600, behavior: "smooth" });
  };

  if (loading) return <SkeletonRow title={title} />;
  if (!titles.length) return null;

  return (
    <div className="mb-8 group/row">
      <h2 className="text-lg md:text-xl font-bold text-foreground mb-3 px-4 md:px-12">{title}</h2>
      <div className="relative">
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-0 bottom-8 z-10 w-10 bg-background/60 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity"
        >
          <ChevronLeft size={24} className="text-foreground" />
        </button>
        <div ref={scrollRef} className="flex gap-2 overflow-x-auto scrollbar-hide px-4 md:px-12">
          {titles.map((t, i) => <MovieCard key={t.id} title={t} index={i} />)}
        </div>
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-0 bottom-8 z-10 w-10 bg-background/60 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity"
        >
          <ChevronRight size={24} className="text-foreground" />
        </button>
      </div>
    </div>
  );
}
