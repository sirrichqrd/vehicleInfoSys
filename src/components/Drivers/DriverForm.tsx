import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Driver } from '../../types';

interface DriverFormProps {
  driver?: Driver;
  onSubmit: (driver: Omit<Driver, 'id'>) => void;
  onCancel: () => void;
}

export function DriverForm({ driver, onSubmit, onCancel }: DriverFormProps) {
  const [formData, setFormData] = useState({
    name: driver?.name || '',
    licenseNumber: driver?.licenseNumber || '',
    phone: driver?.phone || '',
    email: driver?.email || '',
    address: driver?.address || '',
    passport: driver?.passport || '',
    dateJoined: driver?.dateJoined || new Date().toISOString().split('T')[0],
    dateOfBirth: driver?.dateOfBirth || new Date().toISOString().split('T')[0],
    emergencyContactName: driver?.emergencyContactName || '',
    emergencyContactNumber: driver?.emergencyContactNumber || '',
    status: driver?.status || 'active' as const,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      dateJoined: driver?.dateJoined || new Date().toISOString().split('T')[0],
      dateOfBirth: driver?.dateOfBirth || new Date().toISOString().split('T')[0],
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{driver ? 'Edit Driver' : 'Add New Driver'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Passport Upload */}
              <div>
                <label className="block text-sm font-medium">Passport</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setFormData((prev) => ({
                          ...prev,
                          passport: reader.result as string, // save base64
                        }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="mt-1 text-sm"
                />
                {formData.passport && (
                  <img
                    src={formData.passport}
                    alt="Driver Passport"
                    className="mt-2 w-20 h-20 object-cover rounded-full border"
                  />
                )}
              </div>


            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="licenseNumber">License Number</Label>
              <Input
                id="licenseNumber"
                value={formData.licenseNumber}
                onChange={(e) => handleChange('licenseNumber', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
            </div>
          </div>

                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="dateJoined">Date Joined</Label>
                    <Input
                      id="dateJoined"
                      type="date"
                      value={formData.dateJoined}
                      onChange={(e) => handleChange('dateJoined', e.target.value)}
                      required
                    />
                  </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
                    <Input
                      id="emergencyContactName"
                      value={formData.emergencyContactName}
                      onChange={(e) => handleChange('emergencyContactName', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="emergencyContactNumber">Emergency Contact Number</Label>
                    <Input
                      id="emergencyContactNumber"
                      type="tel"
                      value={formData.emergencyContactNumber}
                      onChange={(e) => handleChange('emergencyContactNumber', e.target.value)}
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {driver ? 'Update Driver' : 'Add Driver'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}