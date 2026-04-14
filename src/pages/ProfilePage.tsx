import { useApp } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import MovieCard from "@/components/MovieCard";
import { User } from "lucide-react";

export default function ProfilePage() {
  const { user, watchlist, watchHistory, logout } = useApp();
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-16 px-4 md:px-12">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
          <User size={28} className="text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{user.name}</h1>
          <p className="text-sm text-muted-foreground">{user.isGuest ? "Guest Account" : user.email}</p>
        </div>
      </div>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-foreground mb-4">My Watchlist ({watchlist.length})</h2>
        {watchlist.length === 0 ? (
          <p className="text-muted-foreground text-sm">No items in your watchlist yet.</p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3">
            {watchlist.map((t, i) => <MovieCard key={t.id} title={t} index={i} />)}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-bold text-foreground mb-4">Watch History ({watchHistory.length})</h2>
        {watchHistory.length === 0 ? (
          <p className="text-muted-foreground text-sm">No watch history yet.</p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3">
            {watchHistory.map((t, i) => <MovieCard key={t.id} title={t} index={i} />)}
          </div>
        )}
      </section>
    </div>
  );
}
