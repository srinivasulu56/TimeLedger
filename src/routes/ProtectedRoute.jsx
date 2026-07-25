import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  // 1. Wait while AuthContext restores session from token on mount
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-cyan-400 font-mono text-xs uppercase tracking-widest">
        [INITIALIZING_OPERATOR_SESSION...]
      </div>
    );
  }

  // 2. If no authenticated user exists, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Render child layout and protected routes
  return <Outlet />;
}