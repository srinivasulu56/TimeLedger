import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../shared/components/Navbar";
import Sidebar from "../shared/components/Sidebar";

function DashboardLayout() {
  const [tasks, setTasks] = useState([]);
  const [sessions, setSessions] = useState([]);

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6">
          <Outlet
            context={{
              tasks,
              setTasks,
              sessions,
              setSessions,
            }}
          />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;