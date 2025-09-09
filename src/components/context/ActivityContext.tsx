// src/components/context/ActivityContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Activity {
  id: string;
  message: string;
  type: "driver" | "vehicle" | "log" | "system" | "report" | "assignment" | "search";
  date: string;
}

interface ActivityContextType {
  activities: Activity[];  // recent (max 50, last 7 days)
  history: Activity[];     // full history (last 7 days)
  addActivity: (activity: Omit<Activity, "id" | "date">) => void;
  clearActivities: () => void;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export const ActivityProvider = ({ children }: { children: ReactNode }) => {
  const [history, setHistory] = useState<Activity[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("activityHistory");
    if (stored) {
      const parsed: Activity[] = JSON.parse(stored);
      setHistory(parsed);
    }
  }, []);

  // Save history whenever it changes
  useEffect(() => {
    localStorage.setItem("activityHistory", JSON.stringify(history));
    // keep activities as a trimmed + recent slice
    setActivities(history.slice(0, 50));
  }, [history]);

  // Auto-expire items older than 7 days
  useEffect(() => {
    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    setHistory((prev) =>
      prev.filter((a) => now - new Date(a.date).getTime() <= sevenDays)
    );
  }, []);

  const addActivity = (activity: Omit<Activity, "id" | "date">) => {
    setHistory((prev) => {
      const last = prev[0];
      if (last && last.message === activity.message) {
        return prev; // skip duplicate consecutive
      }
      const newActivity: Activity = {
        ...activity,
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
      };
      return [newActivity, ...prev];
    });
  };

  const clearActivities = () => {
    setHistory([]);
    setActivities([]);
    localStorage.removeItem("activityHistory");
  };

  return (
    <ActivityContext.Provider value={{ activities, history, addActivity, clearActivities }}>
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivity = () => {
  const context = useContext(ActivityContext);
  if (!context) throw new Error("useActivity must be used inside ActivityProvider");
  return context;
};
