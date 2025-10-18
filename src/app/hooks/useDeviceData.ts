"use client";
import { useEffect, useState } from "react";
import { DeviceData } from "../types/device";
import { getMqttClient } from "../../lib/mqttClient";

export function useDeviceData() {
  const [deviceData, setDeviceData] = useState<DeviceData>({
    isActive: false,
    batteryPercentage: 0,
    ratsDetected: 0,
    ultrasonicOutput: 0,
    lastUpdated: new Date(),
    signalStrength: 0,
  });

  useEffect(() => {
    const client = getMqttClient();

    // Daftar topik yang dikirim oleh perangkat kamu
    const topics = ["device/status", "device/data"];
    client.subscribe(topics, (err) => {
      if (err) console.error("Subscribe error:", err);
    });

    client.on("message", (topic, payload) => {
      try {
        const message = JSON.parse(payload.toString());

        if (topic === "device/status") {
          setDeviceData((prev) => ({
            ...prev,
            isActive: message.isActive,
            lastUpdated: new Date(),
          }));
        } else if (topic === "device/data") {
          setDeviceData((prev) => ({
            ...prev,
            ...message,
            lastUpdated: new Date(),
          }));
        }
      } catch (error) {
        console.error("Invalid MQTT message:", error);
      }
    });

    return () => {
      client.unsubscribe(topics);
    };
  }, []);

  // Fungsi publish untuk nyalakan/matikan alat
  const toggleDevice = () => {
    const client = getMqttClient();
    const newState = !deviceData.isActive;
    client.publish("device/control", JSON.stringify({ isActive: newState }));
    setDeviceData((prev) => ({
      ...prev,
      isActive: newState,
      lastUpdated: new Date(),
    }));
  };

  return { deviceData, toggleDevice };
}