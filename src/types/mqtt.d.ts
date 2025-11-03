// Type declarations for mqtt module
declare module 'mqtt' {
  export interface IClientOptions {
    keepalive?: number;
    reconnectPeriod?: number;
    clientId?: string;
    username?: string;
    password?: string;
    clean?: boolean;
    connectTimeout?: number;
  }

  export interface MqttClient {
    connect(): void;
    subscribe(topic: string | string[], callback?: (error: Error | null) => void): void;
    unsubscribe(topic: string | string[]): void;
    publish(topic: string, message: string | Buffer, callback?: (error?: Error) => void): void;
    on(event: 'connect' | 'reconnect' | 'close' | 'error' | 'message', 
       handler: (...args: any[]) => void): void;
    end(): void;
    connected: boolean;
  }

  export function connect(url: string, options?: IClientOptions): MqttClient;
}