import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Car, AlertTriangle, DollarSign } from 'lucide-react';
import { Driver, Vehicle, DriverLog } from '../../types';

interface DashboardStatsProps {
  drivers: Driver[];
  vehicles: Vehicle[];
  logs: DriverLog[];
}

export function DashboardStats({ drivers, vehicles, logs }: DashboardStatsProps) {
  const activeDrivers = drivers.filter(d => d.status === 'active').length;
  const assignedVehicles = vehicles.filter(v => v.status === 'assigned').length;
  const pendingRemittances = logs.filter(l => 
    l.type === 'remittance' && l.status === 'unpaid'
  ).length;
  const totalExpenses = logs
    .filter(l => l.type === 'expense')
    .reduce((sum, l) => sum + (l.amount || 0), 0);

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
      color: 'text-green-600',
    },
    {
      title: 'Pending Remittances',
      value: pendingRemittances,
      total: logs.filter(l => l.type === 'remittance').length,
      icon: AlertTriangle,
      color: 'text-orange-600',
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            {stat.total !== null && (
              <p className="text-xs text-muted-foreground">
                out of {stat.total} total
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}