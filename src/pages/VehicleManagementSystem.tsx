import { useState } from "react";
import { Navbar } from "../components/Layout/Navbar";
import { Sidebar } from "../components/Layout/Sidebar";
import { DashboardStats } from "../components/Dashboard/DashboardStats";
import { RecentActivity } from "../components/Dashboard/RecentActivity";
import { DriverList } from "../components/Drivers/DriverList";
import { VehicleList } from "../components/Vehicles/VehicleList";
import { AssignmentManager } from "../components/Assignment/AssignmentManager";
import { LogList } from "../components/Logs/LogList";
import { ReportGenerator } from "../components/Reports/ReportGenerator";
import { SearchResults } from "../components/Search/SearchResults";
import { useVehicleData } from "../hooks/useVehicleData";
import { useActivity } from "@/components/context/ActivityContext";
import { Vehicle, Driver, DriverLog } from "../types";
import  HistoryPage  from "../components/History/HistoryPage";

export default function VehicleManagementSystem() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const { addActivity } = useActivity();

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

  // 🔎 SEARCH
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setShowSearchResults(true);
      setActiveTab("search");
      addActivity({ message: `🔍 Search performed: "${query}"`, type: "system" });
    } else {
      setShowSearchResults(false);
    }
  };

  // 🚗 VEHICLES
  const handleAddVehicle = (vehicle: Omit<Vehicle, "id">) => {
    addVehicle(vehicle);
    addActivity({ message: `🚗 Vehicle ${vehicle.plateNumber} registered`, type: "vehicle" });
  };

  const handleUpdateVehicle = (id: string, updates: Partial<Vehicle>) => {
    updateVehicle(id, updates);
    addActivity({ message: `✏️ Vehicle ${id} updated`, type: "vehicle" });
  };

  const handleDeleteVehicle = (id: string) => {
    deleteVehicle(id);
    addActivity({ message: `🗑️ Vehicle deleted`, type: "vehicle" });
  };

  // 👤 DRIVERS
  const handleAddDriver = (driver: Omit<Driver, "id">) => {
    addDriver(driver);
    addActivity({ message: `👤 Driver ${driver.name} added`, type: "driver" });
  };

  const handleUpdateDriver = (id: string, updates: Partial<Driver>) => {
  updateDriver(id, updates);
    addActivity({ message: `✏️ Driver ${id} updated`, type: "driver" });
  };

  const handleDeleteDriver = (id: string) => {
    deleteDriver(id);
    addActivity({ message: `🗑️ Driver deleted`, type: "driver" });
  };

  // 📝 LOGS
  const handleAddLog = (log: DriverLog) => {
    addLog(log);
    addActivity({ message: `📝 New ${log.type} log recorded`, type: "log" });
  };

  const handleUpdateLog = (id: string, updates: Partial<DriverLog>) => {
  updateLog(id, updates);
    addActivity({ message: `✏️ Log ${id} updated`, type: "log" });
  };

  const handleDeleteLog = (id: string) => {
    deleteLog(id);
    addActivity({ message: `🗑️ Log deleted`, type: "log" });
  };

  // 🔗 ASSIGNMENTS
  const handleAssignVehicle = (vehicleId: string, driverId: string) => {
    assignVehicle(vehicleId, driverId);
    addActivity({ message: `🔗 Vehicle ${vehicleId} assigned to Driver ${driverId}`, type: "assignment" });
  };

  const handleUnassignVehicle = (vehicleId: string) => {
    unassignVehicle(vehicleId);
    addActivity({ message: `🔓 Vehicle ${vehicleId} unassigned from Driver ${drivers}`, type: "assignment" });
  };

  // 📊 REPORTS
  const handleGenerateReport = () => {
    addActivity({ message: `📊 Report generated`, type: "report" });
  };

  const searchResultDrivers = searchQuery ? searchDrivers(searchQuery) : [];
  const searchResultVehicles = searchQuery ? searchVehicles(searchQuery) : [];

  const renderContent = () => {
    if (showSearchResults && activeTab === "search") {
      return (
        <SearchResults
          drivers={searchResultDrivers}
          vehicles={searchResultVehicles}
          query={searchQuery}
          onClose={() => {
            setShowSearchResults(false);
            setActiveTab("dashboard");
            setSearchQuery("");
          }}
        />
      );
    }

    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <DashboardStats drivers={drivers} vehicles={vehicles} logs={logs} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentActivity />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Quick Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {drivers.filter((d) => d.status === "active").length}
                    </div>
                    <div className="text-sm text-blue-600">Active Drivers</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {vehicles.filter((v) => v.status === "available").length}
                    </div>
                    <div className="text-sm text-green-600">Available Vehicles</div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {logs.filter((l) => l.type === "remittance" && l.status === "unpaid").length}
                    </div>
                    <div className="text-sm text-orange-600">Pending Remittances</div>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {logs.filter((l) => l.type === "incident").length}
                    </div>
                    <div className="text-sm text-red-600">Total Incidents</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "drivers":
        return (
          <DriverList
            drivers={drivers}
            onAddDriver={handleAddDriver}
            onUpdateDriver={handleUpdateDriver}
            onDeleteDriver={handleDeleteDriver}
          />
        );
      case "vehicles":
        return (
          <VehicleList
            vehicles={vehicles}
            drivers={drivers}
            onAddVehicle={handleAddVehicle}
            onUpdateVehicle={handleUpdateVehicle}
            onDeleteVehicle={handleDeleteVehicle}
          />
        );
      case "assignments":
        return (
          <AssignmentManager
            vehicles={vehicles}
            drivers={drivers}
            assignments={assignments}
            onAssignVehicle={handleAssignVehicle}
            onUnassignVehicle={handleUnassignVehicle}
          />
        );
      case "logs":
        return (
          <LogList
            logs={logs}
            drivers={drivers}
            vehicles={vehicles}
            onAddLog={handleAddLog}
            onUpdateLog={handleUpdateLog}
            onDeleteLog={handleDeleteLog}
          />
        );
      case "reports":
        return (
          <ReportGenerator
            drivers={drivers}
            vehicles={vehicles}
            logs={logs}
            onGenerateReport={handleGenerateReport}
          />
        );
        case "history":
          return (
            <HistoryPage />
          );
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onMenuClick={() => setSidebarOpen(true)} onSearch={handleSearch} />

      <div className="flex">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 p-6">{renderContent()}</main>
      </div>
    </div>
  );
}
