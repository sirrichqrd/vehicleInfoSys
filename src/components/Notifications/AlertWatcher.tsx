"use client";

import { useEffect, useRef } from "react";
import { useNotifications } from "@/components/context/NotificationContext";
import { Vehicle } from "@/types"; // your vehicle type

interface AlertWatcherProps {
  vehicles: Vehicle[];
  maintenanceAlerts?: { id: string; message: string }[];
  generalAlerts?: { id: string; message: string }[];
}

export function AlertWatcher({
  vehicles,
  maintenanceAlerts = [],
  generalAlerts = [],
}: AlertWatcherProps) {
  const { addAlert } = useNotifications();

  // Keep a set of already-added alert IDs to prevent duplicates
  const addedAlertsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const newAlerts: {
      id: string;
      type: "license" | "maintenance" | "general";
      title: string;
      description: string;
      message: string;
      date: string;
      priority?: "low" | "medium" | "high";
    }[] = [];

    // License alerts
    vehicles.forEach((vehicle) => {
      if (vehicle.licenseExpiryDate) {
        const daysLeft =
          (new Date(vehicle.licenseExpiryDate).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24);

        if (daysLeft <= 30) {
          const id = `license-${vehicle.id}`;
          if (!addedAlertsRef.current.has(id)) {
            newAlerts.push({
              id,
              type: "license",
              title: "License Expiry Alert",
              description: `The license for ${vehicle.plateNumber} expires in ${Math.ceil(
                daysLeft
              )} days`,
              message: `License for ${vehicle.plateNumber} expires in ${Math.ceil(
                daysLeft
              )} days`,
              date: new Date().toISOString(),
              priority: daysLeft <= 7 ? "high" : "medium",
            });
            addedAlertsRef.current.add(id);
          }
        }
      }
    });

    // Maintenance alerts
    maintenanceAlerts.forEach((alert) => {
      const id = `maintenance-${alert.id}`;
      if (!addedAlertsRef.current.has(id)) {
        newAlerts.push({
          id,
          type: "maintenance",
          title: "🔧 Maintenance Alert",
          description: alert.message,
          message: alert.message,
          date: new Date().toISOString(),
          priority: "medium",
        });
        addedAlertsRef.current.add(id);
      }
    });

    // General alerts
    generalAlerts.forEach((alert) => {
      const id = `general-${alert.id}`;
      if (!addedAlertsRef.current.has(id)) {
        newAlerts.push({
          id,
          type: "general",
          title: "📢 General Alert",
          description: alert.message,
          message: alert.message,
          date: new Date().toISOString(),
          priority: "low",
        });
        addedAlertsRef.current.add(id);
      }
    });

    // Push all new alerts into context
    newAlerts.forEach((alert) => addAlert(alert));
  }, [vehicles, maintenanceAlerts, generalAlerts, addAlert]);

  return null;
}
