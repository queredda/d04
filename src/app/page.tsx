"use client";
import React from 'react';
import { Header } from './components/header';
import { ControlPanel } from './components/controlPanel';
import { StatsGrid } from './components/statsGrid';
import { useDeviceData } from './hooks/useDeviceData';

export default function RatRepellentDashboard() {
  const { deviceData, toggleDevice } = useDeviceData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <Header isActive={deviceData.isActive} />
        
        <ControlPanel 
          isActive={deviceData.isActive} 
          onToggle={toggleDevice} 
        />
        
        <StatsGrid deviceData={deviceData} />

        <div className="text-center mt-8 text-gray-500">
          <p>Sistem monitoring pengusir tikus ultrasonik untuk pertanian modern</p>
        </div>
      </div>
    </div>
  );
}