import type { SeverityLevel } from '@/types/incident';

export function severityRank(sev: SeverityLevel): number {
  const s = (sev || '').toUpperCase();
  switch (s) {
    case 'CRITICAL': return 0;
    case 'HIGH': return 1;
    case 'MEDIUM': return 2;
    case 'LOW': return 3;
    default: return 4;
  }
}

export function severityClasses(sev: SeverityLevel): {
  badge: string;
  dot: string;
  text: string;
  label: string;
} {
  const s = (sev || '').toUpperCase();
  switch (s) {
    case 'CRITICAL':
      return {
        badge: 'bg-red-500/15 text-red-400 border-red-500/30',
        dot: 'bg-red-500',
        text: 'text-red-400',
        label: 'Critical',
      };
    case 'HIGH':
      return {
        badge: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
        dot: 'bg-orange-500',
        text: 'text-orange-400',
        label: 'High',
      };
    case 'MEDIUM':
      return {
        badge: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
        dot: 'bg-yellow-500',
        text: 'text-yellow-400',
        label: 'Medium',
      };
    case 'LOW':
      return {
        badge: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
        dot: 'bg-blue-500',
        text: 'text-blue-400',
        label: 'Low',
      };
    default:
      return {
        badge: 'bg-neutral-500/15 text-neutral-400 border-neutral-500/30',
        dot: 'bg-neutral-500',
        text: 'text-neutral-400',
        label: 'Unknown',
      };
  }
}

export function formatTimestamp(ts: string): string {
  try {
    const d = new Date(ts);
    if (isNaN(d.getTime())) return ts;
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch {
    return ts;
  }
}

export function timeAgo(date: Date | null): string {
  if (!date) return 'never';
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 5) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function confidencePercent(value: number | null | undefined): string {
  if (value == null || isNaN(value)) return 'N/A';
  if (value <= 1) return `${Math.round(value * 100)}%`;
  return `${Math.round(value)}%`;
}

export function truncate(str: string, max: number): string {
  if (str.length <= max) return str;
  return str.slice(0, max) + '…';
}
