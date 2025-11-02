"use client";

import { useState, useEffect } from 'react';
import { DeviceData } from '../types/device';
import { useMQTTCool } from './useMQTTcool';

// MQTT Broker Configuration
// EMQX public broker supports WebSocket at ws://broker.emqx.io:8083/mqtt and
// secure WebSocket at wss://broker.emqx.io:8084/mqtt. We pick wss when the
// page is served over HTTPS to avoid mixed-content blocks.
const BROKER_HOST = 'broker.emqx.io';
const MQTT_COOL_URL = (typeof window !== 'undefined' && window.location.protocol === 'https:')
  ? `wss://${BROKER_HOST}:8084/mqtt`
  : `ws://${BROKER_HOST}:8083/mqtt`;

// Topics sesuai dengan STM32
const TOPIC_SENSOR_DATA = 'D04/sensor'; // Subscribe - terima data dari STM32
const TOPIC_CONTROL = 'D04/control';         // Publish - kirim perintah ke STM32

export function useDeviceData() {
  const [deviceData, setDeviceData] = useState<DeviceData>({
    isActive: false,
    batteryPercentage: 0,
    ratsDetected: 0,
    ultrasonicOutput: 0, // Frekuensi dalam kHz (20, 25, 30, 35, 40)
    lastUpdated: new Date(),
    connected: false,
    signalStrength: 0
  });

  const { isConnected, messages, subscribe, publish, connectionError } = useMQTTCool(MQTT_COOL_URL);

  // Subscribe ke topik sensor data saat koneksi berhasil
  useEffect(() => {
    if (isConnected) {
      console.log('Connection established, subscribing to topics...');
      subscribe(TOPIC_SENSOR_DATA, 0);
      console.log(`Listening on topic: ${TOPIC_SENSOR_DATA}`);
    }
  }, [isConnected, subscribe]);

  // Parse pesan MQTT yang diterima dari STM32
  useEffect(() => {
    if (messages.length > 0) {
      const latestMessage = messages[messages.length - 1];
      
      console.log('Processing message:', latestMessage);
      
      if (latestMessage.topic === TOPIC_SENSOR_DATA) {
        try {
          const messageStr = latestMessage.message;
          
          console.log('Data dari STM32:', messageStr);
          
          // Cek apakah pesan adalah "hei aku disini" dari STM32
          if (messageStr.includes('hei aku disini') || messageStr.includes('hei')) {
            console.log('Heartbeat message received from STM32');
            setDeviceData(prev => ({
              ...prev,
              isActive: true,
              connected: true,
              lastUpdated: new Date(),
              signalStrength: 90 + Math.floor(Math.random() * 10)
            }));
            return;
          }
          
          // Coba parse sebagai JSON
          try {
            const data = JSON.parse(messageStr);
            console.log('Parsed JSON data:', data);
            
            setDeviceData(prev => ({
              ...prev,
              // Prefer an explicit reported voltage field if present
              batteryVoltage: (data.battery_voltage !== undefined)
                ? data.battery_voltage
                : (data.voltage !== undefined)
                ? data.voltage
                : (data.battery !== undefined && typeof data.battery === 'number' && data.battery <= 5)
                ? data.battery
                : prev.batteryVoltage,
              ratsDetected: data.rats_detected ? prev.ratsDetected + 1 : prev.ratsDetected,
              // ultrasonicOutput menyimpan frekuensi dalam kHz dari STM32
              ultrasonicOutput: data.ultrasonic_freq !== undefined ? data.ultrasonic_freq : prev.ultrasonicOutput,
              isActive: data.is_active !== undefined ? data.is_active : prev.isActive,
              connected: true,
              lastUpdated: new Date(),
              signalStrength: 85 + Math.floor(Math.random() * 15)
            }));
          } catch (e) {
            // Jika bukan JSON, update last updated saja
            console.log('Non-JSON message received');
            setDeviceData(prev => ({
              ...prev,
              connected: true,
              lastUpdated: new Date(),
              signalStrength: 85 + Math.floor(Math.random() * 15)
            }));
          }
        } catch (error) {
          console.error('Error parsing MQTT message:', error);
        }
      }
    }
  }, [messages]);

  const toggleDevice = () => {
    if (!isConnected) {
      console.warn('Cannot toggle: Not connected to MQTT broker');
      return;
    }
    const newState = !deviceData.isActive;
    const controlMessage = newState ? 'START_NIGHT_MODE' : 'START_DAY_MODE';

    console.log('Sending control message to', TOPIC_CONTROL, ':', controlMessage);
    publish(TOPIC_CONTROL, controlMessage, 0);
    
    // Update state lokal
    setDeviceData(prev => ({
      ...prev,
      isActive: newState,
      lastUpdated: new Date()
    }));
  };

  return { deviceData, toggleDevice, isConnected, connectionError };
}