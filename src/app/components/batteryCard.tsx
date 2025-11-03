import React from 'react';
import { Battery } from 'lucide-react';

interface BatteryCardProps {
  // percentage is still accepted for color/status fallback
  percentage: number;
  // optional measured voltage (in volts) reported by the device
  voltage?: number | null;
}

export function BatteryCard({ percentage, voltage }: BatteryCardProps) {
  const getBatteryColor = (v: number) => {
    if (v >= 3.7) return 'text-green-500';
    if (v >= 3.4) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getBatteryStatus = (v: number) => {
    if (v >= 3.7) return 'Baik';
    if (v >= 3.4) return 'Sedang';
    return 'Rendah';
  };

  // If the device reports voltage, display it. Otherwise map percentage to voltage
  const displayVoltage = typeof voltage === 'number'
    ? +voltage.toFixed(2)
    : +(3 + (percentage / 100) * 1.2).toFixed(2);

  const batteryColor = getBatteryColor(displayVoltage);

  return (
    <div className="bg-white rounded-3xl p-7 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Status Baterai</h3>
        <div className={`p-3 rounded-full bg-gray-50 ${batteryColor}`}>
          <Battery className="w-6 h-6" />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-8">
        <div className="relative">
          <span className="text-5xl font-black text-gray-900">{displayVoltage}</span>
          <span className="text-2xl font-bold text-gray-600 ml-2">V</span>
        </div>
        <span className="text-base font-medium text-gray-600 mt-3">Tegangan Baterai</span>

        <div className={`mt-4 px-4 py-2 rounded-full text-sm font-semibold ${
          displayVoltage >= 3.7
            ? 'bg-green-100 text-green-800'
            : displayVoltage >= 3.4
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {getBatteryStatus(displayVoltage)}
        </div>
      </div>
    </div>
  );
}