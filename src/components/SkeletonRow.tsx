export default function SkeletonRow({ title }: { title: string }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg md:text-xl font-bold text-foreground mb-3 px-4 md:px-12">{title}</h2>
      <div className="flex gap-2 px-4 md:px-12 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex-shrink-0 w-[140px] md:w-[180px]">
            <div className="aspect-[2/3] rounded-md bg-secondary animate-pulse" />
            <div className="mt-2 h-3 w-3/4 bg-secondary rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
