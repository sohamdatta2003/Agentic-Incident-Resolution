import { Layout } from '@/components/layout/Layout';
import { Card, StatusBadge } from '@/components/common/UI';
import { ErrorState } from '@/components/common/StateViews';
import { Skeleton } from '@/components/common/Skeleton';
import { useServiceHealth } from '@/hooks/useServiceHealth';
import { KNOWN_SERVICES } from '@/config';
import { Server, Network, Info, ArrowRight } from 'lucide-react';
import type { HealthState } from '@/types/service';

export function Services() {
  const { health, loading, error, lastUpdated, refresh } = useServiceHealth(false);

  const overallStatus: HealthState = loading ? 'checking' : error ? 'unhealthy' : health.every((h) => h.state === 'healthy') ? 'healthy' : health.some((h) => h.state === 'unhealthy') ? 'unhealthy' : 'unknown';

  return (
    <Layout
      pageTitle="Services"
      breadcrumb="Services"
      backendStatus={overallStatus}
      lastUpdated={lastUpdated}
      onRefresh={refresh}
      refreshing={loading}
    >
      {/* Architecture flow */}
      <Card title="Architecture Flow" subtitle="Data pipeline: log generation → ingestion → AI detection" className="mb-6 p-5">
        <div className="flex flex-col items-center gap-3 lg:flex-row lg:justify-center lg:gap-2">
          <FlowNode label="log-generator" port={8081} />
          <FlowArrow label="Kafka: logs-topic" />
          <FlowNode label="log-ingestion" port={8082} />
          <FlowArrow label="Kafka: incident-topic" />
          <FlowNode label="incident-detection" port={8080} />
          <FlowArrow label="RAG + Ollama" />
          <FlowNode label="IncidentAnalysis" port={null} highlight />
        </div>
      </Card>

      {/* Service cards */}
      {loading && health.length === 0 ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-40" />)}
        </div>
      ) : error && health.length === 0 ? (
        <ErrorState title="Unable to check service health" message={error} onRetry={refresh} />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {KNOWN_SERVICES.map((svc) => {
            const svcHealth = health.find((h) => h.serviceId === svc.id);
            return (
              <Card key={svc.id} className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-800 border border-neutral-700">
                      <Server className="h-5 w-5 text-accent-400" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-100">{svc.name}</h3>
                      <p className="flex items-center gap-1 text-xs text-neutral-500">
                        <Network className="h-3 w-3" /> Port {svc.port}
                      </p>
                    </div>
                  </div>
                  {svcHealth ? (
                    <StatusBadge state={svcHealth.state} />
                  ) : (
                    <span className="text-xs text-neutral-500">Health endpoint unavailable</span>
                  )}
                </div>

                <p className="mt-3 text-sm text-neutral-400">{svc.role}</p>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-neutral-500">
                      <Info className="h-3 w-3" /> Base URL
                    </span>
                    <code className="text-neutral-400">{svc.baseUrl}</code>
                  </div>
                  {svcHealth?.latency != null && (
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500">Latency</span>
                      <span className="font-mono text-neutral-400">{svcHealth.latency}ms</span>
                    </div>
                  )}
                  {svcHealth?.error && (
                    <div className="rounded-md bg-red-500/5 border border-red-500/20 px-2 py-1.5 text-red-400">
                      {svcHealth.error}
                    </div>
                  )}
                  {!svcHealth && (
                    <div className="rounded-md border border-dashed border-neutral-700 bg-neutral-900/30 px-2 py-1.5 text-neutral-500">
                      Health endpoint unavailable — Spring Boot Actuator may not be enabled
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </Layout>
  );
}

function FlowNode({ label, port, highlight }: { label: string; port: number | null; highlight?: boolean }) {
  return (
    <div className={`flex flex-col items-center rounded-lg border px-4 py-3 text-center ${highlight ? 'border-accent-500/30 bg-accent-500/5' : 'border-neutral-700 bg-neutral-900/50'}`}>
      <span className={`text-xs font-medium ${highlight ? 'text-accent-400' : 'text-neutral-300'}`}>{label}</span>
      {port != null && <span className="mt-0.5 text-xs text-neutral-500">:{port}</span>}
    </div>
  );
}

function FlowArrow({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 lg:flex-row">
      <span className="text-xs text-neutral-600">{label}</span>
      <ArrowRight className="h-4 w-4 text-neutral-600 lg:block hidden" />
      <ArrowRight className="h-4 w-4 text-neutral-600 lg:hidden rotate-90" />
    </div>
  );
}
