import { detectionClient, ollamaClient } from './client';
import type { SystemComponentHealth, HealthState } from '@/types/service';
import { API_CONFIG } from '@/config';

/**
 * Check the health of system-level components (Kafka, Ollama, RAG, H2).
 *
 * Most of these do not have dedicated health endpoints yet. We probe what we
 * can and return 'unknown' for components we cannot verify.
 */

/** Check Ollama LLM service availability via its root endpoint. */
export async function checkOllamaHealth(): Promise<SystemComponentHealth> {
  try {
    const response = await ollamaClient.get('/api/tags', { timeout: 5000 });
    return {
      name: 'Ollama (Qwen 3 1.7B)',
      state: 'healthy',
      detail: response.data?.models ? `${response.data.models.length} models available` : 'Connected',
      endpoint: API_CONFIG.ollama,
    };
  } catch {
    return {
      name: 'Ollama (Qwen 3 1.7B)',
      state: 'unhealthy',
      detail: 'Cannot reach Ollama service',
      endpoint: API_CONFIG.ollama,
    };
  }
}

/**
 * Check Kafka connectivity.
 * TODO: The backend does not expose a Kafka health endpoint. We infer
 * availability from the incident-detection service health — if it responds,
 * Kafka is likely running. This is an approximation.
 */
export async function checkKafkaHealth(): Promise<SystemComponentHealth> {
  try {
    await detectionClient.get('/actuator/health', { timeout: 5000 });
    return {
      name: 'Kafka',
      state: 'healthy',
      detail: 'Inferred from detection service connectivity',
      endpoint: 'logs-topic → incident-topic',
    };
  } catch {
    return {
      name: 'Kafka',
      state: 'unknown',
      detail: 'Health endpoint unavailable — Kafka status inferred from detection service',
      endpoint: 'logs-topic → incident-topic',
    };
  }
}

/**
 * Check RAG / Vector Store availability.
 * TODO: No dedicated endpoint exists. We return 'unknown' with context.
 */
export async function checkRagHealth(): Promise<SystemComponentHealth> {
  return {
    name: 'RAG / SimpleVectorStore',
    state: 'unknown',
    detail: 'RAG runs internally within the detection service. No dedicated health endpoint.',
    endpoint: 'Internal (KnowledgeBaseService)',
  };
}

/**
 * Check H2 database availability.
 * Inferred from detection service actuator health if it exposes db info.
 */
export async function checkH2Health(): Promise<SystemComponentHealth> {
  try {
    const response = await detectionClient.get('/actuator/health', { timeout: 5000 });
    const components = response.data?.components;
    if (components?.db) {
      const state: HealthState = components.db.status === 'UP' ? 'healthy' : 'unhealthy';
      return {
        name: 'H2 Database',
        state,
        detail: components.db.detail ?? 'H2 embedded database',
        endpoint: 'Embedded (incident-detection-service)',
      };
    }
    return {
      name: 'H2 Database',
      state: 'unknown',
      detail: 'Database health not exposed via Actuator. H2 runs embedded in the detection service.',
      endpoint: 'Embedded (incident-detection-service)',
    };
  } catch {
    return {
      name: 'H2 Database',
      state: 'unknown',
      detail: 'H2 database status cannot be verified — detection service unreachable',
      endpoint: 'Embedded (incident-detection-service)',
    };
  }
}

/** Fetch all system component health statuses. */
export async function checkSystemHealth(): Promise<SystemComponentHealth[]> {
  const [ollama, kafka, rag, h2] = await Promise.all([
    checkOllamaHealth(),
    checkKafkaHealth(),
    checkRagHealth(),
    checkH2Health(),
  ]);
  return [ollama, kafka, rag, h2];
}
