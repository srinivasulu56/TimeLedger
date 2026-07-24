import { Outlet } from "react-router-dom";
import Navbar from "../shared/components/Navbar";
import Sidebar from "../shared/components/Sidebar";
import { TaskProvider } from "../features/tasks/context/TaskContext";

function DashboardLayout() {
  return (
    <TaskProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            {/* Outlets no longer need manual context props */}
            <Outlet />
          </main>
        </div>
      </div>
    </TaskProvider>
  );
}

export default DashboardLayout;