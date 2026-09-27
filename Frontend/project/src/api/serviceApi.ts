import { ingestionClient, generatorClient, detectionClient } from './client';
import type { ServiceHealth, HealthState } from '@/types/service';
import { KNOWN_SERVICES } from '@/config';

/**
 * Check health of a single service by hitting its Actuator health endpoint.
 *
 * Spring Boot Actuator exposes GET /actuator/health which returns:
 * { "status": "UP" | "DOWN" | ... }
 *
 * If the endpoint does not exist, we fall back to a TCP-level reachability
 * check via a lightweight GET to the base URL.
 */
export async function checkServiceHealth(serviceId: string): Promise<ServiceHealth> {
  const service = KNOWN_SERVICES.find((s) => s.id === serviceId);
  if (!service) {
    return {
      serviceId,
      state: 'unknown' as HealthState,
      error: 'Unknown service',
      lastChecked: new Date(),
    };
  }

  const client = getClientForService(serviceId);
  const start = performance.now();

  try {
    // Try Actuator health endpoint first
    let response;
    try {
      response = await client.get('/actuator/health', { timeout: 5000 });
    } catch {
      // Fallback: try base URL reachability
      response = await client.get('/', { timeout: 5000 });
    }

    const latency = Math.round(performance.now() - start);
    const status = response.data?.status?.toUpperCase();
    const state: HealthState = status === 'UP' ? 'healthy' : status === 'DOWN' ? 'unhealthy' : 'healthy';

    return {
      serviceId,
      state,
      latency,
      lastChecked: new Date(),
    };
  } catch (error) {
    const latency = Math.round(performance.now() - start);
    return {
      serviceId,
      state: 'unhealthy',
      latency,
      error: error instanceof Error ? error.message : 'Connection failed',
      lastChecked: new Date(),
    };
  }
}

/** Check health for all known services in parallel. */
export async function checkAllServicesHealth(): Promise<ServiceHealth[]> {
  const results = await Promise.all(
    KNOWN_SERVICES.map((s) => checkServiceHealth(s.id))
  );
  return results;
}

function getClientForService(serviceId: string) {
  switch (serviceId) {
    case 'incident-detection':
      return detectionClient;
    case 'log-ingestion':
      return ingestionClient;
    case 'log-generator':
      return generatorClient;
    default:
      return detectionClient;
  }
}
