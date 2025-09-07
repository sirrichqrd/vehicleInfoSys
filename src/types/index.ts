export interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  phone: string;
  email: string;
  address: string;
  dateJoined: string;
  status: 'active' | 'inactive';
  dateOfBirth: string;
  emergencyContactNumber: string;
}

export interface Vehicle {
  id: string;
  plateNumber: string;
  licenseNumber: string;
  licenseIssuingDate: string;
  licenseExpiryDate: string;
  make: string;
  model: string;
  year: number;
  color: string;
  vin: string;
  registrationDate: string;
  status: 'available' | 'assigned' | 'maintenance';
  assignedDriverId?: string;
  fuelType: 'Gasoline' | 'Diesel' | 'Electric' | 'Hybrid' | 'Plug-in Hybrid' | 'CNG' | 'LPG' | 'Hydrogen' | 'Biodiesel' | 'Ethanol' | 'Synthetic fuels';
  mileage: number;
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
  cost: number;
  serviceProvider: string;
  maintenanceCategory?: string;
  maintenanceItem?: string;
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

export interface LicenseAlert {
  vehicleId: string;
  plateNumber: string;
  licenseNumber: string;
  expiryDate: string;
  daysUntilExpiry: number;
  alertType: 'today' | 'tomorrow' | '2days' | '1week' | '1month' | '3months';
}

export type AlertType = LicenseAlert['alertType'];

export interface SearchResult {
  drivers: Driver[];
  vehicles: Vehicle[];
}

export interface DashboardStats {
  totalDrivers: number;
  activeDrivers: number;
  totalVehicles: number;
  availableVehicles: number;
  assignedVehicles: number;
  vehiclesUnderMaintenance: number;
  totalRemittances: number;
  pendingRemittances: number;
  totalExpenses: number;
}

export interface RecentActivity {
  date: string;
  type: 'driver' | 'vehicle' | 'log';
  driverId?: string;
  vehicleId?: string;
  logId?: string;
  description: string;
  status: 'pending' | 'completed';
  logs: DriverLog[];
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
}