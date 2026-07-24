import { createContext, useContext, useState, useEffect } from "react";

const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  // Initialize from localStorage for quick client-side persistence
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("timeledger_tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem("timeledger_sessions");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("timeledger_tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("timeledger_sessions", JSON.stringify(sessions));
  }, [sessions]);

  // Core Business Action: Add pre-built Task & Sessions directly
  const addTask = (newTask, newSessions) => {
    setTasks((prev) => [...prev, newTask]);
    setSessions((prev) => [...prev, ...newSessions]);
  };

  // Core Business Action: Delete Task & Associated Sessions
  const deleteTask = (taskId) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    setSessions((prev) => prev.filter((session) => session.taskId !== taskId));
  };

  // Core Business Action: Complete Session & Update Carry-forward
  const updateSessionStatus = (sessionId, status, actualMinutes = 0) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, status, actualDuration: actualMinutes } : s))
    );
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        sessions,
        addTask,
        deleteTask,
        updateSessionStatus,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

// Custom Hook for clean imports in pages
export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
}