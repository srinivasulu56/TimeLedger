import { Outlet } from "react-router-dom";
import Sidebar from "../shared/components/Sidebar";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-[#090a0c] text-slate-200 flex flex-col font-mono">
      {/* Top Header + Slide-over Drawer */}
      <Sidebar />

      {/* Main Workspace Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}