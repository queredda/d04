"use client";
import React from 'react';
import { Header } from './components/header';
import { ControlPanel } from './components/controlPanel';
import { StatsGrid } from './components/statsGrid';
import { useDeviceData } from './hooks/useDeviceData';

export default function RatRepellentDashboard() {
  const { deviceData, toggleDevice } = useDeviceData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Header isActive={deviceData.isActive} />

        <div className="mb-8">
          <ControlPanel
            isActive={deviceData.isActive}
            onToggle={toggleDevice}
          />
        </div>

        <StatsGrid deviceData={deviceData} />

        <div className="text-center mt-12 text-gray-600">
          <p className="text-lg">Sistem monitoring pengusir tikus ultrasonik untuk pertanian modern</p>
        </div>

        <footer className="mt-16 border-t border-gray-200">
          <div className="w-full flex justify-center items-center text-gray-500 text-sm py-6">
            <span className="inline-flex items-center gap-2">
              <span aria-hidden>©</span>
              <span>Copyrights Capstone D04</span>
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}