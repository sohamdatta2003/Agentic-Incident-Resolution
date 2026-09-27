/**
 * Incident-related types.
 *
 * The backend endpoint `GET /incidents/errors` returns an object whose exact
 * shape is not documented. These interfaces are designed to flexibly handle
 * the most common shapes (array of error logs, or wrapper object containing
 * errors) while still providing type safety.
 *
 * TODO: Once the actual backend response is observed, tighten these types
 * and remove the flexible adapter logic in incidentApi.ts.
 */

/** AI analysis result as produced by the RAG + Ollama pipeline. */
export interface IncidentAnalysis {
  isIncident: boolean;
  severity: SeverityLevel;
  category: IncidentCategory;
  rootCause: string;
  confidence: number;
  recommendedAction: string;
  autoResolvable: boolean;
}

export type SeverityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | string;

export type IncidentCategory =
  | 'DATABASE'
  | 'NETWORK'
  | 'KAFKA'
  | 'APPLICATION'
  | 'INFRASTRUCTURE'
  | 'SECURITY'
  | 'UNKNOWN'
  | string;

/**
 * Flexible incident / error log shape.
 * All fields are optional because the backend response structure is uncertain.
 */
export interface Incident {
  id: string;
  timestamp: string;
  service?: string;
  serviceName?: string;
  message?: string;
  errorType?: string;
  stackTrace?: string;
  severity?: SeverityLevel;
  category?: IncidentCategory;
  status?: IncidentStatus;
  analysis?: IncidentAnalysis;
  raw?: Record<string, unknown>;
}

export type IncidentStatus =
  | 'OPEN'
  | 'INVESTIGATING'
  | 'RESOLVED'
  | 'FAILED'
  | string;

/** Normalized incident after adapter processing. */
export interface NormalizedIncident extends Incident {
  /** Derived display name for the service */
  serviceDisplay: string;
  /** Derived severity (defaults to UNKNOWN) */
  severityDisplay: SeverityLevel;
  /** Derived timestamp in ISO format */
  timestampDisplay: string;
  /** Confidence 0-1 if available */
  confidenceValue: number | null;
}

export type ApiStatus = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  status: ApiStatus;
  error: string | null;
  lastUpdated: Date | null;
}
