'use client';

import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { ModuleView, FiltrosGenerales } from '@/types/electoral';
import { MODULE_LABELS } from '@/components/electoral/Sidebar';

import Login from '@/components/electoral/Login';
import Sidebar from '@/components/electoral/Sidebar';
import Header from '@/components/electoral/Header';
import Dashboard from '@/components/electoral/Dashboard';
import Personeros from '@/components/electoral/Personeros';
import Partidos from '@/components/electoral/Partidos';
import Actas from '@/components/electoral/Actas';
import Mesas from '@/components/electoral/Mesas';
import Reportes from '@/components/electoral/Reportes';
import Configuracion from '@/components/electoral/Configuracion';

const emptyFiltros: FiltrosGenerales = {
  departamento: '',
  provincia: '',
  distrito: '',
  localVotacion: '',
  partidoPolitico: '',
  fechaInicio: '',
  fechaFin: '',
  numeroMesa: '',
};

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeModule, setActiveModule] = useState<ModuleView>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filtros, setFiltros] = useState<FiltrosGenerales>(emptyFiltros);

  const moduleName = useMemo(() => MODULE_LABELS[activeModule], [activeModule]);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveModule('dashboard');
  };

  const handleNavigate = (module: ModuleView) => {
    setActiveModule(module);
  };

  const renderContent = () => {
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard filtros={filtros} onFiltrosChange={setFiltros} />;
      case 'personeros':
        return <Personeros />;
      case 'partidos':
        return <Partidos />;
      case 'actas':
        return <Actas />;
      case 'mesas':
        return <Mesas />;
      case 'reportes':
        return <Reportes />;
      case 'configuracion':
        return <Configuracion />;
      default:
        return <Dashboard filtros={filtros} onFiltrosChange={setFiltros} />;
    }
  };

  // Show Login if not authenticated
  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  // Main layout with Sidebar + Header + Content
  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Sidebar */}
      <Sidebar
        activeModule={activeModule}
        onNavigate={handleNavigate}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={handleLogout}
      />

      {/* Main content area — offset on desktop for sidebar width */}
      <div className="md:ml-[260px] flex flex-col min-h-screen">
        {/* Header */}
        <Header
          moduleName={moduleName}
          onMenuToggle={() => setSidebarOpen(true)}
          userName="Administrador"
        />

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-5 lg:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-100 bg-white px-4 py-2.5 md:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-1.5 text-[11px] text-gray-400">
            <p>© {new Date().getFullYear()} Sistema Electoral — Monitoreo en Tiempo Real</p>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span>Sistema en línea</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
