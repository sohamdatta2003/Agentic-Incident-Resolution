import { detectionClient } from './client';
import type { Incident, NormalizedIncident, SeverityLevel } from '@/types/incident';

/**
 * Fetch error logs / incidents from the Incident Detection Service.
 *
 * Endpoint: GET /incidents/errors
 *
 * The exact response shape is not documented. This adapter handles the most
 * common shapes:
 *  1. An array of error log objects
 *  2. An object like { errors: [...] } or { incidents: [...] }
 *  3. A single object
 *
 * TODO: Once the actual response is observed, replace this flexible adapter
 * with a precise mapping and tighten the NormalizedIncident type.
 */
export async function fetchIncidents(): Promise<NormalizedIncident[]> {
  const response = await detectionClient.get('/incidents/errors');
  const raw = response.data;
  return normalizeIncidents(raw);
}

/**
 * Fetch a single incident by ID.
 *
 * TODO: The backend does not yet expose GET /incidents/{id}.
 * This function is a placeholder — it will throw so callers know the endpoint
 * is not available. Replace the body once the endpoint exists.
 *
 * @param _id — incident identifier
 */
export async function fetchIncidentById(_id: string): Promise<NormalizedIncident> {
  throw new Error(
    'Single incident retrieval (GET /incidents/{id}) is not yet available on the backend. ' +
    'The frontend currently derives incident details from the loaded collection.'
  );
}

/** Extract an array of raw items from various possible response shapes. */
function extractArray(raw: unknown): Record<string, unknown>[] {
  if (Array.isArray(raw)) return raw as Record<string, unknown>[];
  if (raw && typeof raw === 'object') {
    const obj = raw as Record<string, unknown>;
    for (const key of ['errors', 'incidents', 'data', 'content', 'items', 'results']) {
      if (Array.isArray(obj[key])) return obj[key] as Record<string, unknown>[];
    }
    // Single object — wrap in array
    return [obj];
  }
  return [];
}

function normalizeIncidents(raw: unknown): NormalizedIncident[] {
  const items = extractArray(raw);
  return items.map((item, index) => normalizeOne(item, index));
}

function normalizeOne(item: Record<string, unknown>, index: number): NormalizedIncident {
  const id = String(item.id ?? item.incidentId ?? item.uuid ?? `inc-${index}`);
  const service = (item.service ?? item.serviceName ?? item.source ?? item.origin) as string | undefined;
  const severity = (item.severity ?? item.level) as SeverityLevel | undefined;
  const timestamp = (item.timestamp ?? item.createdAt ?? item.time ?? item.date) as string | undefined;
  const confidence =
    typeof item.confidence === 'number'
      ? item.confidence
      : item.analysis && typeof (item.analysis as Record<string, unknown>).confidence === 'number'
        ? (item.analysis as Record<string, unknown>).confidence as number
        : null;

  return {
    id,
    timestamp: timestamp ?? new Date().toISOString(),
    service: service,
    serviceDisplay: service ?? 'Unknown Service',
    severity,
    severityDisplay: severity ?? 'UNKNOWN',
    category: item.category as string | undefined,
    status: item.status as string | undefined,
    message: item.message as string | undefined,
    errorType: item.errorType as string | undefined,
    stackTrace: item.stackTrace as string | undefined,
    analysis: item.analysis as NormalizedIncident['analysis'],
    confidenceValue: confidence,
    timestampDisplay: timestamp ?? new Date().toISOString(),
    raw: item,
  };
}
