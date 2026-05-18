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
  const currentLabel = useMemo(() => MODULE_LABELS[activeModule], [activeModule]);

  const handleNavigate = (module: ModuleView) => {
    onNavigate(module);
    onClose();
  };

  const sidebarContent = (
    <div className="flex h-full flex-col bg-[#1a1a2e]">
      {/* Logo / Brand */}
      <div className="flex items-center gap-3 px-6 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FF6B00]">
          <Shield className="h-5 w-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-base font-bold text-[#FF6B00]">Sistema Electoral</span>
          <span className="text-[11px] font-medium text-gray-400">Administraci\u00f3n 2024</span>
        </div>
        {/* Close button on mobile */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="ml-auto text-gray-400 hover:bg-white/10 hover:text-white md:hidden"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <Separator className="bg-white/10 mx-4" />

      {/* Navigation */}
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
                  group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium
                  transition-all duration-200 ease-in-out
                  ${
                    isActive
                      ? 'bg-[#FF6B00] text-white shadow-lg shadow-[#FF6B00]/25'
                      : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                  }
                `}
              >
                <Icon
                  className={`h-5 w-5 transition-transform duration-200 ${
                    isActive ? 'scale-110' : 'group-hover:scale-105'
                  }`}
                />
                <span>{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto h-1.5 w-1.5 rounded-full bg-white"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </ScrollArea>

      <Separator className="bg-white/10 mx-4" />

      {/* User Section */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-3 rounded-lg bg-white/5 px-3 py-3">
          <Avatar className="h-9 w-9 border-2 border-[#FF6B00]/40">
            <AvatarFallback className="bg-[#FF6B00]/20 text-[#FF6B00] text-sm font-semibold">
              AD
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-col overflow-hidden">
            <span className="truncate text-sm font-medium text-gray-200">Administrador</span>
            <span className="truncate text-[11px] text-gray-500">admin@electoral.gob</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onLogout}
            className="h-8 w-8 shrink-0 text-gray-500 hover:bg-red-500/10 hover:text-red-400"
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
      <aside className="hidden md:flex md:w-[280px] md:shrink-0 md:flex-col fixed inset-y-0 left-0 z-30">
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
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={onClose}
            />

            {/* Sliding panel */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 w-[280px] md:hidden"
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
