export default function SkeletonBanner() {
  return (
    <div className="relative h-[70vh] md:h-[85vh] w-full bg-secondary animate-pulse">
      <div className="absolute bottom-[15%] left-4 md:left-12 space-y-4">
        <div className="h-10 w-72 bg-muted rounded" />
        <div className="h-4 w-48 bg-muted rounded" />
        <div className="h-16 w-96 bg-muted rounded" />
        <div className="flex gap-3">
          <div className="h-10 w-28 bg-muted rounded" />
          <div className="h-10 w-28 bg-muted rounded" />
        </div>
      </div>
    </div>
  );
}
