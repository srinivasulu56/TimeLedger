import { useAuth } from "../../features/auth/context/AuthContext";
import { LogOut, User, Terminal } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="h-14 border-b border-slate-800 bg-[#0A0A0A] px-6 flex items-center justify-between sticky top-0 z-40 font-mono text-xs">
      {/* System Status Indicator */}
      <div className="flex items-center gap-2 text-slate-400">
        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span className="font-semibold text-slate-300 tracking-wider uppercase">
          [WORKSPACE_ACTIVE]
        </span>
      </div>

      {/* User Session Info & Controls */}
      <div className="flex items-center gap-3">
        {/* User Badge */}
        <div className="flex items-center gap-2 px-3 py-1 rounded border border-slate-800 bg-black text-slate-300">
          <User className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-bold tracking-tight">
            {user?.username || "OPERATOR"}
          </span>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="p-1.5 rounded border border-slate-800 bg-black text-slate-400 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10 transition-all"
          title="Disconnect Session"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}