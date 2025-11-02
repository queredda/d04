"use client";

import { useState, useEffect } from 'react';
import { DeviceData } from '../types/device';
import { useMQTTCool } from './useMQTTcool';

// MQTT Broker Configuration
const MQTT_COOL_URL = 'ws://test.mosquitto.org:8081';

// Topics sesuai dengan STM32
const TOPIC_SENSOR_DATA = 'sensor/dataD04'; // Subscribe - terima data dari STM32
const TOPIC_CONTROL = 'iot/control';         // Publish - kirim perintah ke STM32

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
              batteryPercentage: data.battery !== undefined ? data.battery : prev.batteryPercentage,
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
    
    // Kirim perintah on/off ke STM32 dalam format JSON
    const controlMessage = JSON.stringify({
      state: newState ? 1 : 0,
      timestamp: new Date().toISOString()
    });
    
    console.log('Sending control message:', controlMessage);
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