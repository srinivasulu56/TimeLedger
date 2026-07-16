import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="w-64 border-r min-h-screen p-5">
      <nav className="flex flex-col gap-3">
        <NavLink to="/dashboard">Dashboard</NavLink>

        <NavLink to="/dashboard/tasks">Tasks</NavLink>

        <NavLink to="/dashboard/timer">Timer</NavLink>

        <NavLink to="/dashboard/analytics">Analytics</NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;