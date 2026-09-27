import { useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Brain,
  BookOpen,
  Clock,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Wrench,
  ShieldCheck,
  Activity,
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SeverityBadge } from '@/components/common/SeverityBadge';
import { Card, StatusBadge, SectionTitle } from '@/components/common/UI';
import { ErrorState, EmptyState } from '@/components/common/StateViews';
import { Skeleton } from '@/components/common/Skeleton';
import { useIncidents } from '@/hooks/useIncidents';
import { useServiceHealth } from '@/hooks/useServiceHealth';
import { API_CONFIG } from '@/config';
import { formatTimestamp, confidencePercent } from '@/utils/format';
import type { NormalizedIncident } from '@/types/incident';
import type { HealthState } from '@/types/service';

export function IncidentDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { incidents, loading, error, lastUpdated, refresh } = useIncidents({
    pollingInterval: API_CONFIG.pollingInterval,
  });
  const { health } = useServiceHealth(false);

  /**
   * TODO: Replace this client-side lookup with a direct API call once the
   * backend exposes GET /incidents/{id}. Until then, we derive the incident
   * from the already-loaded collection fetched by GET /incidents/errors.
   */
  const incident = useMemo(
    () => incidents.find((i) => i.id === decodeURIComponent(id ?? '')),
    [incidents, id]
  );

  const backendStatus: HealthState = error ? 'unhealthy' : loading ? 'checking' : 'healthy';

  const analysis = incident?.analysis;

  const timelineStages = useMemo(() => {
    const stages = [
      { key: 'detected', label: 'Detected', icon: AlertTriangle },
      { key: 'analyzed', label: 'AI Analyzed', icon: Brain },
      { key: 'recommended', label: 'Recommended Action', icon: Wrench },
      { key: 'remediation', label: 'Remediation', icon: ShieldCheck },
      { key: 'verification', label: 'Verification', icon: CheckCircle2 },
    ];

    return stages.map((stage) => {
      let completed = false;
      let active = false;

      if (stage.key === 'detected') {
        completed = !!incident;
        active = !!incident && !analysis;
      } else if (stage.key === 'analyzed') {
        completed = !!analysis;
        active = !analysis && !!incident;
      } else if (stage.key === 'recommended') {
        completed = !!analysis?.recommendedAction;
        active = !!analysis && !analysis.recommendedAction;
      } else if (stage.key === 'remediation') {
        completed = false; // Not yet supported by backend
        active = false;
      } else if (stage.key === 'verification') {
        completed = false; // Not yet supported by backend
        active = false;
      }

      return { ...stage, completed, active };
    });
  }, [incident, analysis]);

  if (loading && incidents.length === 0) {
    return (
      <Layout pageTitle="Incident Details" breadcrumb="Incidents / Details" backendStatus="checking" lastUpdated={lastUpdated} onRefresh={refresh} refreshing>
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-32" />
          <Skeleton className="h-48" />
        </div>
      </Layout>
    );
  }

  if (error && incidents.length === 0) {
    return (
      <Layout pageTitle="Incident Details" breadcrumb="Incidents / Details" backendStatus="unhealthy" lastUpdated={lastUpdated} onRefresh={refresh}>
        <ErrorState
          title="Unable to connect to Incident Detection Service"
          message={error}
          onRetry={refresh}
        />
      </Layout>
    );
  }

  if (!incident) {
    return (
      <Layout pageTitle="Incident Details" breadcrumb="Incidents / Details" backendStatus={backendStatus} lastUpdated={lastUpdated} onRefresh={refresh}>
        <EmptyState
          title="Incident not found"
          message="This incident may have been cleared or is no longer available in the current data."
          icon={<AlertTriangle className="h-8 w-8 text-neutral-600" />}
        />
        <div className="mt-4 text-center">
          <Link to="/incidents" className="text-sm font-medium text-accent-400 hover:text-accent-300">
            ← Back to Incidents
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      pageTitle={`Incident ${incident.id}`}
      breadcrumb={`Incidents / ${incident.id}`}
      backendStatus={backendStatus}
      lastUpdated={lastUpdated}
      onRefresh={refresh}
      refreshing={loading}
    >
      {/* Back link */}
      <button
        onClick={() => navigate('/incidents')}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-200"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Incidents
      </button>

      {/* Header card */}
      <Card className="mb-6 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-neutral-100">
                {incident.errorType || `Incident ${incident.id}`}
              </h2>
              <SeverityBadge severity={incident.severityDisplay} size="md" />
            </div>
            {incident.message && (
              <p className="text-sm text-neutral-400">{incident.message}</p>
            )}
            <div className="flex flex-wrap gap-x-6 gap-y-1 pt-2 text-xs text-neutral-500">
              <span><span className="text-neutral-600">ID:</span> {incident.id}</span>
              <span><span className="text-neutral-600">Service:</span> {incident.serviceDisplay}</span>
              <span><span className="text-neutral-600">Category:</span> {incident.category || '—'}</span>
              <span><span className="text-neutral-600">Timestamp:</span> {formatTimestamp(incident.timestampDisplay)}</span>
              <span>
                <span className="text-neutral-600">Status:</span>{' '}
                {incident.status ? (
                  <span className="rounded-md bg-neutral-800 px-1.5 py-0.5 text-neutral-300">{incident.status}</span>
                ) : '—'}
              </span>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* AI Analysis */}
        <div className="space-y-6">
          <Card title="AI Analysis" subtitle="RAG + Ollama (Qwen 3 1.7B)" className="animate-slide-in">
            <div className="p-5">
              {analysis ? (
                <div className="space-y-4">
                  <AnalysisRow
                    label="Incident Detected"
                    value={
                      <span className={`inline-flex items-center gap-1.5 ${analysis.isIncident ? 'text-red-400' : 'text-emerald-400'}`}>
                        {analysis.isIncident ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                        {analysis.isIncident ? 'Yes' : 'No'}
                      </span>
                    }
                  />
                  <AnalysisRow label="Severity" value={<SeverityBadge severity={analysis.severity} />} />
                  <AnalysisRow label="Category" value={<span className="text-neutral-200">{analysis.category}</span>} />
                  <AnalysisRow label="Root Cause" value={<span className="text-neutral-300">{analysis.rootCause}</span>} />
                  <AnalysisRow
                    label="Confidence"
                    value={
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm text-neutral-200">{confidencePercent(analysis.confidence)}</span>
                        <ConfidenceBar value={analysis.confidence} />
                      </div>
                    }
                  />
                  <AnalysisRow
                    label="Auto-Resolvable"
                    value={
                      <span className={`inline-flex items-center gap-1.5 ${analysis.autoResolvable ? 'text-emerald-400' : 'text-neutral-400'}`}>
                        <ShieldCheck className="h-4 w-4" />
                        {analysis.autoResolvable ? 'Yes' : 'No'}
                      </span>
                    }
                  />
                  <div className="border-t border-neutral-800 pt-4">
                    <p className="mb-1 text-xs font-medium uppercase tracking-wider text-neutral-500">Recommended Action</p>
                    <p className="text-sm text-neutral-300">{analysis.recommendedAction}</p>
                  </div>

                  {/* Remediation button — disabled until backend support exists */}
                  <div className="border-t border-neutral-800 pt-4">
                    <button
                      disabled
                      className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg border border-neutral-700 bg-neutral-800/50 px-4 py-2 text-sm text-neutral-500"
                      title="Remediation API not yet available"
                    >
                      <Wrench className="h-4 w-4" />
                      {analysis.autoResolvable ? 'Remediation unavailable — Coming soon' : 'Remediation unavailable'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-6">
                  <EmptyState
                    title="AI Analysis Not Available"
                    message="This incident has not yet been analyzed by the AI detection service, or the analysis result is not included in the current API response."
                    icon={<Brain className="h-8 w-8 text-neutral-600" />}
                  />
                </div>
              )}
            </div>
          </Card>

          {/* Incident Summary */}
          <Card title="Incident Summary" className="animate-slide-in">
            <div className="p-5 space-y-3">
              {incident.stackTrace && (
                <div>
                  <p className="mb-1 text-xs font-medium uppercase tracking-wider text-neutral-500">Stack Trace</p>
                  <pre className="overflow-x-auto rounded-lg bg-neutral-950 p-3 text-xs font-mono text-neutral-400 max-h-48">{incident.stackTrace}</pre>
                </div>
              )}
              {!incident.stackTrace && !incident.message && (
                <p className="text-sm text-neutral-500">No additional detail available for this incident.</p>
              )}
              {incident.raw && Object.keys(incident.raw).length > 0 && (
                <details>
                  <summary className="cursor-pointer text-xs text-neutral-500 hover:text-neutral-400">Raw API data</summary>
                  <pre className="mt-2 overflow-x-auto rounded-lg bg-neutral-950 p-3 text-xs font-mono text-neutral-500 max-h-64">{JSON.stringify(incident.raw, null, 2)}</pre>
                </details>
              )}
            </div>
          </Card>
        </div>

        {/* Right column: RAG + Timeline */}
        <div className="space-y-6">
          {/* RAG Evidence */}
          <Card title="RAG Evidence" subtitle="Retrieved knowledge / runbook" className="animate-slide-in">
            <div className="p-5">
              {analysis ? (
                <div className="space-y-3">
                  <div className="flex items-start gap-3 rounded-lg border border-neutral-800 bg-neutral-950/50 p-3">
                    <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" />
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">Knowledge Source</p>
                      <p className="mt-1 text-sm text-neutral-300">
                        Runbooks from <code className="text-xs text-accent-400">src/main/resources/knowledge/</code>
                      </p>
                    </div>
                  </div>
                  <div className="rounded-lg border border-dashed border-neutral-700 bg-neutral-900/30 p-4 text-sm text-neutral-500">
                    RAG evidence is generated internally by the detection service and is not currently exposed through the frontend API.
                    The AI analysis above was produced using retrieved runbook context, but the specific evidence passages and similarity
                    scores are not returned in the current response.
                  </div>
                </div>
              ) : (
                <div className="py-6">
                  <EmptyState
                    title="RAG Evidence Unavailable"
                    message="RAG evidence is generated internally by the detection service and is not currently exposed through the frontend API."
                    icon={<BookOpen className="h-8 w-8 text-neutral-600" />}
                  />
                </div>
              )}
            </div>
          </Card>

          {/* Timeline */}
          <Card title="Timeline" subtitle="Incident lifecycle stages" className="animate-slide-in">
            <div className="p-5">
              <ol className="relative space-y-6">
                {timelineStages.map((stage, i) => {
                  const Icon = stage.icon;
                  return (
                    <li key={stage.key} className="flex items-start gap-3">
                      <div className="relative flex flex-col items-center">
                        {stage.completed ? (
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/30">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                          </div>
                        ) : stage.active ? (
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-500/15 border border-yellow-500/30">
                            <Icon className="h-4 w-4 text-yellow-400 animate-pulse" />
                          </div>
                        ) : (
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-800/60 border border-neutral-700">
                            <Circle className="h-4 w-4 text-neutral-600" />
                          </div>
                        )}
                        {i < timelineStages.length - 1 && (
                          <div className={`absolute top-7 h-[calc(100%+0.5rem)] w-px ${stage.completed ? 'bg-emerald-500/20' : 'bg-neutral-800'}`} />
                        )}
                      </div>
                      <div className="pt-1">
                        <p className={`text-sm font-medium ${stage.completed ? 'text-neutral-200' : stage.active ? 'text-neutral-300' : 'text-neutral-600'}`}>
                          {stage.label}
                        </p>
                        {stage.completed && stage.key === 'detected' && (
                          <p className="text-xs text-neutral-500">{formatTimestamp(incident.timestampDisplay)}</p>
                        )}
                        {stage.completed && stage.key === 'analyzed' && analysis && (
                          <p className="text-xs text-neutral-500">Severity: {analysis.severity} • Confidence: {confidencePercent(analysis.confidence)}</p>
                        )}
                        {stage.completed && stage.key === 'recommended' && analysis?.recommendedAction && (
                          <p className="text-xs text-neutral-500">{analysis.recommendedAction}</p>
                        )}
                        {!stage.completed && !stage.active && (stage.key === 'remediation' || stage.key === 'verification') && (
                          <p className="text-xs text-neutral-600">Not yet supported by backend</p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

function AnalysisRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-xs font-medium uppercase tracking-wider text-neutral-500 shrink-0 pt-0.5">{label}</span>
      <span className="text-right">{value}</span>
    </div>
  );
}

function ConfidenceBar({ value }: { value: number }) {
  const pct = value <= 1 ? value * 100 : value;
  const color = pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-red-500';
  return (
    <div className="h-1.5 w-20 overflow-hidden rounded-full bg-neutral-800">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min(100, pct)}%` }} />
    </div>
  );
}
