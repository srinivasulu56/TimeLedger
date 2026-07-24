import { createContext, useContext, useState, useEffect } from "react";

const TaskContext = createContext(null);

export function TaskProvider({ children }) {
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

  const addTask = (newTask, newSessions) => {
    setTasks((prev) => [...prev, newTask]);
    setSessions((prev) => [...prev, ...newSessions]);
  };

  const deleteTask = (taskId) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    setSessions((prev) => prev.filter((session) => session.taskId !== taskId));
  };

  const updateSessionStatus = (
    sessionId,
    status,
    actualMinutes = 0,
    pauseLogs = []
  ) => {
    setSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              status: status,
              actualDuration: actualMinutes,
              pauseLogs: pauseLogs,
            }
          : session
      )
    );
  };

  // 🚀 Core Engine: Create a Carry-Forward Session & Insert it Immediately Next
  const carryForwardSession = (
    completedSession,
    remainingMinutesNeeded,
    actualMinutesWorked,
    pauseLogs = []
  ) => {
    setSessions((prev) => {
      // 1. Mark the current session as completed
      const updatedPrev = prev.map((s) =>
        s.id === completedSession.id
          ? {
              ...s,
              status: "Completed (Incomplete Subtask)",
              actualDuration: actualMinutesWorked,
              pauseLogs,
            }
          : s
      );

      // 2. Create the carryover session immediately after the completed one
      const carryoverSession = {
        id: crypto.randomUUID(),
        taskId: completedSession.taskId,
        order: completedSession.order + 1,
        topic: `${completedSession.topic || "Subtask"} (Carryover)`,
        plannedDuration: Number(remainingMinutesNeeded),
        actualDuration: null,
        status: "planned",
        isCarryover: true,
      };

      // 3. Shift the order of all subsequent sessions for THIS task by +1
      const finalSessions = updatedPrev.map((session) => {
        if (
          session.taskId === completedSession.taskId &&
          session.order > completedSession.order
        ) {
          return { ...session, order: session.order + 1 };
        }
        return session;
      });

      // 4. Return combined list
      return [...finalSessions, carryoverSession];
    });
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        sessions,
        addTask,
        deleteTask,
        updateSessionStatus,
        carryForwardSession,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
}