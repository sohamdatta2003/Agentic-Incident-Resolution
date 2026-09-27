import { useCallback, useEffect, useRef, useState } from 'react';
import { checkSystemHealth } from '@/api/healthApi';
import type { SystemComponentHealth } from '@/types/service';

interface UseSystemHealthResult {
  components: SystemComponentHealth[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => void;
}

export function useSystemHealth(autoRefresh = false, interval = 30000): UseSystemHealthResult {
  const [components, setComponents] = useState<SystemComponentHealth[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await checkSystemHealth();
      setComponents(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check system health');
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

  return { components, loading, error, lastUpdated, refresh };
}
