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
import { Label } from '@/components/ui/label';
import { UserCheck, UserX, Plus } from 'lucide-react';
import { Vehicle, Driver, VehicleAssignment } from '../../types';

interface AssignmentManagerProps {
  vehicles: Vehicle[];
  drivers: Driver[];
  assignments: VehicleAssignment[];
  onAssignVehicle: (vehicleId: string, driverId: string) => void;
  onUnassignVehicle: (vehicleId: string) => void;
}

export function AssignmentManager({
  vehicles,
  drivers,
  assignments,
  onAssignVehicle,
  onUnassignVehicle,
}: AssignmentManagerProps) {
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedDriver, setSelectedDriver] = useState('');

  const availableVehicles = vehicles.filter(v => v.status === 'available');
  const activeDrivers = drivers.filter(d => d.status === 'active');
  const assignedVehicles = vehicles.filter(v => v.status === 'assigned');

  const handleAssign = () => {
    if (selectedVehicle && selectedDriver) {
      onAssignVehicle(selectedVehicle, selectedDriver);
      setSelectedVehicle('');
      setSelectedDriver('');
      setShowAssignForm(false);
    }
  };

  const getDriverName = (driverId: string) => {
    const driver = drivers.find(d => d.id === driverId);
    return driver ? driver.name : 'Unknown Driver';
  };

  const getAssignmentDate = (vehicleId: string) => {
    const assignment = assignments.find(a => 
      a.vehicleId === vehicleId && a.status === 'active'
    );
    return assignment ? assignment.assignedDate : '';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Vehicle Assignment</h2>
          <p className="text-muted-foreground">Assign vehicles to drivers and manage assignments</p>
        </div>
        <Button 
          onClick={() => setShowAssignForm(true)}
          disabled={availableVehicles.length === 0 || activeDrivers.length === 0}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Assignment
        </Button>
      </div>

      {showAssignForm && (
        <Card>
          <CardHeader>
            <CardTitle>Assign Vehicle to Driver</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Select Vehicle</Label>
                <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableVehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.plateNumber} - {vehicle.make} {vehicle.model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Select Driver</Label>
                <Select value={selectedDriver} onValueChange={setSelectedDriver}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a driver" />
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
            </div>
            
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setShowAssignForm(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleAssign}
                disabled={!selectedVehicle || !selectedDriver}
              >
                Assign Vehicle
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Vehicles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserX className="mr-2 h-5 w-5" />
              Available Vehicles ({availableVehicles.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {availableVehicles.length === 0 ? (
              <p className="text-muted-foreground">No available vehicles</p>
            ) : (
              <div className="space-y-2">
                {availableVehicles.map((vehicle) => (
                  <div key={vehicle.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">{vehicle.plateNumber}</div>
                      <div className="text-sm text-muted-foreground">
                        {vehicle.make} {vehicle.model} ({vehicle.year})
                      </div>
                    </div>
                    <Badge variant="secondary">Available</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Assigned Vehicles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserCheck className="mr-2 h-5 w-5" />
              Assigned Vehicles ({assignedVehicles.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {assignedVehicles.length === 0 ? (
              <p className="text-muted-foreground">No assigned vehicles</p>
            ) : (
              <div className="space-y-2">
                {assignedVehicles.map((vehicle) => (
                  <div key={vehicle.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <div className="font-medium">{vehicle.plateNumber}</div>
                      <div className="text-sm text-muted-foreground">
                        {vehicle.make} {vehicle.model} • Assigned to: {getDriverName(vehicle.assignedDriverId!)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Since: {getAssignmentDate(vehicle.id)}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUnassignVehicle(vehicle.id)}
                    >
                      Unassign
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Assignment History */}
      <Card>
        <CardHeader>
          <CardTitle>Assignment History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Assigned Date</TableHead>
                <TableHead>Unassigned Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No assignment history
                  </TableCell>
                </TableRow>
              ) : (
                assignments
                  .sort((a, b) => new Date(b.assignedDate).getTime() - new Date(a.assignedDate).getTime())
                  .map((assignment) => {
                    const vehicle = vehicles.find(v => v.id === assignment.vehicleId);
                    const driver = drivers.find(d => d.id === assignment.driverId);
                    
                    return (
                      <TableRow key={assignment.id}>
                        <TableCell>
                          {vehicle ? `${vehicle.plateNumber} - ${vehicle.make} ${vehicle.model}` : 'Unknown Vehicle'}
                        </TableCell>
                        <TableCell>{driver ? driver.name : 'Unknown Driver'}</TableCell>
                        <TableCell>{assignment.assignedDate}</TableCell>
                        <TableCell>{assignment.unassignedDate || '-'}</TableCell>
                        <TableCell>
                          <Badge variant={assignment.status === 'active' ? 'default' : 'secondary'}>
                            {assignment.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}