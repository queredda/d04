import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';

interface ConnectionCardProps {
  isConnected: boolean;
}

export function ConnectionCard({ isConnected }: ConnectionCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-700">Status Koneksi</h3>
        {isConnected ? (
          <Wifi className="w-6 h-6 text-green-500" />
        ) : (
          <WifiOff className="w-6 h-6 text-red-500" />
        )}
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className={`text-2xl font-bold ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
            {isConnected ? 'Terhubung' : 'Terputus'}
          </span>
        </div>
        <div className="text-sm text-gray-500">Status WiFi perangkat</div>
      </div>
    </div>
  );
}