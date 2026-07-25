import { Outlet } from "react-router-dom";
import Sidebar from "../shared/components/Sidebar";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-[#050505] bg-grid-pattern text-slate-200 flex flex-col md:flex-row selection:bg-emerald-500 selection:text-black">
      {/* Sidebar with top bar toggle for mobile */}
      <Sidebar />

      {/* Workspace Area with responsive padding */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}