import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Vehicle } from '../../types';

interface VehicleFormProps {
  vehicle?: Vehicle;
  onSubmit: (vehicle: Omit<Vehicle, 'id'>) => void;
  onCancel: () => void;
  mode: 'add' | 'edit' | 'view';
}

export function VehicleForm({ vehicle, onSubmit, onCancel }: VehicleFormProps) {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>{vehicle ? 'Edit Vehicle' : 'Register New Vehicle'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="plateNumber">Plate Number</Label>
              <Input
                id="plateNumber"
                value={formData.plateNumber}
                onChange={(e) => handleChange('plateNumber', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="make">Make</Label>
              <Input
                id="make"
                value={formData.make}
                onChange={(e) => handleChange('make', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => handleChange('model', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                min="1900"
                max={new Date().getFullYear() + 1}
                value={formData.year}
                onChange={(e) => handleChange('year', parseInt(e.target.value))}
                required
              />
            </div>

            <div>
              <Label htmlFor="fuelType">Fuel Type</Label>
              <Select value={formData.fuelType} onValueChange={(value) => handleChange('fuelType', value)}>
                <SelectTrigger>
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

            <div>
              <Label htmlFor="mileage">Mileage</Label>
              <Input
                id="mileage"
                type="string"
                min="0"
                value={formData.mileage}
                onChange={(e) => handleChange('mileage', e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor='licenseNumber'>License Number</label>
              <Input
                id="licenseNumber"
                value={formData.licenseNumber}
                onChange={(e) => handleChange('licenseNumber', e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor='licenseIssuingDate'>License Issuing Date</label>
              <Input
                id="licenseIssuingDate"
                type="date"
                value={formData.licenseIssuingDate}
                onChange={(e) => handleChange('licenseIssuingDate', e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor='licenseExpiryDate'>License Expiry Date</label>
              <Input 
                id="licenseExpiryDate"
                type="date"
                value={formData.licenseExpiryDate}
                onChange={(e) => handleChange('licenseExpiryDate', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                value={formData.color}
                onChange={(e) => handleChange('color', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="vin">VIN</Label>
              <Input
                id="vin"
                value={formData.vin}
                onChange={(e) => handleChange('vin', e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="maintenance">Under Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {vehicle ? 'Update Vehicle' : 'Register Vehicle'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}