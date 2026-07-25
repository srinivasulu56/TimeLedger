import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ListTodo,
  ShieldCheck,
  Activity,
  LogOut,
  ChevronUp,
  User,
  Terminal,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTasks } from "../../context/TaskContext";

export default function Sidebar() {
  const authContext = useAuth();
  const taskContext = useTasks();
  const navigate = useNavigate();

  const user = authContext?.user;
  const logout = authContext?.logout;
  const tasks = taskContext?.tasks || [];

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const username = user?.username || user?.email?.split("@")[0] || "Operator";

  // Close user dropdown menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { name: "DASHBOARD", path: "/dashboard", icon: LayoutDashboard },
    { name: "TASK_PLANS", path: "/dashboard/tasks", icon: ListTodo },
  ];

  return (
    <>
      {/* 📱 Mobile Top Header Bar (Only visible on screens < md) */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#070A0D] border-b border-slate-800 font-mono sticky top-0 z-30 w-full">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Terminal className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-100 uppercase tracking-widest">
            FOCUS_SYS
          </span>
        </div>

        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 rounded border border-slate-800 bg-black text-slate-300 hover:text-cyan-400 cursor-pointer"
        >
          {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* 📱 Mobile Backdrop Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* 🖥️ Responsive Sidebar Drawer */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen bg-[#070A0D] border-r border-slate-800/80 font-mono flex flex-col justify-between p-4 z-50 transition-all duration-300 ease-in-out ${
          isMobileOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0"
        } ${isCollapsed ? "md:w-20" : "md:w-64"}`}
      >
        {/* Upper Brand Header & Nav Links */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-1 py-1">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="p-1.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shrink-0">
                <Terminal className="w-5 h-5" />
              </div>
              <div className={`whitespace-nowrap ${isCollapsed ? "md:hidden" : "block"}`}>
                <h1 className="text-xs font-bold text-slate-100 uppercase tracking-widest leading-none">
                  FOCUS_SYS
                </h1>
                <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider">
                  v2.4.0 • ONLINE
                </span>
              </div>
            </div>

            {/* Collapse toggle (Desktop only) */}
            <button
              onClick={() => {
                setIsCollapsed(!isCollapsed);
                setIsUserMenuOpen(false);
              }}
              className="hidden md:block p-1.5 rounded text-slate-500 hover:text-cyan-400 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all cursor-pointer"
            >
              {isCollapsed ? <PanelLeftOpen className="w-4 h-4 text-cyan-400" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/dashboard"}
                  onClick={() => setIsMobileOpen(false)} // Auto-close drawer on navigation tap
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-bold transition-all ${
                      isActive
                        ? "bg-cyan-500/10 border border-cyan-500/40 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent"
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0 text-cyan-400/80" />
                  <span className={`whitespace-nowrap tracking-wide ${isCollapsed ? "md:hidden" : "block"}`}>
                    {item.name}
                  </span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Lower User Dropup Section */}
        <div className="relative" ref={userMenuRef}>
          <AnimatePresence>
            {isUserMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className={`absolute bottom-full mb-3 rounded-lg border border-slate-800 bg-[#0A0A0A] p-3 shadow-2xl space-y-3 z-50 text-xs w-full left-0 ${
                  isCollapsed ? "md:w-56" : "md:w-full"
                }`}
              >
                <div className="border-b border-slate-800/80 pb-2.5">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">
                    <span>IDENTITY</span>
                    <span className="text-emerald-400 flex items-center gap-1 text-[9px]">
                      <ShieldCheck className="w-3 h-3" /> VERIFIED
                    </span>
                  </div>
                  <p className="font-bold text-slate-100 truncate">{username}</p>
                  <p className="text-[10px] text-slate-500 truncate mt-0.5">
                    {user?.email || "operator@system.local"}
                  </p>
                </div>

                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-cyan-400" /> Active Plans
                  </span>
                  <span className="font-bold text-slate-100 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-[10px]">
                    {safeTasks.length}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    if (logout) logout();
                    navigate("/login");
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded border border-red-500/30 bg-red-500/10 py-2 text-xs font-bold text-red-400 hover:bg-red-500/20 hover:border-red-500/50 transition-all cursor-pointer uppercase"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>TERMINATE_SESSION</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className={`w-full flex items-center justify-between p-2.5 rounded-lg border transition-all cursor-pointer ${
              isUserMenuOpen
                ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                : "bg-[#0A0A0A] border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-900/60"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative flex items-center justify-center p-1.5 rounded bg-slate-900 border border-slate-800 shrink-0">
                <User className="w-4 h-4 text-cyan-400" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border-2 border-[#070A0D] animate-pulse" />
              </div>

              <div className={`text-left min-w-0 ${isCollapsed ? "md:hidden" : "block"}`}>
                <p className="text-xs font-bold text-slate-100 truncate leading-tight">
                  {username}
                </p>
                <p className="text-[10px] text-slate-500 font-semibold truncate mt-0.5">
                  OPERATOR
                </p>
              </div>
            </div>

            <ChevronUp
              className={`w-4 h-4 text-slate-500 transition-transform duration-200 shrink-0 ${
                isUserMenuOpen ? "rotate-180 text-cyan-400" : ""
              } ${isCollapsed ? "md:hidden" : "block"}`}
            />
          </button>
        </div>
      </aside>
    </>
  );
}