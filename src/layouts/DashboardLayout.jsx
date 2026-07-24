import { Outlet } from "react-router-dom";
import Sidebar from "../shared/components/Sidebar";
import Navbar from "../shared/components/Navbar";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-[#050505] bg-grid-pattern text-slate-200 flex selection:bg-emerald-500 selection:text-black">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}