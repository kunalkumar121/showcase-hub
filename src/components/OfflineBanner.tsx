import { WifiOff } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function OfflineBanner() {
  const { isOnline } = useApp();
  if (isOnline) return null;

  return (
    <div className="fixed top-14 left-0 right-0 z-50 bg-primary text-primary-foreground text-center py-2 text-sm font-medium animate-slide-up flex items-center justify-center gap-2">
      <WifiOff size={16} />
      You're offline. Showing cached content.
    </div>
  );
}
