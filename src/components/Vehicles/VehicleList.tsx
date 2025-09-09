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
import { Edit, Trash2, Plus, Eye } from 'lucide-react';
import { Vehicle, Driver } from '../../types';
import { VehicleForm } from './VehicleForm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
  const [viewingVehicle, setViewingVehicle] = useState<Vehicle | null>(null);

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setShowForm(true);
  };

  const handleView = (vehicle: Vehicle) => {
    setViewingVehicle(vehicle);
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

  const getDriverDetails = (driverId?: string) => {
    if (!driverId) return null;
    return drivers.find(d => d.id === driverId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const VehicleDetailsDialog = ({ vehicle }: { vehicle: Vehicle }) => {
    const assignedDriver = getDriverDetails(vehicle.assignedDriverId);
    
    return (
      <DialogContent className="rounded-2xl max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Vehicle Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Plate Number</label>
              <p className="font-semibold">{vehicle.plateNumber}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <div className="mt-1">
                <Badge className={getStatusColor(vehicle.status)} variant="secondary">
                  {vehicle.status}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Make</label>
              <p>{vehicle.make}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Model</label>
              <p>{vehicle.model}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Year</label>
              <p>{vehicle.year}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Color</label>
              <p>{vehicle.color}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Feul Type</label>
              <p>{vehicle.fuelType}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Mileage</label>
              <p>{vehicle.mileage}</p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">VIN</label>
            <p className="font-mono text-sm bg-muted p-2 rounded">{vehicle.vin}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">License Number</label>
            <p className="font-mono text-sm bg-muted p-2 rounded">{vehicle.licenseNumber}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">License Issuing Date</label>
              <p className="font-mono text-sm bg-muted p-2 rounded">{vehicle.licenseIssuingDate}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">License Expiry Date</label>
              <p className="font-mono text-sm bg-muted p-2 rounded">{vehicle.licenseExpiryDate}</p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Assigned Driver</label>
            {assignedDriver ? (
              <div className="mt-1 p-3 bg-muted rounded">
                <p className="font-medium">{assignedDriver.name}</p>
                <p className="text-sm text-muted-foreground">{assignedDriver.email}</p>
                <p className="text-sm text-muted-foreground">License: {assignedDriver.licenseNumber}</p>
              </div>
            ) : (
              <p className="text-muted-foreground mt-1">Unassigned</p>
            )}
          </div>
        </div>
      </DialogContent>
    );
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
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(vehicle)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <VehicleDetailsDialog vehicle={vehicle} />
                    </Dialog>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(vehicle)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Vehicle</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete vehicle <b>{vehicle.plateNumber}</b>?  
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDeleteVehicle(vehicle.id)}
                            className="bg-red-600 text-white hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
          <Card key={vehicle.id} className="p-4 shadow-sm ">
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
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleView(vehicle)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <VehicleDetailsDialog vehicle={vehicle} />
              </Dialog>
              <Button variant="outline" size="sm" onClick={() => handleEdit(vehicle)}>
                <Edit className="h-4 w-4" />
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-2xl sm:rounded-xl max-w-md">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Vehicle</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete vehicle <b>{vehicle.plateNumber}</b>?  
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDeleteVehicle(vehicle.id)}
                      className="bg-red-600 text-white hover:bg-red-700"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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