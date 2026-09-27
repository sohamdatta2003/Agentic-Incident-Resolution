import { useLocation } from 'react-router-dom';
import { Bell, RefreshCw, Menu } from 'lucide-react';
import { StatusBadge } from '@/components/common/UI';
import { timeAgo } from '@/utils/format';
import type { HealthState } from '@/types/service';

interface HeaderProps {
  pageTitle: string;
  breadcrumb?: string;
  backendStatus: HealthState;
  lastUpdated: Date | null;
  onRefresh: () => void;
  refreshing?: boolean;
  onOpenMobileSidebar: () => void;
}

export function Header({
  pageTitle,
  breadcrumb,
  backendStatus,
  lastUpdated,
  onRefresh,
  refreshing,
  onOpenMobileSidebar,
}: HeaderProps) {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-neutral-800 bg-neutral-950/80 px-4 backdrop-blur-sm lg:px-6">
      {/* Left: mobile menu + title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-base font-semibold text-neutral-100 lg:text-lg">{pageTitle}</h1>
          {breadcrumb && (
            <p className="hidden text-xs text-neutral-500 sm:block">
              <span className="text-neutral-600">IncidentAI</span>
              <span className="mx-1.5 text-neutral-700">/</span>
              <span>{breadcrumb}</span>
            </p>
          )}
        </div>
      </div>

      {/* Right: status + actions */}
      <div className="flex items-center gap-2 lg:gap-3">
        <div className="hidden items-center gap-2 text-xs text-neutral-500 sm:flex">
          <span>Last updated:</span>
          <span className="font-medium text-neutral-400">{timeAgo(lastUpdated)}</span>
        </div>

        <StatusBadge state={backendStatus} label={backendStatus === 'healthy' ? 'Backend Connected' : backendStatus === 'unhealthy' ? 'Backend Offline' : 'Checking…'} />

        <button
          onClick={onRefresh}
          className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-neutral-200"
          aria-label="Refresh data"
          disabled={refreshing}
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
        </button>

        <button
          className="relative rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-neutral-200"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-accent-500" />
        </button>

        {/* Profile placeholder */}
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-800 text-xs font-medium text-neutral-400"
          aria-label="User profile placeholder"
        >
          IA
        </div>
      </div>
    </header>
  );
}


