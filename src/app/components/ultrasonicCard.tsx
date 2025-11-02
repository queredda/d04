import React from 'react';
import { Volume2 } from 'lucide-react';

interface UltrasonicCardProps {
  output: number; // Frekuensi dari STM32 dalam kHz (20, 25, 30, 35, 40)
  isActive: boolean;
}

export function UltrasonicCard({ output, isActive }: UltrasonicCardProps) {
  // Five stages in kHz
  const stages = [20, 25, 30, 35, 40];

  const getOutputStatus = (isActive: boolean) => {
    return isActive ? 'On' : 'Off';
  };

  // Tentukan stage mana yang sedang aktif berdasarkan output
  const getCurrentStageIndex = () => {
    const index = stages.indexOf(output);
    return index !== -1 ? index : 0;
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-700">Output Ultrasonik</h3>
        <Volume2 className={`w-6 h-6 ${isActive ? 'text-purple-500' : 'text-gray-400'}`} />
      </div>

      <div className="space-y-4">
        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-sm text-gray-500">Status</div>
            <div className={`text-lg font-medium ${isActive ? 'text-green-600' : 'text-gray-400'}`}>
              {getOutputStatus(isActive)}
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm text-gray-500">Frekuensi Aktif</div>
            <div className={`text-2xl font-bold ${isActive ? 'text-purple-600' : 'text-gray-400'}`}>
              {isActive ? output : 0} kHz
            </div>
          </div>
        </div>

        {/* Stage indicator: menampilkan tahap mana yang sedang aktif */}
        <div>
          <div className="text-xs text-gray-500 mb-2">
            Tahap Frekuensi {isActive ? `(${getCurrentStageIndex() + 1}/5)` : ''}
          </div>
          <div className="flex gap-2">
            {stages.map((s, index) => (
              <div
                key={s}
                className={`flex-1 px-3 py-2 rounded-lg border text-center text-sm font-medium transition-all duration-300
                  ${output === s && isActive 
                    ? 'bg-purple-500 text-white border-purple-500 shadow-lg scale-105' 
                    : 'bg-gray-50 text-gray-400 border-gray-200'
                  }`}
              >
                {s} kHz
              </div>
            ))}
          </div>
        </div>

        {/* Informasi tambahan */}
        {!isActive && (
          <div className="text-xs text-gray-400 text-center mt-2">
            Alat sedang tidak aktif
          </div>
        )}
      </div>
    </div>
  );
}