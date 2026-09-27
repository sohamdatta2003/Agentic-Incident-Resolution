import type { ReactNode } from 'react';

interface KpiCardProps {
  label: string;
  value: ReactNode;
  icon: ReactNode;
  accent?: 'cyan' | 'red' | 'orange' | 'yellow' | 'blue' | 'emerald' | 'neutral';
  subtext?: string;
}

const accentMap = {
  cyan: 'text-accent-400 bg-accent-500/10 border-accent-500/20',
  red: 'text-red-400 bg-red-500/10 border-red-500/20',
  orange: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  yellow: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  neutral: 'text-neutral-400 bg-neutral-500/10 border-neutral-500/20',
};

export function KpiCard({ label, value, icon, accent = 'cyan', subtext }: KpiCardProps) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-4 transition-colors hover:border-neutral-700">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-neutral-100">{value}</p>
          {subtext && <p className="mt-1 text-xs text-neutral-500">{subtext}</p>}
        </div>
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${accentMap[accent]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
