"use client";

import React from 'react';
import { Power } from 'lucide-react';

interface ControlPanelProps {
  isActive: boolean;
  onToggle: () => void;
}

export function ControlPanel({ isActive, onToggle }: ControlPanelProps) {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">Panel Kontrol</h2>
          <p className="text-gray-600 text-lg">Kontrol utama sistem pengusir tikus ultrasonik</p>
        </div>

        <button
          onClick={onToggle}
          className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg border-2 ${
            isActive
              ? 'bg-red-500 hover:bg-red-600 text-white border-red-600 hover:border-red-700'
              : 'bg-green-500 hover:bg-green-600 text-white border-green-600 hover:border-green-700'
          }`}
        >
          <Power className="w-6 h-6" />
          {isActive ? 'Matikan Alat' : 'Nyalakan Alat'}
        </button>
      </div>

      {/* Status indicator */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full animate-pulse ${
            isActive ? 'bg-green-500' : 'bg-gray-400'
          }`} />
          <span className="text-sm font-medium text-gray-700">
            Sistem {isActive ? 'sedang aktif' : 'tidak aktif'}
          </span>
        </div>
      </div>
    </div>
  );
}