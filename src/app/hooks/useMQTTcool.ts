"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import mqtt from 'mqtt';

interface MQTTMessage {
  topic: string;
  message: string;
}

const MAX_MESSAGES = 10; // Batasi messages yang disimpan

export function useMQTTCool(brokerUrl: string, enableConnection: boolean = true) {
  const [client, setClient] = useState<ReturnType<typeof mqtt.connect> | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<MQTTMessage[]>([]);
  const [connectionError, setConnectionError] = useState<string>('');
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  useEffect(() => {
    if (!enableConnection) {
      console.log('MQTT connection disabled via config');
      setIsConnected(false);
      setConnectionError('MQTT disabled by config');
      return;
    }

    console.log('Connecting to MQTT:', brokerUrl);

    const options = {
      protocol: 'ws' as const,
      reconnectPeriod: 10000, // 10 detik (lebih lama = lebih ringan)
      connectTimeout: 30000,
      clientId: 'webClient_' + Math.random().toString(16).substr(2, 8),
      clean: true,
      protocolVersion: 4,
      keepalive: 60, // Keep alive lebih lama
    };
    
    const mqttClient = mqtt.connect(brokerUrl, options);

    mqttClient.on('connect', () => {
      console.log('Connected to MQTT Broker');
      setIsConnected(true);
      setConnectionError('');
      reconnectAttempts.current = 0;
    });

    mqttClient.on('error', (error: Error) => {
      console.error('MQTT Error:', error.message);
      setIsConnected(false);
      setConnectionError(error.message);
      
      reconnectAttempts.current++;
      if (reconnectAttempts.current >= maxReconnectAttempts) {
        console.warn('Max reconnect attempts reached');
        mqttClient.end(true);
      }
    });

    mqttClient.on('offline', () => {
      console.warn('MQTT offline');
      setIsConnected(false);
    });

    mqttClient.on('message', (topic: string, message: Buffer) => {
      const messageStr = message.toString();
      console.log(`Message on ${topic}:`, messageStr);
      
      const newMessage: MQTTMessage = {
        topic,
        message: messageStr,
      };
      
      // Batasi jumlah messages (FIFO)
      setMessages((prev) => {
        const updated = [...prev, newMessage];
        return updated.slice(-MAX_MESSAGES); // Hanya simpan 10 terakhir
      });
    });

    mqttClient.on('disconnect', () => {
      console.log('Disconnected from MQTT');
      setIsConnected(false);
    });

    setClient(mqttClient);

    return () => {
      if (mqttClient) {
        console.log('Cleanup MQTT connection');
        mqttClient.end(true);
      }
    };
  }, [brokerUrl, enableConnection]);

  const subscribe = useCallback((topic: string, qos: 0 | 1 | 2 = 0) => {
    if (client && isConnected) {
      console.log(`Subscribe: ${topic}`);
      client.subscribe(topic, { qos }, (err?: Error) => {
        if (err) {
          console.error('Subscribe error:', err.message);
        } else {
          console.log(`Subscribed: ${topic}`);
        }
      });
    }
  }, [client, isConnected]);

  const publish = useCallback((topic: string, message: string, qos: 0 | 1 | 2 = 0) => {
    if (client && isConnected) {
      console.log(`Publish: ${topic}`);
      client.publish(topic, message, { qos }, (err?: Error) => {
        if (err) {
          console.error('Publish error:', err.message);
        }
      });
    } else {
      console.warn('Cannot publish: Not connected');
    }
  }, [client, isConnected]);

  return { isConnected, messages, subscribe, publish, connectionError };
}