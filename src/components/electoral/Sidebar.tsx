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
  LogOut,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { ModuleView } from '@/types/electoral';
import type { ElementType } from 'react';

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
  icon: ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'personeros', label: 'Personeros', icon: Users },
  { id: 'partidos', label: 'Partidos Políticos', icon: Flag },
  { id: 'actas', label: 'Actas Registradas', icon: FileText },
  { id: 'mesas', label: 'Mesas Electorales', icon: Hash },
  { id: 'reportes', label: 'Reportes', icon: BarChart3 },
  { id: 'configuracion', label: 'Configuración', icon: Settings },
];

const MODULE_LABELS: Record<ModuleView, string> = {
  dashboard: 'Dashboard',
  personeros: 'Personeros',
  partidos: 'Partidos Políticos',
  actas: 'Actas Registradas',
  mesas: 'Mesas Electorales',
  reportes: 'Reportes',
  configuracion: 'Configuración',
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
        background: 'linear-gradient(180deg, #1E1008 0%, #2A1408 40%, #1A0D06 100%)',
      }}
    >
      <div className="relative overflow-hidden px-5 pb-5 pt-6">
        <div
          className="absolute -right-6 -top-6 h-24 w-24 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,107,0,0.2) 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-white"
            style={{
              boxShadow: '0 4px 12px rgba(255,107,0,0.35)',
            }}
          >
            <img
              src="/images/k.png"
              alt="Logo Sistema Electoral"
              className="h-full w-full object-contain p-1"
            />
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-bold text-white">
              Sistema Electoral
            </span>

            <div className="mt-0.5 flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              <span className="text-[10px] font-medium text-orange-200/60">
                Monitoreo en Vivo
              </span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="ml-auto text-orange-200/40 hover:bg-white/5 hover:text-white md:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div
        className="mx-4 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,107,0,0.15), transparent)',
        }}
      />

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = activeModule === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`
                  group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium
                  transition-all duration-200
                  ${
                    isActive
                      ? 'text-white'
                      : 'text-orange-100/50 hover:bg-white/[0.04] hover:text-orange-100/80'
                  }
                `}
                style={
                  isActive
                    ? {
                        background:
                          'linear-gradient(135deg, rgba(255,107,0,0.2) 0%, rgba(255,107,0,0.08) 100%)',
                      }
                    : undefined
                }
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-indicator"
                    className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full"
                    style={{
                      background: 'linear-gradient(180deg, #FF8C38, #FF6B00)',
                      boxShadow: '0 0 8px rgba(255,107,0,0.4)',
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}

                <Icon
                  className={`h-5 w-5 transition-colors duration-200 ${
                    isActive
                      ? 'text-orange-400'
                      : 'text-orange-200/40 group-hover:text-orange-200/70'
                  }`}
                />

                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </ScrollArea>

      <div
        className="px-3 py-3"
        style={{ borderTop: '1px solid rgba(255,107,0,0.08)' }}
      >
        <div
          className="flex items-center gap-3 rounded-lg px-3 py-2.5"
          style={{ background: 'rgba(255,255,255,0.03)' }}
        >
          <Avatar className="h-8 w-8 border-2 border-orange-500/30">
            <AvatarFallback
              className="text-xs font-bold text-white"
              style={{
                background: 'linear-gradient(135deg, #FF6B00, #E05500)',
              }}
            >
              AD
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-1 flex-col overflow-hidden">
            <span className="truncate text-sm font-medium text-orange-100/80">
              Administrador
            </span>
            <span className="truncate text-[10px] text-orange-200/30">
              admin@electoral.gob
            </span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onLogout}
            className="h-8 w-8 shrink-0 text-orange-200/30 hover:bg-red-500/10 hover:text-red-400"
            title="Cerrar sesión"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside
        className="fixed inset-y-0 left-0 z-30 hidden md:flex md:w-[260px] md:shrink-0 md:flex-col"
        style={{ boxShadow: '4px 0 20px rgba(0,0,0,0.15)' }}
      >
        {sidebarContent}
      </aside>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
              onClick={onClose}
            />

            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 w-[260px] md:hidden"
              style={{ boxShadow: '4px 0 20px rgba(0,0,0,0.15)' }}
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