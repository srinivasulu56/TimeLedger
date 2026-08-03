import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../services/api"; // Adjust to your API client import

const TaskContext = createContext();

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🎯 FETCH LATEST DATA FROM DJANGO
  const fetchTasks = useCallback(async () => {
    try {
      const response = await api.get("/tasks/plans/");
      const data = response.data || [];
      setTasks(data);

      // Extract all sessions into flattened array for real-time telemetry
      const allSessions = data.flatMap((plan) => plan.sessions || []);
      setSessions(allSessions);
    } catch (error) {
      console.error("Error fetching task plans:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 🎯 REAL-TIME SYNC ENGINE: Listen for Tab Focus & Visibility Events
  useEffect(() => {
    fetchTasks();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchTasks(); // Re-sync when user returns to tab
      }
    };

    window.addEventListener("focus", fetchTasks);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", fetchTasks);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchTasks]);

  const deleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/plans/${taskId}/`);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  const updateSessionStatus = async (sessionId, status, actualMinutes, pauseLogs) => {
    try {
      await api.patch(`/tasks/sessions/${sessionId}/`, {
        status,
        actual_duration: actualMinutes,
        pause_logs: pauseLogs,
      });
      fetchTasks(); // Re-fetch to sync calculations
    } catch (err) {
      console.error("Failed to update session:", err);
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        sessions,
        loading,
        fetchTasks,
        deleteTask,
        updateSessionStatus,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  return useContext(TaskContext);
}