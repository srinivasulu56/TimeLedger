import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Lock, User } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import PageTransition from "../../../shared/components/PageTransition";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState(""); 
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Authenticate with Django backend
      await login(identifier, password);

      // 2. Try navigating to '/' (or change to '/dashboard' if your route specifically uses that)
      navigate("/");
    } catch (err) {
      console.error("Login error details:", err);

      const djangoError =
        err.response?.data?.detail ||
        "Invalid operator credentials. Access denied.";

      setError(djangoError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div>
        <div className="mb-6">
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            [OPERATOR_LOGIN]
          </span>
          <h2 className="text-xl font-bold text-slate-100 uppercase tracking-tight mt-2">
            Authenticate Session
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Enter credentials to access workspace telemetry.
          </p>
        </div>

        {error && (
          <div className="mb-4 text-xs font-bold text-red-400 bg-red-500/10 p-2.5 rounded border border-red-500/30">
            ⚠️ AUTH_ERROR: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              OPERATOR_HANDLE
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-600 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="username"
                className="w-full rounded border border-slate-800 bg-black pl-9 pr-3 py-2.5 text-xs text-slate-100 placeholder-slate-600 outline-none focus:border-cyan-400 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              PASSPHRASE
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-600 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded border border-slate-800 bg-black pl-9 pr-3 py-2.5 text-xs text-slate-100 placeholder-slate-600 outline-none focus:border-cyan-400 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-1.5 rounded border border-cyan-500/40 bg-cyan-500/10 py-3 text-xs font-bold text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400 disabled:opacity-50 transition-all uppercase cursor-pointer"
          >
            {loading ? "AUTHENTICATING..." : "INITIALIZE_SESSION"}{" "}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-6 border-t border-slate-800/80 pt-4">
          NEW_OPERATOR?{" "}
          <Link to="/register" className="font-bold text-cyan-400 hover:underline">
            CREATE_ACCOUNT →
          </Link>
        </p>
      </div>
    </PageTransition>
  );
}