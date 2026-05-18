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
  Radio,
  CheckCircle2,
  AlertTriangle,
  Hourglass,
  ChevronDown,
  ChevronRight,
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
import { Progress } from '@/components/ui/progress';

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

  // ---- Top 2 parties for comparison ----
  const topPartidos = porcentajes.slice(0, 2);
  const partido1 = topPartidos[0];
  const partido2 = topPartidos[1];
  const diferencia = partido1 && partido2 ? partido1.votos - partido2.votos : 0;
  const participationRate = totalGeneral > 0 ? ((totalGeneral - totalNulos - totalBlanco) / totalGeneral * 100).toFixed(1) : '0';

  // ---- Department distribution data for horizontal bars ----
  const deptoData = useMemo(() => {
    return DEPARTAMENTOS.map((depto) => {
      const actasDepto = filteredActas.filter((a) => a.departamento === depto);
      if (actasDepto.length === 0) return null;
      const { votosPorPartido: vp, totalGeneral: tg } = calcularVotosTotales(actasDepto);
      const pcts = calcularPorcentajes(vp, tg);
      const leader = pcts[0];
      const second = pcts[1];
      return {
        departamento: depto,
        totalVotos: tg,
        leaderName: leader?.nombre || '',
        leaderSiglas: leader?.siglas || '',
        leaderColor: leader?.color || '',
        leaderPct: parseFloat(leader?.porcentaje || '0'),
        secondName: second?.nombre || '',
        secondColor: second?.color || '',
        secondPct: parseFloat(second?.porcentaje || '0'),
      };
    }).filter(Boolean) as {
      departamento: string;
      totalVotos: number;
      leaderName: string;
      leaderSiglas: string;
      leaderColor: string;
      leaderPct: number;
      secondName: string;
      secondColor: string;
      secondPct: number;
    }[];
  }, [filteredActas]);

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
      {/* HEADER: Live Transmission Banner             */}
      {/* ============================================ */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-white text-xs font-bold shadow-md"
            style={{
              background: 'linear-gradient(135deg, #FF6B00, #E05500)',
              boxShadow: '0 2px 8px rgba(255,107,0,0.3)',
            }}
          >
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            TRANSMISIÓN EN VIVO
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Monitoreo Electoral</h2>
            <p className="text-xs text-gray-400">Última actualización: hace 2 min</p>
          </div>
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
            className="text-white border-0"
            style={{ background: 'linear-gradient(135deg, #FF6B00, #E05500)' }}
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
      {/* CANDIDATE FACE-OFF: Top 2 Party Comparison   */}
      {/* ============================================ */}
      {partido1 && partido2 && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
        >
          <Card className="rounded-2xl shadow-sm border border-gray-100 bg-white overflow-hidden">
            <CardHeader className="pb-2 pt-5 px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Vote className="w-5 h-5 text-[#FF6B00]" />
                  <CardTitle className="text-lg font-bold text-gray-800">Resultados Electorales</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[11px] font-semibold text-gray-500">Actualización en vivo</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              {/* Two candidate cards side by side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Candidate 1 - Leader */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="relative rounded-2xl p-6 border-2 overflow-hidden"
                  style={{ borderColor: partido1.color + '40', background: `linear-gradient(135deg, ${partido1.color}08 0%, ${partido1.color}03 100%)` }}
                >
                  <div className="flex items-start gap-5">
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <div
                        className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-black shadow-lg"
                        style={{
                          background: `linear-gradient(135deg, ${partido1.color}, ${partido1.color}CC)`,
                          boxShadow: `0 4px 16px ${partido1.color}40`,
                          border: `3px solid ${partido1.color}60`,
                        }}
                      >
                        {partido1.siglas.slice(0, 2)}
                      </div>
                      {/* Percentage badge */}
                      <div
                        className="absolute -bottom-1 -right-1 flex items-center justify-center w-10 h-10 rounded-full text-white text-xs font-black shadow-md"
                        style={{
                          background: `linear-gradient(135deg, ${partido1.color}, ${partido1.color}CC)`,
                          boxShadow: `0 2px 8px ${partido1.color}50`,
                        }}
                      >
                        {partido1.porcentaje}%
                      </div>
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0 pt-1">
                      <h3 className="text-lg font-bold text-gray-900 leading-tight">{partido1.nombre}</h3>
                      <p className="text-sm text-gray-500 font-medium mt-0.5">{partido1.siglas}</p>
                      <div className="flex items-baseline gap-2 mt-3">
                        <span className="text-3xl font-black tracking-tight" style={{ color: partido1.color }}>
                          {partido1.votos.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-400 font-medium">Votos</span>
                      </div>
                      {/* Progress bar */}
                      <div className="mt-3 w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: partido1.color + '15' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${partido1.porcentaje}%` }}
                          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                          className="h-full rounded-full"
                          style={{ background: `linear-gradient(90deg, ${partido1.color}, ${partido1.color}CC)` }}
                        />
                      </div>
                    </div>
                  </div>
                  {/* 1st place badge */}
                  <div
                    className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-bold text-white"
                    style={{ backgroundColor: partido1.color }}
                  >
                    1° LUGAR
                  </div>
                </motion.div>

                {/* Candidate 2 - Second */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="relative rounded-2xl p-6 border-2 overflow-hidden"
                  style={{ borderColor: partido2.color + '40', background: `linear-gradient(135deg, ${partido2.color}08 0%, ${partido2.color}03 100%)` }}
                >
                  <div className="flex items-start gap-5">
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <div
                        className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-black shadow-lg"
                        style={{
                          background: `linear-gradient(135deg, ${partido2.color}, ${partido2.color}CC)`,
                          boxShadow: `0 4px 16px ${partido2.color}40`,
                          border: `3px solid ${partido2.color}60`,
                        }}
                      >
                        {partido2.siglas.slice(0, 2)}
                      </div>
                      {/* Percentage badge */}
                      <div
                        className="absolute -bottom-1 -right-1 flex items-center justify-center w-10 h-10 rounded-full text-white text-xs font-black shadow-md"
                        style={{
                          background: `linear-gradient(135deg, ${partido2.color}, ${partido2.color}CC)`,
                          boxShadow: `0 2px 8px ${partido2.color}50`,
                        }}
                      >
                        {partido2.porcentaje}%
                      </div>
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0 pt-1">
                      <h3 className="text-lg font-bold text-gray-900 leading-tight">{partido2.nombre}</h3>
                      <p className="text-sm text-gray-500 font-medium mt-0.5">{partido2.siglas}</p>
                      <div className="flex items-baseline gap-2 mt-3">
                        <span className="text-3xl font-black tracking-tight" style={{ color: partido2.color }}>
                          {partido2.votos.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-400 font-medium">Votos</span>
                      </div>
                      {/* Progress bar */}
                      <div className="mt-3 w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: partido2.color + '15' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${partido2.porcentaje}%` }}
                          transition={{ duration: 1, ease: 'easeOut', delay: 0.4 }}
                          className="h-full rounded-full"
                          style={{ background: `linear-gradient(90deg, ${partido2.color}, ${partido2.color}CC)` }}
                        />
                      </div>
                    </div>
                  </div>
                  {/* 2nd place badge */}
                  <div
                    className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-bold text-white"
                    style={{ backgroundColor: partido2.color }}
                  >
                    2° LUGAR
                  </div>
                </motion.div>
              </div>

              {/* Bottom stats row - Diferencia, Blanco/Nulo, Participación */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
                {/* Diferencia */}
                <div className="rounded-xl p-4 bg-gray-50 border border-gray-100">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Diferencia</span>
                  <p className="text-2xl font-black text-gray-900 mt-1">{diferencia.toLocaleString()}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: partido1.color }} />
                    <span className="text-[11px] font-semibold text-gray-600">{partido1.porcentaje}%</span>
                    <span className="text-[10px] text-gray-300">vs</span>
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: partido2.color }} />
                    <span className="text-[11px] font-semibold text-gray-600">{partido2.porcentaje}%</span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">
                    {((parseFloat(partido1.porcentaje) - parseFloat(partido2.porcentaje))).toFixed(1)}% margen
                  </p>
                </div>

                {/* Blanco/Nulo */}
                <div className="rounded-xl p-4 bg-gray-50 border border-gray-100">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Blanco / Nulo</span>
                  <div className="flex items-baseline gap-3 mt-1">
                    <p className="text-2xl font-black text-gray-900">{totalNulos.toLocaleString()}</p>
                    <div className="h-5 w-px bg-gray-200" />
                    <p className="text-xl font-bold text-gray-500">{totalBlanco.toLocaleString()}</p>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">No contabilizados</p>
                </div>

                {/* Participación */}
                <div className="rounded-xl p-4 bg-gray-50 border border-gray-100">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Participación</span>
                  <p className="text-2xl font-black text-emerald-600 mt-1">{participationRate}%</p>
                  <p className="text-[10px] text-gray-400 mt-1">Censo Electoral</p>
                  <div className="mt-2 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: `${participationRate}%` }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* ============================================ */}
      {/* ROW 1: Big Progress Card + 3 Stats Cards     */}
      {/* ============================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* ---- Main Progress Card ---- */}
        <motion.div custom={0} initial="hidden" animate="visible" variants={cardVariants} className="lg:col-span-1">
          <Card
            className="rounded-xl shadow-sm border-0 h-full overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #FF6B00 0%, #E05500 60%, #C44A00 100%)',
              boxShadow: '0 4px 16px rgba(255,107,0,0.2)',
            }}
          >
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-semibold text-white/80">Avance General</span>
              </div>
              <p className="text-4xl font-extrabold text-white tracking-tight">{avance}%</p>
              <p className="text-xs text-white/60 mt-1 mb-4">de actas procesadas</p>
              <div className="w-full h-2.5 rounded-full bg-white/20 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${avance}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                  className="h-full rounded-full bg-white/90"
                />
              </div>
              <div className="flex justify-between mt-2 text-[10px] text-white/50">
                <span>{filteredActas.length} actas</span>
                <span>{filteredMesas.length} mesas</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ---- Stat Card: Actas Validadas ---- */}
        <motion.div custom={1} initial="hidden" animate="visible" variants={cardVariants}>
          <Card className="rounded-xl shadow-sm border border-gray-100 bg-white h-full">
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

        {/* ---- Stat Card: Actas Observadas ---- */}
        <motion.div custom={2} initial="hidden" animate="visible" variants={cardVariants}>
          <Card className="rounded-xl shadow-sm border border-gray-100 bg-white h-full">
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

        {/* ---- Stat Card: Mesas + Personeros ---- */}
        <motion.div custom={3} initial="hidden" animate="visible" variants={cardVariants}>
          <Card className="rounded-xl shadow-sm border border-gray-100 bg-white h-full">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                  <Hash className="w-4 h-4 text-orange-600" />
                </div>
                <span className="text-sm font-medium text-gray-500">Mesas / Personeros</span>
              </div>
              <div className="flex items-baseline gap-3">
                <div>
                  <p className="text-3xl font-bold text-gray-900">{filteredMesas.length.toLocaleString()}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">mesas registradas</p>
                </div>
                <div className="h-8 w-px bg-gray-200" />
                <div>
                  <p className="text-2xl font-bold text-gray-700">{activePersoneros}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">personeros activos</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-3">
                <span className="text-[10px] text-gray-400">{actasPendientes} pendientes</span>
                <div className="w-1 h-1 rounded-full bg-gray-300" />
                <span className="text-[10px] text-gray-400">{totalGeneral.toLocaleString()} votos</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ============================================ */}
      {/* ROW 2: Party Comparison + Mini Metrics        */}
      {/* ============================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* ---- Party Comparison Card ---- */}
        <motion.div initial="hidden" animate="visible" variants={sectionVariants} className="lg:col-span-2">
          <Card className="rounded-xl shadow-sm border border-gray-100 bg-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                    <Vote className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold text-gray-800">Resultados por Partido</CardTitle>
                    <CardDescription className="text-xs text-gray-500">Comparación de votos acumulados</CardDescription>
                  </div>
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
                        {/* Party color dot + initials */}
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-white text-xs font-bold shadow-sm"
                          style={{ backgroundColor: partido.color }}
                        >
                          {partido.siglas.slice(0, 2)}
                        </div>
                        {/* Party info + bar */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-semibold text-gray-800 truncate">{partido.nombre}</span>
                            <div className="flex items-center gap-2 shrink-0 ml-2">
                              <span className="text-sm font-bold text-gray-900">{partido.votos.toLocaleString()}</span>
                              <span className="text-xs font-semibold px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-600">{partido.porcentaje}%</span>
                            </div>
                          </div>
                          <div className="w-full h-2.5 rounded-full bg-gray-100 overflow-hidden">
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

        {/* ---- Mini Metrics Column ---- */}
        <motion.div initial="hidden" animate="visible" variants={sectionVariants} className="space-y-4">
          {/* Diferencia entre 1ro y 2do */}
          <Card className="rounded-xl shadow-sm border border-gray-100 bg-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-orange-500" />
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Diferencia</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{diferencia.toLocaleString()}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {partido1?.nombre || '—'} vs {partido2?.nombre || '—'}
              </p>
              {partido1 && (
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: partido1.color }} />
                  <span className="text-xs font-medium text-gray-600">{partido1.porcentaje}%</span>
                  <span className="text-[10px] text-gray-400">—</span>
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: partido2?.color || '#ccc' }} />
                  <span className="text-xs font-medium text-gray-600">{partido2?.porcentaje || '0'}%</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Votos nulos y en blanco */}
          <Card className="rounded-xl shadow-sm border border-gray-100 bg-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-gray-400" />
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Votos Nulos / Blancos</span>
              </div>
              <div className="flex items-baseline gap-4">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{totalNulos.toLocaleString()}</p>
                  <p className="text-[10px] text-gray-400">nulos</p>
                </div>
                <div className="h-6 w-px bg-gray-200" />
                <div>
                  <p className="text-2xl font-bold text-gray-700">{totalBlanco.toLocaleString()}</p>
                  <p className="text-[10px] text-gray-400">en blanco</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tasa de participación */}
          <Card className="rounded-xl shadow-sm border border-gray-100 bg-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-orange-500" />
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Participación</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{participationRate}%</p>
              <p className="text-[11px] text-gray-400 mt-0.5">votos válidos del total</p>
              <div className="mt-2 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full rounded-full bg-orange-500" style={{ width: `${participationRate}%` }} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ============================================ */}
      {/* ROW 3: Department Distribution + Acts Table   */}
      {/* ============================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* ---- Department Distribution ---- */}
        <motion.div initial="hidden" animate="visible" variants={sectionVariants} className="lg:col-span-1">
          <Card className="rounded-xl shadow-sm border border-gray-100 bg-white h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold text-gray-800">Distribución por Departamento</CardTitle>
                    <CardDescription className="text-xs text-gray-500">Partido líder por región</CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-[#FF6B00] hover:bg-orange-50 text-xs font-semibold h-7 px-2">
                  VER MAPA
                  <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="max-h-[380px] overflow-y-auto pr-1 custom-scrollbar space-y-2.5">
                {deptoData.map((depto, idx) => (
                  <motion.div
                    key={depto.departamento}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04, duration: 0.3 }}
                    className="bg-gray-50/80 rounded-lg p-3 border border-gray-100 hover:border-orange-200 transition-colors group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-gray-400 group-hover:text-orange-500 transition-colors" />
                        <span className="text-sm font-semibold text-gray-800">{depto.departamento}</span>
                      </div>
                      <span className="text-[10px] font-medium text-gray-400">{depto.totalVotos.toLocaleString()} votos</span>
                    </div>
                    {/* Dual bars */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: depto.leaderColor }} />
                        <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${depto.leaderPct}%`, backgroundColor: depto.leaderColor }} />
                        </div>
                        <span className="text-[10px] font-bold shrink-0" style={{ color: depto.leaderColor }}>{depto.leaderPct}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: depto.secondColor }} />
                        <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${depto.secondPct}%`, backgroundColor: depto.secondColor }} />
                        </div>
                        <span className="text-[10px] font-bold shrink-0" style={{ color: depto.secondColor }}>{depto.secondPct}%</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[9px] text-gray-400 truncate">{depto.leaderName}</span>
                      <span className="text-[9px] text-gray-300">vs</span>
                      <span className="text-[9px] text-gray-400 truncate">{depto.secondName}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ---- Latest Acts Table ---- */}
        <motion.div initial="hidden" animate="visible" variants={sectionVariants} className="lg:col-span-2">
          <Card className="rounded-xl shadow-sm border border-gray-100 bg-white h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold text-gray-800">Últimas Actas Recibidas</CardTitle>
                    <CardDescription className="text-xs text-gray-500">{filteredActas.length} actas registradas</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-semibold text-gray-500">En vivo</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="max-h-[380px] overflow-y-auto custom-scrollbar">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-gray-100 hover:bg-transparent">
                      <TableHead className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">N° Mesa</TableHead>
                      <TableHead className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Ubicación</TableHead>
                      <TableHead className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Local</TableHead>
                      <TableHead className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Estado</TableHead>
                      <TableHead className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Hora</TableHead>
                      <TableHead className="text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Votos</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tableData.map((acta, idx) => (
                      <TableRow
                        key={acta.id}
                        className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-orange-50/30 border-b border-gray-50 transition-colors cursor-pointer`}
                      >
                        <TableCell className="py-2.5">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-orange-100 flex items-center justify-center">
                              <Hash className="w-3 h-3 text-orange-600" />
                            </div>
                            <span className="text-sm font-semibold text-gray-800">{acta.numeroMesa}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-2.5">
                          <p className="text-sm text-gray-700 font-medium">{acta.departamento}</p>
                          <p className="text-[10px] text-gray-400">{acta.provincia} / {acta.distrito}</p>
                        </TableCell>
                        <TableCell className="py-2.5 text-sm text-gray-500 max-w-[140px] truncate">{acta.localVotacion}</TableCell>
                        <TableCell className="py-2.5">{getStatusBadge(acta.estadoValidacion)}</TableCell>
                        <TableCell className="py-2.5">
                          <p className="text-xs font-mono text-gray-600">{acta.horaRegistro}</p>
                          <p className="text-[10px] text-gray-400">{getTimeAgo(acta.horaRegistro)}</p>
                        </TableCell>
                        <TableCell className="py-2.5 text-right">
                          <span className="text-sm font-bold text-gray-800">{acta.totalVotos.toLocaleString()}</span>
                        </TableCell>
                      </TableRow>
                    ))}
                    {tableData.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-400 text-sm">
                          No se encontraron actas con los filtros aplicados
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              {tableData.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100 flex justify-center">
                  <Button variant="ghost" size="sm" className="text-[#FF6B00] hover:bg-orange-50 text-xs font-semibold">
                    Cargar más actas
                    <ChevronDown className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ============================================ */}
      {/* ROW 4: Timeline Chart                        */}
      {/* ============================================ */}
      <motion.div initial="hidden" animate="visible" variants={sectionVariants}>
        <Card className="rounded-xl shadow-sm border border-gray-100 bg-white">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                <Clock className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-gray-800">Línea de Tiempo - Registro de Actas</CardTitle>
                <CardDescription className="text-xs text-gray-500">Votos registrados por hora a lo largo del día</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={timelineChartConfig} className="aspect-[4/1] max-h-[200px]">
              <BarChart data={timelineChartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis
                  dataKey="hora"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                  width={50}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="votos" fill={ORANGE} radius={[4, 4, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
