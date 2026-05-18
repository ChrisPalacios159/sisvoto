'use client';

import { useMemo } from 'react';
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
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
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
    <div className="flex h-full flex-col bg-white border-r border-gray-200/80">
      {/* Logo / Brand - Orange gradient header */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #FF6B00 0%, #FF8C38 60%, #FFB347 100%)',
          }}
        />
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 80% 20%, white 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }} />
        <div className="relative z-10 flex items-center gap-3 px-5 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm border border-white/25 shadow-lg">
            <Shield className="h-5 w-5 text-white" strokeWidth={2} />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold text-white tracking-tight">Sistema Electoral</span>
            <span className="text-[11px] font-medium text-white/70">Monitoreo en Tiempo Real</span>
          </div>
          {/* Close button on mobile */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="ml-auto text-white/70 hover:bg-white/20 hover:text-white md:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="mb-3 px-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Menú Principal</span>
        </div>
        <nav className="flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = activeModule === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`
                  group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium
                  transition-all duration-200 ease-in-out
                  ${
                    isActive
                      ? 'bg-orange-50 text-[#FF6B00]'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }
                `}
              >
                {/* Active left indicator */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-[#FF6B00]"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${
                  isActive ? 'bg-[#FF6B00]/10' : 'group-hover:bg-gray-100'
                }`}>
                  <Icon className={`h-[18px] w-[18px] transition-transform duration-200 ${
                    isActive ? 'scale-110' : 'group-hover:scale-105'
                  }`} />
                </div>
                <span className="flex-1 text-left">{item.label}</span>
                {isActive && (
                  <ChevronRight className="h-4 w-4 text-[#FF6B00]/50" />
                )}
              </button>
            );
          })}
        </nav>

        <Separator className="my-4 bg-gray-100" />

        <div className="mb-3 px-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Cuenta</span>
        </div>
      </ScrollArea>

      {/* User Section */}
      <div className="px-3 py-3 border-t border-gray-100">
        <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-3 border border-gray-100">
          <Avatar className="h-9 w-9 border-2 border-[#FF6B00]/30">
            <AvatarFallback className="bg-[#FF6B00] text-white text-sm font-bold">
              AD
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-col overflow-hidden">
            <span className="truncate text-sm font-semibold text-gray-700">Administrador</span>
            <span className="truncate text-[11px] text-gray-400">admin@electoral.gob</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onLogout}
            className="h-8 w-8 shrink-0 text-gray-400 hover:bg-red-50 hover:text-red-500"
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
      <aside className="hidden md:flex md:w-[260px] md:shrink-0 md:flex-col fixed inset-y-0 left-0 z-30">
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
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
              onClick={onClose}
            />

            {/* Sliding panel */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 w-[260px] md:hidden"
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
