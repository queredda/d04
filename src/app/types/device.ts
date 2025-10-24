export interface DeviceData {
  isActive: boolean;
  batteryPercentage: number;
  ratsDetected: number;
  ultrasonicOutput: number;
  lastUpdated: Date;
  // Indicates whether the device is connected to the broker / reachable
  connected: boolean;
  // optional legacy field if you still publish signal strength
  signalStrength?: number;
}