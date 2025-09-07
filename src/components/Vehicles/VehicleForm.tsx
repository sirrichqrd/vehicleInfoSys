import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Vehicle } from '../../types';
import { Plus, Edit, Eye, Trash2, Car, Gauge, Calendar, User } from 'lucide-react';

interface VehicleFormProps {
  vehicle?: Vehicle;
  onSubmit: (vehicle: Omit<Vehicle, 'id'>) => void;
  onCancel: () => void;
  mode: 'add' | 'edit' | 'view';
}

export function VehicleForm({ vehicle, onSubmit, onCancel, mode }: VehicleFormProps) {
  const [formData, setFormData] = useState({
    plateNumber: vehicle?.plateNumber || '',
    licenseNumber: vehicle?.licenseNumber || '',
    licenseIssuingDate: vehicle?.licenseIssuingDate || new Date().toISOString().split('T')[0],
    licenseExpiryDate: vehicle?.licenseExpiryDate || new Date().toISOString().split('T')[0],
    make: vehicle?.make || '',
    model: vehicle?.model || '',
    year: vehicle?.year || new Date().getFullYear(),
    color: vehicle?.color || '',
    vin: vehicle?.vin || '',
    status: vehicle?.status || 'available' as const,
    fuelType: vehicle?.fuelType || 'Gasoline',
    mileage: vehicle?.mileage || 0,
  });

  const modalRef = useRef<HTMLDivElement>(null);
  const isViewMode = mode === 'view';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      registrationDate: vehicle?.registrationDate || new Date().toISOString().split('T')[0],
      assignedDriverId: vehicle?.assignedDriverId,
    });
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Focus management and ESC key handling
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    // Focus the modal when it opens
    if (modalRef.current) {
      const firstFocusable = modalRef.current.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') as HTMLElement;
      firstFocusable?.focus();
    }

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = ''; // Restore scrolling
    };
  }, [onCancel]);

  return (
    <>
      {/* Backdrop with dimming effect */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
        {/* Modal container */}
        <div 
          ref={modalRef}
          className="relative w-full max-w-full sm:max-w-3xl max-h-[90vh] overflow-y-auto focus:outline-none rounded-lg"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <Card className="w-full shadow-lg">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle id="modal-title" className="text-lg sm:text-xl">
                {mode === 'add' ? 'Add New Vehicle' : 
                 mode === 'edit' ? 'Edit Vehicle' : 'Vehicle Details'}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pt-0 pb-4 sm:pb-6">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                {/* Compact grid for basic info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <Label htmlFor="plateNumber" className="text-sm font-medium text-gray-700">Plate Number</Label>
                    <Input
                      id="plateNumber"
                      value={formData.plateNumber}
                      onChange={(e) => handleChange('plateNumber', e.target.value)}
                      disabled={isViewMode}
                      required
                      className="text-sm w-full mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="make" className="text-sm font-medium text-gray-700">Make</Label>
                    <Input
                      id="make"
                      value={formData.make}
                      onChange={(e) => handleChange('make', e.target.value)}
                      disabled={isViewMode}
                      required
                      className="text-sm w-full mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="model" className="text-sm font-medium text-gray-700">Model</Label>
                    <Input
                      id="model"
                      value={formData.model}
                      onChange={(e) => handleChange('model', e.target.value)}
                      disabled={isViewMode}
                      required
                      className="text-sm w-full mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="year" className="text-sm font-medium text-gray-700">Year</Label>
                    <Input
                      id="year"
                      type="number"
                      min="1900"
                      max={new Date().getFullYear() + 1}
                      value={formData.year}
                      onChange={(e) => handleChange('year', parseInt(e.target.value))}
                      disabled={isViewMode}
                      required
                      className="text-sm w-full mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="color" className="text-sm font-medium text-gray-700">Color</Label>
                    <Input
                      id="color"
                      value={formData.color}
                      onChange={(e) => handleChange('color', e.target.value)}
                      disabled={isViewMode}
                      required
                      className="text-sm w-full mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="fuelType" className="text-sm font-medium text-gray-700">Fuel Type</Label>
                    <Select 
                      value={formData.fuelType} 
                      onValueChange={(value) => handleChange('fuelType', value)}
                      disabled={isViewMode}
                    >
                      <SelectTrigger className="text-sm w-full mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Gasoline">Gasoline</SelectItem>
                        <SelectItem value="Diesel">Diesel</SelectItem>
                        <SelectItem value="Electric">Electric</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                        <SelectItem value='Plug-in Hybrid'>Plug-in Hybrid</SelectItem>
                        <SelectItem value='CNG'>CNG</SelectItem>
                        <SelectItem value='LPG'>LPG</SelectItem>
                        <SelectItem value='Hydrogen'>Hydrogen</SelectItem>
                        <SelectItem value='Biodiesel'>Biodiesel</SelectItem>
                        <SelectItem value='Ethanol'>Ethanol</SelectItem>
                        <SelectItem value='Synthetic fuels'>Synthetic fuels</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* License info - more compact on mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <Label htmlFor="licenseNumber" className="text-sm font-medium text-gray-700">License Number</Label>
                    <Input
                      id="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={(e) => handleChange('licenseNumber', e.target.value)}
                      disabled={isViewMode}
                      required
                      className="text-sm w-full mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="licenseIssuingDate" className="text-sm font-medium text-gray-700">Issuing Date</Label>
                    <Input
                      id="licenseIssuingDate"
                      type="date"
                      value={formData.licenseIssuingDate}
                      onChange={(e) => handleChange('licenseIssuingDate', e.target.value)}
                      disabled={isViewMode}
                      required
                      className="text-sm w-full mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="licenseExpiryDate" className="text-sm font-medium text-gray-700">Expiry Date</Label>
                    <Input 
                      id="licenseExpiryDate"
                      type="date"
                      value={formData.licenseExpiryDate}
                      onChange={(e) => handleChange('licenseExpiryDate', e.target.value)}
                      disabled={isViewMode}
                      required
                      className="text-sm w-full mt-1"
                    />
                  </div>
                </div>
                
                {/* VIN and Mileage - side by side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label htmlFor="vin" className="text-sm font-medium text-gray-700">VIN</Label>
                    <Input
                      id="vin"
                      value={formData.vin}
                      onChange={(e) => handleChange('vin', e.target.value)}
                      disabled={isViewMode}
                      required
                      className="text-sm w-full mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="mileage" className="text-sm font-medium text-gray-700">Mileage</Label>
                    <Input
                      id="mileage"
                      type="number"
                      min="0"
                      value={formData.mileage}
                      onChange={(e) => handleChange('mileage', parseInt(e.target.value))}
                      disabled={isViewMode}
                      required
                      className="text-sm w-full mt-1"
                    />
                  </div>
                </div>
                
                {/* Status dropdown */}
                <div>
                  <Label htmlFor="status" className="text-sm font-medium text-gray-700">Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => handleChange('status', value)}
                    disabled={isViewMode}
                  >
                    <SelectTrigger className="text-sm w-full mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="assigned">Assigned</SelectItem>
                      <SelectItem value="maintenance">Under Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Buttons */}
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 sm:pt-6">
                  
                  <Button 
                      type="submit"
                      className="w-full sm:w-auto text-sm"
                    >
                      {mode === 'add' ? 'Add Vehicle' : 'Update Vehicle'}
                    </Button>
                  {!isViewMode && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={onCancel}
                    className="w-full sm:w-auto text-sm"
                  >
                    {isViewMode ? 'Close' : 'Cancel'}
                  </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}