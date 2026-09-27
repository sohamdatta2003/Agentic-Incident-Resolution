export const API_CONFIG = {
  detection: import.meta.env.VITE_DETECTION_API_URL || 'http://localhost:8080',
  ingestion: import.meta.env.VITE_INGESTION_API_URL || 'http://localhost:8082',
  generator: import.meta.env.VITE_GENERATOR_API_URL || 'http://localhost:8081',
  ollama: import.meta.env.VITE_OLLAMA_URL || 'http://localhost:11434',
  pollingInterval: Number(import.meta.env.VITE_POLLING_INTERVAL_MS) || 12000,
} as const;

export const APP_CONFIG = {
  name: 'IncidentAI',
  subtitle: 'AI-Powered Incident Detection & Response',
} as const;

/** Known services in the backend architecture. */
export const KNOWN_SERVICES = [
  {
    id: 'incident-detection',
    name: 'incident-detection-service',
    port: 8080,
    role: 'AI-powered incident detection, RAG analysis, and recommendation engine',
    baseUrl: API_CONFIG.detection,
  },
  {
    id: 'log-ingestion',
    name: 'log-ingestion-service',
    port: 8082,
    role: 'Consumes logs from Kafka, normalizes and forwards to incident topic',
    baseUrl: API_CONFIG.ingestion,
  },
  {
    id: 'log-generator',
    name: 'log-generator-service',
    port: 8081,
    role: 'Generates simulated service logs and publishes to Kafka logs-topic',
    baseUrl: API_CONFIG.generator,
  },
] as const;
