import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  AlertTriangle,
  BookOpen,
  Server,
  Activity,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
} from 'lucide-react';
import { APP_CONFIG } from '@/config';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/incidents', label: 'Incidents', icon: AlertTriangle },
  { to: '/knowledge', label: 'Knowledge Base', icon: BookOpen },
  { to: '/services', label: 'Services', icon: Server },
  { to: '/health', label: 'System Health', icon: Activity },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ collapsed, onToggle, mobileOpen, onCloseMobile }: SidebarProps) {
  const widthCls = collapsed ? 'w-16' : 'w-60';

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed lg:sticky top-0 z-40 flex h-screen flex-col border-r border-neutral-800 bg-neutral-900/80 backdrop-blur-sm
          transition-all duration-200 ${widthCls}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        aria-label="Primary navigation"
      >
        {/* Logo / Brand */}
        <div className="flex h-16 items-center gap-3 border-b border-neutral-800 px-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-500/10 border border-accent-500/20">
            <Shield className="h-5 w-5 text-accent-400" aria-hidden="true" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <div className="truncate text-sm font-semibold text-neutral-100">{APP_CONFIG.name}</div>
              <div className="truncate text-xs text-neutral-500">AIOps Platform</div>
            </div>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={onCloseMobile}
                    className={({ isActive }) => `
                      flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
                      ${isActive
                        ? 'bg-accent-500/10 text-accent-400'
                        : 'text-neutral-400 hover:bg-neutral-800/60 hover:text-neutral-200'
                      }
                      ${collapsed ? 'justify-center' : ''}
                    `}
                    title={collapsed ? item.label : undefined}
                    aria-label={item.label}
                  >
                    <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          className="hidden lg:flex items-center justify-center border-t border-neutral-800 py-3 text-neutral-500 transition-colors hover:text-neutral-300"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </aside>
    </>
  );
}
