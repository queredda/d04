import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';

interface UltrasonicCardProps {
  output: number;
  isActive: boolean;
  // optional callback when user picks a stage
  onStageChange?: (freqKhz: number) => void;
}

export function UltrasonicCard({ output, isActive, onStageChange }: UltrasonicCardProps) {
  // Five stages in kHz
  const stages = [20, 25, 30, 35, 40];
  const [selected, setSelected] = useState<number>(stages[0]);

  const handleSelect = (freq: number) => {
    setSelected(freq);
    if (onStageChange) onStageChange(freq);
  };

  const getOutputStatus = (isActive: boolean) => {
    return isActive ? 'On' : 'Off';
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
            <div className="text-sm text-gray-500">Frekuensi</div>
            <div className="text-lg font-bold text-gray-800">{selected} kHz</div>
          </div>
        </div>

        {/* Stage selector: five distinct buttons. No progress bar. */}
        <div className="flex gap-2">
          {stages.map((s) => (
            <button
              key={s}
              onClick={() => handleSelect(s)}
              className={`px-3 py-2 rounded-lg border transition-colors duration-150 text-sm font-medium 
                ${selected === s ? 'bg-purple-500 text-white border-purple-500' : 'bg-white text-gray-700 border-gray-200'}
                ${!isActive ? 'opacity-60 cursor-not-allowed' : 'hover:bg-purple-100'}`}
              disabled={!isActive}
              aria-pressed={selected === s}
              aria-label={`${s} kHz`}
            >
              {s} kHz
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}