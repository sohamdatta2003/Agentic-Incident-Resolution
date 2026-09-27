import { useState } from 'react';
import { Search, BookOpen, FileText, Database, Network } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/common/UI';
import { UnavailableState } from '@/components/common/StateViews';
import { useServiceHealth } from '@/hooks/useServiceHealth';
import type { HealthState } from '@/types/service';

/**
 * Knowledge Base page.
 *
 * The backend currently loads runbooks internally from
 * src/main/resources/knowledge/*.txt — there is no CRUD API yet.
 *
 * Known runbooks (from backend source):
 * - database-timeout.txt
 * - kafka-consumer-lag.txt
 *
 * We display these as known items but mark all API-backed functionality
 * (content retrieval, search, CRUD) as unavailable.
 */

const KNOWN_RUNBOOKS = [
  {
    id: 'database-timeout',
    filename: 'database-timeout.txt',
    category: 'DATABASE',
    title: 'Database Timeout Resolution',
    description: 'Runbook for resolving database connection timeout and pool exhaustion incidents.',
    icon: Database,
  },
  {
    id: 'kafka-consumer-lag',
    filename: 'kafka-consumer-lag.txt',
    category: 'KAFKA',
    title: 'Kafka Consumer Lag Remediation',
    description: 'Runbook for addressing Kafka consumer group lag and throughput degradation.',
    icon: Network,
  },
];

export function KnowledgeBase() {
  const { health, lastUpdated, refresh } = useServiceHealth(false);
  const backendStatus: HealthState = health.find((h) => h.serviceId === 'incident-detection')?.state ?? 'unknown';
  const [search, setSearch] = useState('');

  return (
    <Layout
      pageTitle="Knowledge Base"
      breadcrumb="Knowledge Base"
      backendStatus={backendStatus}
      lastUpdated={lastUpdated}
      onRefresh={refresh}
    >
      {/* Search bar */}
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" aria-hidden="true" />
        <input
          type="text"
          placeholder="Search runbooks…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-neutral-700 bg-neutral-900/50 py-2.5 pl-9 pr-3 text-sm text-neutral-200 placeholder:text-neutral-600 focus:border-accent-500"
          aria-label="Search runbooks"
        />
      </div>

      {/* Unavailable banner */}
      <div className="mb-6">
        <UnavailableState
          title="Knowledge Base API not connected yet"
          message="Runbooks are loaded internally by the incident-detection-service from src/main/resources/knowledge/*.txt. A CRUD API for browsing, searching, and viewing runbook content is not yet available."
          futureApi="GET /api/knowledge/runbooks, GET /api/knowledge/runbooks/{id}"
        />
      </div>

      {/* Known runbooks — display only, content not available */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {KNOWN_RUNBOOKS.filter((r) =>
          search ? r.title.toLowerCase().includes(search.toLowerCase()) || r.category.toLowerCase().includes(search.toLowerCase()) : true
        ).map((runbook) => {
          const Icon = runbook.icon;
          return (
            <Card key={runbook.id} className="p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-500/10 border border-accent-500/20">
                  <Icon className="h-5 w-5 text-accent-400" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-neutral-100">{runbook.title}</h3>
                    <span className="rounded-md bg-neutral-800 px-1.5 py-0.5 text-xs font-medium text-neutral-400">
                      {runbook.category}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-neutral-400">{runbook.description}</p>
                  <div className="mt-3 flex items-center gap-4 text-xs text-neutral-500">
                    <span className="inline-flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {runbook.filename}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      Loaded internally by backend
                    </span>
                  </div>
                  <button
                    disabled
                    className="mt-4 cursor-not-allowed rounded-lg border border-neutral-700 bg-neutral-800/50 px-3 py-1.5 text-xs text-neutral-500"
                    title="Runbook content API not yet available"
                  >
                    View runbook content — API unavailable
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </Layout>
  );
}
