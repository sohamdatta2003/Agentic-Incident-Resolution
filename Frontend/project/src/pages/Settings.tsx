import { Layout } from '@/components/layout/Layout';
import { Card, StatusBadge } from '@/components/common/UI';
import { useServiceHealth } from '@/hooks/useServiceHealth';
import { API_CONFIG, APP_CONFIG } from '@/config';
import { Server, Brain, Settings as SettingsIcon, Info, Lock } from 'lucide-react';
import type { HealthState } from '@/types/service';

export function Settings() {
  const { health, lastUpdated, refresh } = useServiceHealth(false);
  const backendStatus: HealthState = health.find((h) => h.serviceId === 'incident-detection')?.state ?? 'unknown';

  const settings = [
    {
      icon: Server,
      name: 'Incident Detection Service',
      url: API_CONFIG.detection,
      port: 8080,
      description: 'AI-powered incident detection, RAG analysis, and recommendation engine',
    },
    {
      icon: Server,
      name: 'Log Ingestion Service',
      url: API_CONFIG.ingestion,
      port: 8082,
      description: 'Consumes logs from Kafka and normalizes for incident detection',
    },
    {
      icon: Server,
      name: 'Log Generator Service',
      url: API_CONFIG.generator,
      port: 8081,
      description: 'Generates simulated service logs and publishes to Kafka',
    },
    {
      icon: Brain,
      name: 'Ollama LLM Service',
      url: API_CONFIG.ollama,
      port: 11434,
      description: 'Local LLM inference (Qwen 3 1.7B) for AI incident analysis',
    },
  ];

  return (
    <Layout
      pageTitle="Settings"
      breadcrumb="Settings"
      backendStatus={backendStatus}
      lastUpdated={lastUpdated}
      onRefresh={refresh}
    >
      {/* Read-only notice */}
      <div className="mb-6 flex items-start gap-3 rounded-xl border border-neutral-800 bg-neutral-900/50 p-4">
        <Lock className="mt-0.5 h-5 w-5 shrink-0 text-neutral-500" aria-hidden="true" />
        <div>
          <p className="text-sm font-medium text-neutral-300">Configuration is read-only</p>
          <p className="mt-1 text-sm text-neutral-500">
            These values are loaded from environment variables (<code className="text-xs text-neutral-400">.env</code>) and cannot be
            modified at runtime. Update the <code className="text-xs text-neutral-400">.env</code> file and restart the frontend to change backend URLs.
          </p>
        </div>
      </div>

      {/* Backend configuration */}
      <Card title="Backend Configuration" subtitle="Service endpoints and connection settings">
        <div className="divide-y divide-neutral-800">
          {settings.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.name} className="flex items-center justify-between px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-800 border border-neutral-700">
                    <Icon className="h-4 w-4 text-accent-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-200">{s.name}</p>
                    <p className="text-xs text-neutral-500">{s.description}</p>
                    <p className="mt-1 font-mono text-xs text-neutral-400">{s.url}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="font-mono text-xs text-neutral-500">:{s.port}</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Environment variables reference */}
      <div className="mt-6">
        <Card title="Environment Variables" subtitle=".env file reference">
          <div className="p-5">
            <div className="overflow-x-auto rounded-lg bg-neutral-950 p-4">
              <pre className="text-xs font-mono text-neutral-400">{`VITE_DETECTION_API_URL=${API_CONFIG.detection}
VITE_INGESTION_API_URL=${API_CONFIG.ingestion}
VITE_GENERATOR_API_URL=${API_CONFIG.generator}
VITE_OLLAMA_URL=${API_CONFIG.ollama}
VITE_POLLING_INTERVAL_MS=${API_CONFIG.pollingInterval}`}</pre>
            </div>
            <div className="mt-3 flex items-start gap-2 text-xs text-neutral-500">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <p>
                Variables prefixed with <code className="text-neutral-400">VITE_</code> are exposed to the frontend at build time.
                Changes require a restart of the dev server.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* About */}
      <div className="mt-6">
        <Card title="About" subtitle="Application information">
          <div className="p-5 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">Application</span>
              <span className="font-medium text-neutral-200">{APP_CONFIG.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">Description</span>
              <span className="text-neutral-300">{APP_CONFIG.subtitle}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">Polling Interval</span>
              <span className="font-mono text-neutral-300">{API_CONFIG.pollingInterval / 1000}s</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-500">Framework</span>
              <span className="text-neutral-300">React + TypeScript + Vite</span>
            </div>
          </div>
        </Card>
      </div>

      {/* CORS notice */}
      <div className="mt-6">
        <Card title="CORS Configuration" subtitle="Required Spring Boot configuration for frontend access">
          <div className="p-5">
            <p className="text-sm text-neutral-400">
              The frontend runs on <code className="text-xs text-neutral-300">http://localhost:5173</code> and communicates with
              backend services on ports 8080, 8081, and 8082. Each Spring Boot service must have CORS configured to allow
              requests from the frontend origin.
            </p>
            <div className="mt-3 overflow-x-auto rounded-lg bg-neutral-950 p-4">
              <pre className="text-xs font-mono text-neutral-400">{`// Add to each Spring Boot service:
@CrossOrigin(origins = "http://localhost:5173")
// Or in WebMvcConfigurer:
@Override
public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**")
        .allowedOrigins("http://localhost:5173")
        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS");
}`}</pre>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
