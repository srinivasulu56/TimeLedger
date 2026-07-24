import { NavLink } from "react-router-dom";
import { LayoutDashboard, CheckSquare, Terminal, Activity } from "lucide-react";

const NAV_ITEMS = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { path: "/dashboard/tasks", label: "Focus Sequence", icon: CheckSquare },
];

export default function Sidebar() {
  return (
    <aside className="w-60 hidden md:flex flex-col border-r border-slate-800/80 bg-[#0A0A0A] p-4 justify-between font-mono">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-2.5 px-2 py-3 mb-6 border-b border-slate-800/60 pb-4">
          <div className="h-7 w-7 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-wider text-slate-100 uppercase">
              TIMELEDGER
            </h1>
            <p className="text-[9px] text-emerald-500 font-semibold tracking-widest uppercase">
              [SYSTEM_ACTIVE]
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-md text-xs transition-all ${
                  isActive
                    ? "bg-slate-800/80 text-emerald-400 font-semibold border-l-2 border-emerald-500"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer System Status */}
      <div className="rounded-md border border-slate-800 bg-black/60 p-3 text-[11px] space-y-1">
        <div className="flex items-center gap-2 text-slate-300">
          <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="font-semibold text-xs">Engine Online</span>
        </div>
        <p className="text-slate-500 text-[10px]">
          Adaptive focus & carryover logic operational.
        </p>
      </div>
    </aside>
  );
}