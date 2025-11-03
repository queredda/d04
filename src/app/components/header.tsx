import React from 'react';
import { Zap } from 'lucide-react';

interface HeaderProps {
  isActive: boolean;
}

export function Header({ isActive }: HeaderProps) {
  return (
    <div className={`${isActive ? 'bg-gradient-to-r from-green-600 via-green-500 to-emerald-600' : 'bg-gradient-to-r from-gray-500 via-gray-400 to-gray-500'} rounded-3xl p-8 sm:p-10 mb-8 text-white shadow-2xl transition-all duration-700`}>
      <div className="flex items-center justify-between flex-wrap gap-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 tracking-tight">Pengusir Tikus Ultrasonik</h1>
          <p className="text-xl sm:text-2xl opacity-90 font-medium">Sistem Monitoring IoT untuk Pertanian Modern</p>
        </div>

        <div className="flex items-center gap-6 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="text-right">
            <div className={`text-sm font-semibold uppercase tracking-wide ${isActive ? 'text-green-100' : 'text-gray-200'}`}>
              Status Alat
            </div>
            <div className="text-3xl font-black mt-1">
              {isActive ? 'AKTIF' : 'STANDBY'}
            </div>
          </div>
          <div className={`p-4 rounded-full ${isActive ? 'bg-white/20 animate-pulse' : 'bg-gray-600/20'}`}>
            <Zap className={`w-10 h-10 ${isActive ? 'text-yellow-300' : 'text-gray-300'}`} />
          </div>
        </div>
      </div>

      {/* Status indicator line */}
      <div className="mt-6 pt-6 border-t border-white/20">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full animate-pulse ${
            isActive ? 'bg-yellow-300' : 'bg-gray-400'
          }`} />
          <span className="text-sm font-medium text-white/80">
            {isActive ? 'Sistem sedang aktif dan memantau area' : 'Sistem dalam mode siaga'}
          </span>
        </div>
      </div>
    </div>
  );
}