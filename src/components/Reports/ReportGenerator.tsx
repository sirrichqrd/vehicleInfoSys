import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, Download, Calendar, Filter } from 'lucide-react';
import { Driver, Vehicle, DriverLog, ReportFilter } from '../../types';

interface ReportGeneratorProps {
  drivers: Driver[];
  vehicles: Vehicle[];
  logs: DriverLog[];
}

export function ReportGenerator({ drivers, vehicles, logs }: ReportGeneratorProps) {
  const [filters, setFilters] = useState<ReportFilter>({
    vehicleIds: [],
    driverIds: [],
    logTypes: [],
    dateFrom: '',
    dateTo: '',
  });
  
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const [selectedDrivers, setSelectedDrivers] = useState<string[]>([]);
  const [selectedLogTypes, setSelectedLogTypes] = useState<string[]>([]);
  const [showReport, setShowReport] = useState(false);

  const filteredLogs = logs.filter(log => {
    const vehicleMatch = selectedVehicles.length === 0 || selectedVehicles.includes(log.vehicleId);
    const driverMatch = selectedDrivers.length === 0 || selectedDrivers.includes(log.driverId);
    const typeMatch = selectedLogTypes.length === 0 || selectedLogTypes.includes(log.type);
    const dateFromMatch = !filters.dateFrom || log.date >= filters.dateFrom;
    const dateToMatch = !filters.dateTo || log.date <= filters.dateTo;
    
    return vehicleMatch && driverMatch && typeMatch && dateFromMatch && dateToMatch;
  });

  const getDriverName = (driverId: string) => {
    const driver = drivers.find(d => d.id === driverId);
    return driver ? driver.name : 'Unknown Driver';
  };

  const getVehicleInfo = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.plateNumber} - ${vehicle.make} ${vehicle.model}` : 'Unknown Vehicle';
  };

  const handleVehicleToggle = (vehicleId: string, checked: boolean) => {
    if (checked) {
      setSelectedVehicles(prev => [...prev, vehicleId]);
    } else {
      setSelectedVehicles(prev => prev.filter(id => id !== vehicleId));
    }
  };

  const handleDriverToggle = (driverId: string, checked: boolean) => {
    if (checked) {
      setSelectedDrivers(prev => [...prev, driverId]);
    } else {
      setSelectedDrivers(prev => prev.filter(id => id !== driverId));
    }
  };

  const handleLogTypeToggle = (logType: string, checked: boolean) => {
    if (checked) {
      setSelectedLogTypes(prev => [...prev, logType]);
    } else {
      setSelectedLogTypes(prev => prev.filter(type => type !== logType));
    }
  };

  const generateReport = () => {
    setShowReport(true);
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Type', 'Driver', 'Vehicle', 'Description', 'Amount', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredLogs.map(log => [
        log.date,
        log.type,
        getDriverName(log.driverId),
        getVehicleInfo(log.vehicleId),
        `"${log.description}"`,
        log.amount || '',
        log.status || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vehicle_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    window.print();
  };

  const getTotalAmount = () => {
    return filteredLogs.reduce((sum, log) => sum + (log.amount || 0), 0);
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Reports</h2>
          <p className="text-muted-foreground">Generate comprehensive vehicle and driver reports</p>
        </div>
      </div>

      {!showReport ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="mr-2 h-5 w-5" />
              Report Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dateFrom" className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  From Date
                </Label>
                <Input
                  id="dateFrom"
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="dateTo">To Date</Label>
                <Input
                  id="dateTo"
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                />
              </div>
            </div>

            {/* Vehicle Selection */}
            <div>
              <Label className="text-base font-medium">Select Vehicles (leave empty for all)</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
                {vehicles.map(vehicle => (
                  <div key={vehicle.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`vehicle-${vehicle.id}`}
                      checked={selectedVehicles.includes(vehicle.id)}
                      onCheckedChange={(checked) => handleVehicleToggle(vehicle.id, checked as boolean)}
                    />
                    <Label htmlFor={`vehicle-${vehicle.id}`} className="text-sm">
                      {vehicle.plateNumber} - {vehicle.make} {vehicle.model}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Driver Selection */}
            <div>
              <Label className="text-base font-medium">Select Drivers (leave empty for all)</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
                {drivers.map(driver => (
                  <div key={driver.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`driver-${driver.id}`}
                      checked={selectedDrivers.includes(driver.id)}
                      onCheckedChange={(checked) => handleDriverToggle(driver.id, checked as boolean)}
                    />
                    <Label htmlFor={`driver-${driver.id}`} className="text-sm">
                      {driver.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Log Type Selection */}
            <div>
              <Label className="text-base font-medium">Select Log Types (leave empty for all)</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                {['remittance', 'maintenance', 'expense', 'incident'].map(type => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`type-${type}`}
                      checked={selectedLogTypes.includes(type)}
                      onCheckedChange={(checked) => handleLogTypeToggle(type, checked as boolean)}
                    />
                    <Label htmlFor={`type-${type}`} className="text-sm capitalize">
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={generateReport} className="w-full">
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Report Header */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Vehicle Information Report</CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={exportToCSV}>
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                  </Button>
                  <Button variant="outline" onClick={exportToPDF}>
                    <Download className="mr-2 h-4 w-4" />
                    Export PDF
                  </Button>
                  <Button onClick={() => setShowReport(false)}>
                    New Report
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{filteredLogs.length}</div>
                  <div className="text-sm text-muted-foreground">Total Records</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">${getTotalAmount().toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Total Amount</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {filters.dateFrom && filters.dateTo 
                      ? `${filters.dateFrom} to ${filters.dateTo}`
                      : 'All Time'
                    }
                  </div>
                  <div className="text-sm text-muted-foreground">Period</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {new Date().toLocaleDateString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Generated</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Report Data */}
          <Card>
            <CardHeader>
              <CardTitle>Report Details</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredLogs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No records found matching the selected criteria</p>
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
                              <Badge variant={log.status === 'paid' ? 'default' : 'secondary'}>
                                {log.status}
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}