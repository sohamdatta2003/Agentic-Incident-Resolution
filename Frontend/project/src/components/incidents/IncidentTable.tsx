import { Link } from 'react-router-dom';
import { ChevronRight, Search } from 'lucide-react';
import { SeverityBadge } from '@/components/common/SeverityBadge';
import { confidencePercent, formatTimestamp, truncate } from '@/utils/format';
import type { NormalizedIncident } from '@/types/incident';

interface IncidentTableProps {
  incidents: NormalizedIncident[];
  showActions?: boolean;
  emptyMessage?: string;
}

export function IncidentTable({ incidents, showActions = true, emptyMessage = 'No incidents detected' }: IncidentTableProps) {
  if (incidents.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-sm text-neutral-500">
        <Search className="mr-2 h-4 w-4" aria-hidden="true" />
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-800 text-left text-xs uppercase tracking-wider text-neutral-500">
            <th className="px-4 py-3 font-medium">Incident</th>
            <th className="px-4 py-3 font-medium">Service</th>
            <th className="px-4 py-3 font-medium">Severity</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Confidence</th>
            <th className="px-4 py-3 font-medium">Timestamp</th>
            {showActions && <th className="px-4 py-3 font-medium text-right">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800/60">
          {incidents.map((inc) => (
            <tr key={inc.id} className="transition-colors hover:bg-neutral-800/30">
              <td className="px-4 py-3">
                <div className="font-medium text-neutral-200">{inc.errorType || inc.id}</div>
                {inc.message && (
                  <div className="mt-0.5 text-xs text-neutral-500">{truncate(inc.message, 60)}</div>
                )}
              </td>
              <td className="px-4 py-3 text-neutral-300">{inc.serviceDisplay}</td>
              <td className="px-4 py-3">
                <SeverityBadge severity={inc.severityDisplay} />
              </td>
              <td className="px-4 py-3 text-neutral-300">{inc.category || '—'}</td>
              <td className="px-4 py-3">
                {inc.status ? (
                  <span className="rounded-md bg-neutral-800 px-2 py-0.5 text-xs font-medium text-neutral-300">
                    {inc.status}
                  </span>
                ) : (
                  <span className="text-xs text-neutral-600">—</span>
                )}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-neutral-300">
                {confidencePercent(inc.confidenceValue)}
              </td>
              <td className="px-4 py-3 text-xs text-neutral-400">{formatTimestamp(inc.timestampDisplay)}</td>
              {showActions && (
                <td className="px-4 py-3 text-right">
                  <Link
                    to={`/incidents/${encodeURIComponent(inc.id)}`}
                    className="inline-flex items-center gap-1 text-xs font-medium text-accent-400 hover:text-accent-300"
                    aria-label={`View incident ${inc.id} details`}
                  >
                    View
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
