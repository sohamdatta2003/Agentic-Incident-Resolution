import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  Flame,
  ShieldCheck,
  Brain,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { SeverityChart, CategoryChart, ChartLegend } from '@/components/dashboard/Charts';
import { Card } from '@/components/common/UI';
import { IncidentTable } from '@/components/incidents/IncidentTable';
import { ErrorState, EmptyState } from '@/components/common/StateViews';
import { SkeletonCards, Skeleton } from '@/components/common/Skeleton';
import { useIncidents } from '@/hooks/useIncidents';
import { useServiceHealth } from '@/hooks/useServiceHealth';
import { API_CONFIG } from '@/config';
import { severityRank, confidencePercent } from '@/utils/format';
import type { HealthState } from '@/types/service';

export function Dashboard() {
  const navigate = useNavigate();
  const { incidents, loading, error, lastUpdated, refresh } = useIncidents({
    pollingInterval: API_CONFIG.pollingInterval,
  });
  const { health, refresh: refreshHealth } = useServiceHealth(false);

  const backendStatus: HealthState = useMemo(() => {
    if (loading && incidents.length === 0) return 'checking';
    if (error) return 'unhealthy';
    const detectionHealth = health.find((h) => h.serviceId === 'incident-detection');
    if (detectionHealth) return detectionHealth.state;
    return 'healthy';
  }, [loading, error, incidents.length, health]);

  const metrics = useMemo(() => {
    const total = incidents.length;
    const critical = incidents.filter((i) => (i.severityDisplay || '').toUpperCase() === 'CRITICAL').length;
    const high = incidents.filter((i) => (i.severityDisplay || '').toUpperCase() === 'HIGH').length;
    const autoResolvable = incidents.filter((i) => i.analysis?.autoResolvable === true).length;
    const withConfidence = incidents.filter((i) => i.confidenceValue != null);
    const avgConfidence =
      withConfidence.length > 0
        ? withConfidence.reduce((sum, i) => sum + (i.confidenceValue ?? 0), 0) / withConfidence.length
        : null;
    return { total, critical, high, autoResolvable, avgConfidence };
  }, [incidents]);

  const recentIncidents = useMemo(
    () =>
      [...incidents]
        .sort((a, b) => new Date(b.timestampDisplay).getTime() - new Date(a.timestampDisplay).getTime())
        .slice(0, 8),
    [incidents]
  );

  const severityLegend = useMemo(() => {
    const colors: Record<string, string> = {
      CRITICAL: '#ef4444', HIGH: '#f97316', MEDIUM: '#eab308', LOW: '#3b82f6', UNKNOWN: '#737373',
    };
    const counts = new Map<string, number>();
    for (const inc of incidents) {
      const s = (inc.severityDisplay || 'UNKNOWN').toUpperCase();
      counts.set(s, (counts.get(s) ?? 0) + 1);
    }
    return Array.from(counts.entries()).map(([label, value]) => ({ label, color: colors[label] ?? '#737373', value }));
  }, [incidents]);

  return (
    <Layout
      pageTitle="Dashboard"
      breadcrumb="Dashboard"
      backendStatus={backendStatus}
      lastUpdated={lastUpdated}
      onRefresh={() => { refresh(); refreshHealth(); }}
      refreshing={loading}
    >
      {/* KPI Cards */}
      {loading && incidents.length === 0 ? (
        <SkeletonCards count={5} />
      ) : error && incidents.length === 0 ? (
        <ErrorState
          title="Unable to connect to Incident Detection Service"
          message={error}
          onRetry={refresh}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <KpiCard
              label="Total Incidents"
              value={metrics.total}
              icon={<AlertTriangle className="h-5 w-5" />}
              accent="cyan"
              subtext={metrics.total === 0 ? 'No incidents detected' : 'From /incidents/errors'}
            />
            <KpiCard
              label="Critical"
              value={metrics.critical}
              icon={<Flame className="h-5 w-5" />}
              accent="red"
              subtext={metrics.critical === 0 ? 'No critical incidents' : 'Requires immediate attention'}
            />
            <KpiCard
              label="High Severity"
              value={metrics.high}
              icon={<TrendingUp className="h-5 w-5" />}
              accent="orange"
            />
            <KpiCard
              label="Auto-Resolvable"
              value={metrics.autoResolvable}
              icon={<ShieldCheck className="h-5 w-5" />}
              accent="emerald"
              subtext={metrics.autoResolvable === 0 ? 'None flagged as auto-resolvable' : 'AI-recommended automation'}
            />
            <KpiCard
              label="Avg AI Confidence"
              value={confidencePercent(metrics.avgConfidence)}
              icon={<Brain className="h-5 w-5" />}
              accent="blue"
              subtext={metrics.avgConfidence == null ? 'No AI analysis data yet' : 'Across analyzed incidents'}
            />
          </div>

          {/* Charts */}
          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card title="Severity Distribution" subtitle="Incidents grouped by severity level">
              <div className="p-4">
                <SeverityChart incidents={incidents} />
              </div>
              <ChartLegend items={severityLegend} />
            </Card>

            <Card title="Category Distribution" subtitle="Incidents grouped by category">
              <div className="p-4">
                <CategoryChart incidents={incidents} />
              </div>
            </Card>
          </div>

          {/* Recent Incidents */}
          <div className="mt-6">
            <Card
              title="Recent Incidents"
              subtitle="Latest detected incidents"
              action={
                <button
                  onClick={() => navigate('/incidents')}
                  className="inline-flex items-center gap-1 text-xs font-medium text-accent-400 hover:text-accent-300"
                >
                  View all
                  <ArrowRight className="h-3 w-3" />
                </button>
              }
            >
              {loading && incidents.length === 0 ? (
                <div className="p-4"><Skeleton className="h-8" /></div>
              ) : recentIncidents.length === 0 ? (
                <div className="p-4">
                  <EmptyState title="No incidents detected" message="When the detection service identifies incidents, they will appear here." />
                </div>
              ) : (
                <IncidentTable incidents={recentIncidents} />
              )}
            </Card>
          </div>
        </>
      )}
    </Layout>
  );
}
