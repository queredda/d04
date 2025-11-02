"use client";

import { useState, useEffect, useCallback } from 'react';
import mqtt from 'mqtt';

interface MQTTMessage {
  topic: string;
  message: string;
}

export function useMQTTCool(brokerUrl: string, enableConnection: boolean = true) {
  const [client, setClient] = useState<ReturnType<typeof mqtt.connect> | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<MQTTMessage[]>([]);
  const [connectionError, setConnectionError] = useState<string>('');

  useEffect(() => {
    if (!enableConnection) {
      console.log('MQTT connection disabled via config, skipping connect.');
      setIsConnected(false);
      setConnectionError('MQTT disabled by config');
      return;
    }

    console.log('Attempting to connect to MQTT.Cool:', brokerUrl);

    // Konfigurasi MQTT Client dengan tipe yang benar
    const options = {
      protocol: 'ws' as const,
      reconnectPeriod: 5000,
      connectTimeout: 30000,
      clientId: 'webClient_' + Math.random().toString(16).substr(2, 8),
      clean: true,
      protocolVersion: 4, // MQTT 3.1.1
    };
    
    // Koneksi ke MQTT.Cool broker
    const mqttClient = mqtt.connect(brokerUrl, options);

    mqttClient.on('connect', () => {
      console.log('Connected to MQTT.Cool Broker');
      setIsConnected(true);
      setConnectionError('');
    });

    mqttClient.on('error', (error: Error) => {
      console.error('MQTT Connection Error:', error);
      setIsConnected(false);
      setConnectionError(error.message);
    });

    mqttClient.on('offline', () => {
      console.warn('MQTT Client is offline');
      setIsConnected(false);
    });

    mqttClient.on('reconnect', () => {
      console.log('Attempting to reconnect...');
    });

    mqttClient.on('message', (topic: string, message: Buffer) => {
      const messageStr = message.toString();
      console.log(`Received message on topic "${topic}":`, messageStr);
      
      const newMessage: MQTTMessage = {
        topic,
        message: messageStr,
      };
      setMessages((prev) => [...prev, newMessage]);
    });

    mqttClient.on('disconnect', () => {
      console.log('Disconnected from MQTT Broker');
      setIsConnected(false);
    });

    setClient(mqttClient);

    return () => {
      if (mqttClient) {
        console.log('Cleaning up MQTT connection...');
        mqttClient.end(true);
      }
    };
  }, [brokerUrl, enableConnection]);

  const subscribe = useCallback((topic: string, qos: 0 | 1 | 2 = 0) => {
    if (client && isConnected) {
      console.log(`Subscribing to topic: ${topic} with QoS ${qos}`);
      client.subscribe(topic, { qos }, (err?: Error) => {
        if (err) {
          console.error('Subscribe error:', err);
        } else {
          console.log(`Successfully subscribed to: ${topic}`);
        }
      });
    } else {
      console.warn('Cannot subscribe: Client not connected');
    }
  }, [client, isConnected]);

  const publish = useCallback((topic: string, message: string, qos: 0 | 1 | 2 = 0) => {
    if (client && isConnected) {
      console.log(`Publishing to topic "${topic}":`, message);
      client.publish(topic, message, { qos }, (err?: Error) => {
        if (err) {
          console.error('Publish error:', err);
        } else {
          console.log(`Successfully published to: ${topic}`);
        }
      });
    } else {
      console.warn('Cannot publish: Client not connected');
    }
  }, [client, isConnected]);

  return { isConnected, messages, subscribe, publish, connectionError };
}