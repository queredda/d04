import React from 'react';
import { Battery } from 'lucide-react';

interface BatteryCardProps {
  // percentage is still accepted for color/status fallback
  percentage: number;
  // optional measured voltage (in volts) reported by the device
  voltage?: number | null;
}

export function BatteryCard({ percentage, voltage }: BatteryCardProps) {
  const getBatteryColor = (p: number) => {
    if (p > 50) return 'text-green-500';
    if (p > 20) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getBatteryStatus = (p: number) => {
    if (p > 50) return 'Baik';
    if (p > 20) return 'Sedang';
    return 'Rendah';
  };

  // If the device reports voltage, display it. Otherwise map percentage to voltage
  const displayVoltage = typeof voltage === 'number'
    ? +voltage.toFixed(2)
    : +(3 + (percentage / 100) * 1.2).toFixed(2);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-700">Status Baterai</h3>
        <Battery className={`w-6 h-6 ${getBatteryColor(percentage)}`} />
      </div>

      <div className="flex flex-col items-center justify-center py-6">
        <span className="text-4xl font-extrabold text-gray-900">{displayVoltage} V</span>
        <span className="text-sm text-gray-500 mt-1">Battery Voltage</span>
        <div className="mt-2 text-xs text-gray-400">{getBatteryStatus(percentage)}</div>
      </div>
    </div>
  );
}