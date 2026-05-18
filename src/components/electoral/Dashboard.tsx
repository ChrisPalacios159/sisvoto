'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  timelineMock,
  calcularVotosTotales,
  calcularPorcentajes,
} from '@/data/mock';

interface DashboardProps {
  filtros: FiltrosGenerales;
  onFiltrosChange: (filtros: FiltrosGenerales) => void;
}

const PRIMARY = '#F97316';
const PRIMARY_DARK = '#C2410C';
const PRIMARY_LIGHT = '#FDBA74';
const PRIMARY_SOFT = '#FFF7ED';
const SECONDARY = '#7C2D12';
const TEXT = '#24130A';

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.35, ease: 'easeOut' },
  }),
};

const sectionVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

export default function Dashboard({ filtros, onFiltrosChange }: DashboardProps) {
  const [localFiltros, setLocalFiltros] = useState<FiltrosGenerales>(filtros);
  const [showFilters, setShowFilters] = useState(false);

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

  const activePersoneros = filteredPersoneros.filter((p) => p.estado === 'activo').length;

  const avance = filteredMesas.length > 0
    ? Math.min(100, Math.round((filteredActas.length / filteredMesas.length) * 100))
    : 0;

  const actasValidadas = filteredActas.filter((a) => a.estadoValidacion === 'validada').length;
  const actasObservadas = filteredActas.filter((a) => a.estadoValidacion === 'observada').length;
  const actasPendientes = filteredActas.filter((a) => a.estadoValidacion === 'pendiente').length;

  const totalMesas = filteredMesas.length || mesasMock.length;
  const mesasRegistradas = filteredActas.length;
  const mesasPendientes = Math.max(totalMesas - mesasRegistradas, 0);

  const availableProvincias = localFiltros.departamento
    ? PROVINCIAS_POR_DEPARTAMENTO[localFiltros.departamento] || []
    : [];

  const availableDistritos = localFiltros.provincia
    ? DISTRITOS_POR_PROVINCIA[localFiltros.provincia] || []
    : [];

  const hasFilters = Object.values(localFiltros).some((v) => v !== '');

  const topCandidates = useMemo(() => porcentajes.slice(0, 2), [porcentajes]);

  const firstCandidate = topCandidates[0];
  const secondCandidate = topCandidates[1];

  const diferencia = firstCandidate && secondCandidate
    ? Math.abs(firstCandidate.votos - secondCandidate.votos)
    : 0;

  const margen = totalGeneral > 0
    ? ((diferencia / totalGeneral) * 100).toFixed(1)
    : '0.0';

  const participacion = totalMesas > 0
    ? Math.round((filteredActas.length / totalMesas) * 100)
    : 0;

  const barData = useMemo(() => {
    return DEPARTAMENTOS.map((depto) => {
      const actasDepto = filteredActas.filter((a) => a.departamento === depto);

      if (actasDepto.length === 0) return null;

      const { totalGeneral: tg } = calcularVotosTotales(actasDepto);

      return {
        departamento: depto,
        votos: tg,
      };
    }).filter(Boolean) as { departamento: string; votos: number }[];
  }, [filteredActas]);

  const barConfig = useMemo(() => ({
    votos: {
      label: 'Votos',
      color: PRIMARY,
    },
  }), []);

  const departamentosRanking = useMemo(() => {
    const items = DEPARTAMENTOS.map((depto) => {
      const actasDepto = filteredActas.filter((a) => a.departamento === depto);

      if (actasDepto.length === 0) return null;

      const { votosPorPartido: votosDepto, totalGeneral: totalDepto } = calcularVotosTotales(actasDepto);
      const porcentajesDepto = calcularPorcentajes(votosDepto, totalDepto);
      const ganador = porcentajesDepto[0];

      return {
        departamento: depto,
        porcentaje: ganador?.porcentaje || 0,
        ganador: ganador?.siglas || 'S/D',
        color: ganador?.color || PRIMARY,
      };
    }).filter(Boolean) as {
      departamento: string;
      porcentaje: number;
      ganador: string;
      color: string;
    }[];

    return items.slice(0, 5);
  }, [filteredActas]);

  const timelineChartData = useMemo(() => {
    const hourMap: Record<string, number> = {};

    timelineMock.forEach((entry) => {
      const hour = `${entry.hora.split(':')[0]}:00`;
      hourMap[hour] = (hourMap[hour] || 0) + entry.totalVotos;
    });

    return Object.entries(hourMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([hora, votos]) => ({ hora, votos }));
  }, []);

  const tableData = useMemo(() => {
    return [...filteredActas]
      .sort((a, b) => `${b.fechaRegistro}${b.horaRegistro}`.localeCompare(`${a.fechaRegistro}${a.horaRegistro}`))
      .slice(0, 10);
  }, [filteredActas]);

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

  const getTimeAgo = (hora: string) => {
    const now = new Date();
    const [h, m] = hora.split(':').map(Number);
    const minutes = Math.max(1, (now.getHours() - h) * 60 + (now.getMinutes() - m));

    if (minutes < 60) return `Hace ${minutes} min`;

    return `Hace ${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  };

  const formatNumber = (value: number) => {
    return value.toLocaleString('es-PE');
  };

  return (
    <div className="min-h-screen w-full bg-[#FFF7ED] px-4 py-4 text-[#24130A] sm:px-6 lg:px-8">
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
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <Radio className="h-3.5 w-3.5" />
              En línea
              <span className="hidden text-[10px] font-semibold normal-case tracking-normal text-orange-900/45 sm:inline">
                Actualizado hace 2 min
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
              transition={{ duration: 0.25 }}
            >
              <Card className="rounded-2xl border border-orange-200 bg-white shadow-sm">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
                    <Select
                      value={localFiltros.departamento}
                      onValueChange={(v) => updateFiltro('departamento', v)}
                    >
                      <SelectTrigger className="w-full rounded-xl border-orange-200 bg-white text-xs">
                        <SelectValue placeholder="Departamento" />
                      </SelectTrigger>
                      <SelectContent>
                        {DEPARTAMENTOS.map((d) => (
                          <SelectItem key={d} value={d}>
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
                      <SelectTrigger className="w-full rounded-xl border-orange-200 bg-white text-xs">
                        <SelectValue placeholder="Provincia" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableProvincias.map((p) => (
                          <SelectItem key={p} value={p}>
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
                      <SelectTrigger className="w-full rounded-xl border-orange-200 bg-white text-xs">
                        <SelectValue placeholder="Distrito" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableDistritos.map((d) => (
                          <SelectItem key={d} value={d}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={localFiltros.partidoPolitico}
                      onValueChange={(v) => updateFiltro('partidoPolitico', v)}
                    >
                      <SelectTrigger className="w-full rounded-xl border-orange-200 bg-white text-xs">
                        <SelectValue placeholder="Partido político" />
                      </SelectTrigger>
                      <SelectContent>
                        {partidosMock.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
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
          <div className="space-y-5 xl:col-span-8">
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

                      <div className="rounded-full bg-white/18 px-3 py-1 text-[10px] font-bold text-white">
                        {formatNumber(totalMesas)} mesas
                      </div>
                    </div>

                    <div className="mt-3 flex items-end gap-3">
                      <div className="text-5xl font-black leading-none tracking-tight text-white">
                        {avance}%
                      </div>
                      <TrendingUp className="mb-2 h-5 w-5 text-orange-100" />
                    </div>

                    <p className="mt-2 text-xs font-medium text-white/75">
                      Actas procesadas frente al total de mesas registradas.
                    </p>

                    <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/25">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${avance}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="h-full rounded-full bg-white"
                      />
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[11px] font-bold text-white/75">
                      <span>{formatNumber(mesasRegistradas)} procesadas</span>
                      <span>{formatNumber(mesasPendientes)} pendientes</span>
                    </div>

                    <div className="absolute -bottom-10 -right-8 h-32 w-32 rounded-full bg-white/10" />
                    <div className="absolute -right-5 top-8 h-16 w-16 rounded-full bg-white/10" />
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div custom={1} initial="hidden" animate="visible" variants={cardVariants}>
                <Card className="h-full rounded-2xl border border-orange-100 bg-white shadow-sm">
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
                    <div className="mt-2 text-3xl font-black text-[#24130A]">
                      {formatNumber(actasValidadas)}
                    </div>
                    <div className="mt-3 flex items-center gap-1 text-xs font-bold text-emerald-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Sincronizadas
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div custom={2} initial="hidden" animate="visible" variants={cardVariants}>
                <Card className="h-full rounded-2xl border border-orange-100 bg-white shadow-sm">
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
                    <div className="mt-2 text-3xl font-black text-[#24130A]">
                      {formatNumber(actasObservadas)}
                    </div>
                    <div className="mt-3 flex items-center gap-1 text-xs font-bold text-red-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                      Pendientes de control
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <motion.div initial="hidden" animate="visible" variants={sectionVariants}>
              <Card className="rounded-2xl border border-orange-100 bg-white shadow-sm">
                <CardContent className="p-5 sm:p-6">
                  <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-lg font-black text-[#24130A]">
                        Resultados principales
                      </h2>
                      <p className="mt-1 text-xs font-medium text-orange-900/50">
                        Comparativo de los dos partidos con mayor votación acumulada.
                      </p>
                    </div>

                    <Badge className="w-fit rounded-full bg-orange-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-orange-700 hover:bg-orange-50">
                      Resumen oficial
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {[firstCandidate, secondCandidate].filter(Boolean).map((candidate, index) => {
                      const maxVotos = Math.max(firstCandidate?.votos || 1, secondCandidate?.votos || 1);
                      const progress = candidate ? (candidate.votos / maxVotos) * 100 : 0;

                      return (
                        <div key={candidate?.id || index} className="space-y-4">
                          <div className="flex items-center gap-4">
                            <div
                              className="flex h-14 w-14 items-center justify-center rounded-2xl text-xs font-black text-white shadow-sm"
                              style={{ backgroundColor: candidate?.color || PRIMARY }}
                            >
                              {candidate?.siglas?.slice(0, 3) || 'S/D'}
                            </div>

                            <div className="min-w-0">
                              <div className="truncate text-lg font-black text-[#24130A]">
                                {candidate?.nombre || 'Sin datos'}
                              </div>
                              <div className="text-[10px] font-black uppercase tracking-[0.14em] text-orange-900/35">
                                {candidate?.siglas || 'Partido'}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-end justify-between gap-3">
                            <div className="text-4xl font-black tracking-tight text-[#24130A]">
                              {formatNumber(candidate?.votos || 0)}
                            </div>

                            <div className="pb-1 text-xs font-black text-orange-900/45">
                              Votos
                            </div>
                          </div>

                          <div className="h-3 overflow-hidden rounded-full bg-orange-100">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 0.8, ease: 'easeOut' }}
                              className="h-full rounded-full"
                              style={{ backgroundColor: candidate?.color || PRIMARY }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="my-7 border-t border-orange-100" />

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-2xl bg-orange-50 p-4 text-center">
                      <div className="text-[10px] font-black uppercase tracking-[0.14em] text-orange-800/70">
                        Diferencia
                      </div>
                      <div className="mt-1 text-2xl font-black text-[#24130A]">
                        {formatNumber(diferencia)}
                      </div>
                      <div className="text-[10px] font-bold text-orange-900/40">
                        {margen}% de margen
                      </div>
                    </div>

                    <div className="rounded-2xl bg-orange-50 p-4 text-center">
                      <div className="text-[10px] font-black uppercase tracking-[0.14em] text-orange-800/70">
                        Blanco / nulo
                      </div>
                      <div className="mt-1 text-2xl font-black text-[#24130A]">
                        {formatNumber(totalBlanco + totalNulos)}
                      </div>
                      <div className="text-[10px] font-bold text-orange-900/40">
                        Votos especiales
                      </div>
                    </div>

                    <div className="rounded-2xl bg-orange-50 p-4 text-center">
                      <div className="text-[10px] font-black uppercase tracking-[0.14em] text-orange-800/70">
                        Participación
                      </div>
                      <div className="mt-1 text-2xl font-black text-[#24130A]">
                        {participacion}%
                      </div>
                      <div className="text-[10px] font-bold text-orange-900/40">
                        Sobre mesas procesadas
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="space-y-5 xl:col-span-4">
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
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-bold text-[#24130A]">
                        <span className="h-2 w-2 rounded-full bg-orange-600" />
                        Registradas
                      </div>
                      <div className="text-lg font-black text-[#24130A]">
                        {formatNumber(mesasRegistradas)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-bold text-orange-900/45">
                        <span className="h-2 w-2 rounded-full bg-orange-200" />
                        Pendientes
                      </div>
                      <div className="text-lg font-black text-[#24130A]">
                        {formatNumber(mesasPendientes)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-bold text-orange-900/45">
                        <span className="h-2 w-2 rounded-full bg-orange-400" />
                        Actas en proceso
                      </div>
                      <div className="text-lg font-black text-[#24130A]">
                        {formatNumber(actasPendientes)}
                      </div>
                    </div>
                  </div>

                  <div className="my-5 border-t border-orange-100" />

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-orange-900/45">
                      Personeros activos
                    </span>
                    <span className="font-black text-orange-700">
                      {formatNumber(activePersoneros)}
                    </span>
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
                        Departamentos con mayor concentración de votos.
                      </p>
                    </div>
                    <MapPin className="h-5 w-5 text-orange-600" />
                  </div>

                  <div className="space-y-4">
                    {departamentosRanking.length > 0 ? (
                      departamentosRanking.map((item, index) => (
                        <div key={item.departamento}>
                          <div className="mb-1 flex items-center justify-between">
                            <span className="text-xs font-black text-[#24130A]">
                              {item.departamento}
                            </span>
                            <span className="text-xs font-black text-orange-900/50">
                              {item.porcentaje}% {item.ganador}
                            </span>
                          </div>

                          <div className="h-2 overflow-hidden rounded-full bg-orange-100">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(item.porcentaje, 100)}%` }}
                              transition={{ duration: 0.7, delay: index * 0.08 }}
                              className="h-full rounded-full"
                              style={{ backgroundColor: item.color || PRIMARY }}
                            />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-xl border border-dashed border-orange-200 p-4 text-center text-xs font-semibold text-orange-900/45">
                        No hay datos para mostrar.
                      </div>
                    )}
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
                      <BarChart data={timelineChartData}>
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
                          {timelineChartData.map((_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                index === timelineChartData.length - 1
                                  ? PRIMARY
                                  : index >= timelineChartData.length - 2
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

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            className="xl:col-span-7"
          >
            <Card className="rounded-2xl border border-orange-100 bg-white shadow-sm">
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
                      Comparación general de votos acumulados.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  {porcentajes.map((partido, idx) => {
                    const maxVotos = porcentajes[0]?.votos || 1;
                    const barWidth = (partido.votos / maxVotos) * 100;

                    return (
                      <motion.div
                        key={partido.id}
                        initial={{ opacity: 0, x: -18 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05, duration: 0.35 }}
                        className="rounded-xl border border-orange-100 p-3 hover:bg-orange-50/40"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-black text-white"
                            style={{ backgroundColor: partido.color }}
                          >
                            {partido.siglas.slice(0, 2)}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="mb-1 flex items-center justify-between">
                              <span className="truncate text-sm font-black text-[#24130A]">
                                {partido.nombre}
                              </span>

                              <div className="ml-2 flex shrink-0 items-center gap-2">
                                <span className="text-sm font-black text-[#24130A]">
                                  {formatNumber(partido.votos)}
                                </span>
                                <span className="rounded-lg bg-orange-50 px-2 py-0.5 text-xs font-black text-orange-700">
                                  {partido.porcentaje}%
                                </span>
                              </div>
                            </div>

                            <div className="h-2 overflow-hidden rounded-full bg-orange-100">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${barWidth}%` }}
                                transition={{
                                  duration: 0.8,
                                  ease: 'easeOut',
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
            className="xl:col-span-5"
          >
            <Card className="rounded-2xl border border-orange-100 bg-white shadow-sm">
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
                  <BarChart data={barData} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#FFEDD5" />
                    <XAxis type="number" tick={{ fontSize: 11, fill: '#9A3412' }} />
                    <YAxis
                      dataKey="departamento"
                      type="category"
                      tick={{ fontSize: 11, fill: '#9A3412' }}
                      width={80}
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
                    Registro operativo de actas procesadas recientemente.
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
                <Table>
                  <TableHeader>
                    <TableRow className="border-orange-100 bg-orange-50 hover:bg-orange-50">
                      <TableHead className="h-11 text-[10px] font-black uppercase tracking-[0.12em] text-orange-800/70">
                        ID acta
                      </TableHead>
                      <TableHead className="h-11 text-[10px] font-black uppercase tracking-[0.12em] text-orange-800/70">
                        Ubicación
                      </TableHead>
                      <TableHead className="h-11 text-[10px] font-black uppercase tracking-[0.12em] text-orange-800/70">
                        Estado
                      </TableHead>
                      <TableHead className="h-11 text-[10px] font-black uppercase tracking-[0.12em] text-orange-800/70">
                        Mesa
                      </TableHead>
                      <TableHead className="h-11 text-right text-[10px] font-black uppercase tracking-[0.12em] text-orange-800/70">
                        Hora registro
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {tableData.length > 0 ? (
                      tableData.map((acta, index) => (
                        <TableRow
                          key={acta.id}
                          className="border-orange-100 hover:bg-orange-50/50"
                        >
                          <TableCell className="py-4 text-sm font-black text-[#24130A]">
                            <div className="flex items-center gap-2">
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  acta.estadoValidacion === 'validada'
                                    ? 'bg-emerald-400'
                                    : acta.estadoValidacion === 'observada'
                                      ? 'bg-red-400'
                                      : 'bg-orange-400'
                                }`}
                              />
                              #ACT-{String(index + 92840).padStart(5, '0')}
                            </div>
                          </TableCell>

                          <TableCell className="py-4">
                            <div className="text-sm font-black text-[#24130A]">
                              {acta.departamento}, {acta.provincia}
                            </div>
                            <div className="mt-0.5 text-[10px] font-semibold text-orange-900/45">
                              {acta.distrito}
                            </div>
                          </TableCell>

                          <TableCell className="py-4">
                            {getStatusBadge(acta.estadoValidacion)}
                          </TableCell>

                          <TableCell className="py-4 text-sm font-black text-[#24130A]">
                            {acta.numeroMesa}
                          </TableCell>

                          <TableCell className="py-4 text-right text-sm font-black text-[#24130A]">
                            {getTimeAgo(acta.horaRegistro)}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="py-10 text-center">
                          <div className="flex flex-col items-center justify-center gap-2 text-orange-900/45">
                            <FileText className="h-8 w-8 text-orange-200" />
                            <span className="text-sm font-semibold">
                              No se encontraron actas con los filtros aplicados.
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
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