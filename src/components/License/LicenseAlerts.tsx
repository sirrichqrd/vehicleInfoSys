import React from 'react';
import { AlertTriangle, Calendar, X } from 'lucide-react';
import { LicenseAlert } from '../../types';
import { getAlertColor, getAlertMessage } from '../../utils/licenseAlerts';

interface LicenseAlertsProps {
  alerts: LicenseAlert[];
  onDismiss?: (alertId: string) => void;
}

export const LicenseAlerts: React.FC<LicenseAlertsProps> = ({ alerts, onDismiss }) => {
  if (alerts.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center space-x-2 mb-3">
        <AlertTriangle className="w-5 h-5 text-red-600" />
        <h3 className="text-lg font-semibold text-gray-900">License Expiry Alerts</h3>
      </div>
      
      <div className="space-y-2">
        {alerts.map((alert) => (
          <div
            key={`${alert.vehicleId}-${alert.alertType}`}
            className={`p-3 rounded-lg border flex items-center justify-between ${getAlertColor(alert.alertType)}`}
          >
            <div className="flex items-center space-x-3">
              <Calendar className="w-4 h-4" />
              <div>
                <div className="font-medium">
                  {alert.plateNumber} ({alert.licenseNumber})
                </div>
                <div className="text-sm">
                  {getAlertMessage(alert)} - Expires: {new Date(alert.expiryDate).toLocaleDateString()}
                </div>
              </div>
            </div>
            {onDismiss && (
              <button
                onClick={() => onDismiss(alert.vehicleId)}
                className="p-1 hover:bg-black hover:bg-opacity-10 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};