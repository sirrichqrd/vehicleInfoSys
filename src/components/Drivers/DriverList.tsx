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
import { Edit, Trash2, Plus, Phone, Mail, Eye, User, Calendar, CreditCard, MapPin } from 'lucide-react';
import { Driver } from '../../types';
import { DriverForm } from './DriverForm';
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

interface DriverListProps {
  drivers: Driver[];
  onAddDriver: (driver: Omit<Driver, 'id'>) => void;
  onUpdateDriver: (id: string, updates: Partial<Driver>) => void;
  onDeleteDriver: (id: string) => void;
}

export function DriverList({ drivers, onAddDriver, onUpdateDriver, onDeleteDriver }: DriverListProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [viewingDriver, setViewingDriver] = useState<Driver | null>(null);

  const handleEdit = (driver: Driver) => {
    setEditingDriver(driver);
    setShowForm(true);
  };

  const handleView = (driver: Driver) => {
    setViewingDriver(driver);
  };

  const handleSubmit = (driverData: Omit<Driver, 'id'>) => {
    if (editingDriver) {
      onUpdateDriver(editingDriver.id, driverData);
    } else {
      onAddDriver(driverData);
    }
    setShowForm(false);
    setEditingDriver(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingDriver(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const DriverDetailsDialog = ({ driver }: { driver: Driver }) => {
    return (
      <DialogContent className="rounded-2xl sm:rounded-xl max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Driver Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Header Section with Avatar */}
          <div className="flex flex-col items-center text-center">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full w-20 h-20 flex items-center justify-center mb-3 shadow-lg overflow-hidden">
              {viewingDriver?.passport ? (
                <img
                  src={viewingDriver.passport}
                  alt={`${viewingDriver.name} Passport`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-10 w-10 text-white" />
              )}
            </div>
            <h3 className="text-xl font-bold text-foreground">{driver.name}</h3>
            <Badge className={`${getStatusColor(driver.status)} mt-2`} variant="secondary">
              {driver.status}
            </Badge>
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <CreditCard className="h-4 w-4 mr-2" />
                  License Number
                </div>
                <p className="font-semibold bg-muted px-3 py-2 rounded font-mono text-sm">
                  {driver.licenseNumber}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  Date Joined
                </div>
                <p className="font-mono text-sm bg-muted p-2 rounded">{driver.dateJoined}</p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-3">
              <h4 className="font-medium text-foreground border-b pb-2">Contact Information</h4>
              <div className="space-y-3">

                <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Phone className="h-3 w-3 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className=" font-mono">{driver.phone}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <Calendar className="h-3 w-3 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date of Birth</p>
                    <p className="text-sm">{driver.dateOfBirth}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Mail className="h-3 w-3 text-green-600" />
                  </div>
                 
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-semimedium text-sm">{driver.email}</p>
                  </div>
                  </div>
                  <div className="flex items-center space-x-3">
                  <div className="bg-red-100 p-2 rounded-full">
                    <MapPin className="h-3 w-3 text-red-600" />
                  </div>
                 
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-semimedium text-sm">{driver.address || 'No address provided'}</p>
                  </div>
                </div>
              </div>

              {/* Emergency Contact*/}
              <h5 className="font-medium text-foreground border-b pb-2">Emergency Contact</h5>
                <div className="grid grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <User className="h-3 w-3 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium text-sm">
                        {driver.emergencyContactName || "Not provided"}
                      </p>
                    </div>
                  </div>

                  {/* Contact Number */}
                  <div className="flex items-center space-x-3">
                    <div className="bg-yellow-100 p-2 rounded-full">
                      <Phone className="h-3 w-3 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium text-sm">
                        {driver.emergencyContactNumber || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    );
  };

  if (showForm) {
    return (
      <DriverForm
        driver={editingDriver || undefined}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Driver Registration</h2>
          <p className="text-muted-foreground">Manage driver profiles and information</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Driver
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registered Drivers ({drivers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {drivers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No drivers registered yet</p>
              <Button onClick={() => setShowForm(true)} className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Register First Driver
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* Desktop Table */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>License Number</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Date Joined</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {drivers.map((driver) => (
                      <TableRow key={driver.id}>
                        <TableCell className="font-medium">{driver.name}</TableCell>
                        <TableCell className="font-mono text-sm">{driver.licenseNumber}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm">
                              <Phone className="mr-1 h-3 w-3" />
                              {driver.phone}
                            </div>
                            <div className="flex items-center text-sm">
                              <Mail className="mr-1 h-3 w-3" />
                              {driver.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{driver.dateJoined}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(driver.status)} variant="secondary">
                            {driver.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleView(driver)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DriverDetailsDialog driver={driver} />
                            </Dialog>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(driver)}
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
                                  <AlertDialogTitle>Delete Driver</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete driver <b>{driver.name}</b>?  
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => onDeleteDriver(driver.id)}
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
                {drivers.map((driver) => (
                  <Card key={driver.id} className="p-4 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold">{driver.name}</h3>
                      <Badge className={getStatusColor(driver.status)} variant="secondary">
                        {driver.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2 font-mono">
                      License: {driver.licenseNumber}
                    </div>
                    <div className="mb-2 text-sm">
                      <div className="flex items-center">
                        <Phone className="mr-1 h-3 w-3" /> {driver.phone}
                      </div>
                      <div className="flex items-center">
                        <Mail className="mr-1 h-3 w-3" /> {driver.email}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">
                      Joined: {driver.dateJoined}
                    </div>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleView(driver)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DriverDetailsDialog driver={driver} />
                      </Dialog>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(driver)}>
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
                            <AlertDialogTitle>Delete Driver</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete driver <b>{driver.name}</b>?  
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDeleteDriver(driver.id)}
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