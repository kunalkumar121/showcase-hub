import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import type { Title } from "@/services/api";

interface User {
  email: string;
  name: string;
  isGuest: boolean;
}

interface AppState {
  user: User | null;
  watchlist: Title[];
  watchHistory: Title[];
  isOnline: boolean;
  lastSearch: string;
}

interface AppContextType extends AppState {
  login: (email: string, name: string) => void;
  guestLogin: () => void;
  logout: () => void;
  addToWatchlist: (title: Title) => void;
  removeFromWatchlist: (id: string) => void;
  addToHistory: (title: Title) => void;
  isInWatchlist: (id: string) => boolean;
  setLastSearch: (q: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => loadFromStorage("nf_user", null));
  const [watchlist, setWatchlist] = useState<Title[]>(() => loadFromStorage("nf_watchlist", []));
  const [watchHistory, setWatchHistory] = useState<Title[]>(() => loadFromStorage("nf_history", []));
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSearch, setLastSearchState] = useState(() => loadFromStorage("nf_lastSearch", ""));

  useEffect(() => {
    const on = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);

  useEffect(() => { localStorage.setItem("nf_watchlist", JSON.stringify(watchlist)); }, [watchlist]);
  useEffect(() => { localStorage.setItem("nf_history", JSON.stringify(watchHistory)); }, [watchHistory]);
  useEffect(() => { localStorage.setItem("nf_user", JSON.stringify(user)); }, [user]);

  const login = useCallback((email: string, name: string) => setUser({ email, name, isGuest: false }), []);
  const guestLogin = useCallback(() => setUser({ email: "", name: "Guest", isGuest: true }), []);
  const logout = useCallback(() => { setUser(null); localStorage.removeItem("nf_user"); }, []);

  const addToWatchlist = useCallback((t: Title) => setWatchlist(prev => prev.some(x => x.id === t.id) ? prev : [t, ...prev]), []);
  const removeFromWatchlist = useCallback((id: string) => setWatchlist(prev => prev.filter(x => x.id !== id)), []);
  const addToHistory = useCallback((t: Title) => setWatchHistory(prev => {
    const filtered = prev.filter(x => x.id !== t.id);
    return [t, ...filtered].slice(0, 50);
  }), []);
  const isInWatchlist = useCallback((id: string) => watchlist.some(x => x.id === id), [watchlist]);
  const setLastSearch = useCallback((q: string) => { setLastSearchState(q); localStorage.setItem("nf_lastSearch", q); }, []);

  return (
    <AppContext.Provider value={{
      user, watchlist, watchHistory, isOnline, lastSearch,
      login, guestLogin, logout, addToWatchlist, removeFromWatchlist,
      addToHistory, isInWatchlist, setLastSearch,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
