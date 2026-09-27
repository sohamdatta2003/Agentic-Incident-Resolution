import type { ReactNode } from 'react';
import type { HealthState } from '@/types/service';

interface StatusDotProps {
  state: HealthState;
  size?: 'sm' | 'md';
}

export function StatusDot({ state, size = 'sm' }: StatusDotProps) {
  const sizeCls = size === 'sm' ? 'h-2 w-2' : 'h-2.5 w-2.5';
  const colorCls =
    state === 'healthy'
      ? 'bg-emerald-500'
      : state === 'unhealthy'
        ? 'bg-red-500'
        : state === 'checking'
          ? 'bg-yellow-500 animate-pulse'
          : 'bg-neutral-600';

  return (
    <span
      className={`relative inline-flex ${sizeCls} rounded-full ${colorCls}`}
      aria-label={`Status: ${state}`}
    >
      {state === 'healthy' && (
        <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${colorCls} opacity-60`} />
      )}
    </span>
  );
}

interface StatusBadgeProps {
  state: HealthState;
  label?: string;
}

export function StatusBadge({ state, label }: StatusBadgeProps) {
  const text =
    label ??
    (state === 'healthy'
      ? 'Connected'
      : state === 'unhealthy'
        ? 'Disconnected'
        : state === 'checking'
          ? 'Checking…'
          : 'Unknown');

  const cls =
    state === 'healthy'
      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      : state === 'unhealthy'
        ? 'bg-red-500/10 text-red-400 border-red-500/20'
        : state === 'checking'
          ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
          : 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium ${cls}`}>
      <StatusDot state={state} />
      {text}
    </span>
  );
}

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
}

export function Card({ children, className = '', title, subtitle, action }: CardProps) {
  return (
    <div className={`rounded-xl border border-neutral-800 bg-neutral-900/50 ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between border-b border-neutral-800 px-5 py-3">
          <div>
            {title && <h3 className="text-sm font-semibold text-neutral-100">{title}</h3>}
            {subtitle && <p className="mt-0.5 text-xs text-neutral-500">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
}

export function SectionTitle({ title, subtitle, icon }: SectionTitleProps) {
  return (
    <div className="flex items-center gap-2">
      {icon && <span className="text-accent-400">{icon}</span>}
      <div>
        <h2 className="text-lg font-semibold text-neutral-100">{title}</h2>
        {subtitle && <p className="text-sm text-neutral-500">{subtitle}</p>}
      </div>
    </div>
  );
}
