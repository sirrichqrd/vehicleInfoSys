// src/components/context/NotificationContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Notification {
  id: string;
  type: "license" | "maintenance" | "remittance" | "general";
  title: string;
  description: string;
  message: string;
  date: string;
  read?: boolean;
  priority?: "low" | "medium" | "high"; 
}

interface NotificationContextType {
  alerts: Notification[];
  addAlert: (alert: Omit<Notification, "id" | "date">) => void;
  markAsRead: (id: string) => void;
  clearAlerts: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [alerts, setAlerts] = useState<Notification[]>([]);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("notifications");
    if (stored) {
      const parsed: Notification[] = JSON.parse(stored);
      setAlerts(parsed);
    }
  }, []);

  // Save to localStorage whenever alerts change
  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(alerts));
  }, [alerts]);

  // Expire notifications older than 7 days
  useEffect(() => {
    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    setAlerts((prev) =>
      prev.filter((n) => now - new Date(n.date).getTime() <= sevenDays)
    );
  }, []);

  const addAlert = (alert: Omit<Notification, "id" | "date">) => {
    setAlerts((prev) => {
      // ✅ Prevent duplicates: same type + title + message
      const exists = prev.some(
        (n) =>
          n.type === alert.type &&
          n.title === alert.title &&
          n.message === alert.message
      );
      if (exists) return prev;

      const newAlert: Notification = {
        ...alert,
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        read: false,
      };
      return [newAlert, ...prev];
    });
  };

  const markAsRead = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, read: true } : a))
    );
  };

  const clearAlerts = () => {
    setAlerts([]);
    localStorage.removeItem("notifications");
  };

  return (
    <NotificationContext.Provider value={{ alerts, addAlert, markAsRead, clearAlerts }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotifications must be used inside NotificationProvider");
  return context;
};
