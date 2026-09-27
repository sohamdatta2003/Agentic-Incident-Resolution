import { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import type { NormalizedIncident } from '@/types/incident';
import type { SeverityLevel } from '@/types/incident';

const SEVERITY_COLORS: Record<string, string> = {
  CRITICAL: '#ef4444',
  HIGH: '#f97316',
  MEDIUM: '#eab308',
  LOW: '#3b82f6',
  UNKNOWN: '#737373',
};

const CATEGORY_COLORS = [
  '#06b6d4',
  '#8b5cf6',
  '#f97316',
  '#10b981',
  '#ef4444',
  '#eab308',
  '#6366f1',
  '#ec4899',
];

interface SeverityChartProps {
  incidents: NormalizedIncident[];
}

export function SeverityChart({ incidents }: SeverityChartProps) {
  const data = useMemo(() => {
    const counts = new Map<string, number>();
    for (const inc of incidents) {
      const sev = (inc.severityDisplay || 'UNKNOWN').toUpperCase();
      counts.set(sev, (counts.get(sev) ?? 0) + 1);
    }
    return Array.from(counts.entries()).map(([name, value]) => ({ name, value }));
  }, [incidents]);

  if (data.length === 0) {
    return <ChartEmpty label="No severity data available" />;
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
        <XAxis dataKey="name" tick={{ fill: '#737373', fontSize: 11 }} axisLine={{ stroke: '#404040' }} tickLine={false} />
        <YAxis tick={{ fill: '#737373', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#171717',
            border: '1px solid #404040',
            borderRadius: '8px',
            fontSize: '12px',
            color: '#e5e5e5',
          }}
          cursor={{ fill: '#262626' }}
        />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={SEVERITY_COLORS[entry.name] ?? '#737373'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

interface CategoryChartProps {
  incidents: NormalizedIncident[];
}

export function CategoryChart({ incidents }: CategoryChartProps) {
  const data = useMemo(() => {
    const counts = new Map<string, number>();
    for (const inc of incidents) {
      const cat = (inc.category || 'UNKNOWN').toUpperCase();
      counts.set(cat, (counts.get(cat) ?? 0) + 1);
    }
    return Array.from(counts.entries()).map(([name, value]) => ({ name, value }));
  }, [incidents]);

  if (data.length === 0) {
    return <ChartEmpty label="No category data available" />;
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          innerRadius={45}
          paddingAngle={2}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} stroke="#171717" strokeWidth={2} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: '#171717',
            border: '1px solid #404040',
            borderRadius: '8px',
            fontSize: '12px',
            color: '#e5e5e5',
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function ChartLegend({ items }: { items: { label: string; color: string; value: number }[] }) {
  if (items.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1.5 px-5 pb-4">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5 text-xs text-neutral-400">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: item.color }} />
          {item.label} <span className="font-medium text-neutral-300">({item.value})</span>
        </div>
      ))}
    </div>
  );
}

function ChartEmpty({ label }: { label: string }) {
  return (
    <div className="flex h-[240px] items-center justify-center text-sm text-neutral-600">
      {label}
    </div>
  );
}

export type { SeverityLevel };
