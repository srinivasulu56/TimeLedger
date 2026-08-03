import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch task plans when user logs in
  const fetchTasks = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await api.get('/tasks/plans/');
      setTasks(response.data || []);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Initial fetch and Real-Time Tab Focus Re-Sync
  useEffect(() => {
    if (user) {
      fetchTasks();

      // Auto re-sync when operator switches back to this tab
      const handleVisibilityChange = () => {
        if (document.visibilityState === "visible") {
          fetchTasks();
        }
      };

      window.addEventListener("focus", fetchTasks);
      document.addEventListener("visibilitychange", handleVisibilityChange);

      return () => {
        window.removeEventListener("focus", fetchTasks);
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      };
    } else {
      setTasks([]);
    }
  }, [user, fetchTasks]);

  // Create a new task plan with subtask sessions
  const createTaskPlan = async (taskData) => {
    try {
      const response = await api.post('/tasks/plans/', taskData);
      setTasks((prev) => [response.data, ...prev]);
      return response.data;
    } catch (err) {
      console.error("Error creating task plan:", err);
      throw err;
    }
  };

  // Delete task plan
  const deleteTaskPlan = async (taskId) => {
    try {
      await api.delete(`/tasks/plans/${taskId}/`);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  // Update session status (e.g. 'Completed')
  const updateSessionStatus = async (sessionId, status, actualDuration = null) => {
    try {
      const response = await api.patch(`/tasks/sessions/${sessionId}/status/`, {
        status,
        actual_duration: actualDuration
      });

      // Update state locally
      setTasks((prevTasks) =>
        prevTasks.map((task) => ({
          ...task,
          sessions: (task.sessions || []).map((sess) =>
            sess.id === sessionId ? { ...sess, ...response.data } : sess
          ),
        }))
      );
    } catch (err) {
      console.error("Error updating session status:", err);
    }
  };

  // Log a pause interruption event
  const logSessionPause = async (sessionId, pauseData) => {
    try {
      await api.post(`/tasks/sessions/${sessionId}/pause/`, pauseData);
      fetchTasks();
    } catch (err) {
      console.error("Error logging pause:", err);
    }
  };

  // Flattened sessions array derived from tasks for easy component access
  const sessions = tasks.flatMap((t) => t.sessions || []);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        sessions,
        loading,
        fetchTasks,
        createTaskPlan,
        createTask: createTaskPlan,  // Alias
        addTaskPlan: createTaskPlan, // Alias
        addTask: createTaskPlan,     // Alias
        deleteTaskPlan,
        deleteTask: deleteTaskPlan,  // Alias
        updateSessionStatus,
        logSessionPause,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
};