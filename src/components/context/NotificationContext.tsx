import { createContext, useContext, useState, ReactNode } from "react";

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
  addAlert: (alert: Notification) => void;
  clearAlerts: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [alerts, setAlerts] = useState<Notification[]>([]);

  const addAlert = (alert: Notification) => {
    setAlerts((prev) => [...prev, alert]);
  };

  const clearAlerts = () => setAlerts([]);

  return (
    <NotificationContext.Provider value={{ alerts, addAlert, clearAlerts }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotifications must be used inside NotificationProvider");
  return context;
};
