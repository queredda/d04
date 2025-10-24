"use client";
import { useState, useEffect, useRef } from 'react';
import { DeviceData } from '../types/device';

/**
 * useDeviceData
 * - By default uses a small simulated device data so UI keeps working when STM isn't ready.
 * - If NEXT_PUBLIC_MQTT_URL is provided, it will attempt to connect to that broker (WebSocket)
 *   and subscribe to topics to update batteryPercentage, ratsDetected and connection status.
 *
 * Environment variables (configure in .env.local or hosting):
 * - NEXT_PUBLIC_MQTT_URL (e.g. ws://localhost:9001 or ws://broker.example.com:9001)
 * - NEXT_PUBLIC_MQTT_TOPIC_BASE (defaults to 'ratrepelling/device')
 */
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

  const toggleDevice = () => {
    setDeviceData(prev => ({
      ...prev,
      isActive: !prev.isActive,
      lastUpdated: new Date()
    }));
  };

  // NOTE: removed automatic simulation updates so data only changes via MQTT
  // If you want a simulation mode for local dev, we can re-add it behind
  // an environment flag like NEXT_PUBLIC_ENABLE_SIMULATION.

  // MQTT: connect if NEXT_PUBLIC_MQTT_URL is set
  useEffect(() => {
    const mqttUrl = process.env.NEXT_PUBLIC_MQTT_URL;
    if (!mqttUrl) return;

    let mounted = true;
    let client: any = null;

    (async () => {
      try {
  // dynamic import to avoid SSR issues; prefer browser build to avoid node shims
  // note: requires the `mqtt` package installed in node_modules
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
          // subscribe to topics
          client.subscribe(topics, (err: any) => {
            // ignore subscription errors here; app can show connected state
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
          // You can log or display errors in UI if desired
          // console.error('MQTT error', err);
        });

        client.on('message', (_topic: string, payload: Uint8Array) => {
          if (!mounted) return;
          const msg = payload.toString();

          try {
            // topics: .../battery => numeric or JSON { batteryPercentage }
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
        // dynamic import or connect failed; leave simulation running
        // console.error('Could not initialize MQTT', err);
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

  return { deviceData, toggleDevice };
}
