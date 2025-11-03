import React from 'react';
import { Clock } from 'lucide-react';
import ShowDataButton from './showDataButton';
import { DeviceData } from '../types/device';

interface LastUpdatedCardProps {
  deviceData: DeviceData;
}

export function LastUpdatedCard({ deviceData }: LastUpdatedCardProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  return (
    <div className="bg-white rounded-3xl p-7 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Pembaruan Terakhir</h3>
        <div className="p-3 rounded-full bg-blue-100">
          <Clock className="w-6 h-6 text-blue-500" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {formatTime(deviceData.lastUpdated)}
          </div>
          <div className="text-base font-medium text-gray-600 mt-2">Sinkronisasi data terbaru</div>
        </div>

        <div className="flex items-center justify-center px-4 py-3 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 border border-blue-200">
          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
          Data Terhubung
        </div>

        <div className="mt-6">
          <ShowDataButton
            ultrasonicOutput={deviceData.ultrasonicOutput}
            batteryVoltage={deviceData.batteryVoltage ?? null}
            batteryPercentage={deviceData.batteryPercentage}
            label="Show Data"
          />
        </div>
      </div>
    </div>
  );
}