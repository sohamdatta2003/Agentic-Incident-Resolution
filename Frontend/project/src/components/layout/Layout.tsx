import { useState, type ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import type { HealthState } from '@/types/service';

interface LayoutProps {
  children: ReactNode;
  pageTitle: string;
  breadcrumb?: string;
  backendStatus: HealthState;
  lastUpdated: Date | null;
  onRefresh: () => void;
  refreshing?: boolean;
}

export function Layout({
  children,
  pageTitle,
  breadcrumb,
  backendStatus,
  lastUpdated,
  onRefresh,
  refreshing,
}: LayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-neutral-950">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          pageTitle={pageTitle}
          breadcrumb={breadcrumb}
          backendStatus={backendStatus}
          lastUpdated={lastUpdated}
          onRefresh={onRefresh}
          refreshing={refreshing}
          onOpenMobileSidebar={() => setMobileOpen(true)}
        />

        <main className="flex-1 overflow-x-hidden p-4 lg:p-6">
          <div className="mx-auto max-w-7xl animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  );
}
