import { useMemo, useState } from 'react';
import { Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { IncidentTable } from '@/components/incidents/IncidentTable';
import { ErrorState, EmptyState } from '@/components/common/StateViews';
import { SkeletonRows } from '@/components/common/Skeleton';
import { useIncidents } from '@/hooks/useIncidents';
import { useServiceHealth } from '@/hooks/useServiceHealth';
import { API_CONFIG } from '@/config';
import { severityRank } from '@/utils/format';
import type { HealthState } from '@/types/service';

const PAGE_SIZE = 10;
const SORT_OPTIONS = [
  { label: 'Newest first', value: 'desc' as const },
  { label: 'Oldest first', value: 'asc' as const },
  { label: 'Severity (high→low)', value: 'sev-desc' as const },
  { label: 'Severity (low→high)', value: 'sev-asc' as const },
];

export function Incidents() {
  const { incidents, loading, error, lastUpdated, refresh } = useIncidents({
    pollingInterval: API_CONFIG.pollingInterval,
  });
  const { health } = useServiceHealth(false);

  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [serviceFilter, setServiceFilter] = useState('ALL');
  const [sortMode, setSortMode] = useState<'desc' | 'asc' | 'sev-desc' | 'sev-asc'>('desc');
  const [page, setPage] = useState(0);

  const backendStatus: HealthState = error ? 'unhealthy' : loading && incidents.length === 0 ? 'checking' : 'healthy';

  const categories = useMemo(
    () => [...new Set(incidents.map((i) => i.category).filter(Boolean))] as string[],
    [incidents]
  );
  const services = useMemo(
    () => [...new Set(incidents.map((i) => i.serviceDisplay).filter((s) => s !== 'Unknown Service'))],
    [incidents]
  );

  const filtered = useMemo(() => {
    let result = incidents;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) =>
          i.id.toLowerCase().includes(q) ||
          i.message?.toLowerCase().includes(q) ||
          i.errorType?.toLowerCase().includes(q) ||
          i.serviceDisplay.toLowerCase().includes(q) ||
          i.category?.toLowerCase().includes(q)
      );
    }

    if (severityFilter !== 'ALL') {
      result = result.filter((i) => (i.severityDisplay || '').toUpperCase() === severityFilter);
    }
    if (categoryFilter !== 'ALL') {
      result = result.filter((i) => (i.category || '').toUpperCase() === categoryFilter);
    }
    if (serviceFilter !== 'ALL') {
      result = result.filter((i) => i.serviceDisplay === serviceFilter);
    }

    const sorted = [...result];
    switch (sortMode) {
      case 'desc':
        sorted.sort((a, b) => new Date(b.timestampDisplay).getTime() - new Date(a.timestampDisplay).getTime());
        break;
      case 'asc':
        sorted.sort((a, b) => new Date(a.timestampDisplay).getTime() - new Date(b.timestampDisplay).getTime());
        break;
      case 'sev-desc':
        sorted.sort((a, b) => severityRank(a.severityDisplay) - severityRank(b.severityDisplay));
        break;
      case 'sev-asc':
        sorted.sort((a, b) => severityRank(b.severityDisplay) - severityRank(a.severityDisplay));
        break;
    }
    return sorted;
  }, [incidents, search, severityFilter, categoryFilter, serviceFilter, sortMode]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const hasFilters = search || severityFilter !== 'ALL' || categoryFilter !== 'ALL' || serviceFilter !== 'ALL';

  return (
    <Layout
      pageTitle="Incidents"
      breadcrumb="Incidents"
      backendStatus={backendStatus}
      lastUpdated={lastUpdated}
      onRefresh={refresh}
      refreshing={loading}
    >
      {/* Filters bar */}
      <div className="mb-4 flex flex-col gap-3 rounded-xl border border-neutral-800 bg-neutral-900/50 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search incidents, messages, services…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 py-2 pl-9 pr-3 text-sm text-neutral-200 placeholder:text-neutral-600 focus:border-accent-500"
              aria-label="Search incidents"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <FilterSelect
              icon={<Filter className="h-3.5 w-3.5" />}
              value={severityFilter}
              onChange={(v) => { setSeverityFilter(v); setPage(0); }}
              options={['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW']}
              label="Severity"
            />
            <FilterSelect
              value={categoryFilter}
              onChange={(v) => { setCategoryFilter(v); setPage(0); }}
              options={['ALL', ...categories.map((c) => c.toUpperCase())]}
              label="Category"
            />
            <FilterSelect
              value={serviceFilter}
              onChange={(v) => { setServiceFilter(v); setPage(0); }}
              options={['ALL', ...services]}
              label="Service"
            />
            <FilterSelect
              icon={<ArrowUpDown className="h-3.5 w-3.5" />}
              value={sortMode}
              onChange={(v) => setSortMode(v as typeof sortMode)}
              options={SORT_OPTIONS.map((s) => s.value)}
              labels={SORT_OPTIONS.map((s) => s.label)}
              label="Sort"
            />
          </div>
        </div>

        {/* Result count + clear filters */}
        <div className="flex items-center justify-between text-xs text-neutral-500">
          <span>
            {filtered.length} {filtered.length === 1 ? 'incident' : 'incidents'}
            {hasFilters && ' (filtered)'}
          </span>
          {hasFilters && (
            <button
              onClick={() => {
                setSearch(''); setSeverityFilter('ALL'); setCategoryFilter('ALL'); setServiceFilter('ALL'); setPage(0);
              }}
              className="text-accent-400 hover:text-accent-300"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/50">
        {loading && incidents.length === 0 ? (
          <div className="p-4"><SkeletonRows count={5} columns={7} /></div>
        ) : error && incidents.length === 0 ? (
          <div className="p-4">
            <ErrorState
              title="Unable to connect to Incident Detection Service"
              message={error}
              onRetry={refresh}
            />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-4">
            <EmptyState
              title={hasFilters ? 'No matching incidents' : 'No incidents detected'}
              message={hasFilters ? 'Try adjusting your filters or search query.' : 'When the detection service identifies incidents, they will appear here.'}
            />
          </div>
        ) : (
          <>
            <IncidentTable incidents={paged} emptyMessage="No incidents on this page" />
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-neutral-800 px-4 py-3 text-sm">
                <span className="text-xs text-neutral-500">
                  Page {page + 1} of {totalPages}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="rounded-md p-1.5 text-neutral-400 enabled:hover:bg-neutral-800 disabled:opacity-30"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                    className="rounded-md p-1.5 text-neutral-400 enabled:hover:bg-neutral-800 disabled:opacity-30"
                    aria-label="Next page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}

interface FilterSelectProps {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  labels?: string[];
  label: string;
  icon?: React.ReactNode;
}

function FilterSelect({ value, onChange, options, labels, label, icon }: FilterSelectProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none rounded-lg border border-neutral-700 bg-neutral-950 py-2 pl-3 pr-8 text-sm text-neutral-200 focus:border-accent-500"
        aria-label={`Filter by ${label}`}
      >
        {options.map((opt, i) => (
          <option key={opt} value={opt}>
            {labels?.[i] ?? (opt === 'ALL' ? `All ${label}` : opt)}
          </option>
        ))}
      </select>
      {icon && (
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500">
          {icon}
        </span>
      )}
    </div>
  );
}
