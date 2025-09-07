"use client";

import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/components/context/NotificationContext";

export default function NotificationDropdown() {
  // Fetch alerts from context
  const { alerts: contextAlerts, clearAlerts } = useNotifications();

  // Local state for read/unread tracking
  const [notifications, setNotifications] = useState(
    contextAlerts.map((a) => ({ ...a, read: false }))
  );

  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Unread count
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Mark individual notification as read
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const getNotificationColor = (priority?: "low" | "medium" | "high") => {
    switch (priority) {
        case "high": return "text-red-600 bg-red-50";
        case "medium": return "text-yellow-600 bg-yellow-50";
        case "low": return "text-blue-600 bg-blue-50";
        default: return "text-gray-600 bg-gray-50";
    }
  };


  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync context alerts if they change
  useEffect(() => {
    setNotifications(contextAlerts.map((a) => ({ ...a, read: false })));
  }, [contextAlerts]);

  return (
    <div className="relative" ref={notificationRef}>
      {/* 🔔 Bell */}
      <button
        className="relative p-2 text-gray-500 hover:text-gray-700"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {showNotifications && (
        <Card className="absolute right-0 top-full mt-2 w-80 rounded-xl shadow-lg z-50">
          <div className="flex items-center justify-between px-4 py-2 border-b">
            <h3 className="text-sm font-semibold">Notifications</h3>
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setNotifications([]);
                  clearAlerts(); // clear context alerts
                }}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Clear all
              </Button>
            )}
          </div>
          <CardContent className="max-h-96 overflow-y-auto p-0">
            {notifications.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-4 py-3 border-b cursor-pointer hover:bg-gray-50 ${
                    !notification.read ? "bg-blue-50" : ""
                  }`}
                  onClick={() => markNotificationAsRead(notification.id)}
                >
                 <div className="flex items-start space-x-3">
                    {/* Priority badge with Bell icon */}
                    <div className={`p-1 rounded-full ${getNotificationColor(notification.priority)}`}>
                        <Bell className="w-4 h-4" />
                    </div>

                    {/* Text content */}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{notification.title}</p>
                        <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                        {notification.date && new Date(notification.date).toLocaleString()}
                        </p>
                    </div>
                    </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
