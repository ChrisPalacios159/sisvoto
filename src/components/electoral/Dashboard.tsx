'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from 'recharts';
import {
  Vote,
  FileText,
  TrendingUp,
  MapPin,
  Clock,
  Filter,
  X,
  Search,
  CheckCircle2,
  AlertTriangle,
  Hourglass,
  ChevronDown,
  Download,
  Radio,
  Eye,
  ShieldCheck,
  BarChart3,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

import {
  FiltrosGenerales,
  DEPARTAMENTOS,
  PROVINCIAS_POR_DEPARTAMENTO,
  DISTRITOS_POR_PROVINCIA,
} from '@/types/electoral';

import {
  partidosMock,
  actasMock,
  mesasMock,
  personerosMock,
  calcularVotosTotales,
  calcularPorcentajes,
} from '@/data/mock';

interface DashboardProps {
  filtros: FiltrosGenerales;
  onFiltrosChange: (filtros: FiltrosGenerales) => void;
}

interface CandidateDashboard {
  id: string;
  displayName: string;
  partyName: string;
  partyShortName: string;
  votes: number;
  photo: string;
  logo: string;
  color: string;
  darkColor: string;
  accent: string;
  progress: number;
}

interface TerritorialItem {
  departamento: string;
  fuerzaPopular: number;
  partidoDelPueblo: number;
}

interface LiveStats {
  actasValidadas: number;
  actasObservadas: number;
  actasPendientes: number;
  mesasRegistradas: number;
  mesasPendientes: number;
  blancoNulo: number;
  activePersoneros: number;
}

interface DepartmentVotes {
  departamento: string;
  votos: number;
}

interface TimelineItem {
  hora: string;
  votos: number;
}

interface LiveActaRow {
  id: string;
  ubicacion: string;
  centro: string;
  estado: 'validada' | 'observada' | 'pendiente';
  mesa: string;
  horaRegistro: string;
}

interface RollingNumberProps {
  value: string | number;
  className?: string;
  style?: React.CSSProperties;
}

const PRIMARY = '#F97316';
const PRIMARY_DARK = '#C2410C';
const PRIMARY_LIGHT = '#FDBA74';
const GREEN = '#16A34A';
const GREEN_DARK = '#15803D';
const GREEN_LIGHT = '#DCFCE7';


const numberClass = 'whitespace-nowrap font-black leading-none tracking-[-0.02em] tabular-nums';

const selectTriggerClass =
  'w-full rounded-xl border-orange-200 bg-white text-xs text-[#24130A] shadow-sm focus:border-orange-500 focus:ring-orange-500/20 data-[placeholder]:text-orange-900/45 disabled:cursor-not-allowed disabled:bg-orange-50 disabled:text-orange-900/30';

const selectContentClass =
  'border-orange-200 bg-white text-[#24130A] shadow-xl';

const selectItemClass =
  'cursor-pointer text-xs font-semibold focus:bg-orange-50 focus:text-orange-700';

const MAIN_CANDIDATES: CandidateDashboard[] = [
  {
    id: 'keiko',
    displayName: 'Keiko Fujimori',
    partyName: 'Fuerza Popular',
    partyShortName: 'FP',
    votes: 8860200,
    photo: '/images/keiko.jpeg',
    logo: '/images/k.png',
    color: PRIMARY,
    darkColor: PRIMARY_DARK,
    accent: '#FFF7ED',
    progress: 65,
  },
  {
    id: 'roberto',
    displayName: 'Roberto Sánchez',
    partyName: 'Juntos por el Perú',
    partyShortName: 'JP',
    votes: 8790500,
    photo: '/images/roberto.jpeg',
    logo: '/images/jp.jpg',
    color: GREEN,
    darkColor: GREEN_DARK,
    accent: GREEN_LIGHT,
    progress: 58,
  },
];

const INITIAL_TERRITORIAL_DATA: TerritorialItem[] = [
  { departamento: 'Lima', fuerzaPopular: 65.2, partidoDelPueblo: 34.8 },
  { departamento: 'Cusco', fuerzaPopular: 58.6, partidoDelPueblo: 41.4 },
  { departamento: 'La Libertad', fuerzaPopular: 61.8, partidoDelPueblo: 38.2 },
  { departamento: 'Piura', fuerzaPopular: 55.4, partidoDelPueblo: 44.6 },
];

const INITIAL_DEPARTMENT_VOTES: DepartmentVotes[] = [
  { departamento: 'Lima', votos: 1480200 },
  { departamento: 'Cusco', votos: 842500 },
  { departamento: 'La Libertad', votos: 735800 },
  { departamento: 'Piura', votos: 612400 },
  { departamento: 'Arequipa', votos: 558700 },
  { departamento: 'Junín', votos: 421900 },
];

const INITIAL_TIMELINE: TimelineItem[] = [
  { hora: '08:00 AM', votos: 180000 },
  { hora: '09:00 AM', votos: 260000 },
  { hora: '10:00 AM', votos: 340000 },
  { hora: '11:00 AM', votos: 440000 },
  { hora: '12:00 PM', votos: 570000 },
  { hora: '01:00 PM', votos: 680000 },
  { hora: '02:00 PM', votos: 790000 },
  { hora: '03:00 PM', votos: 925000 },
];

const INITIAL_LIVE_ACTAS: LiveActaRow[] = [
  {
    id: '#ACT-92840-A',
    ubicacion: 'Lima, Miraflores',
    centro: 'Colegio San Agustín',
    estado: 'validada',
    mesa: '048291',
    horaRegistro: 'Hace 1 min',
  },
  {
    id: '#ACT-92839-B',
    ubicacion: 'Arequipa, Cercado',
    centro: 'I.E. Independencia',
    estado: 'validada',
    mesa: '012354',
    horaRegistro: 'Hace 4 min',
  },
  {
    id: '#ACT-92838-C',
    ubicacion: 'Cusco, Wanchaq',
    centro: 'U.N. San Antonio Abad',
    estado: 'pendiente',
    mesa: '085421',
    horaRegistro: 'Hace 7 min',
  },
  {
    id: '#ACT-92837-D',
    ubicacion: 'Piura, Castilla',
    centro: 'I.E. Miguel Cortés',
    estado: 'observada',
    mesa: '032158',
    horaRegistro: 'Hace 12 min',
  },
];

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.35,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const sectionVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 22,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function Dashboard({ filtros, onFiltrosChange }: DashboardProps) {
  const [localFiltros, setLocalFiltros] = useState<FiltrosGenerales>(filtros);
  const [showFilters, setShowFilters] = useState(false);

  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [liveCandidates, setLiveCandidates] = useState<CandidateDashboard[]>(MAIN_CANDIDATES);
  const [liveStats, setLiveStats] = useState<LiveStats>({
    actasValidadas: 82400,
    actasObservadas: 1800,
    actasPendientes: 920,
    mesasRegistradas: 84200,
    mesasPendientes: 1800,
    blancoNulo: 350000,
    activePersoneros: 128,
  });
  const [liveTerritorialData, setLiveTerritorialData] = useState<TerritorialItem[]>(INITIAL_TERRITORIAL_DATA);
  const [liveDepartmentVotes, setLiveDepartmentVotes] = useState<DepartmentVotes[]>(INITIAL_DEPARTMENT_VOTES);
  const [liveTimeline, setLiveTimeline] = useState<TimelineItem[]>(INITIAL_TIMELINE);
  const [liveActas, setLiveActas] = useState<LiveActaRow[]>(INITIAL_LIVE_ACTAS);

  const updateFiltro = (key: keyof FiltrosGenerales, value: string) => {
    const next = { ...localFiltros, [key]: value };

    if (key === 'departamento') {
      next.provincia = '';
      next.distrito = '';
    }

    if (key === 'provincia') {
      next.distrito = '';
    }

    setLocalFiltros(next);
    onFiltrosChange(next);
  };

  const clearFiltros = () => {
    const empty: FiltrosGenerales = {
      departamento: '',
      provincia: '',
      distrito: '',
      localVotacion: '',
      partidoPolitico: '',
      fechaInicio: '',
      fechaFin: '',
      numeroMesa: '',
    };

    setLocalFiltros(empty);
    onFiltrosChange(empty);
  };

  useEffect(() => {
    const interval = window.setInterval(() => {
      setLastUpdate(new Date());

      setLiveCandidates((prev) =>
        prev.map((candidate) => {
          const voteIncrement = candidate.id === 'keiko'
            ? randomInt(60, 180)
            : randomInt(45, 165);

          const progressIncrement = candidate.id === 'keiko'
            ? randomFloat(0.02, 0.08)
            : randomFloat(0.01, 0.06);

          return {
            ...candidate,
            votes: candidate.votes + voteIncrement,
            progress: Math.min(98, Number((candidate.progress + progressIncrement).toFixed(2))),
          };
        }),
      );

      setLiveStats((prev) => {
        const nuevasActas = randomInt(6, 18);
        const nuevasValidadas = randomInt(4, nuevasActas);
        const nuevasObservadas = randomInt(0, 2);
        const nuevasPendientes = Math.max(0, nuevasActas - nuevasValidadas - nuevasObservadas);

        return {
          ...prev,
          actasValidadas: prev.actasValidadas + nuevasValidadas,
          actasObservadas: prev.actasObservadas + nuevasObservadas,
          actasPendientes: prev.actasPendientes + nuevasPendientes,
          mesasRegistradas: prev.mesasRegistradas + nuevasActas,
          mesasPendientes: Math.max(0, prev.mesasPendientes - nuevasActas),
          blancoNulo: prev.blancoNulo + randomInt(5, 18),
          activePersoneros: prev.activePersoneros + randomInt(0, 1),
        };
      });

      setLiveTerritorialData((prev) =>
        prev.map((item) => {
          const fpIncrement = randomFloat(0.02, 0.12);
          const ppIncrement = randomFloat(0.01, 0.07);

          return {
            ...item,
            fuerzaPopular: Math.min(85, Number((item.fuerzaPopular + fpIncrement).toFixed(1))),
            partidoDelPueblo: Math.min(75, Number((item.partidoDelPueblo + ppIncrement).toFixed(1))),
          };
        }),
      );

      setLiveDepartmentVotes((prev) =>
        prev.map((item) => ({
          ...item,
          votos: item.votos + randomInt(180, 850),
        })),
      );

      setLiveTimeline((prev) => {
        const next = [...prev];
        const lastIndex = next.length - 1;

        next[lastIndex] = {
          ...next[lastIndex],
          votos: next[lastIndex].votos + randomInt(1500, 4200),
        };

        if (next.length >= 2) {
          const previousIndex = next.length - 2;

          next[previousIndex] = {
            ...next[previousIndex],
            votos: next[previousIndex].votos + randomInt(400, 1200),
          };
        }

        return next;
      });

      setLiveActas((prev) => {
        const newRow = createLiveActaRow();

        return [newRow, ...prev]
          .map((row, index) => ({
            ...row,
            horaRegistro: index === 0 ? 'Hace 0 min' : updateRelativeTime(index),
          }))
          .slice(0, 8);
      });
    }, 5000);

    return () => window.clearInterval(interval);
  }, []);

  const filteredActas = useMemo(() => {
    return actasMock.filter((a) => {
      if (localFiltros.departamento && a.departamento !== localFiltros.departamento) return false;
      if (localFiltros.provincia && a.provincia !== localFiltros.provincia) return false;
      if (localFiltros.distrito && a.distrito !== localFiltros.distrito) return false;

      if (localFiltros.partidoPolitico) {
        const hasParty = a.votosPorPartido.some(
          (vp) => vp.partidoId === localFiltros.partidoPolitico,
        );

        if (!hasParty) return false;
      }

      if (localFiltros.fechaInicio && a.fechaRegistro < localFiltros.fechaInicio) return false;
      if (localFiltros.fechaFin && a.fechaRegistro > localFiltros.fechaFin) return false;
      if (localFiltros.numeroMesa && !a.numeroMesa.includes(localFiltros.numeroMesa)) return false;

      return true;
    });
  }, [localFiltros]);

  const filteredMesas = useMemo(() => {
    return mesasMock.filter((m) => {
      if (localFiltros.departamento && m.departamento !== localFiltros.departamento) return false;
      if (localFiltros.provincia && m.provincia !== localFiltros.provincia) return false;
      if (localFiltros.distrito && m.distrito !== localFiltros.distrito) return false;
      if (localFiltros.numeroMesa && !m.numeroMesa.includes(localFiltros.numeroMesa)) return false;

      return true;
    });
  }, [localFiltros]);

  const filteredPersoneros = useMemo(() => {
    return personerosMock.filter((p) => {
      if (localFiltros.departamento && p.departamento !== localFiltros.departamento) return false;
      if (localFiltros.provincia && p.provincia !== localFiltros.provincia) return false;

      return true;
    });
  }, [localFiltros]);

  const { votosPorPartido, totalGeneral, totalNulos, totalBlanco } = useMemo(
    () => calcularVotosTotales(filteredActas),
    [filteredActas],
  );

  const porcentajes = useMemo(
    () => calcularPorcentajes(votosPorPartido, totalGeneral),
    [votosPorPartido, totalGeneral],
  );

  const totalMesas = liveStats.mesasRegistradas + liveStats.mesasPendientes;
  const avance = totalMesas > 0
    ? Math.min(100, Number(((liveStats.mesasRegistradas / totalMesas) * 100).toFixed(2)))
    : 0;

  const firstCandidate = liveCandidates[0];
  const secondCandidate = liveCandidates[1];

  const totalMainVotes = firstCandidate.votes + secondCandidate.votes;
  const diferencia = Math.abs(firstCandidate.votes - secondCandidate.votes);

  const margen = totalMainVotes > 0
    ? ((diferencia / totalMainVotes) * 100).toFixed(2)
    : '0.00';

  const participacion = totalMesas > 0
    ? Math.min(100, Math.round((liveStats.mesasRegistradas / totalMesas) * 100))
    : 0;

  const availableProvincias = localFiltros.departamento
    ? PROVINCIAS_POR_DEPARTAMENTO[localFiltros.departamento] || []
    : [];

  const availableDistritos = localFiltros.provincia
    ? DISTRITOS_POR_PROVINCIA[localFiltros.provincia] || []
    : [];

  const hasFilters = Object.values(localFiltros).some((v) => v !== '');

  const barConfig = useMemo(() => ({
    votos: {
      label: 'Votos',
      color: PRIMARY,
    },
  }), []);

  const lastUpdateText = useMemo(() => {
    return lastUpdate.toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  }, [lastUpdate]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'validada':
        return (
          <Badge className="border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700 hover:bg-emerald-50">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Contabilizada
          </Badge>
        );

      case 'observada':
        return (
          <Badge className="border-red-200 bg-red-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-700 hover:bg-red-50">
            <AlertTriangle className="mr-1 h-3 w-3" />
            Observada
          </Badge>
        );

      case 'pendiente':
        return (
          <Badge className="border-orange-200 bg-orange-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-orange-700 hover:bg-orange-50">
            <Hourglass className="mr-1 h-3 w-3" />
            En proceso
          </Badge>
        );

      default:
        return (
          <Badge variant="secondary" className="text-[10px]">
            {status}
          </Badge>
        );
    }
  };

  const formatNumber = (value: number) => {
    return value.toLocaleString('es-PE');
  };

  return (
    <div
      className="min-h-screen w-full bg-[#FFF7ED] px-4 py-4 text-[#24130A] sm:px-6 lg:px-8"
      style={{
        fontFamily:
          'Inter, Manrope, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
      }}
    >
      <div className="mx-auto w-full max-w-[1480px] space-y-5">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between"
        >
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[#24130A] sm:text-3xl">
              Dashboard Electoral
            </h1>
            <p className="mt-1 text-sm font-medium text-orange-900/60">
              Seguimiento general de actas, mesas, votos y actividad operativa.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex items-center justify-center gap-2 rounded-xl border border-orange-200 bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-orange-700 shadow-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              <Radio className="h-3.5 w-3.5" />
              En línea
              <span className="hidden text-[10px] font-semibold normal-case tracking-normal text-orange-900/45 sm:inline">
                Actualizado: {lastUpdateText}
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="rounded-xl border-orange-200 bg-white text-orange-700 hover:bg-orange-50"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="mr-1.5 h-4 w-4" />
              Filtros
              <ChevronDown className={`ml-1 h-3.5 w-3.5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </Button>
          </div>
        </motion.div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -8 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <Card className="rounded-2xl border border-orange-200 bg-white shadow-sm">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
                    <Select
                      value={localFiltros.departamento}
                      onValueChange={(v) => updateFiltro('departamento', v)}
                    >
                      <SelectTrigger className={selectTriggerClass}>
                        <SelectValue placeholder="Departamento" />
                      </SelectTrigger>
                      <SelectContent className={selectContentClass}>
                        {DEPARTAMENTOS.map((d) => (
                          <SelectItem key={d} value={d} className={selectItemClass}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={localFiltros.provincia}
                      onValueChange={(v) => updateFiltro('provincia', v)}
                      disabled={!localFiltros.departamento}
                    >
                      <SelectTrigger className={selectTriggerClass}>
                        <SelectValue placeholder="Provincia" />
                      </SelectTrigger>
                      <SelectContent className={selectContentClass}>
                        {availableProvincias.map((p) => (
                          <SelectItem key={p} value={p} className={selectItemClass}>
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={localFiltros.distrito}
                      onValueChange={(v) => updateFiltro('distrito', v)}
                      disabled={!localFiltros.provincia}
                    >
                      <SelectTrigger className={selectTriggerClass}>
                        <SelectValue placeholder="Distrito" />
                      </SelectTrigger>
                      <SelectContent className={selectContentClass}>
                        {availableDistritos.map((d) => (
                          <SelectItem key={d} value={d} className={selectItemClass}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={localFiltros.partidoPolitico}
                      onValueChange={(v) => updateFiltro('partidoPolitico', v)}
                    >
                      <SelectTrigger className={selectTriggerClass}>
                        <SelectValue placeholder="Partido político" />
                      </SelectTrigger>
                      <SelectContent className={selectContentClass}>
                        {partidosMock.map((p) => (
                          <SelectItem key={p.id} value={p.id} className={selectItemClass}>
                            <div className="flex items-center gap-2">
                              <span
                                className="h-2.5 w-2.5 shrink-0 rounded-full"
                                style={{ backgroundColor: p.color }}
                              />
                              {p.nombre}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Input
                      type="date"
                      value={localFiltros.fechaInicio}
                      onChange={(e) => updateFiltro('fechaInicio', e.target.value)}
                      className="rounded-xl border-orange-200 bg-white text-xs"
                    />

                    <Input
                      type="date"
                      value={localFiltros.fechaFin}
                      onChange={(e) => updateFiltro('fechaFin', e.target.value)}
                      className="rounded-xl border-orange-200 bg-white text-xs"
                    />

                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-orange-400" />
                      <Input
                        value={localFiltros.numeroMesa}
                        onChange={(e) => updateFiltro('numeroMesa', e.target.value)}
                        placeholder="N° mesa"
                        className="rounded-xl border-orange-200 bg-white pl-8 text-xs"
                      />
                    </div>
                  </div>

                  {hasFilters && (
                    <div className="mt-3 flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFiltros}
                        className="h-8 text-xs text-orange-700 hover:bg-orange-50 hover:text-orange-800"
                      >
                        <X className="mr-1 h-3.5 w-3.5" />
                        Limpiar filtros
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
          <div className="space-y-5 xl:col-span-7">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <motion.div
                custom={0}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                className="md:col-span-2"
              >
                <Card className="relative overflow-hidden rounded-2xl border-0 bg-gradient-to-br from-[#F97316] via-[#EA580C] to-[#9A3412] shadow-sm">
                  <CardContent className="relative p-5">
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] font-black uppercase tracking-[0.18em] text-white/75">
                        Avance general
                      </div>

                      <div className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold text-white">
                        <RollingNumber value={formatNumber(totalMesas)} /> mesas
                      </div>
                    </div>

                    <div className="mt-3 flex items-end gap-3">
                      <RollingNumber
                        value={`${avance.toFixed(2)}%`}
                        className="text-5xl font-black leading-none tracking-tight text-white"
                      />
                      <TrendingUp className="mb-2 h-5 w-5 text-orange-100" />
                    </div>

                    <p className="mt-2 text-xs font-medium text-white/75">
                      Actas procesadas frente al total de mesas registradas.
                    </p>

                    <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/25">
                      <motion.div
                        initial={false}
                        animate={{ width: `${avance}%` }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="h-full rounded-full bg-white"
                      />
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[11px] font-bold text-white/75">
                      <span>
                        <RollingNumber value={formatNumber(liveStats.mesasRegistradas)} /> procesadas
                      </span>
                      <span>
                        <RollingNumber value={formatNumber(liveStats.mesasPendientes)} /> pendientes
                      </span>
                    </div>

                    <div className="absolute -bottom-10 -right-8 h-32 w-32 rounded-full bg-white/10" />
                    <div className="absolute -right-5 top-8 h-16 w-16 rounded-full bg-white/10" />
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div custom={1} initial="hidden" animate="visible" variants={cardVariants}>
                <Card className="h-full overflow-visible rounded-2xl border border-orange-100 bg-white shadow-sm">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.14em] text-orange-900/35">
                        Correctas
                      </span>
                    </div>

                    <div className="mt-5 text-xs font-bold uppercase tracking-[0.12em] text-orange-900/50">
                      Actas validadas
                    </div>

                    <RollingNumber
                      value={formatNumber(liveStats.actasValidadas)}
                      className={`mt-2 block text-[2rem] ${numberClass} text-[#24130A] sm:text-3xl`}
                    />

                    <div className="mt-3 flex items-center gap-1 text-xs font-bold text-emerald-600">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                      Sincronizadas
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div custom={2} initial="hidden" animate="visible" variants={cardVariants}>
                <Card className="h-full overflow-visible rounded-2xl border border-orange-100 bg-white shadow-sm">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.14em] text-orange-900/35">
                        Revisión
                      </span>
                    </div>

                    <div className="mt-5 text-xs font-bold uppercase tracking-[0.12em] text-orange-900/50">
                      Actas observadas
                    </div>

                    <RollingNumber
                      value={formatNumber(liveStats.actasObservadas)}
                      className={`mt-2 block text-[2rem] ${numberClass} text-[#24130A] sm:text-3xl`}
                    />

                    <div className="mt-3 flex items-center gap-1 text-xs font-bold text-red-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                      Pendientes de control
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <motion.div initial="hidden" animate="visible" variants={sectionVariants}>
              <Card className="rounded-3xl border border-orange-100 bg-white shadow-sm">
                <CardContent className="p-5 sm:p-6">
                  <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-xl font-black tracking-tight text-[#24130A]">
                        Resultados principales
                      </h2>
                      <p className="mt-1 text-xs font-medium text-orange-900/50">
                        Simulación de incremento de votos cada 5 segundos.
                      </p>
                    </div>

                    <Badge className="w-fit rounded-full bg-orange-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-orange-700 hover:bg-orange-50">
                      Resumen en vivo
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                    {liveCandidates.map((candidate) => (
                      <div
                        key={candidate.id}
                        className="relative overflow-hidden rounded-3xl border border-orange-100 bg-white p-4 shadow-sm"
                      >
                        <div
                          className="absolute inset-x-0 top-0 h-1.5"
                          style={{ backgroundColor: candidate.color }}
                        />

                        <div className="flex items-start gap-4">
                          <div className="relative shrink-0">
                            <div
                              className="h-[72px] w-[72px] overflow-hidden rounded-2xl border-4 bg-white shadow-sm"
                              style={{ borderColor: candidate.color }}
                            >
                              <img
                                src={candidate.photo}
                                alt={candidate.displayName}
                                className="h-full w-full object-cover"
                              />
                            </div>

                            <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-white shadow-md">
                              <img
                                src={candidate.logo}
                                alt={candidate.partyName}
                                className="h-full w-full object-contain p-0.5"
                              />
                            </div>
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="truncate text-xl font-black leading-tight text-[#24130A]">
                              {candidate.displayName}
                            </div>

                            <div className="mt-1 flex flex-wrap items-center gap-2">
                              <span
                                className="rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em]"
                                style={{
                                  backgroundColor: candidate.accent,
                                  color: candidate.color,
                                }}
                              >
                                {candidate.partyName}
                              </span>

                              <span className="text-[10px] font-bold text-orange-900/40">
                                Barra al <RollingNumber value={`${candidate.progress.toFixed(1)}%`} />
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 flex items-end justify-between gap-3">
                          <RollingNumber
                            value={formatNumber(candidate.votes)}
                            className="text-4xl font-black tracking-tight"
                            style={{ color: candidate.color }}
                          />

                          <div className="pb-1 text-xs font-black uppercase tracking-[0.12em] text-orange-900/45">
                            Votos
                          </div>
                        </div>

                        <div className="mt-4 h-3 overflow-hidden rounded-full bg-orange-100">
                          <motion.div
                            initial={false}
                            animate={{ width: `${candidate.progress}%` }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: candidate.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="my-7 border-t border-orange-100" />

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-2xl bg-orange-50 p-4 text-center">
                      <div className="text-[10px] font-black uppercase tracking-[0.14em] text-orange-800/70">
                        Diferencia
                      </div>
                      <RollingNumber
                        value={formatNumber(diferencia)}
                        className="mt-1 block text-2xl font-black text-[#24130A]"
                      />
                      <div className="text-[10px] font-bold text-orange-900/40">
                        <RollingNumber value={`${margen}%`} /> de margen
                      </div>
                    </div>

                    <div className="rounded-2xl bg-orange-50 p-4 text-center">
                      <div className="text-[10px] font-black uppercase tracking-[0.14em] text-orange-800/70">
                        Blanco / nulo
                      </div>
                      <RollingNumber
                        value={formatNumber(liveStats.blancoNulo + totalBlanco + totalNulos)}
                        className="mt-1 block text-2xl font-black text-[#24130A]"
                      />
                      <div className="text-[10px] font-bold text-orange-900/40">
                        Votos especiales
                      </div>
                    </div>

                    <div className="rounded-2xl bg-orange-50 p-4 text-center">
                      <div className="text-[10px] font-black uppercase tracking-[0.14em] text-orange-800/70">
                        Participación
                      </div>
                      <RollingNumber
                        value={`${participacion}%`}
                        className="mt-1 block text-2xl font-black text-[#24130A]"
                      />
                      <div className="text-[10px] font-bold text-orange-900/40">
                        Sobre mesas procesadas
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="space-y-5 xl:col-span-5">
            <motion.div custom={3} initial="hidden" animate="visible" variants={cardVariants}>
              <Card className="rounded-2xl border border-orange-100 bg-white shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-black uppercase tracking-[0.14em] text-orange-900/55">
                      Estado de mesas
                    </div>
                    <ShieldCheck className="h-5 w-5 text-orange-600" />
                  </div>

                  <div className="mt-5 space-y-4">
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
                      <div className="flex min-w-0 items-center gap-2 text-sm font-bold text-[#24130A]">
                        <span className="h-2 w-2 shrink-0 rounded-full bg-orange-600" />
                        <span className="truncate">Registradas</span>
                      </div>
                      <RollingNumber
                        value={formatNumber(liveStats.mesasRegistradas)}
                        className={`shrink-0 text-lg ${numberClass} text-[#24130A]`}
                      />
                    </div>

                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
                      <div className="flex min-w-0 items-center gap-2 text-sm font-bold text-orange-900/55">
                        <span className="h-2 w-2 shrink-0 rounded-full bg-orange-200" />
                        <span className="truncate">Pendientes</span>
                      </div>
                      <RollingNumber
                        value={formatNumber(liveStats.mesasPendientes)}
                        className={`shrink-0 text-lg ${numberClass} text-[#24130A]`}
                      />
                    </div>

                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
                      <div className="flex min-w-0 items-center gap-2 text-sm font-bold text-orange-900/55">
                        <span className="h-2 w-2 shrink-0 rounded-full bg-orange-400" />
                        <span className="truncate">Actas en proceso</span>
                      </div>
                      <RollingNumber
                        value={formatNumber(liveStats.actasPendientes)}
                        className={`shrink-0 text-lg ${numberClass} text-[#24130A]`}
                      />
                    </div>
                  </div>

                  <div className="my-5 border-t border-orange-100" />

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-orange-900/45">
                      Personeros activos
                    </span>
                    <RollingNumber
                      value={formatNumber(liveStats.activePersoneros)}
                      className={`shrink-0 ${numberClass} text-orange-700`}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial="hidden" animate="visible" variants={sectionVariants}>
              <Card className="rounded-2xl border border-orange-100 bg-white shadow-sm">
                <CardContent className="p-5">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-black text-[#24130A]">
                        Distribución territorial
                      </h2>
                      <p className="mt-1 text-xs font-medium text-orange-900/50">
                        Comparativo territorial por partido.
                      </p>
                    </div>
                    <MapPin className="h-5 w-5 text-orange-600" />
                  </div>

                  <div className="mb-5 grid grid-cols-2 gap-3">
                    {liveCandidates.map((candidate) => (
                      <div
                        key={candidate.id}
                        className="rounded-2xl border border-orange-100 bg-orange-50/50 p-3"
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm">
                            <img
                              src={candidate.logo}
                              alt={candidate.partyName}
                              className="h-full w-full object-contain p-1"
                            />
                          </div>

                          <div className="min-w-0">
                            <div className="truncate text-[11px] font-black text-[#24130A]">
                              {candidate.partyName}
                            </div>
                            <div
                              className="text-[10px] font-black uppercase"
                              style={{ color: candidate.color }}
                            >
                              {candidate.partyShortName}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-5">
                    {liveTerritorialData.map((item, index) => (
                      <div key={item.departamento}>
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-xs font-black text-[#24130A]">
                            {item.departamento}
                          </span>

                          <span className="text-xs font-black text-orange-700">
                            Fuerza Popular
                          </span>
                        </div>

                        <div className="space-y-2">
                          <div>
                            <div className="mb-1 flex items-center justify-between text-[10px] font-bold">
                              <div className="flex items-center gap-1.5 text-orange-700">
                                <img
                                  src="/images/k.png"
                                  alt="Fuerza Popular"
                                  className="h-4 w-4 rounded-full object-contain"
                                />
                                <span>Fuerza Popular</span>
                              </div>
                              <span className="text-orange-700">
                                <RollingNumber value={`${item.fuerzaPopular.toFixed(1)}%`} />
                              </span>
                            </div>

                            <div className="h-2 overflow-hidden rounded-full bg-orange-100">
                              <motion.div
                                initial={false}
                                animate={{ width: `${item.fuerzaPopular}%` }}
                                transition={{
                                  duration: 0.7,
                                  delay: index * 0.08,
                                  ease: [0.16, 1, 0.3, 1],
                                }}
                                className="h-full rounded-full bg-orange-500"
                              />
                            </div>
                          </div>

                          <div>
                            <div className="mb-1 flex items-center justify-between text-[10px] font-bold">
                              <div className="flex items-center gap-1.5 text-emerald-700">
                                <img
                                  src="/images/jp.jpg"
                                  alt="Juntos por el Perú"
                                  className="h-4 w-4 rounded-full object-contain"
                                />
                                <span>Juntos por el Perú</span>
                              </div>
                              <span className="text-emerald-700">
                                <RollingNumber value={`${item.partidoDelPueblo.toFixed(1)}%`} />
                              </span>
                            </div>

                            <div className="h-2 overflow-hidden rounded-full bg-emerald-100">
                              <motion.div
                                initial={false}
                                animate={{ width: `${item.partidoDelPueblo}%` }}
                                transition={{
                                  duration: 0.7,
                                  delay: index * 0.08 + 0.1,
                                  ease: [0.16, 1, 0.3, 1],
                                }}
                                className="h-full rounded-full bg-emerald-500"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    className="mt-6 h-9 w-full rounded-xl border-orange-200 bg-white text-xs font-black uppercase tracking-[0.08em] text-orange-700 hover:bg-orange-50"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Ver detalle territorial
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial="hidden" animate="visible" variants={sectionVariants}>
              <Card className="rounded-2xl border border-orange-100 bg-white shadow-sm">
                <CardContent className="p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-black text-[#24130A]">
                        Línea de tiempo
                      </h2>
                      <p className="mt-1 text-xs font-medium text-orange-900/50">
                        Flujo de votos registrados por hora.
                      </p>
                    </div>
                    <Clock className="h-5 w-5 text-orange-600" />
                  </div>

                  <div className="h-[170px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={liveTimeline}>
                        <XAxis
                          dataKey="hora"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 10, fill: '#9A3412', fontWeight: 700 }}
                        />
                        <YAxis hide />
                        <Tooltip
                          cursor={{ fill: 'rgba(249, 115, 22, 0.08)' }}
                          contentStyle={{
                            border: '1px solid #FED7AA',
                            borderRadius: 12,
                            fontSize: 12,
                          }}
                        />
                        <Bar dataKey="votos" radius={[6, 6, 0, 0]}>
                          {liveTimeline.map((_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                index === liveTimeline.length - 1
                                  ? PRIMARY
                                  : index >= liveTimeline.length - 2
                                    ? PRIMARY_LIGHT
                                    : '#FED7AA'
                              }
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            className="min-w-0"
          >
            <Card className="h-full rounded-2xl border border-orange-100 bg-white shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50">
                    <Vote className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-black text-[#24130A]">
                      Resultados por partido
                    </CardTitle>
                    <CardDescription className="text-xs text-orange-900/50">
                      Simulación de votos acumulados por agrupación.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  {liveCandidates.map((partido, idx) => {
                    const maxVotos = Math.max(...liveCandidates.map((p) => p.votes));
                    const barWidth = maxVotos > 0 ? (partido.votes / maxVotos) * 100 : 0;

                    return (
                      <motion.div
                        key={partido.id}
                        initial={{ opacity: 0, x: -18 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: idx * 0.05,
                          duration: 0.35,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        className="rounded-xl border border-orange-100 p-3 hover:bg-orange-50/40"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm">
                            <img
                              src={partido.logo}
                              alt={partido.partyName}
                              className="h-full w-full object-contain p-1"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="mb-1 flex items-center justify-between gap-3">
                              <span className="truncate text-sm font-black text-[#24130A]">
                                {partido.partyName}
                              </span>

                              <div className="flex shrink-0 items-center gap-2">
                                <RollingNumber
                                  value={formatNumber(partido.votes)}
                                  className="text-sm font-black text-[#24130A]"
                                />
                                <span
                                  className="rounded-lg px-2 py-0.5 text-xs font-black"
                                  style={{
                                    backgroundColor: partido.accent,
                                    color: partido.color,
                                  }}
                                >
                                  <RollingNumber value={`${partido.progress.toFixed(1)}%`} />
                                </span>
                              </div>
                            </div>

                            <div className="h-2 overflow-hidden rounded-full bg-orange-100">
                              <motion.div
                                initial={false}
                                animate={{ width: `${barWidth}%` }}
                                transition={{
                                  duration: 0.8,
                                  ease: [0.16, 1, 0.3, 1],
                                  delay: 0.2 + idx * 0.05,
                                }}
                                className="h-full rounded-full"
                                style={{ backgroundColor: partido.color }}
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            className="min-w-0"
          >
            <Card className="h-full rounded-2xl border border-orange-100 bg-white shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50">
                    <BarChart3 className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-black text-[#24130A]">
                      Votos por departamento
                    </CardTitle>
                    <CardDescription className="text-xs text-orange-900/50">
                      Distribución geográfica acumulada.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <ChartContainer config={barConfig} className="aspect-[4/3] max-h-[280px]">
                  <BarChart data={liveDepartmentVotes} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#FFEDD5" />
                    <XAxis type="number" tick={{ fontSize: 11, fill: '#9A3412' }} />
                    <YAxis
                      dataKey="departamento"
                      type="category"
                      tick={{ fontSize: 11, fill: '#9A3412' }}
                      width={85}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="votos" fill={PRIMARY} radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div initial="hidden" animate="visible" variants={sectionVariants}>
          <Card className="rounded-2xl border border-orange-100 bg-white shadow-sm">
            <CardContent className="p-0">
              <div className="flex flex-col gap-4 border-b border-orange-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-black text-[#24130A]">
                    Últimas actas recibidas
                  </h2>
                  <p className="mt-1 text-xs font-medium text-orange-900/50">
                    Registro operativo simulado en tiempo real.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-xl border-orange-200 bg-white text-orange-700 hover:bg-orange-50"
                  >
                    <Filter className="h-4 w-4" />
                  </Button>

                  <Button className="h-9 rounded-xl bg-orange-600 px-4 text-xs font-black uppercase tracking-[0.08em] text-white hover:bg-orange-700">
                    <Download className="mr-2 h-4 w-4" />
                    Descargar reporte
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table className="min-w-[820px]">
                  <TableHeader>
                    <TableRow className="border-orange-100 bg-orange-50 hover:bg-orange-50">
                      <TableHead className="h-11 w-[170px] whitespace-nowrap text-[10px] font-black uppercase tracking-[0.12em] text-orange-800/70">
                        ID acta
                      </TableHead>
                      <TableHead className="h-11 min-w-[260px] whitespace-nowrap text-[10px] font-black uppercase tracking-[0.12em] text-orange-800/70">
                        Ubicación
                      </TableHead>
                      <TableHead className="h-11 w-[160px] whitespace-nowrap text-[10px] font-black uppercase tracking-[0.12em] text-orange-800/70">
                        Estado
                      </TableHead>
                      <TableHead className="h-11 w-[120px] whitespace-nowrap text-[10px] font-black uppercase tracking-[0.12em] text-orange-800/70">
                        Mesa
                      </TableHead>
                      <TableHead className="h-11 w-[150px] whitespace-nowrap text-right text-[10px] font-black uppercase tracking-[0.12em] text-orange-800/70">
                        Hora registro
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {liveActas.map((acta) => (
                      <TableRow
                        key={acta.id}
                        className="border-orange-100 hover:bg-orange-50/50"
                      >
                        <TableCell className="py-4 text-sm font-black text-[#24130A]">
                          <div className="flex items-center gap-2">
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                acta.estado === 'validada'
                                  ? 'bg-emerald-400'
                                  : acta.estado === 'observada'
                                    ? 'bg-red-400'
                                    : 'bg-orange-400'
                              }`}
                            />
                            <span className="whitespace-nowrap">{acta.id}</span>
                          </div>
                        </TableCell>

                        <TableCell className="py-4">
                          <div className="text-sm font-black text-[#24130A]">
                            {acta.ubicacion}
                          </div>
                          <div className="mt-0.5 text-[10px] font-semibold text-orange-900/45">
                            {acta.centro}
                          </div>
                        </TableCell>

                        <TableCell className="py-4">
                          {getStatusBadge(acta.estado)}
                        </TableCell>

                        <TableCell className="py-4 text-sm font-black text-[#24130A]">
                          <RollingNumber value={acta.mesa} />
                        </TableCell>

                        <TableCell className="py-4 text-right text-sm font-black text-[#24130A]">
                          {acta.horaRegistro}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="border-t border-orange-100 py-4 text-center">
                <Button
                  variant="ghost"
                  className="h-8 text-xs font-black uppercase tracking-[0.12em] text-orange-700 hover:bg-orange-50"
                >
                  Cargar más actas
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function RollingNumber({ value, className = '', style }: RollingNumberProps) {
  const text = String(value);
  const characters = Array.from(text);

  const getCharacterWidth = (character: string) => {
    if (character === ',') return '0.22em';
    if (character === '.') return '0.22em';
    if (character === '%') return '0.58em';
    if (character === ' ') return '0.28em';
    return '0.58em';
  };

  return (
    <span
      className={`inline-flex max-w-full items-baseline whitespace-nowrap tabular-nums ${className}`}
      style={style}
      aria-label={text}
    >
      {characters.map((character, index) => (
        <span
          key={`${index}-${character}`}
          className="relative inline-flex h-[1.18em] overflow-visible align-baseline leading-none"
          style={{
            minWidth: getCharacterWidth(character),
            perspective: 120,
          }}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={`${character}-${index}-${text}`}
              initial={{
                y: '0.9em',
                rotateX: 90,
                opacity: 0,
                filter: 'blur(2px)',
              }}
              animate={{
                y: '0em',
                rotateX: 0,
                opacity: 1,
                filter: 'blur(0px)',
              }}
              exit={{
                y: '-0.9em',
                rotateX: -90,
                opacity: 0,
                filter: 'blur(2px)',
              }}
              transition={{
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="inline-block origin-center leading-none"
            >
              {character === ' ' ? '\u00A0' : character}
            </motion.span>
          </AnimatePresence>
        </span>
      ))}
    </span>
  );
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function createLiveActaRow(): LiveActaRow {
  const locations = [
    { ubicacion: 'Lima, San Isidro', centro: 'I.E. Alfonso Ugarte' },
    { ubicacion: 'Lima, Miraflores', centro: 'Colegio San Agustín' },
    { ubicacion: 'Arequipa, Cercado', centro: 'I.E. Independencia' },
    { ubicacion: 'Cusco, Wanchaq', centro: 'U.N. San Antonio Abad' },
    { ubicacion: 'Piura, Castilla', centro: 'I.E. Miguel Cortés' },
    { ubicacion: 'La Libertad, Trujillo', centro: 'Colegio Modelo' },
  ];

  const estados: LiveActaRow['estado'][] = ['validada', 'validada', 'validada', 'pendiente', 'observada'];
  const selectedLocation = locations[randomInt(0, locations.length - 1)];
  const selectedStatus = estados[randomInt(0, estados.length - 1)];
  const actaNumber = randomInt(92841, 99999);
  const letter = String.fromCharCode(65 + randomInt(0, 25));

  return {
    id: `#ACT-${actaNumber}-${letter}`,
    ubicacion: selectedLocation.ubicacion,
    centro: selectedLocation.centro,
    estado: selectedStatus,
    mesa: String(randomInt(10000, 99999)).padStart(6, '0'),
    horaRegistro: 'Hace 0 min',
  };
}

function updateRelativeTime(index: number) {
  const minutes = Math.max(1, index * randomInt(2, 4));

  if (minutes < 60) {
    return `Hace ${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;

  return `Hace ${hours}h ${rest}m`;
}