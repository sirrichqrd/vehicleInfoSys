import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DriverLog, Driver, Vehicle } from '../../types';

interface LogFormProps {
  drivers: Driver[];
  vehicles: Vehicle[];
  log?: DriverLog;
  onSubmit: (log: Omit<DriverLog, 'id'>) => void;
  onCancel: () => void;
}

function LogForm({ drivers, vehicles, log, onSubmit, onCancel }: LogFormProps) {
  const [formData, setFormData] = useState({
    driverId: log?.driverId || '',
    vehicleId: log?.vehicleId || '',
    type: log?.type || 'expense' as const,
    date: log?.date || new Date().toISOString().split('T')[0],
    description: log?.description || '',
    amount: log?.amount || 0,
    status: log?.status || 'unpaid',
    // Type-specific fields
    weekOf: log?.type === 'remittance' ? (log as any).weekOf || '' : '',
    maintenanceType: log?.type === 'maintenance' ? (log as any).maintenanceType || '' : '',
    serviceProvider: log?.type === 'maintenance' ? (log as any).serviceProvider || '' : '',
    category: log?.type === 'expense' ? (log as any).category || '' : '',
    severity: log?.type === 'incident' ? (log as any).severity || 'minor' : 'minor',
    location: log?.type === 'incident' ? (log as any).location || '' : '',
    reportedTo: log?.type === 'incident' ? (log as any).reportedTo || '' : '',
  });

  const activeDrivers = drivers.filter(d => d.status === 'active');
  const assignedVehicles = vehicles.filter(v => v.status === 'assigned');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let logData: any = {
      driverId: formData.driverId,
      vehicleId: formData.vehicleId,
      type: formData.type,
      date: formData.date,
      description: formData.description,
    };

    // Add type-specific fields
    switch (formData.type) {
      case 'remittance':
        logData = {
          ...logData,
          amount: formData.amount,
          status: formData.status,
          weekOf: formData.weekOf,
        };
        break;
      case 'maintenance':
        logData = {
          ...logData,
          amount: formData.amount,
          maintenanceType: formData.maintenanceType,
          serviceProvider: formData.serviceProvider,
        };
        break;
      case 'expense':
        logData = {
          ...logData,
          amount: formData.amount,
          category: formData.category,
        };
        break;
      case 'incident':
        logData = {
          ...logData,
          severity: formData.severity,
          location: formData.location,
          reportedTo: formData.reportedTo,
        };
        break;
    }

    onSubmit(logData);
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getDriverVehicle = (driverId: string) => {
    const vehicle = vehicles.find(v => v.assignedDriverId === driverId);
    return vehicle;
  };

  const handleDriverChange = (driverId: string) => {
    const vehicle = getDriverVehicle(driverId);
    setFormData(prev => ({
      ...prev,
      driverId,
      vehicleId: vehicle ? vehicle.id : '',
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{log ? 'Edit Log Entry' : 'Add New Log Entry'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Log Type</Label>
              <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="remittance">Weekly Remittance</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="incident">Incident</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="driverId">Driver</Label>
              <Select value={formData.driverId} onValueChange={handleDriverChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select driver" />
                </SelectTrigger>
                <SelectContent>
                  {activeDrivers.map((driver) => (
                    <SelectItem key={driver.id} value={driver.id}>
                      {driver.name} - {driver.licenseNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="vehicleId">Vehicle</Label>
              <Select 
                value={formData.vehicleId} 
                onValueChange={(value) => handleChange('vehicleId', value)}
                disabled={!formData.driverId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {assignedVehicles
                    .filter(v => !formData.driverId || v.assignedDriverId === formData.driverId)
                    .map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.plateNumber} - {vehicle.make} {vehicle.model}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              required
            />
          </div>

          {/* Type-specific fields */}
          {formData.type === 'remittance' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="weekOf">Week Of</Label>
                <Input
                  id="weekOf"
                  type="date"
                  value={formData.weekOf}
                  onChange={(e) => handleChange('weekOf', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => handleChange('amount', parseFloat(e.target.value))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="status">Payment Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="unpaid">Unpaid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {formData.type === 'maintenance' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="maintenanceType">Maintenance Type</Label>
                <Input
                  id="maintenanceType"
                  value={formData.maintenanceType}
                  onChange={(e) => handleChange('maintenanceType', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="amount">Cost ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => handleChange('amount', parseFloat(e.target.value))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="serviceProvider">Service Provider</Label>
                <Input
                  id="serviceProvider"
                  value={formData.serviceProvider}
                  onChange={(e) => handleChange('serviceProvider', e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          {formData.type === 'expense' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => handleChange('amount', parseFloat(e.target.value))}
                  required
                />
              </div>
            </div>
          )}

          {formData.type === 'incident' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="severity">Severity</Label>
                <Select value={formData.severity} onValueChange={(value) => handleChange('severity', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minor">Minor</SelectItem>
                    <SelectItem value="major">Major</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="reportedTo">Reported To</Label>
                <Input
                  id="reportedTo"
                  value={formData.reportedTo}
                  onChange={(e) => handleChange('reportedTo', e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {log ? 'Update Log' : 'Add Log'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export { LogForm };