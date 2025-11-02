"use client";

import React from 'react';
import { Power } from 'lucide-react';

interface ControlPanelProps {
  isActive: boolean;
  onToggle: () => void;
}

export function ControlPanel({ isActive, onToggle }: ControlPanelProps) {
  return (
    <div className="bg-white rounded-2xl p-6 mb-8 shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Panel Kontrol</h2>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">Kontrol Alat</h3>
          <p className="text-gray-500">Nyalakan atau matikan pengusir tikus</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={onToggle}
            className={`flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${
              isActive
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            <Power className="w-5 h-5" />
            {isActive ? 'Matikan Alat' : 'Nyalakan Alat'}
          </button>
        </div>
      </div>
    </div>
  );
}