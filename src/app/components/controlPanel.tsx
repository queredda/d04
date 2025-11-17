"use client";
import React from 'react';
import { Power, Zap } from 'lucide-react';

interface ControlPanelProps {
  isActive: boolean;
  onToggle: () => void;
}

export function ControlPanel({ isActive, onToggle }: ControlPanelProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 rounded-lg ${isActive ? 'bg-green-100' : 'bg-gray-100'}`}>
          <Zap className={`w-6 h-6 ${isActive ? 'text-green-600' : 'text-gray-400'}`} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Panel Kontrol</h2>
          <p className="text-sm text-gray-500">Kendalikan perangkat</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center space-y-6">
        {/* Status Display */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Status Saat Ini</span>
            <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
          </div>
          <div className={`text-2xl font-bold ${isActive ? 'text-green-600' : 'text-gray-400'}`}>
            {isActive ? 'AKTIF' : 'NONAKTIF'}
          </div>
        </div>

        {/* Toggle Button */}
        <button
          onClick={onToggle}
          className={`w-full flex items-center justify-center gap-3 px-6 py-5 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg ${
            isActive 
              ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-red-200' 
              : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-green-200'
          }`}
        >
          <Power className="w-6 h-6" />
          {isActive ? 'Matikan Alat' : 'Nyalakan Alat'}
        </button>

        {/* Info */}
        <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100">
          <p>Tekan tombol untuk mengubah status alat</p>
          <p className="mt-1">atau gunakan penjadwalan otomatis</p>
        </div>
      </div>
    </div>
  );
}