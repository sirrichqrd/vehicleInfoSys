// src/pages/HistoryPage.tsx
import { useState } from "react";
import { Sidebar } from "../../components/Layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

import { useActivity } from "@/components/context/ActivityContext";
import { useNotifications } from "@/components/context/NotificationContext";

export default function HistoryPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { history: activityHistory, clearActivities } = useActivity();
  const { alerts, clearAlerts } = useNotifications();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 p-6 space-y-6">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <CardTitle> Activity History</CardTitle>
              <button
                onClick={clearActivities}
                className="text-sm text-red-600 hover:underline"
              >
                Clear
              </button>
            </CardHeader>
            <CardContent>
              {activityHistory.length === 0 ? (
                <p className="text-muted-foreground text-sm">No past activities</p>
              ) : (
                <div className="space-y-4">
                  {activityHistory.map((a) => (
                    <div
                      key={a.id}
                      className="flex items-center justify-between border-b pb-2"
                    >
                      <div>
                        <p className="font-medium">{a.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(a.date), "PPpp")}
                        </p>
                      </div>
                      <Badge>{a.type}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex justify-between items-center">
              <CardTitle> Notification History</CardTitle>
              <button
                onClick={clearAlerts}
                className="text-sm text-red-600 hover:underline"
              >
                Clear
              </button>
            </CardHeader>
            <CardContent>
              {alerts.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No notifications stored
                </p>
              ) : (
                <div className="space-y-4">
                  {alerts.map((n) => (
                    <div
                      key={n.id}
                      className="flex items-center justify-between border-b pb-2"
                    >
                      <div>
                        <p className="font-medium">{n.title}</p>
                        <p className="text-xs">{n.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(n.date), "PPpp")}
                        </p>
                      </div>
                      <Badge
                        variant={
                          n.priority === "high"
                            ? "destructive"
                            : n.priority === "medium"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {n.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
