import React from 'react';
import { BatteryCard } from './batteryCard';
import { RatsDetectedCard } from './ratsDetectedCard';
import { UltrasonicCard } from './ultrasonicCard';
import { ConnectionCard } from './connectionCard';
import { LastUpdatedCard } from './lastUpdatedCard';
import { DeviceData } from '../types/device';

interface StatsGridProps {
  deviceData: DeviceData;
}

export function StatsGrid({ deviceData }: StatsGridProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <BatteryCard percentage={deviceData.batteryPercentage} />
        <RatsDetectedCard 
          count={deviceData.ratsDetected} 
          isActive={deviceData.isActive} 
        />
        <UltrasonicCard 
          output={deviceData.ultrasonicOutput} 
          isActive={deviceData.isActive} 
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ConnectionCard signalStrength={deviceData.signalStrength} />
        <LastUpdatedCard lastUpdated={deviceData.lastUpdated} />
      </div>
    </>
  );
}