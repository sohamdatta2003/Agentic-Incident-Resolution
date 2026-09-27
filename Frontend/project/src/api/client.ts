import axios, { AxiosError, type AxiosInstance } from 'axios';
import { API_CONFIG } from '@/config';

/**
 * Central Axios clients — one per backend service.
 * Each service runs on a different port, so they need separate instances.
 */

function createClient(baseURL: string, name: string): AxiosInstance {
  const instance = axios.create({
    baseURL,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
  });

  instance.interceptors.response.use(
    (res) => res,
    (error: AxiosError) => {
      // Normalize the error so callers get a human-readable message
      const enhanced = new Error(
        formatApiError(error, name)
      ) as Error & { technical?: string; code?: string };
      enhanced.technical = error.message;
      enhanced.code = error.code;
      throw enhanced;
    }
  );

  return instance;
}

function formatApiError(error: AxiosError, serviceName: string): string {
  if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
    return `${serviceName} is unavailable. Check that the service is running and reachable.`;
  }
  if (error.response) {
    return `${serviceName} returned an error (HTTP ${error.response.status}).`;
  }
  return `Failed to communicate with ${serviceName}.`;
}

export const detectionClient = createClient(API_CONFIG.detection, 'Incident Detection Service');
export const ingestionClient = createClient(API_CONFIG.ingestion, 'Log Ingestion Service');
export const generatorClient = createClient(API_CONFIG.generator, 'Log Generator Service');
export const ollamaClient = createClient(API_CONFIG.ollama, 'Ollama LLM Service');

export { formatApiError };
