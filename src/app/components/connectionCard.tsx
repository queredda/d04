import React from 'react';
import { Wifi } from 'lucide-react';

interface ConnectionCardProps {
  signalStrength: number;
}

export function ConnectionCard({ signalStrength }: ConnectionCardProps) {
  const getSignalColor = (strength: number) => {
    if (strength > 70) return 'text-green-500';
    if (strength > 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getSignalStatus = (strength: number) => {
    if (strength > 70) return 'Kuat';
    if (strength > 40) return 'Sedang';
    return 'Lemah';
  };

  const getSignalTextColor = (strength: number) => {
    if (strength > 70) return 'text-green-600';
    if (strength > 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-700">Status Koneksi</h3>
        <Wifi className={`w-6 h-6 ${getSignalColor(signalStrength)}`} />
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-800">{signalStrength}%</span>
          <span className={`text-sm font-medium ${getSignalTextColor(signalStrength)}`}>
            {getSignalStatus(signalStrength)}
          </span>
        </div>
        <div className="text-sm text-gray-500">Kualitas sinyal IoT</div>
      </div>
    </div>
  );
}