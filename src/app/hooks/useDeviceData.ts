"use client";
import { useState, useEffect } from 'react';
import { DeviceData } from '../types/device';

export function useDeviceData() {
  const [deviceData, setDeviceData] = useState<DeviceData>({
    isActive: true,
    batteryPercentage: 78,
    ratsDetected: 12,
    ultrasonicOutput: 85,
    lastUpdated: new Date(),
    signalStrength: 92
  });

  const toggleDevice = () => {
    setDeviceData(prev => ({
      ...prev,
      isActive: !prev.isActive,
      lastUpdated: new Date()
    }));
  };

  // Simulasi update data setiap 5 detik
  useEffect(() => {
    const interval = setInterval(() => {
      if (deviceData.isActive) {
        setDeviceData(prev => ({
          ...prev,
          ratsDetected: prev.ratsDetected + Math.floor(Math.random() * 2),
          ultrasonicOutput: 80 + Math.floor(Math.random() * 20),
          batteryPercentage: Math.max(0, prev.batteryPercentage - 0.1),
          lastUpdated: new Date(),
          signalStrength: 85 + Math.floor(Math.random() * 15)
        }));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [deviceData.isActive]);

  return { deviceData, toggleDevice };
}
