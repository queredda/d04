import React from 'react';
import { Wifi } from 'lucide-react';

interface ConnectionCardProps {
  connected: boolean;
}

export function ConnectionCard({ connected }: ConnectionCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-700">Status Koneksi</h3>
        <Wifi className={`w-6 h-6 ${connected ? 'text-green-500' : 'text-gray-400'}`} />
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-800">{connected ? 'Connected' : 'Disconnected'}</span>
          <span className={`text-sm font-medium ${connected ? 'text-green-600' : 'text-gray-600'}`}>
            {connected ? 'Terkoneksi' : 'Tidak Terkoneksi'}
          </span>
        </div>
        <div className="text-sm text-gray-500">Status koneksi perangkat</div>
      </div>
    </div>
  );
}