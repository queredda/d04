export interface DeviceData {
  isActive: boolean;
  batteryPercentage: number;
  ratsDetected: number;
  ultrasonicOutput: number;
  lastUpdated: Date;
  signalStrength: number;
}