import { Vehicle, LicenseAlert } from '../types';

export const getLicenseAlerts = (vehicles: Vehicle[]): LicenseAlert[] => {
  const today = new Date();
  const alerts: LicenseAlert[] = [];

  vehicles.forEach(vehicle => {
    const expiryDate = new Date(vehicle.licenseExpiryDate);
    const timeDiff = expiryDate.getTime() - today.getTime();
    const daysUntilExpiry = Math.ceil(timeDiff / (1000 * 3600 * 24));

    let alertType: LicenseAlert['alertType'] | null = null;

    if (daysUntilExpiry === 0) {
      alertType = 'today';
    } else if (daysUntilExpiry === 1) {
      alertType = 'tomorrow';
    } else if (daysUntilExpiry === 2) {
      alertType = '2days';
    } else if (daysUntilExpiry <= 7) {
      alertType = '1week';
    } else if (daysUntilExpiry <= 30) {
      alertType = '1month';
    } else if (daysUntilExpiry <= 90) {
      alertType = '3months';
    }

    if (alertType && daysUntilExpiry >= 0) {
      alerts.push({
        vehicleId: vehicle.id,
        plateNumber: vehicle.plateNumber,
        licenseNumber: vehicle.licenseNumber,
        expiryDate: vehicle.licenseExpiryDate,
        daysUntilExpiry,
        alertType
      });
    }
  });

  return alerts.sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);
};

export const getAlertColor = (alertType: LicenseAlert['alertType']): string => {
  switch (alertType) {
    case 'today':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'tomorrow':
      return 'bg-red-100 text-red-800 border-red-200';
    case '2days':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case '1week':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case '1month':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case '3months':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getAlertMessage = (alert: LicenseAlert): string => {
  switch (alert.alertType) {
    case 'today':
      return `License expires TODAY!`;
    case 'tomorrow':
      return `License expires TOMORROW!`;
    case '2days':
      return `License expires in 2 days`;
    case '1week':
      return `License expires in ${alert.daysUntilExpiry} days`;
    case '1month':
      return `License expires in ${alert.daysUntilExpiry} days`;
    case '3months':
      return `License expires in ${alert.daysUntilExpiry} days`;
    default:
      return `License expires in ${alert.daysUntilExpiry} days`;
  }
};