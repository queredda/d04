const mqtt = require('mqtt');

// Connect to public MQTT broker for testing
const client = mqtt.connect('wss://broker.emqx.io:8084/mqtt', {
  clientId: 'rat_device_simulator_' + Math.random().toString(16).substring(2, 8),
  clean: true,
  keepalive: 60,
  reconnectPeriod: 5000,
  connectTimeout: 30000,
});

let deviceState = {
  isActive: true,
  batteryPercentage: 85,
  ratsDetected: 0,
  ultrasonicOutput: 75,
  signalStrength: 90,
};

client.on('connect', () => {
  console.log('IoT Device Simulator Connected to Mosquitto');
  console.log('Sending initial device data...');
  
  // Listen for control commands
  client.subscribe('device/control', (err) => {
    if (err) {
      console.error('Failed to subscribe to control topic');
    } else {
      console.log('Subscribed to device/control');
    }
  });
  
  // Send initial status
  sendDeviceStatus();
  sendDeviceData();
  
  // Send data every 5 seconds
  setInterval(() => {
    if (deviceState.isActive) {
      updateSensorData();
      sendDeviceData();
    }
  }, 5000);
  
  // Send status every 10 seconds
  setInterval(() => {
    sendDeviceStatus();
  }, 10000);
});

client.on('message', (topic, message) => {
  console.log('Received command:', topic, message.toString());
  
  if (topic === 'device/control') {
    try {
      const command = JSON.parse(message.toString());
      deviceState.isActive = command.isActive;
      console.log('Device state changed:', deviceState.isActive ? 'ON' : 'OFF');
      sendDeviceStatus();
    } catch (error) {
      console.error('Invalid command format');
    }
  }
});

function updateSensorData() {
  // Simulate sensor readings
  deviceState.batteryPercentage = Math.max(0, deviceState.batteryPercentage - 0.1);
  
  // Random rats detection
  if (Math.random() < 0.3) {
    deviceState.ratsDetected += Math.floor(Math.random() * 2) + 1;
    console.log('Rats detected! Total:', deviceState.ratsDetected);
  }
  
  // Ultrasonic output variation
  deviceState.ultrasonicOutput = 70 + Math.floor(Math.random() * 30);
  
  // Signal strength variation
  deviceState.signalStrength = 85 + Math.floor(Math.random() * 15);
}

function sendDeviceStatus() {
  const status = {
    isActive: deviceState.isActive,
    timestamp: new Date().toISOString(),
  };
  
  client.publish('device/status', JSON.stringify(status));
  console.log('Status sent:', deviceState.isActive ? 'ACTIVE' : 'INACTIVE');
}

function sendDeviceData() {
  const data = {
    batteryPercentage: Math.round(deviceState.batteryPercentage * 10) / 10,
    ratsDetected: deviceState.ratsDetected,
    ultrasonicOutput: deviceState.ultrasonicOutput,
    signalStrength: deviceState.signalStrength,
    timestamp: new Date().toISOString(),
  };
  
  client.publish('device/data', JSON.stringify(data));
  console.log('Data sent - Battery:', data.batteryPercentage + '%', 
              'Ultrasonic:', data.ultrasonicOutput + '%',
              'Rats:', data.ratsDetected);
}

client.on('error', (error) => {
  console.error('❌ MQTT Error:', error.message);
  
  if (error.message.includes('socket hang up')) {
    console.log('🔄 Connection lost - will auto-reconnect...');
  } else if (error.message.includes('ECONNREFUSED')) {
    console.log('🔧 Broker not reachable - will keep trying...');
  }
});

client.on('close', () => {
  console.log('🔌 MQTT Connection closed - reconnecting...');
});

client.on('reconnect', () => {
  console.log('🔄 Attempting to reconnect to MQTT broker...');
});

client.on('disconnect', () => {
  console.log('⚠️ MQTT Disconnected');
});

process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down device simulator...');
  client.end();
  process.exit(0);
});

console.log('Starting Rat Repelling IoT Device Simulator...');
console.log('Topics:');
console.log('device/status - Device on/off status');
console.log('device/data - Sensor data');
console.log('device/control - Control commands');
console.log('');