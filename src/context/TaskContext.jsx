import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch task plans when user logs in
  useEffect(() => {
    if (user) {
      fetchTasks();
    } else {
      setTasks([]);
    }
  }, [user]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await api.get('/tasks/plans/');
      setTasks(response.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

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
      // Refresh task plans to fetch updated nested pause logs
      fetchTasks();
    } catch (err) {
      console.error("Error logging pause:", err);
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        fetchTasks,
        createTaskPlan,
        createTask: createTaskPlan, // Alias for component compatibility
        addTask: createTaskPlan,    // Alias for component compatibility
        deleteTaskPlan,
        deleteTask: deleteTaskPlan, // Alias for component compatibility
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