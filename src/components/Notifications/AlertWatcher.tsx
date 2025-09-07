"use client";

import { useEffect } from "react";
import { useNotifications } from "@/components/context/NotificationContext";
import { Vehicle } from "@/types"; // your vehicle type

interface AlertWatcherProps {
  vehicles: Vehicle[];
  maintenanceAlerts?: { id: string; message: string }[]; // optional maintenance alerts
  generalAlerts?: { id: string; message: string }[]; // optional general alerts
}

export function AlertWatcher({ vehicles, maintenanceAlerts = [], generalAlerts = [] }: AlertWatcherProps) {
  const { addAlert } = useNotifications();

  useEffect(() => {
    // License alerts
    vehicles.forEach((vehicle) => {
      if (vehicle.licenseExpiryDate) {
        const daysLeft =
          (new Date(vehicle.licenseExpiryDate).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24);

        if (daysLeft <= 30) {
          addAlert({
            id: `license-${vehicle.id}`,
            type: "license",
            title: `🚨 License Expiry Alert`,
            description: `The license for ${vehicle.plateNumber} expires in ${Math.ceil(daysLeft)} days`,
            message: `🚨 License for ${vehicle.plateNumber} expires in ${Math.ceil(daysLeft)} days`,
            date: new Date().toLocaleDateString(),
            priority: daysLeft <= 7 ? "high" : "medium",
          });
        }
      }
    });

    // Maintenance alerts
    maintenanceAlerts.forEach((alert) =>
      addAlert({
        id: alert.id,
        title: `🚨 Maintenance Alert`,
        description: alert.message,
        type: "maintenance",
        message: alert.message,
        date: new Date().toLocaleDateString(),
        priority: "medium",
      })
    );

    // General alerts
    generalAlerts.forEach((alert) =>
      addAlert({
        id: alert.id,
        title: `🚨 General Alert`,
        description: alert.message,
        type: "general",
        message: alert.message,
        date: new Date().toLocaleDateString(),
        priority: "low",
      })
    );
  }, [vehicles, maintenanceAlerts, generalAlerts]);
  
  return null;
}
