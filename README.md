# Rat Repelling IoT Dashboard

A Next.js dashboard for monitoring and controlling rat repelling IoT devices with real-time MQTT communication.

## Features

- Real-time sensor data monitoring (ultrasonic, battery level, connection status)
- Device control (toggle ultrasonic repeller on/off)
- Responsive dashboard with modern UI components
- MQTT integration for IoT device communication

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## IoT Device Simulation

To test the dashboard with simulated sensor data:

```bash
node device-simulator.js
```

This will start sending simulated sensor data to the MQTT broker every 5 seconds.

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **MQTT.js** - IoT communication
- **EMQX Public Broker** - MQTT message broker

## Configuration

The application uses the EMQX public broker (`wss://broker.emqx.io:8084/mqtt`) for MQTT communication. Configuration is stored in `.env.local`:

```
NEXT_PUBLIC_MQTT_BROKER_URL=wss://broker.emqx.io:8084/mqtt
```

## Project Structure

- `src/app/` - Next.js app router pages and components
- `src/app/components/` - Dashboard UI components
- `src/app/hooks/` - Custom React hooks for MQTT data
- `src/lib/` - MQTT client configuration
- `device-simulator.js` - IoT device simulator script
