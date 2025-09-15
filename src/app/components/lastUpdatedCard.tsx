import React from 'react';
import { Clock } from 'lucide-react';

interface LastUpdatedCardProps {
  lastUpdated: Date;
}

export function LastUpdatedCard({ lastUpdated }: LastUpdatedCardProps) {
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
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-700">Pembaruan Terakhir</h3>
        <Clock className="w-6 h-6 text-blue-500" />
      </div>
      <div className="space-y-2">
        <div className="text-lg font-semibold text-gray-800">
          {formatTime(lastUpdated)}
        </div>
        <div className="text-sm text-gray-500">Sinkronisasi data terbaru</div>
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
          Terhubung
        </div>
      </div>
    </div>
  );
}