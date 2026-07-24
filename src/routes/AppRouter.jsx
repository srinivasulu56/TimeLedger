import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../features/auth/context/AuthContext.jsx";
import { TaskProvider } from "../features/tasks/context/TaskContext.jsx";
import ProtectedRoute from "./ProtectedRoute";
import AuthLayout from "../layouts/AuthLayout";
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import DashboardLayout from "../layouts/DashboardLayout";
import TasksPage from "../features/tasks/pages/TasksPage";
import TaskDetailsPage from "../features/tasks/pages/TaskDetailsPage";

function AppRouter() {
  return (
    <AuthProvider>
      <TaskProvider>
        <Routes>
          {/* Public Auth Routes wrapped in AuthLayout */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Protected Dashboard Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="tasks" element={<TasksPage />} />
              <Route path="tasks/:taskId" element={<TaskDetailsPage />} />
            </Route>
          </Route>

          {/* Fallback Redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </TaskProvider>
    </AuthProvider>
  );
}

export default AppRouter;