import { useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Driver, Vehicle, VehicleAssignment, DriverLog } from '../types';

export function useVehicleData() {
  const [drivers, setDrivers] = useLocalStorage<Driver[]>('vis_drivers', []);
  const [vehicles, setVehicles] = useLocalStorage<Vehicle[]>('vis_vehicles', []);
  const [assignments, setAssignments] = useLocalStorage<VehicleAssignment[]>('vis_assignments', []);
  const [logs, setLogs] = useLocalStorage<DriverLog[]>('vis_logs', []);

  // Driver operations
  const addDriver = useCallback((driver: Omit<Driver, 'id'>) => {
    const newDriver = { ...driver, id: Date.now().toString() };
    setDrivers(prev => [...prev, newDriver]);
    return newDriver;
  }, [setDrivers]);

  const updateDriver = useCallback((id: string, updates: Partial<Driver>) => {
    setDrivers(prev => prev.map(driver => 
      driver.id === id ? { ...driver, ...updates } : driver
    ));
  }, [setDrivers]);

  const deleteDriver = useCallback((id: string) => {
    setDrivers(prev => prev.filter(driver => driver.id !== id));
    // Also remove assignments and logs for this driver
    setAssignments(prev => prev.filter(assignment => assignment.driverId !== id));
    setLogs(prev => prev.filter(log => log.driverId !== id));
  }, [setDrivers, setAssignments, setLogs]);

  // Vehicle operations
  const addVehicle = useCallback((vehicle: Omit<Vehicle, 'id'>) => {
    const newVehicle = { ...vehicle, id: Date.now().toString() };
    setVehicles(prev => [...prev, newVehicle]);
    return newVehicle;
  }, [setVehicles]);

  const updateVehicle = useCallback((id: string, updates: Partial<Vehicle>) => {
    setVehicles(prev => prev.map(vehicle => 
      vehicle.id === id ? { ...vehicle, ...updates } : vehicle
    ));
  }, [setVehicles]);

  const deleteVehicle = useCallback((id: string) => {
    setVehicles(prev => prev.filter(vehicle => vehicle.id !== id));
    // Also remove assignments and logs for this vehicle
    setAssignments(prev => prev.filter(assignment => assignment.vehicleId !== id));
    setLogs(prev => prev.filter(log => log.vehicleId !== id));
  }, [setVehicles, setAssignments, setLogs]);

  // Assignment operations
  const assignVehicle = useCallback((vehicleId: string, driverId: string) => {
    const assignment: VehicleAssignment = {
      id: Date.now().toString(),
      vehicleId,
      driverId,
      assignedDate: new Date().toISOString().split('T')[0],
      status: 'active'
    };
    setAssignments(prev => [...prev, assignment]);
    setVehicles(prev => prev.map(vehicle => 
      vehicle.id === vehicleId ? { ...vehicle, status: 'assigned' as const, assignedDriverId: driverId } : vehicle
    ));
    return assignment;
  }, [setAssignments, setVehicles]);

  const unassignVehicle = useCallback((vehicleId: string) => {
    setAssignments(prev => prev.map(assignment => 
      assignment.vehicleId === vehicleId && assignment.status === 'active'
        ? { ...assignment, status: 'completed' as const, unassignedDate: new Date().toISOString().split('T')[0] }
        : assignment
    ));
    setVehicles(prev => prev.map(vehicle => 
      vehicle.id === vehicleId 
        ? { ...vehicle, status: 'available' as const, assignedDriverId: undefined }
        : vehicle
    ));
  }, [setAssignments, setVehicles]);

  // Log operations
  const addLog = useCallback((log: Omit<DriverLog, 'id'>) => {
    const newLog = { ...log, id: Date.now().toString() };
    setLogs(prev => [...prev, newLog]);
    return newLog;
  }, [setLogs]);

  const updateLog = useCallback((id: string, updates: Partial<DriverLog>) => {
    setLogs(prev => prev.map(log => 
      log.id === id ? { ...log, ...updates } : log
    ));
  }, [setLogs]);

  const deleteLog = useCallback((id: string) => {
    setLogs(prev => prev.filter(log => log.id !== id));
  }, [setLogs]);

  // Helper functions
  const getDriverById = useCallback((id: string) => {
    return drivers.find(driver => driver.id === id);
  }, [drivers]);

  const getVehicleById = useCallback((id: string) => {
    return vehicles.find(vehicle => vehicle.id === id);
  }, [vehicles]);

  const getAssignmentByVehicleId = useCallback((vehicleId: string) => {
    return assignments.find(assignment => 
      assignment.vehicleId === vehicleId && assignment.status === 'active'
    );
  }, [assignments]);

  const getLogsByDriverId = useCallback((driverId: string) => {
    return logs.filter(log => log.driverId === driverId);
  }, [logs]);

  const getLogsByVehicleId = useCallback((vehicleId: string) => {
    return logs.filter(log => log.vehicleId === vehicleId);
  }, [logs]);

  const searchDrivers = useCallback((query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return drivers.filter(driver =>
      driver.name.toLowerCase().includes(lowercaseQuery) ||
      driver.licenseNumber.toLowerCase().includes(lowercaseQuery) ||
      driver.email.toLowerCase().includes(lowercaseQuery)
    );
  }, [drivers]);

  const searchVehicles = useCallback((query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return vehicles.filter(vehicle =>
      vehicle.plateNumber.toLowerCase().includes(lowercaseQuery) ||
      vehicle.make.toLowerCase().includes(lowercaseQuery) ||
      vehicle.model.toLowerCase().includes(lowercaseQuery) ||
      vehicle.vin.toLowerCase().includes(lowercaseQuery)
    );
  }, [vehicles]);

  return {
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
    getDriverById,
    getVehicleById,
    getAssignmentByVehicleId,
    getLogsByDriverId,
    getLogsByVehicleId,
    searchDrivers,
    searchVehicles,
  };
}