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

  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const username = user?.username || user?.email?.split("@")[0] || "Operator";

  // Close user dropup on click outside
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
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Task Plans", path: "/dashboard/tasks", icon: ListTodo },
  ];

  return (
    <>
      {/* 📱 Clean Top Header Bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between bg-[#070A0D]/90 backdrop-blur-md px-4 py-3 border-b border-slate-800/80 font-mono">
        <div className="flex items-center gap-3">
          {/* Circular Hamburger Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-cyan-400 transition-all border border-slate-800 cursor-pointer"
            aria-label="Open Navigation"
          >
            <Menu className="w-4 h-4" />
          </button>

          {/* App Title with Custom Logo */}
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
            <img
              src="/favicon.ico"
              alt="Time-Ledger Logo"
              className="w-5 h-5 object-contain rounded"
            />
            <span className="tracking-widest uppercase">Time-Ledger</span>
            <span className="text-[10px] text-slate-500 font-normal">v2.4</span>
          </div>
        </div>
      </header>

      {/* 📱 Slide-Over Gemini-Style Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm"
            />

            {/* Rounded Floating Drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-72 bg-[#0A0A0A] text-slate-200 rounded-r-2xl border-r border-slate-800 shadow-2xl flex flex-col justify-between p-4 font-mono select-none"
            >
              {/* Drawer Top Header */}
              <div className="space-y-6">
                <div className="flex items-center justify-between px-2 pt-1">
                  <div className="flex items-center gap-2.5">
                    <img
                      src="/favicon.ico"
                      alt="Time-Ledger Logo"
                      className="w-6 h-6 object-contain rounded"
                    />
                    <span className="font-bold text-sm tracking-widest text-slate-100 uppercase">
                      Time-Ledger
                    </span>
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-900 hover:text-slate-100 transition-all cursor-pointer border border-transparent hover:border-slate-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Primary Navigation Options */}
                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === "/dashboard"}
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                            isActive
                              ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm"
                              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent"
                          }`
                        }
                      >
                        <Icon className="w-4 h-4 text-cyan-400" />
                        <span>{item.name}</span>
                      </NavLink>
                    );
                  })}
                </nav>

                {/* Active Workspace Diagnostics */}
                <div className="pt-2 px-2 border-t border-slate-800/80">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                    RECORDS
                  </span>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
                    <span className="flex items-center gap-2">
                      <Activity className="w-3.5 h-3.5 text-emerald-400" /> Active Plans
                    </span>
                    <span className="font-bold text-slate-100 bg-slate-800 px-2 py-0.5 rounded-md text-[10px]">
                      {safeTasks.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom User Profile Section */}
              <div className="relative pt-3 border-t border-slate-800/80" ref={userMenuRef}>
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute bottom-full left-0 right-0 mb-3 rounded-xl border border-slate-800 bg-[#070A0D] p-3 shadow-2xl space-y-3 z-50 text-xs"
                    >
                      <div className="border-b border-slate-800/80 pb-2">
                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase mb-1">
                          <span>OPERATOR</span>
                          <span className="text-emerald-400 flex items-center gap-1 text-[9px]">
                            <ShieldCheck className="w-3 h-3" /> VERIFIED
                          </span>
                        </div>
                        <p className="font-bold text-slate-100 truncate">{username}</p>
                        <p className="text-[10px] text-slate-500 truncate mt-0.5">
                          {user?.email || "operator@system.local"}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          setIsOpen(false);
                          if (logout) logout();
                          navigate("/login");
                        }}
                        className="w-full flex items-center justify-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 py-2 text-xs font-bold text-red-400 hover:bg-red-500/20 transition-all cursor-pointer uppercase"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>TERMINATE_SESSION</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* User Trigger Button */}
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:border-slate-700 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative flex items-center justify-center h-8 w-8 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0">
                      <User className="w-4 h-4" />
                      <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 border border-[#0A0A0A]" />
                    </div>

                    <div className="text-left min-w-0">
                      <p className="text-xs font-bold text-slate-100 truncate leading-tight">
                        {username}
                      </p>
                      <p className="text-[10px] text-slate-500 font-semibold truncate">
                        OPERATOR
                      </p>
                    </div>
                  </div>

                  <ChevronUp
                    className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                      isUserMenuOpen ? "rotate-180 text-cyan-400" : ""
                    }`}
                  />
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}