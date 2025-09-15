import React from 'react';
import { Battery } from 'lucide-react';

interface BatteryCardProps {
  percentage: number;
}

export function BatteryCard({ percentage }: BatteryCardProps) {
  const getBatteryColor = (percentage: number) => {
    if (percentage > 50) return 'text-green-500';
    if (percentage > 20) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getBatteryBgColor = (percentage: number) => {
    if (percentage > 50) return 'bg-green-500';
    if (percentage > 20) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getBatteryStatus = (percentage: number) => {
    if (percentage > 50) return 'Baik';
    if (percentage > 20) return 'Sedang';
    return 'Rendah';
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-700">Status Baterai</h3>
        <Battery className={`w-6 h-6 ${getBatteryColor(percentage)}`} />
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold text-gray-800">{percentage.toFixed(1)}%</span>
          <span className={`text-sm font-medium ${getBatteryColor(percentage)}`}>
            {getBatteryStatus(percentage)}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-300 ${getBatteryBgColor(percentage)}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}