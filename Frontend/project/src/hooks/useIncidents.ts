import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchIncidents } from '@/api/incidentApi';
import type { NormalizedIncident } from '@/types/incident';

interface UseIncidentsOptions {
  pollingInterval?: number;
  autoRefresh?: boolean;
}

interface UseIncidentsResult {
  incidents: NormalizedIncident[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => void;
}

export function useIncidents({
  pollingInterval,
  autoRefresh = true,
}: UseIncidentsOptions = {}): UseIncidentsResult {
  const [incidents, setIncidents] = useState<NormalizedIncident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchIncidents();
      setIncidents(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch incidents');
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();

    if (autoRefresh && pollingInterval && pollingInterval > 0) {
      intervalRef.current = setInterval(refresh, pollingInterval);
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [refresh, autoRefresh, pollingInterval]);

  return { incidents, loading, error, lastUpdated, refresh };
}
