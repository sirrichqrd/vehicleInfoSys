import { useState } from 'react';
import { Navbar } from '../components/Layout/Navbar';
import { Sidebar } from '../components/Layout/Sidebar';
import { DashboardStats } from '../components/Dashboard/DashboardStats';
import { RecentActivity } from '../components/Dashboard/RecentActivity';
import { DriverList } from '../components/Drivers/DriverList';
import { VehicleList } from '../components/Vehicles/VehicleList';
import { AssignmentManager } from '../components/Assignment/AssignmentManager';
import { LogList } from '../components/Logs/LogList';
import { ReportGenerator } from '../components/Reports/ReportGenerator';
import { SearchResults } from '../components/Search/SearchResults';
import { useVehicleData } from '../hooks/useVehicleData';

export default function VehicleManagementSystem() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  const {
    drivers,
    vehicles,
    assignments,
    logs,
    addDriver,
    updateDriver,
    deleteDriver,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    assignVehicle,
    unassignVehicle,
    addLog,
    updateLog,
    deleteLog,
    searchDrivers,
    searchVehicles,
  } = useVehicleData();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setShowSearchResults(true);
      setActiveTab('search');
    } else {
      setShowSearchResults(false);
    }
  };

  const searchResultDrivers = searchQuery ? searchDrivers(searchQuery) : [];
  const searchResultVehicles = searchQuery ? searchVehicles(searchQuery) : [];

  const renderContent = () => {
    if (showSearchResults && activeTab === 'search') {
      return (
        <SearchResults
          drivers={searchResultDrivers}
          vehicles={searchResultVehicles}
          query={searchQuery}
          onClose={() => {
            setShowSearchResults(false);
            setActiveTab('dashboard');
            setSearchQuery('');
          }}
        />
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <DashboardStats drivers={drivers} vehicles={vehicles} logs={logs} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentActivity logs={logs} drivers={drivers} vehicles={vehicles} />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Quick Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {drivers.filter(d => d.status === 'active').length}
                    </div>
                    <div className="text-sm text-blue-600">Active Drivers</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {vehicles.filter(v => v.status === 'available').length}
                    </div>
                    <div className="text-sm text-green-600">Available Vehicles</div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {logs.filter(l => l.type === 'remittance' && l.status === 'unpaid').length}
                    </div>
                    <div className="text-sm text-orange-600">Pending Remittances</div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {logs.filter(l => l.type === 'incident').length}
                    </div>
                    <div className="text-sm text-red-600">Total Incidents</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'drivers':
        return (
          <DriverList
            drivers={drivers}
            onAddDriver={addDriver}
            onUpdateDriver={updateDriver}
            onDeleteDriver={deleteDriver}
          />
        );
      case 'vehicles':
        return (
          <VehicleList
            vehicles={vehicles}
            drivers={drivers}
            onAddVehicle={addVehicle}
            onUpdateVehicle={updateVehicle}
            onDeleteVehicle={deleteVehicle}
          />
        );
      case 'assignments':
        return (
          <AssignmentManager
            vehicles={vehicles}
            drivers={drivers}
            assignments={assignments}
            onAssignVehicle={assignVehicle}
            onUnassignVehicle={unassignVehicle}
          />
        );
      case 'logs':
        return (
          <LogList
            logs={logs}
            drivers={drivers}
            vehicles={vehicles}
            onAddLog={addLog}
            onUpdateLog={updateLog}
            onDeleteLog={deleteLog}
          />
        );
      case 'reports':
        return (
          <ReportGenerator
            drivers={drivers}
            vehicles={vehicles}
            logs={logs}
          />
        );
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        onMenuClick={() => setSidebarOpen(true)}
        onSearch={handleSearch}
      />
      
      <div className="flex">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}