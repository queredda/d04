"use client";
import React from 'react';
import { Header } from './components/header';
import { ControlPanel } from './components/controlPanel';
import { StatsGrid } from './components/statsGrid';
import { RealTimeClock } from './components/realTimeClock';
import { useDeviceData } from './hooks/useDeviceData';

export default function RatRepellentDashboard() {
  const { deviceData, toggleDevice, handleScheduledToggle } = useDeviceData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Header isActive={deviceData.isActive} />
        
        {/* Grid layout untuk RTC dan Control Panel */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          {/* Real-Time Clock */}
          <div className="xl:col-span-2">
            <RealTimeClock onScheduledToggle={handleScheduledToggle} />
          </div>
          
          {/* Control Panel */}
          <div className="xl:col-span-1">
            <ControlPanel 
              isActive={deviceData.isActive} 
              onToggle={toggleDevice} 
            />
          </div>
        </div>
        
        <StatsGrid deviceData={deviceData} />

        <div className="text-center mt-8 text-gray-500">
          <p className="text-base">Sistem monitoring pengusir tikus ultrasonik untuk pertanian modern</p>
          <p className="text-sm mt-2 font-medium">⏰ Penjadwalan Otomatis: Aktif 18:00 - 06:00 WIB</p>
        </div>
      </div>
    </div>
  );
}