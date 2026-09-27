/** Known service in the backend architecture. */
export interface ServiceInfo {
  id: string;
  name: string;
  port: number;
  role: string;
  baseUrl: string;
}

export type HealthState = 'healthy' | 'unhealthy' | 'unknown' | 'checking';

export interface ServiceHealth {
  serviceId: string;
  state: HealthState;
  latency?: number;
  error?: string;
  lastChecked: Date;
}

export interface SystemComponentHealth {
  name: string;
  state: HealthState;
  detail?: string;
  endpoint?: string;
}
