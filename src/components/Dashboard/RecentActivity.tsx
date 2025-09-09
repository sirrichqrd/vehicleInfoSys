// src/components/Dashboard/RecentActivity.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useActivity } from "@/components/context/ActivityContext";
import { formatDistanceToNow } from "date-fns";
import { DriverLog, Driver, Vehicle } from '../../types';


export function RecentActivity() {
  const { activities } = useActivity();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent activity</p>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{activity.message}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge>{activity.type}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.date), { addSuffix: true })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
