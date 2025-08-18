export interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  phone: string;
  email: string;
  address: string;
  dateJoined: string;
  status: 'active' | 'inactive';
}

export interface Vehicle {
  id: string;
  plateNumber: string;
  make: string;
  model: string;
  year: number;
  color: string;
  vin: string;
  registrationDate: string;
  status: 'available' | 'assigned' | 'maintenance';
  assignedDriverId?: string;
}

export interface VehicleAssignment {
  id: string;
  vehicleId: string;
  driverId: string;
  assignedDate: string;
  unassignedDate?: string;
  status: 'active' | 'completed';
}

export interface DriverLog {
  id: string;
  driverId: string;
  vehicleId: string;
  type: 'remittance' | 'maintenance' | 'expense' | 'incident';
  date: string;
  description: string;
  amount?: number;
  status?: 'paid' | 'unpaid';
  attachments?: string[];
}

export interface RemittanceLog extends DriverLog {
  type: 'remittance';
  weekOf: string;
  amount: number;
  status: 'paid' | 'unpaid';
}

export interface MaintenanceLog extends DriverLog {
  type: 'maintenance';
  maintenanceType: string;
  cost: number;
  serviceProvider: string;
}

export interface ExpenseLog extends DriverLog {
  type: 'expense';
  category: string;
  amount: number;
  receipt?: string;
}

export interface IncidentLog extends DriverLog {
  type: 'incident';
  severity: 'minor' | 'major' | 'critical';
  location: string;
  reportedTo: string;
}

export interface ReportFilter {
  vehicleIds?: string[];
  driverIds?: string[];
  logTypes?: string[];
  dateFrom?: string;
  dateTo?: string;
}