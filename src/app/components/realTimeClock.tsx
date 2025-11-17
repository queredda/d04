import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface RealTimeClockProps {
  onScheduledToggle?: (shouldBeActive: boolean) => void;
}

export function RealTimeClock({ onScheduledToggle }: RealTimeClockProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextSchedule, setNextSchedule] = useState<{time: string, action: string} | null>(null);
  // Two-pass rendering: isClient state untuk menghindari hydration mismatch
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true after mount (client-side only)
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      
      // Get WIB time (GMT+7)
      const wibTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
      const hours = wibTime.getHours();
      const minutes = wibTime.getMinutes();
      const seconds = wibTime.getSeconds();
      
      // Check if it's time to auto-toggle
      // Activate at 18:00 (6 PM)
      if (hours === 18 && minutes === 0 && seconds === 0) {
        onScheduledToggle?.(true);
      }
      
      // Deactivate at 06:00 (6 AM)
      if (hours === 6 && minutes === 0 && seconds === 0) {
        onScheduledToggle?.(false);
      }
      
      // Calculate next schedule
      if (hours >= 6 && hours < 18) {
        setNextSchedule({ time: '18:00', action: 'Aktif' });
      } else {
        setNextSchedule({ time: '06:00', action: 'Nonaktif' });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [onScheduledToggle]);

  const formatTime = (date: Date) => {
    return date.toLocaleString('id-ID', {
      timeZone: 'Asia/Jakarta',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString('id-ID', {
      timeZone: 'Asia/Jakarta',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-6 sm:p-8 shadow-2xl text-white">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold mb-1">Waktu Real-Time</h3>
          <p className="text-sm opacity-90">Indonesia (GMT+7)</p>
        </div>
        <div className="bg-white/20 p-3 rounded-full">
          <Clock className="w-7 h-7" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Current Time Display dengan suppressHydrationWarning untuk timestamp */}
        <div className="lg:col-span-2 bg-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <div 
            className="text-6xl sm:text-7xl font-bold tracking-tight mb-3 font-mono"
            suppressHydrationWarning
          >
            {isClient ? formatTime(currentTime) : '--:--:--'}
          </div>
          <div 
            className="text-base opacity-95 font-medium"
            suppressHydrationWarning
          >
            {isClient ? formatDate(currentTime) : 'Loading...'}
          </div>
        </div>

        {/* Next Schedule */}
        <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/20 flex flex-col justify-between">
          <div>
            <div className="text-sm opacity-75 mb-3 font-medium">Jadwal Berikutnya</div>
            {isClient && nextSchedule && (
              <div className="space-y-3">
                <div suppressHydrationWarning>
                  <div className="text-4xl font-bold font-mono">{nextSchedule.time}</div>
                  <div className="text-sm opacity-90">WIB</div>
                </div>
                <div className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold ${
                  nextSchedule.action === 'Aktif' 
                    ? 'bg-green-400 text-green-900' 
                    : 'bg-red-400 text-red-900'
                }`}>
                  {nextSchedule.action}
                </div>
              </div>
            )}
            {!isClient && (
              <div className="space-y-3">
                <div className="text-4xl font-bold font-mono">--:--</div>
                <div className="text-sm opacity-90">WIB</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Schedule Info - Static content, no hydration issue */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <div className="flex items-center gap-3">
            <div className="bg-green-400 p-2 rounded-lg">
              <span className="text-2xl">🌙</span>
            </div>
            <div>
              <div className="text-sm opacity-75">Aktif Otomatis</div>
              <div className="text-xl font-bold">18:00 WIB</div>
            </div>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-400 p-2 rounded-lg">
              <span className="text-2xl">☀️</span>
            </div>
            <div>
              <div className="text-sm opacity-75">Nonaktif Otomatis</div>
              <div className="text-xl font-bold">06:00 WIB</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}