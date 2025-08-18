import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Car, Phone, Mail } from 'lucide-react';
import { Driver, Vehicle } from '../../types';

interface SearchResultsProps {
  drivers: Driver[];
  vehicles: Vehicle[];
  query: string;
  onClose: () => void;
}

export function SearchResults({ drivers, vehicles, query, onClose }: SearchResultsProps) {
  if (!query.trim()) return null;

  return (
    <Card className="mt-4">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Search Results for "{query}"</CardTitle>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Driver Results */}
          {drivers.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <User className="mr-2 h-5 w-5" />
                Drivers ({drivers.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {drivers.map((driver) => (
                  <div key={driver.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{driver.name}</h4>
                        <p className="text-sm text-muted-foreground">License: {driver.licenseNumber}</p>
                        <div className="flex items-center text-sm mt-1">
                          <Phone className="mr-1 h-3 w-3" />
                          {driver.phone}
                        </div>
                        <div className="flex items-center text-sm">
                          <Mail className="mr-1 h-3 w-3" />
                          {driver.email}
                        </div>
                      </div>
                      <Badge variant={driver.status === 'active' ? 'default' : 'secondary'}>
                        {driver.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vehicle Results */}
          {vehicles.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Car className="mr-2 h-5 w-5" />
                Vehicles ({vehicles.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vehicles.map((vehicle) => (
                  <div key={vehicle.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{vehicle.plateNumber}</h4>
                        <p className="text-sm text-muted-foreground">
                          {vehicle.make} {vehicle.model} ({vehicle.year})
                        </p>
                        <p className="text-sm text-muted-foreground">VIN: {vehicle.vin}</p>
                        <p className="text-sm text-muted-foreground">Color: {vehicle.color}</p>
                      </div>
                      <Badge 
                        variant={vehicle.status === 'available' ? 'default' : 'secondary'}
                        className={
                          vehicle.status === 'available' ? 'bg-green-100 text-green-800' :
                          vehicle.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                          'bg-orange-100 text-orange-800'
                        }
                      >
                        {vehicle.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {drivers.length === 0 && vehicles.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No drivers or vehicles found matching "{query}"
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}