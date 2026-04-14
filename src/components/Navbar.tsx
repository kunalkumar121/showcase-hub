import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, User, X } from "lucide-react";
import nflixLogo from "@/assets/nflix-logo.png";
import { useApp } from "@/context/AppContext";
import SearchBar from "./SearchBar";

const NAV_ITEMS = [
  { label: "Home", path: "/" },
  { label: "Movies", path: "/movies" },
  { label: "TV Shows", path: "/tv-shows" },
  { label: "Video Games", path: "/games" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useApp();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/95 backdrop-blur-md shadow-lg" : "bg-gradient-to-b from-background/80 to-transparent"}`}>
      <div className="flex items-center justify-between px-4 md:px-12 py-3">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-primary font-extrabold text-2xl tracking-tight">NFLIX</Link>
          <div className="hidden md:flex items-center gap-6">
            {NAV_ITEMS.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-foreground ${location.pathname === item.path ? "text-foreground" : "text-muted-foreground"}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {searchOpen ? (
            <div className="flex items-center gap-2 animate-fade-in">
              <SearchBar onClose={() => setSearchOpen(false)} />
              <button onClick={() => setSearchOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X size={18} />
              </button>
            </div>
          ) : (
            <button onClick={() => setSearchOpen(true)} className="text-muted-foreground hover:text-foreground transition-colors">
              <Search size={20} />
            </button>
          )}

          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/profile" className="text-muted-foreground hover:text-foreground transition-colors">
                <User size={20} />
              </Link>
              <button onClick={logout} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
