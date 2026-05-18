'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Vote,
  Users,
  Hash,
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
  ChartLegend,
  ChartLegendContent,
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
  getVotosPorDepartamento,
} from '@/data/mock';

// ============================
// Props
// ============================
interface DashboardProps {
  filtros: FiltrosGenerales;
  onFiltrosChange: (filtros: FiltrosGenerales) => void;
}

// ============================
// Colors
// ============================
const ORANGE = '#FF6B00';
const ORANGE_DARK = '#E05500';

// ============================
// Animation variants
// ============================
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: 'easeOut' },
  }),
};

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

// ============================
// Component
// ============================
export default function Dashboard({ filtros, onFiltrosChange }: DashboardProps) {
  // ---- Local filter state ----
  const [localFiltros, setLocalFiltros] = useState<FiltrosGenerales>(filtros);
  const [showFilters, setShowFilters] = useState(false);

  const updateFiltro = (key: keyof FiltrosGenerales, value: string) => {
    const next = { ...localFiltros, [key]: value };
    if (key === 'departamento') { next.provincia = ''; next.distrito = ''; }
    if (key === 'provincia') { next.distrito = ''; }
    setLocalFiltros(next);
    onFiltrosChange(next);
  };

  const clearFiltros = () => {
    const empty: FiltrosGenerales = {
      departamento: '', provincia: '', distrito: '', localVotacion: '',
      partidoPolitico: '', fechaInicio: '', fechaFin: '', numeroMesa: '',
    };
    setLocalFiltros(empty);
    onFiltrosChange(empty);
  };

  // ---- Filtered data ----
  const filteredActas = useMemo(() => {
    return actasMock.filter((a) => {
      if (localFiltros.departamento && a.departamento !== localFiltros.departamento) return false;
      if (localFiltros.provincia && a.provincia !== localFiltros.provincia) return false;
      if (localFiltros.distrito && a.distrito !== localFiltros.distrito) return false;
      if (localFiltros.partidoPolitico) {
        const hasParty = a.votosPorPartido.some((vp) => vp.partidoId === localFiltros.partidoPolitico);
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

  // ---- Computed stats ----
  const { votosPorPartido, totalGeneral, totalNulos, totalBlanco } = useMemo(
    () => calcularVotosTotales(filteredActas),
    [filteredActas],
  );

  const porcentajes = useMemo(
    () => calcularPorcentajes(votosPorPartido, totalGeneral),
    [votosPorPartido, totalGeneral],
  );

  const votosPorDepto = useMemo(
    () => getVotosPorDepartamento(filteredActas),
    [filteredActas],
  );

  const activePersoneros = filteredPersoneros.filter((p) => p.estado === 'activo').length;
  const avance = filteredMesas.length > 0
    ? Math.round((filteredActas.length / filteredMesas.length) * 100)
    : 0;

  const actasValidadas = filteredActas.filter(a => a.estadoValidacion === 'validada').length;
  const actasObservadas = filteredActas.filter(a => a.estadoValidacion === 'observada').length;
  const actasPendientes = filteredActas.filter(a => a.estadoValidacion === 'pendiente').length;

  // ---- Donut chart data ----
  const donutData = useMemo(() => {
    return porcentajes.slice(0, 6).map((p) => ({
      name: p.siglas,
      value: p.votos,
      color: p.color,
    }));
  }, [porcentajes]);

  const donutConfig = useMemo(() => {
    const config: Record<string, { label: string; color: string }> = {};
    porcentajes.slice(0, 6).forEach((p) => {
      config[p.siglas] = { label: p.nombre, color: p.color };
    });
    return config;
  }, [porcentajes]);

  // ---- Bar chart data: votos por departamento ----
  const barData = useMemo(() => {
    return DEPARTAMENTOS.map((depto) => {
      const actasDepto = filteredActas.filter((a) => a.departamento === depto);
      if (actasDepto.length === 0) return null;
      const { totalGeneral: tg } = calcularVotosTotales(actasDepto);
      return { departamento: depto, votos: tg };
    }).filter(Boolean) as { departamento: string; votos: number }[];
  }, [filteredActas]);

  const barConfig = useMemo(() => ({
    votos: { label: 'Votos', color: ORANGE },
  }), []);

  // ---- Timeline chart data ----
  const timelineChartData = useMemo(() => {
    const hourMap: Record<string, number> = {};
    timelineMock.forEach((entry) => {
      const hour = entry.hora.split(':')[0] + ':00';
      hourMap[hour] = (hourMap[hour] || 0) + entry.totalVotos;
    });
    return Object.entries(hourMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([hour, votos]) => ({ hora: hour, votos }));
  }, []);

  const timelineChartConfig = useMemo(() => ({
    votos: { label: 'Votos Registrados', color: ORANGE },
  }), []);

  // ---- Table data: latest acts ----
  const tableData = useMemo(() => {
    return [...filteredActas]
      .sort((a, b) => `${b.fechaRegistro}${b.horaRegistro}`.localeCompare(`${a.fechaRegistro}${a.horaRegistro}`))
      .slice(0, 10);
  }, [filteredActas]);

  // ---- Provinces/districts for dependent selects ----
  const availableProvincias = localFiltros.departamento
    ? PROVINCIAS_POR_DEPARTAMENTO[localFiltros.departamento] || []
    : [];
  const availableDistritos = localFiltros.provincia
    ? DISTRITOS_POR_PROVINCIA[localFiltros.provincia] || []
    : [];
  const hasFilters = Object.values(localFiltros).some((v) => v !== '');

  // ---- Status badge helper ----
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'validada':
        return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50 text-[10px] font-semibold px-2 py-0.5"><CheckCircle2 className="w-3 h-3 mr-1" />Validada</Badge>;
      case 'observada':
        return <Badge className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50 text-[10px] font-semibold px-2 py-0.5"><AlertTriangle className="w-3 h-3 mr-1" />Observada</Badge>;
      case 'pendiente':
        return <Badge className="bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-50 text-[10px] font-semibold px-2 py-0.5"><Hourglass className="w-3 h-3 mr-1" />Pendiente</Badge>;
      default:
        return <Badge variant="secondary" className="text-[10px]">{status}</Badge>;
    }
  };

  // ---- Time ago helper ----
  const getTimeAgo = (hora: string) => {
    const now = new Date();
    const [h, m] = hora.split(':').map(Number);
    const minutes = Math.max(1, (now.getHours() - h) * 60 + (now.getMinutes() - m));
    if (minutes < 60) return `Hace ${minutes} min`;
    return `Hace ${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  };

  return (
    <div className="w-full space-y-5">
      {/* ============================================ */}
      {/* HEADER                                        */}
      {/* ============================================ */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div>
          <h2 className="text-xl font-bold text-gray-900">Monitoreo Electoral</h2>
          <p className="text-sm text-gray-500">Última actualización: hace 2 min</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-gray-600 border-gray-200 hover:bg-gray-50"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-1.5" />
            Filtros
            <ChevronDown className={`w-3.5 h-3.5 ml-1 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </Button>
          <Button
            size="sm"
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            <Download className="w-4 h-4 mr-1.5" />
            Exportar
          </Button>
        </div>
      </motion.div>

      {/* ============================================ */}
      {/* FILTER BAR (collapsible)                     */}
      {/* ============================================ */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="rounded-xl shadow-sm border border-gray-100">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
                <Select value={localFiltros.departamento} onValueChange={(v) => updateFiltro('departamento', v)}>
                  <SelectTrigger className="w-full bg-white"><SelectValue placeholder="Departamento" /></SelectTrigger>
                  <SelectContent>{DEPARTAMENTOS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                </Select>
                <Select value={localFiltros.provincia} onValueChange={(v) => updateFiltro('provincia', v)} disabled={!localFiltros.departamento}>
                  <SelectTrigger className="w-full bg-white"><SelectValue placeholder="Provincia" /></SelectTrigger>
                  <SelectContent>{availableProvincias.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                </Select>
                <Select value={localFiltros.distrito} onValueChange={(v) => updateFiltro('distrito', v)} disabled={!localFiltros.provincia}>
                  <SelectTrigger className="w-full bg-white"><SelectValue placeholder="Distrito" /></SelectTrigger>
                  <SelectContent>{availableDistritos.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                </Select>
                <Select value={localFiltros.partidoPolitico} onValueChange={(v) => updateFiltro('partidoPolitico', v)}>
                  <SelectTrigger className="w-full bg-white"><SelectValue placeholder="Partido Político" /></SelectTrigger>
                  <SelectContent>
                    {partidosMock.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                          {p.nombre}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input type="date" value={localFiltros.fechaInicio} onChange={(e) => updateFiltro('fechaInicio', e.target.value)} className="bg-white" />
                <Input type="date" value={localFiltros.fechaFin} onChange={(e) => updateFiltro('fechaFin', e.target.value)} className="bg-white" />
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input value={localFiltros.numeroMesa} onChange={(e) => updateFiltro('numeroMesa', e.target.value)} placeholder="N° Mesa" className="bg-white pl-8" />
                </div>
              </div>
              {hasFilters && (
                <div className="mt-3 flex justify-end">
                  <Button variant="ghost" size="sm" onClick={clearFiltros} className="text-gray-500 hover:text-gray-700 h-8">
                    <X className="w-3.5 h-3.5 mr-1" />Limpiar filtros
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* ============================================ */}
      {/* ROW 1: Stats Cards                            */}
      {/* ============================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* ---- Card: Total Votos ---- */}
        <motion.div custom={0} initial="hidden" animate="visible" variants={cardVariants}>
          <Card className="rounded-xl shadow-sm border border-gray-100 bg-white">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                  <Vote className="w-4 h-4 text-orange-600" />
                </div>
                <span className="text-sm font-medium text-gray-500">Total Votos</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{totalGeneral.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">{filteredActas.length} actas procesadas</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* ---- Card: Actas Validadas ---- */}
        <motion.div custom={1} initial="hidden" animate="visible" variants={cardVariants}>
          <Card className="rounded-xl shadow-sm border border-gray-100 bg-white">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-sm font-medium text-gray-500">Actas Validadas</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{actasValidadas.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-2">
                <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: `${filteredActas.length > 0 ? (actasValidadas / filteredActas.length * 100) : 0}%` }} />
                </div>
                <span className="text-[10px] font-semibold text-emerald-600">{filteredActas.length > 0 ? Math.round(actasValidadas / filteredActas.length * 100) : 0}%</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ---- Card: Actas Observadas ---- */}
        <motion.div custom={2} initial="hidden" animate="visible" variants={cardVariants}>
          <Card className="rounded-xl shadow-sm border border-gray-100 bg-white">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                </div>
                <span className="text-sm font-medium text-gray-500">Actas Observadas</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{actasObservadas.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-2">
                <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full rounded-full bg-amber-500" style={{ width: `${filteredActas.length > 0 ? (actasObservadas / filteredActas.length * 100) : 0}%` }} />
                </div>
                <span className="text-[10px] font-semibold text-amber-600">{filteredActas.length > 0 ? Math.round(actasObservadas / filteredActas.length * 100) : 0}%</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ---- Card: Avance General ---- */}
        <motion.div custom={3} initial="hidden" animate="visible" variants={cardVariants}>
          <Card className="rounded-xl shadow-sm border-0 bg-orange-500 overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-white/80">Avance General</span>
              </div>
              <p className="text-3xl font-bold text-white">{avance}%</p>
              <p className="text-xs text-white/60 mt-1">de actas procesadas</p>
              <div className="w-full h-2 rounded-full bg-white/20 mt-3 overflow-hidden">
                <div className="h-full rounded-full bg-white/90" style={{ width: `${avance}%` }} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ============================================ */}
      {/* ROW 2: Donut Chart + Bar Chart               */}
      {/* ============================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* ---- Donut Chart: Vote Distribution ---- */}
        <motion.div initial="hidden" animate="visible" variants={sectionVariants}>
          <Card className="rounded-xl shadow-sm border border-gray-100 bg-white">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                  <Vote className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-gray-800">Distribución de Votos</CardTitle>
                  <CardDescription className="text-xs text-gray-500">Por partido político</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer config={donutConfig} className="mx-auto aspect-square max-h-[280px]">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* ---- Bar Chart: Votos por Departamento ---- */}
        <motion.div initial="hidden" animate="visible" variants={sectionVariants}>
          <Card className="rounded-xl shadow-sm border border-gray-100 bg-white">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-gray-800">Votos por Departamento</CardTitle>
                  <CardDescription className="text-xs text-gray-500">Distribución geográfica</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer config={barConfig} className="aspect-[4/3] max-h-[280px]">
                <BarChart data={barData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="departamento" type="category" tick={{ fontSize: 11 }} width={80} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="votos" fill={ORANGE} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ============================================ */}
      {/* ROW 3: Party Results + Timeline              */}
      {/* ============================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* ---- Party Comparison Card ---- */}
        <motion.div initial="hidden" animate="visible" variants={sectionVariants} className="lg:col-span-2">
          <Card className="rounded-xl shadow-sm border border-gray-100 bg-white">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                  <Vote className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-gray-800">Resultados por Partido</CardTitle>
                  <CardDescription className="text-xs text-gray-500">Comparación de votos acumulados</CardDescription>
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
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05, duration: 0.35 }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-white text-xs font-bold"
                          style={{ backgroundColor: partido.color }}
                        >
                          {partido.siglas.slice(0, 2)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-semibold text-gray-800 truncate">{partido.nombre}</span>
                            <div className="flex items-center gap-2 shrink-0 ml-2">
                              <span className="text-sm font-bold text-gray-900">{partido.votos.toLocaleString()}</span>
                              <span className="text-xs font-semibold px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-600">{partido.porcentaje}%</span>
                            </div>
                          </div>
                          <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${barWidth}%` }}
                              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 + idx * 0.05 }}
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

        {/* ---- Timeline / Recent Activity ---- */}
        <motion.div initial="hidden" animate="visible" variants={sectionVariants}>
          <Card className="rounded-xl shadow-sm border border-gray-100 bg-white">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-gray-800">Actividad Reciente</CardTitle>
                  <CardDescription className="text-xs text-gray-500">Últimas actualizaciones</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[320px] overflow-y-auto custom-scrollbar">
                {timelineMock.slice(0, 8).map((entry, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04, duration: 0.3 }}
                    className="flex items-start gap-3"
                  >
                    <div className="mt-1.5 w-2 h-2 rounded-full bg-orange-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-800">{entry.evento}</span>
                        <span className="text-[10px] text-gray-400 shrink-0 ml-2">{entry.hora}</span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {entry.departamento} · {entry.totalVotos} votos
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ============================================ */}
      {/* ROW 4: Recent Actas Table                    */}
      {/* ============================================ */}
      <motion.div initial="hidden" animate="visible" variants={sectionVariants}>
        <Card className="rounded-xl shadow-sm border border-gray-100 bg-white">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-gray-800">Últimas Actas Registradas</CardTitle>
                  <CardDescription className="text-xs text-gray-500">Registro de actas recientes</CardDescription>
                </div>
              </div>
              <span className="text-xs text-gray-400">{filteredActas.length} actas totales</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs font-semibold text-gray-500">Mesa</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500">Departamento</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 hidden sm:table-cell">Provincia</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500">Total Votos</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500 hidden md:table-cell">Hora</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-500">Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.map((acta) => (
                    <TableRow key={acta.id} className="hover:bg-gray-50/50">
                      <TableCell className="text-sm font-medium text-gray-900">{acta.numeroMesa}</TableCell>
                      <TableCell className="text-sm text-gray-600">{acta.departamento}</TableCell>
                      <TableCell className="text-sm text-gray-600 hidden sm:table-cell">{acta.provincia}</TableCell>
                      <TableCell className="text-sm font-semibold text-gray-900">{acta.totalVotos.toLocaleString()}</TableCell>
                      <TableCell className="text-sm text-gray-500 hidden md:table-cell">{getTimeAgo(acta.horaRegistro)}</TableCell>
                      <TableCell>{getStatusBadge(acta.estadoValidacion)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
