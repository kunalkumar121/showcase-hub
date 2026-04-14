import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const { login, guestLogin, user } = useApp();
  const navigate = useNavigate();

  if (user) { navigate("/"); return null; }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    login(email, name || email.split("@")[0]);
    navigate("/");
  };

  const handleGuest = () => {
    guestLogin();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-card rounded-lg p-8 shadow-lg border border-border animate-scale-in">
        <h1 className="text-2xl font-bold text-foreground mb-1 text-center">
          {isSignup ? "Sign Up" : "Sign In"}
        </h1>
        <p className="text-sm text-muted-foreground text-center mb-6">
          {isSignup ? "Create your account" : "Welcome back"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Name"
              className="w-full bg-secondary border border-border rounded px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          )}
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full bg-secondary border border-border rounded px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full bg-secondary border border-border rounded px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-2.5 rounded font-semibold text-sm hover:bg-primary/90 transition-colors"
          >
            {isSignup ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <div className="my-4 flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <button
          onClick={handleGuest}
          className="w-full bg-secondary text-secondary-foreground py-2.5 rounded font-semibold text-sm hover:bg-accent transition-colors"
        >
          Continue as Guest
        </button>

        <p className="text-xs text-muted-foreground text-center mt-4">
          {isSignup ? "Already have an account?" : "New here?"}{" "}
          <button onClick={() => setIsSignup(!isSignup)} className="text-primary hover:underline">
            {isSignup ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}
