"use client";

import React from 'react';

interface ShowDataButtonProps {
  ultrasonicOutput?: number | null;
  batteryVoltage?: number | null;
  batteryPercentage: number;
  className?: string;
  label?: string;
}

export function ShowDataButton({
  ultrasonicOutput,
  batteryVoltage,
  batteryPercentage,
  className = '',
  label = 'Show Data'
}: ShowDataButtonProps) {
  const handleClick = async () => {
    try {
      const freq = ultrasonicOutput ?? 0;
      const freqStr = freq >= 1000 ? `${(freq / 1000).toFixed(2)} kHz` : `${freq} Hz`;
      const voltage = (typeof batteryVoltage === 'number')
        ? +batteryVoltage.toFixed(2)
        : +(3 + (batteryPercentage / 100) * 1.2).toFixed(2);
      const body = `Last frequency: ${freqStr}\nBattery voltage: ${voltage} V`;

      if (typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'granted') {
          new Notification('Device Data', { body });
        } else if (Notification.permission !== 'denied') {
          const perm = await Notification.requestPermission();
          if (perm === 'granted') new Notification('Device Data', { body });
          else alert(body);
        } else {
          alert(body);
        }
      } else {
        alert(body);
      }
    } catch (e) {
      // fallback
      alert('Unable to show notification');
    }
  };

  return (
    <button
      type="button"
      className={`inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${className}`}
      onClick={handleClick}
    >
      {label}
    </button>
  );
}

export default ShowDataButton;
