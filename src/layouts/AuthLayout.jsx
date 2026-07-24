import { Outlet } from "react-router-dom";
import { Terminal, Activity } from "lucide-react";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-[#050505] bg-grid-pattern text-slate-200 flex flex-col items-center justify-center p-4 font-mono selection:bg-emerald-500 selection:text-black">
      {/* Brand Header */}
      <div className="flex items-center gap-2.5 mb-6">
        <div className="h-8 w-8 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <Terminal className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-bold text-base tracking-widest text-slate-100 uppercase">
            TIMELEDGER
          </h1>
          <p className="text-[10px] text-emerald-500 font-semibold tracking-widest uppercase flex items-center gap-1">
            <Activity className="w-3 h-3 animate-pulse" /> [AUTH_GATEWAY_ONLINE]
          </p>
        </div>
      </div>

      {/* Main Form Container */}
      <main className="w-full max-w-md rounded-lg border border-slate-800 bg-[#0A0A0A] p-6 shadow-2xl relative">
        <Outlet />
      </main>

      {/* Footer System Note */}
      <p className="text-[10px] text-slate-600 mt-6 tracking-wider uppercase">
        // SECURE_TERMINAL_SESSION • ENCRYPTED_AUTH
      </p>
    </div>
  );
}