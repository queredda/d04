"use client";
import { useState, useEffect, useRef, useCallback } from 'react';
import { DeviceData } from '../types/device';

export function useDeviceData() {
  const [deviceData, setDeviceData] = useState<DeviceData>({
    isActive: true,
    batteryPercentage: 78,
    ratsDetected: 12,
    ultrasonicOutput: 85,
    lastUpdated: new Date(),
    connected: false,
    signalStrength: undefined
  });

  const mqttClientRef = useRef<any | null>(null);

  const toggleDevice = useCallback(() => {
    setDeviceData(prev => ({
      ...prev,
      isActive: !prev.isActive,
      lastUpdated: new Date()
    }));
  }, []);

  // Auto-schedule handler
  const handleScheduledToggle = useCallback((shouldBeActive: boolean) => {
    setDeviceData(prev => {
      // Only toggle if the state is different
      if (prev.isActive !== shouldBeActive) {
        console.log(`Auto-schedule triggered: ${shouldBeActive ? 'Activating' : 'Deactivating'} device`);
        return {
          ...prev,
          isActive: shouldBeActive,
          lastUpdated: new Date()
        };
      }
      return prev;
    });
  }, []);

  // MQTT: connect if NEXT_PUBLIC_MQTT_URL is set
  useEffect(() => {
    const mqttUrl = process.env.NEXT_PUBLIC_MQTT_URL;
    if (!mqttUrl) return;

    let mounted = true;
    let client: any = null;

    (async () => {
      try {
        const mqttModule = await import('mqtt/dist/mqtt.min.js');
        const mqtt = mqttModule.default ?? mqttModule;

        const clientId = 'web-client-' + Math.random().toString(16).slice(2, 10);
        const opts = { clientId, connectTimeout: 4000, reconnectPeriod: 2000 };

        client = mqtt.connect(mqttUrl, opts);
        mqttClientRef.current = client;

        const topicBase = process.env.NEXT_PUBLIC_MQTT_TOPIC_BASE || 'ratrepelling/device';
        const topics = [
          `${topicBase}/battery`,
          `${topicBase}/rats`,
          `${topicBase}/connected`,
          `${topicBase}/signal`
        ];

        client.on('connect', () => {
          if (!mounted) return;
          setDeviceData(prev => ({ ...prev, connected: true, lastUpdated: new Date() }));
          client.subscribe(topics, (err: any) => {
            // ignore subscription errors here
          });
        });

        client.on('reconnect', () => {
          if (!mounted) return;
          setDeviceData(prev => ({ ...prev, connected: false }));
        });

        client.on('offline', () => {
          if (!mounted) return;
          setDeviceData(prev => ({ ...prev, connected: false }));
        });

        client.on('error', (err: any) => {
          // Error handling
        });

        client.on('message', (_topic: string, payload: Uint8Array) => {
          if (!mounted) return;
          const msg = payload.toString();

          try {
            if (_topic.endsWith('/battery')) {
              const val = Number(msg);
              if (!Number.isNaN(val)) {
                setDeviceData(prev => ({ ...prev, batteryPercentage: val, lastUpdated: new Date() }));
                return;
              }
              const parsed = JSON.parse(msg);
              if (parsed && typeof parsed.batteryPercentage === 'number') {
                setDeviceData(prev => ({ ...prev, batteryPercentage: parsed.batteryPercentage, lastUpdated: new Date() }));
              }
            }

            if (_topic.endsWith('/rats')) {
              const val = Number(msg);
              if (!Number.isNaN(val)) {
                setDeviceData(prev => ({ ...prev, ratsDetected: val, lastUpdated: new Date() }));
                return;
              }
              const parsed = JSON.parse(msg);
              if (parsed && typeof parsed.ratsDetected === 'number') {
                setDeviceData(prev => ({ ...prev, ratsDetected: parsed.ratsDetected, lastUpdated: new Date() }));
              }
            }

            if (_topic.endsWith('/connected')) {
              const lower = msg.toLowerCase();
              const val = lower === '1' || lower === 'true' || lower === 'connected';
              setDeviceData(prev => ({ ...prev, connected: val, lastUpdated: new Date() }));
            }

            if (_topic.endsWith('/signal')) {
              const val = Number(msg);
              if (!Number.isNaN(val)) {
                setDeviceData(prev => ({ ...prev, signalStrength: val }));
              }
            }
          } catch (e) {
            // ignore parse errors
          }
        });
      } catch (err) {
        // dynamic import or connect failed
      }
    })();

    return () => {
      mounted = false;
      if (mqttClientRef.current) {
        try { mqttClientRef.current.end(true); } catch (e) { /* ignore */ }
        mqttClientRef.current = null;
      }
    };
  }, []);

  return { deviceData, toggleDevice, handleScheduledToggle };
}