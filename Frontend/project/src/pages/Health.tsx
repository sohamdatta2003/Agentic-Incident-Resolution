import { Layout } from '@/components/layout/Layout';
import { Card, StatusBadge } from '@/components/common/UI';
import { ErrorState } from '@/components/common/StateViews';
import { Skeleton } from '@/components/common/Skeleton';
import { useSystemHealth } from '@/hooks/useSystemHealth';
import { useServiceHealth } from '@/hooks/useServiceHealth';
import { KNOWN_SERVICES } from '@/config';
import { Cpu, MessageSquare, Brain, Database, Server, ArrowDown, Globe } from 'lucide-react';
import type { HealthState } from '@/types/service';

export function Health() {
  const { components, loading: compLoading, error: compError, lastUpdated, refresh } = useSystemHealth(false);
  const { health: svcHealth } = useServiceHealth(false);

  const allStates: HealthState[] = [
    ...svcHealth.map((h) => h.state),
    ...components.map((c) => c.state),
  ];
  const overall: HealthState = compLoading ? 'checking' : allStates.some((s) => s === 'unhealthy') ? 'unhealthy' : allStates.every((s) => s === 'healthy') ? 'healthy' : 'unknown';

  const springBootSection = [
    { icon: Server, name: 'incident-detection-service', port: 8080, health: svcHealth.find((h) => h.serviceId === 'incident-detection') },
    { icon: Server, name: 'log-ingestion-service', port: 8082, health: svcHealth.find((h) => h.serviceId === 'log-ingestion') },
    { icon: Server, name: 'log-generator-service', port: 8081, health: svcHealth.find((h) => h.serviceId === 'log-generator') },
  ];

  return (
    <Layout
      pageTitle="System Health"
      breadcrumb="System Health"
      backendStatus={overall}
      lastUpdated={lastUpdated}
      onRefresh={refresh}
      refreshing={compLoading}
    >
      {/* Architecture Visualization */}
      <Card title="System Architecture" subtitle="End-to-end pipeline status" className="mb-6 p-5">
        <div className="flex flex-col items-center gap-2">
          <ArchNode icon={Globe} label="Frontend (IncidentAI)" sublabel=":5173" status="healthy" />
          <ArchConnector />
          <ArchNode icon={Server} label="Spring Boot APIs" sublabel=":8080  :8081  :8082" status={svcHealth.some((h) => h.state === 'healthy') ? 'healthy' : svcHealth.length > 0 ? 'unhealthy' : 'unknown'} />
          <ArchConnector label="HTTP / REST" />
          <ArchNode icon={MessageSquare} label="Kafka" sublabel="logs-topic → incident-topic" status={components.find((c) => c.name === 'Kafka')?.state ?? 'unknown'} />
          <ArchConnector label="Consumer" />
          <ArchNode icon={Cpu} label="Incident Detection" sublabel="AIAnalysisService" status={svcHealth.find((h) => h.serviceId === 'incident-detection')?.state ?? 'unknown'} />
          <ArchConnector label="RAG Retrieval" />
          <ArchNode icon={Brain} label="RAG + Ollama" sublabel="Qwen 3 1.7B" status={components.find((c) => c.name.startsWith('Ollama'))?.state ?? 'unknown'} />
        </div>
      </Card>

      {/* Component health grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Spring Boot Services */}
        <Card title="Spring Boot Services" subtitle="Backend microservices">
          <div className="divide-y divide-neutral-800">
            {springBootSection.map((svc) => {
              const Icon = svc.icon;
              return (
                <div key={svc.name} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-neutral-500" />
                    <div>
                      <p className="text-sm font-medium text-neutral-200">{svc.name}</p>
                      <p className="text-xs text-neutral-500">:{svc.port}</p>
                    </div>
                  </div>
                  {svc.health ? (
                    <div className="flex items-center gap-3">
                      {svc.health.latency != null && <span className="font-mono text-xs text-neutral-500">{svc.health.latency}ms</span>}
                      <StatusBadge state={svc.health.state} />
                    </div>
                  ) : (
                    <span className="text-xs text-neutral-500">Health endpoint unavailable</span>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Infrastructure components */}
        <Card title="Infrastructure Components" subtitle="Kafka, Ollama, RAG, H2">
          {compLoading && components.length === 0 ? (
            <div className="p-5"><Skeleton className="h-16" /></div>
          ) : compError && components.length === 0 ? (
            <div className="p-5"><ErrorState title="Health check failed" message={compError} onRetry={refresh} /></div>
          ) : (
            <div className="divide-y divide-neutral-800">
              {components.map((comp) => (
                <div key={comp.name} className="px-5 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ComponentIcon name={comp.name} />
                      <div>
                        <p className="text-sm font-medium text-neutral-200">{comp.name}</p>
                        {comp.endpoint && <p className="font-mono text-xs text-neutral-500">{comp.endpoint}</p>}
                      </div>
                    </div>
                    <StatusBadge state={comp.state} />
                  </div>
                  {comp.detail && <p className="mt-1.5 pl-7 text-xs text-neutral-500">{comp.detail}</p>}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
}

function ComponentIcon({ name }: { name: string }) {
  const Icon = name.startsWith('Ollama') ? Brain : name === 'Kafka' ? MessageSquare : name.startsWith('RAG') ? Brain : name.startsWith('H2') ? Database : Server;
  return <Icon className="h-4 w-4 text-neutral-500" />;
}

function ArchNode({ icon: Icon, label, sublabel, status }: { icon: React.ElementType; label: string; sublabel: string; status: HealthState }) {
  return (
    <div className={`flex items-center gap-3 rounded-lg border px-5 py-3 ${status === 'healthy' ? 'border-emerald-500/20 bg-emerald-500/5' : status === 'unhealthy' ? 'border-red-500/20 bg-red-500/5' : 'border-neutral-700 bg-neutral-900/50'}`}>
      <Icon className={`h-5 w-5 ${status === 'healthy' ? 'text-emerald-400' : status === 'unhealthy' ? 'text-red-400' : 'text-neutral-500'}`} />
      <div className="text-center">
        <p className="text-sm font-medium text-neutral-200">{label}</p>
        <p className="font-mono text-xs text-neutral-500">{sublabel}</p>
      </div>
      <StatusBadge state={status} />
    </div>
  );
}

function ArchConnector({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center -my-1">
      {label && <span className="text-xs text-neutral-600">{label}</span>}
      <ArrowDown className="h-4 w-4 text-neutral-600" />
    </div>
  );
}
