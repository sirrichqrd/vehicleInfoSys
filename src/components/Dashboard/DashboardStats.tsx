// DashboardStats.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Car, DollarSign } from 'lucide-react';
import { Driver, Vehicle, DriverLog } from '../../types';
import { LicenseAlerts } from '../../components/License/LicenseAlerts';
import { getLicenseAlerts } from '../../utils/licenseAlerts';


// ✅ Import your AlertWatcher
import { AlertWatcher } from '@/components/Notifications/AlertWatcher';

interface DashboardStatsProps {
  drivers: Driver[];
  vehicles: Vehicle[];
  logs: DriverLog[];
}

export function DashboardStats({ drivers, vehicles, logs }: DashboardStatsProps) {
  const activeDrivers = drivers.filter((d) => d.status === 'active').length;
  const assignedVehicles = vehicles.filter((v) => v.status === 'assigned').length;

  const totalRemittance = logs
    .filter((l) => l.type === 'remittance' && l.status === 'paid')
    .reduce((sum, l) => sum + (l.amount || 0), 0);

  const totalExpenses = logs
    .filter((l) => l.type === 'expense')
    .reduce((sum, l) => sum + (l.amount || 0), 0);

  const licenseAlerts = getLicenseAlerts(vehicles);

  const stats = [
    {
      title: 'Active Drivers',
      value: activeDrivers,
      total: drivers.length,
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Assigned Vehicles',
      value: assignedVehicles,
      total: vehicles.length,
      icon: Car,
      color: 'text-purple-600',
    },
    {
      title: 'Total Remittances',
      value: `$${totalRemittance.toLocaleString()}`,
      total: null,
      sublabel: 'This month',
      icon: DollarSign,
      color: 'text-green-600',
    },
    {
      title: 'Total Expenses',
      value: `$${totalExpenses.toLocaleString()}`,
      total: null,
      icon: DollarSign,
      color: 'text-red-600',
    },
  ];

  return (
    <div className="space-y-8">
      {/* 🔔 Global Notification Watcher */}
      <AlertWatcher vehicles={vehicles} />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                {stat.total !== null && (
                  <p className="text-xs text-muted-foreground">
                    out of {stat.total} total
                  </p>
                )}
                {stat.sublabel && (
                  <p className="text-xs text-muted-foreground mt-1">{stat.sublabel}</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* License Alerts in Card */}
      <Card>
        <CardHeader>
          <CardTitle>License Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <LicenseAlerts alerts={licenseAlerts} />
        </CardContent>
      </Card>
    </div>
  );
}
