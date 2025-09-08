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
import { Edit, Trash2, Plus } from 'lucide-react';
import { Vehicle, Driver } from '../../types';
import { VehicleForm } from './VehicleForm';

interface VehicleListProps {
  vehicles: Vehicle[];
  drivers: Driver[];
  onAddVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  onUpdateVehicle: (id: string, updates: Partial<Vehicle>) => void;
  onDeleteVehicle: (id: string) => void;
}

export function VehicleList({ 
  vehicles, 
  drivers, 
  onAddVehicle, 
  onUpdateVehicle, 
  onDeleteVehicle 
}: VehicleListProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setShowForm(true);
  };

  const handleSubmit = (vehicleData: Omit<Vehicle, 'id'>) => {
    if (editingVehicle) {
      onUpdateVehicle(editingVehicle.id, vehicleData);
    } else {
      onAddVehicle(vehicleData);
    }
    setShowForm(false);
    setEditingVehicle(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingVehicle(null);
  };

  const getDriverName = (driverId?: string) => {
    if (!driverId) return 'Unassigned';
    const driver = drivers.find(d => d.id === driverId);
    return driver ? driver.name : 'Unknown Driver';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (showForm) {
    return (
      <VehicleForm
        vehicle={editingVehicle || undefined}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        mode={editingVehicle ? 'edit' : 'add'}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Vehicle Management</h2>
          <p className="text-muted-foreground">Register and manage organization vehicles</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Register Vehicle
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registered Vehicles ({vehicles.length})</CardTitle>
        </CardHeader>
        <CardContent>
  {vehicles.length === 0 ? (
    <div className="text-center py-8">
      <p className="text-muted-foreground">No vehicles registered yet</p>
      <Button onClick={() => setShowForm(true)} className="mt-4">
        <Plus className="mr-2 h-4 w-4" />
        Register First Vehicle
      </Button>
    </div>
  ) : (
    <div className="overflow-x-auto">
      {/* Desktop Table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Plate Number</TableHead>
              <TableHead>Vehicle Info</TableHead>
              <TableHead>VIN</TableHead>
              <TableHead>Assigned Driver</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell className="font-medium">{vehicle.plateNumber}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{vehicle.make} {vehicle.model}</div>
                    <div className="text-sm text-muted-foreground">
                      {vehicle.year} • {vehicle.color}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">{vehicle.vin}</TableCell>
                <TableCell>{getDriverName(vehicle.assignedDriverId)}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(vehicle.status)} variant="secondary">
                    {vehicle.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(vehicle)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDeleteVehicle(vehicle.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-4">
        {vehicles.map((vehicle) => (
          <Card key={vehicle.id} className="p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold">{vehicle.plateNumber}</h3>
              <Badge className={getStatusColor(vehicle.status)} variant="secondary">
                {vehicle.status}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground mb-2">
              {vehicle.make} {vehicle.model} • {vehicle.year} • {vehicle.color}
            </div>
            <div className="text-sm font-mono mb-2">VIN: {vehicle.vin}</div>
            <div className="mb-2">
              Driver: {getDriverName(vehicle.assignedDriverId)}
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => handleEdit(vehicle)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => onDeleteVehicle(vehicle.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )}
</CardContent>

      </Card>
    </div>
  );
}