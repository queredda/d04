import React from 'react';
import { MousePointer } from 'lucide-react';

interface RatsDetectedCardProps {
  count: number;
  isActive: boolean;
}

export function RatsDetectedCard({ count, isActive }: RatsDetectedCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-700">Tikus Terdeteksi</h3>
        <MousePointer className="w-6 h-6 text-orange-500" />
      </div>
      <div className="space-y-2">
        <div className="text-3xl font-bold text-gray-800">{count}</div>
        <div className="text-sm text-gray-500">Total hari ini</div>
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
          isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
        }`}>
          {isActive ? 'Aktif Memantau' : 'Tidak Memantau'}
        </div>
      </div>
    </div>
  );
}