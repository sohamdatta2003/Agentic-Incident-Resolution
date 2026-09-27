import { useCallback, useEffect, useRef, useState } from 'react';
import { checkAllServicesHealth } from '@/api/serviceApi';
import type { ServiceHealth } from '@/types/service';

interface UseServiceHealthResult {
  health: ServiceHealth[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => void;
}

export function useServiceHealth(autoRefresh = false, interval = 30000): UseServiceHealthResult {
  const [health, setHealth] = useState<ServiceHealth[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await checkAllServicesHealth();
      setHealth(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check service health');
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    if (autoRefresh && interval > 0) {
      intervalRef.current = setInterval(refresh, interval);
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [refresh, autoRefresh, interval]);

  return { health, loading, error, lastUpdated, refresh };
}
