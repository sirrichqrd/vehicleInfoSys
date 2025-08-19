import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2, Plus, Filter } from 'lucide-react';
import { DriverLog, Driver, Vehicle } from '../../types';
import { LogForm } from './LogForm';

interface LogListProps {
  logs: DriverLog[];
  drivers: Driver[];
  vehicles: Vehicle[];
  onAddLog: (log: Omit<DriverLog, 'id'>) => void;
  onUpdateLog: (id: string, updates: Partial<DriverLog>) => void;
  onDeleteLog: (id: string) => void;
}

export function LogList({ 
  logs, 
  drivers, 
  vehicles, 
  onAddLog, 
  onUpdateLog, 
  onDeleteLog 
}: LogListProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingLog, setEditingLog] = useState<DriverLog | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterDriver, setFilterDriver] = useState<string>('all');

  const filteredLogs = logs.filter(log => {
    const typeMatch = filterType === 'all' || log.type === filterType;
    const driverMatch = filterDriver === 'all' || log.driverId === filterDriver;
    return typeMatch && driverMatch;
  });

  const handleEdit = (log: DriverLog) => {
    setEditingLog(log);
    setShowForm(true);
  };

  const handleSubmit = (logData: Omit<DriverLog, 'id'>) => {
    if (editingLog) {
      onUpdateLog(editingLog.id, logData);
    } else {
      onAddLog(logData);
    }
    setShowForm(false);
    setEditingLog(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingLog(null);
  };

  const getDriverName = (driverId: string) => {
    const driver = drivers.find(d => d.id === driverId);
    return driver ? driver.name : 'Unknown Driver';
  };

  const getVehicleInfo = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.plateNumber} - ${vehicle.make} ${vehicle.model}` : 'Unknown Vehicle';
  };

  const getLogTypeColor = (type: string) => {
    switch (type) {
      case 'remittance': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-orange-100 text-orange-800';
      case 'expense': return 'bg-red-100 text-red-800';
      case 'incident': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status?: string) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'unpaid': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (showForm) {
    return (
      <LogForm
        drivers={drivers}
        vehicles={vehicles}
        log={editingLog || undefined}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Driver Logs</h2>
          <p className="text-muted-foreground">Track remittance, maintenance, expenses, and incidents</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Log Entry
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Log Type</label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="remittance">Remittance</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="incident">Incident</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Driver</label>
              <Select value={filterDriver} onValueChange={setFilterDriver}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Drivers</SelectItem>
                  {drivers.map((driver) => (
                    <SelectItem key={driver.id} value={driver.id}>
                      {driver.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Log Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {['remittance', 'maintenance', 'expense', 'incident'].map(type => {
          const count = logs.filter(log => log.type === type).length;
          return (
            <Card key={type}>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-sm text-muted-foreground capitalize">{type} Logs</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Log Entries ({filteredLogs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredLogs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No log entries found</p>
              <Button onClick={() => setShowForm(true)} className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Add First Log Entry
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{log.date}</TableCell>
                      <TableCell>
                        <Badge className={getLogTypeColor(log.type)} variant="secondary">
                          {log.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{getDriverName(log.driverId)}</TableCell>
                      <TableCell>{getVehicleInfo(log.vehicleId)}</TableCell>
                      <TableCell className="max-w-xs truncate">{log.description}</TableCell>
                      <TableCell>
                        {log.amount ? `$${log.amount.toLocaleString()}` : '-'}
                      </TableCell>
                      <TableCell>
                        {log.status && (
                          <Badge className={getStatusColor(log.status)} variant="secondary">
                            {log.status}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(log)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDeleteLog(log.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}