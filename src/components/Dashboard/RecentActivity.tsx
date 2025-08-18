import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DriverLog, Driver, Vehicle } from '../../types';
import { formatDistanceToNow } from 'date-fns';

interface RecentActivityProps {
  logs: DriverLog[];
  drivers: Driver[];
  vehicles: Vehicle[];
}

export function RecentActivity({ logs, drivers, vehicles }: RecentActivityProps) {
  const recentLogs = logs
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const getDriver = (id: string) => drivers.find(d => d.id === id);
  const getVehicle = (id: string) => vehicles.find(v => v.id === id);

  const getLogTypeColor = (type: string) => {
    switch (type) {
      case 'remittance': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-orange-100 text-orange-800';
      case 'expense': return 'bg-red-100 text-red-800';
      case 'incident': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentLogs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent activity</p>
          ) : (
            recentLogs.map((log) => {
              const driver = getDriver(log.driverId);
              const vehicle = getVehicle(log.vehicleId);
              
              return (
                <div key={log.id} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {driver?.name} - {vehicle?.plateNumber}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {log.description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getLogTypeColor(log.type)} variant="secondary">
                      {log.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(log.date), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}