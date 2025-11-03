import mqtt, { MqttClient } from "mqtt";

const MQTT_URL = process.env.NEXT_PUBLIC_MQTT_URL || "ws://localhost:8083/mqtt";
let client: MqttClient | null = null;

export function getMqttClient(): MqttClient {
  if (!client) {
    client = mqtt.connect(MQTT_URL, {
      keepalive: 30,
      reconnectPeriod: 2000,
      connectTimeout: 30000,
      clientId: "rat_dashboard_" + Math.random().toString(16).substring(2, 8),
      clean: true,
    });

    client.on("connect", () => {
      console.log("Connected to Mosquitto MQTT Broker");
      console.log("Broker URL:", MQTT_URL);
    });
    
    client.on("reconnect", () => {
      console.log("🔄 Reconnecting to MQTT...");
    });
    
    client.on("error", (err) => {
      console.error("❌ MQTT Connection Error:", err.message);
      
      if (err.message.includes('socket hang up')) {
        console.log("🔄 Connection interrupted - will auto-reconnect...");
      } else if (err.message.includes('ECONNREFUSED')) {
        console.log("🔧 Broker not reachable - retrying...");
      }
    });
    
    client.on("close", () => {
      console.log("🔌 MQTT Connection Closed - will reconnect");
    });
  }
  return client;
}