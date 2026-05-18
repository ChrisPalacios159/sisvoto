'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Flag,
  FileText,
  Hash,
  BarChart3,
  Settings,
  Shield,
  LogOut,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { ModuleView } from '@/types/electoral';

interface SidebarProps {
  activeModule: ModuleView;
  onNavigate: (module: ModuleView) => void;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

interface NavItem {
  id: ModuleView;
  label: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'personeros', label: 'Personeros', icon: Users },
  { id: 'partidos', label: 'Partidos Pol\u00edticos', icon: Flag },
  { id: 'actas', label: 'Actas Registradas', icon: FileText },
  { id: 'mesas', label: 'Mesas Electorales', icon: Hash },
  { id: 'reportes', label: 'Reportes', icon: BarChart3 },
  { id: 'configuracion', label: 'Configuraci\u00f3n', icon: Settings },
];

const MODULE_LABELS: Record<ModuleView, string> = {
  dashboard: 'Dashboard',
  personeros: 'Personeros',
  partidos: 'Partidos Pol\u00edticos',
  actas: 'Actas Registradas',
  mesas: 'Mesas Electorales',
  reportes: 'Reportes',
  configuracion: 'Configuraci\u00f3n',
};

export default function Sidebar({
  activeModule,
  onNavigate,
  isOpen,
  onClose,
  onLogout,
}: SidebarProps) {
  const handleNavigate = (module: ModuleView) => {
    onNavigate(module);
    onClose();
  };

  const sidebarContent = (
    <div
      className="flex h-full flex-col"
      style={{
        background: 'linear-gradient(180deg, #1B2438 0%, #172033 40%, #131C2E 100%)',
      }}
    >
      {/* Logo / Brand */}
      <div className="relative overflow-hidden px-5 pt-6 pb-5">
        {/* Decorative ambient glow */}
        <div
          className="absolute -top-6 -right-6 w-24 h-24 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,107,0,0.15) 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 left-8 w-16 h-16 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,140,56,0.08) 0%, transparent 70%)' }}
        />

        <div className="relative z-10 flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-2xl shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #FF6B00 0%, #E05500 100%)',
              boxShadow: '0 4px 16px rgba(255,107,0,0.35)',
            }}
          >
            <Shield className="h-5 w-5 text-white" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-[15px] font-bold text-white tracking-tight">Sistema Electoral</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-medium text-slate-400">Monitoreo en Vivo</span>
            </div>
          </div>
          {/* Close button on mobile */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="ml-auto text-slate-500 hover:bg-white/5 hover:text-white md:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Elegant separator */}
      <div className="mx-4 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,107,0,0.2), transparent)' }} />

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="mb-3 px-3">
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">Menú Principal</span>
        </div>
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = activeModule === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`
                  group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium
                  transition-all duration-200 ease-in-out
                  ${
                    isActive
                      ? 'text-white'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                  }
                `}
                style={isActive ? {
                  background: 'linear-gradient(135deg, rgba(255,107,0,0.18) 0%, rgba(255,107,0,0.06) 100%)',
                  boxShadow: '0 1px 8px rgba(255,107,0,0.08)',
                } : undefined}
              >
                {/* Active left indicator */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full"
                    style={{
                      background: 'linear-gradient(180deg, #FF8C38, #FF6B00)',
                      boxShadow: '0 0 10px rgba(255,107,0,0.4)',
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${
                    isActive ? '' : 'group-hover:bg-white/[0.04]'
                  }`}
                  style={isActive ? {
                    background: 'linear-gradient(135deg, #FF6B00 0%, #E05500 100%)',
                    boxShadow: '0 2px 10px rgba(255,107,0,0.25)',
                  } : undefined}
                >
                  <Icon className={`h-[18px] w-[18px] transition-transform duration-200 ${
                    isActive ? 'scale-110 text-white' : 'text-slate-500 group-hover:text-slate-300 group-hover:scale-105'
                  }`} />
                </div>
                <span className="flex-1 text-left">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mx-2 my-4 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(148,163,184,0.15), transparent)' }} />

        <div className="mb-3 px-3">
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">Cuenta</span>
        </div>
      </ScrollArea>

      {/* User Section */}
      <div className="px-3 py-3" style={{ borderTop: '1px solid rgba(148,163,184,0.1)' }}>
        <div
          className="flex items-center gap-3 rounded-xl px-3 py-3"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(148,163,184,0.08)' }}
        >
          <Avatar className="h-9 w-9 border-2 border-orange-500/30">
            <AvatarFallback
              className="text-white text-sm font-bold"
              style={{ background: 'linear-gradient(135deg, #FF6B00, #E05500)' }}
            >
              AD
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-col overflow-hidden">
            <span className="truncate text-sm font-semibold text-slate-200">Administrador</span>
            <span className="truncate text-[11px] text-slate-500">admin@electoral.gob</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onLogout}
            className="h-8 w-8 shrink-0 text-slate-600 hover:bg-red-500/10 hover:text-red-400"
            title="Cerrar sesi\u00f3n"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar — always visible, fixed position */}
      <aside className="hidden md:flex md:w-[260px] md:shrink-0 md:flex-col fixed inset-y-0 left-0 z-30"
        style={{ boxShadow: '4px 0 24px rgba(0,0,0,0.25)' }}
      >
        {sidebarContent}
      </aside>

      {/* Mobile overlay sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
              onClick={onClose}
            />

            {/* Sliding panel */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 w-[260px] md:hidden"
              style={{ boxShadow: '4px 0 24px rgba(0,0,0,0.25)' }}
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export { MODULE_LABELS };
