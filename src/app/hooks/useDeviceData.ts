"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { DeviceData } from '../types/device';
import { useMQTTCool } from './useMQTTcool';

const BROKER_HOST = 'broker.emqx.io';
const MQTT_COOL_URL = (typeof window !== 'undefined' && window.location.protocol === 'https:')
  ? `wss://${BROKER_HOST}:8084/mqtt`
  : `ws://${BROKER_HOST}:8083/mqtt`;

const TOPIC_SENSOR_DATA = 'D04/sensor';
const TOPIC_CONTROL = 'D04/control';

export function useDeviceData() {
  const [deviceData, setDeviceData] = useState<DeviceData>({
    isActive: false,
    batteryPercentage: 0,
    ratsDetected: 0,
    ultrasonicOutput: 0,
    lastUpdated: new Date(),
    connected: false,
    signalStrength: 0
  });

  const subscribed = useRef(false);
  const lastMessageId = useRef<string>('');

  const { isConnected, messages, subscribe, publish, connectionError } = useMQTTCool(MQTT_COOL_URL);

  // Subscribe hanya sekali
  useEffect(() => {
    if (isConnected && !subscribed.current) {
      console.log('Subscribing to:', TOPIC_SENSOR_DATA);
      subscribe(TOPIC_SENSOR_DATA, 0);
      subscribed.current = true;
    }
  }, [isConnected, subscribe]);

  // Parse messages dengan debouncing
  useEffect(() => {
    if (messages.length === 0) return;

    const latestMessage = messages[messages.length - 1];
    const messageId = `${latestMessage.topic}-${latestMessage.message}`;
    
    // Hindari process message yang sama
    if (messageId === lastMessageId.current) return;
    lastMessageId.current = messageId;
    
    if (latestMessage.topic !== TOPIC_SENSOR_DATA) return;

    try {
      const messageStr = latestMessage.message;
      console.log('Data:', messageStr);
      
      // Heartbeat
      if (messageStr.includes('hei')) {
        setDeviceData(prev => ({
          ...prev,
          isActive: true,
          connected: true,
          lastUpdated: new Date(),
        }));
        return;
      }
      
      // JSON parsing
      try {
        const data = JSON.parse(messageStr);
        console.log('Parsed:', data);
        
        setDeviceData(prev => {
          // Hanya update jika ada perubahan
          const hasChanges = 
            (data.bat !== undefined && data.bat !== prev.batteryVoltage) ||
            (data.pir === 1) ||
            (data.freq_khz !== undefined && data.freq_khz !== prev.ultrasonicOutput) ||
            (data.status !== undefined && (data.status === 'active') !== prev.isActive);

          if (!hasChanges) return prev;

          return {
            ...prev,
            batteryVoltage: data.bat !== undefined ? data.bat : prev.batteryVoltage,
            ratsDetected: data.pir === 1 ? prev.ratsDetected + 1 : prev.ratsDetected,
            ultrasonicOutput: data.freq_khz !== undefined ? data.freq_khz : prev.ultrasonicOutput,
            isActive: data.status === 'active',
            connected: true,
            lastUpdated: new Date(),
          };
        });
      } catch (e) {
        // Non-JSON
        setDeviceData(prev => ({
          ...prev,
          connected: true,
          lastUpdated: new Date(),
        }));
      }
    } catch (error) {
      console.error('Parse error:', error);
    }
  }, [messages]);

  const toggleDevice = useCallback(() => {
    const newState = !deviceData.isActive;
    const message = newState ? 'start night mode' : 'start day mode';
    
    console.log('Toggle:', message);
    publish(TOPIC_CONTROL, message, 0);
    
    setDeviceData(prev => ({
      ...prev,
      isActive: newState,
      lastUpdated: new Date()
    }));
  }, [deviceData.isActive, publish]);

  return {
    deviceData,
    toggleDevice,
    isConnected,
    connectionError
  };
}