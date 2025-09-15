import React from 'react';
import { Zap } from 'lucide-react';

interface HeaderProps {
  isActive: boolean;
}

export function Header({ isActive }: HeaderProps) {
  return (
    <div className={`${isActive ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-gray-400 to-gray-500'} rounded-2xl p-8 mb-8 text-white shadow-2xl transition-all duration-500`}>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-light mb-2">Pengusir Tikus Ultrasonik</h1>
          <p className="text-xl opacity-90">Sistem Monitoring IoT untuk Petani</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className={`text-sm font-medium ${isActive ? 'text-green-100' : 'text-gray-200'}`}>
              Status Alat
            </div>
            <div className="text-2xl font-bold">
              {isActive ? 'AKTIF' : 'TIDAK AKTIF'}
            </div>
          </div>
          <div className={`p-3 rounded-full ${isActive ? 'bg-white/20' : 'bg-gray-600/20'}`}>
            <Zap className={`w-8 h-8 ${isActive ? 'text-white' : 'text-gray-300'}`} />
          </div>
        </div>
      </div>
    </div>
  );
}