import type { ReactNode } from 'react';
import { AlertCircle, Inbox, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  technicalDetail?: string;
}

export function ErrorState({ title = 'Connection Error', message, onRetry, technicalDetail }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-red-500/20 bg-red-500/5 p-8 text-center animate-fade-in">
      <AlertCircle className="mb-3 h-10 w-10 text-red-400" aria-hidden="true" />
      <h3 className="text-base font-semibold text-neutral-100">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-neutral-400">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-neutral-800 px-4 py-2 text-sm font-medium text-neutral-100 transition-colors hover:bg-neutral-700"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Retry
        </button>
      )}
      {technicalDetail && (
        <details className="mt-4 w-full text-left">
          <summary className="cursor-pointer text-xs text-neutral-500 hover:text-neutral-400">Technical details</summary>
          <pre className="mt-2 overflow-x-auto rounded-lg bg-neutral-900 p-3 text-xs text-neutral-500 font-mono">{technicalDetail}</pre>
        </details>
      )}
    </div>
  );
}

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: ReactNode;
}

export function EmptyState({ title = 'No Data Available', message, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900/50 p-8 text-center animate-fade-in">
      {icon ?? <Inbox className="mb-3 h-10 w-10 text-neutral-600" aria-hidden="true" />}
      <h3 className="text-base font-semibold text-neutral-300">{title}</h3>
      {message && <p className="mt-1 max-w-sm text-sm text-neutral-500">{message}</p>}
    </div>
  );
}

interface UnavailableStateProps {
  title: string;
  message: string;
  futureApi?: string;
}

export function UnavailableState({ title, message, futureApi }: UnavailableStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-700 bg-neutral-900/30 p-8 text-center animate-fade-in">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-neutral-800">
        <Inbox className="h-5 w-5 text-neutral-500" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold text-neutral-300">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-neutral-500">{message}</p>
      {futureApi && (
        <p className="mt-3 rounded-md bg-neutral-800/50 px-3 py-1.5 text-xs font-mono text-neutral-400">
          Future: {futureApi}
        </p>
      )}
    </div>
  );
}
