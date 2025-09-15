import React from 'react';
import { Volume2 } from 'lucide-react';

interface UltrasonicCardProps {
  output: number;
  isActive: boolean;
}

export function UltrasonicCard({ output, isActive }: UltrasonicCardProps) {
  const getOutputStatus = (output: number, isActive: boolean) => {
    if (!isActive) return 'Off';
    return output > 80 ? 'Optimal' : 'Sedang';
  };

  const getStatusColor = (output: number, isActive: boolean) => {
    if (!isActive) return 'text-gray-400';
    return output > 80 ? 'text-green-600' : 'text-yellow-600';
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-700">Output Ultrasonik</h3>
        <Volume2 className={`w-6 h-6 ${isActive ? 'text-purple-500' : 'text-gray-400'}`} />
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold text-gray-800">
            {isActive ? output : 0}%
          </span>
          <span className={`text-sm font-medium ${getStatusColor(output, isActive)}`}>
            {getOutputStatus(output, isActive)}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-300 ${
              isActive ? 'bg-purple-500' : 'bg-gray-400'
            }`}
            style={{ width: `${isActive ? output : 0}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}