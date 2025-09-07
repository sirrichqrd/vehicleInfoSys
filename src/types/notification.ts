// types/notification.ts
export type Notification = {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: "maintenance" | "license" | "remittance" | "general";
  priority: "low" | "medium" | "high";
  read: boolean;
};
