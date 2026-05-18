'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
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
  ChevronDown,
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
// Orange primary
// ============================
const ORANGE = '#FF6B00';

// ============================
// Animation variants
// ============================
const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.45, ease: 'easeOut' },
  }),
};

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

// ============================
// Component
// ============================
export default function Dashboard({ filtros, onFiltrosChange }: DashboardProps) {
  // ---- Local filter state ----
  const [localFiltros, setLocalFiltros] = useState<FiltrosGenerales>(filtros);

  const updateFiltro = (key: keyof FiltrosGenerales, value: string) => {
    const next = { ...localFiltros, [key]: value };
    // Reset dependent selectors
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

  // ---- Pie chart data ----
  const pieData = porcentajes.map((p) => ({
    name: p.siglas,
    fullName: p.nombre,
    value: p.votos,
    porcentaje: p.porcentaje,
    color: p.color,
  }));

  // ---- Bar chart data ----
  const barData = useMemo(() => {
    const partidos = partidosMock;
    return Object.entries(votosPorDepto).map(([depto, partidosVotos]) => {
      const row: Record<string, string | number> = { departamento: depto };
      partidos.forEach((p) => {
        row[p.siglas] = partidosVotos[p.siglas] || 0;
      });
      return row;
    });
  }, [votosPorDepto]);

  // ---- Chart configs ----
  const pieChartConfig = useMemo(() => {
    const cfg: Record<string, { label: string; color: string }> = {};
    porcentajes.forEach((p) => {
      cfg[p.siglas] = { label: p.nombre, color: p.color };
    });
    return cfg;
  }, [porcentajes]);

  const barChartConfig = useMemo(() => {
    const cfg: Record<string, { label: string; color: string }> = {};
    partidosMock.forEach((p) => {
      cfg[p.siglas] = { label: p.nombre, color: p.color };
    });
    return cfg;
  }, []);

  // ---- Geographic summary ----
  const geoSummary = useMemo(() => {
    return DEPARTAMENTOS.map((depto) => {
      const actasDepto = filteredActas.filter((a) => a.departamento === depto);
      if (actasDepto.length === 0) return null;
      const { votosPorPartido: vp, totalGeneral: tg } = calcularVotosTotales(actasDepto);
      const pcts = calcularPorcentajes(vp, tg);
      const leader = pcts[0];
      return {
        departamento: depto,
        totalVotos: tg,
        leadingParty: leader?.nombre || '',
        leadingColor: leader?.color || '',
        leadingPct: leader?.porcentaje || '0',
      };
    }).filter(Boolean) as {
      departamento: string;
      totalVotos: number;
      leadingParty: string;
      leadingColor: string;
      leadingPct: string;
    }[];
  }, [filteredActas]);

  // ---- Table data ----
  const tableData = useMemo(() => {
    return [...filteredActas]
      .sort((a, b) => `${b.fechaRegistro}${b.horaRegistro}`.localeCompare(`${a.fechaRegistro}${a.horaRegistro}`))
      .slice(0, 8);
  }, [filteredActas]);

  // ---- Provinces/districts for dependent selects ----
  const availableProvincias = localFiltros.departamento
    ? PROVINCIAS_POR_DEPARTAMENTO[localFiltros.departamento] || []
    : [];

  const availableDistritos = localFiltros.provincia
    ? DISTRITOS_POR_PROVINCIA[localFiltros.provincia] || []
    : [];

  // ---- Has active filters ----
  const hasFilters = Object.values(localFiltros).some((v) => v !== '');

  return (
    <div className="w-full space-y-6">
      {/* ============================================ */}
      {/* FILTER BAR                                   */}
      {/* ============================================ */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
      >
        <Card className="rounded-xl shadow-sm border border-gray-100">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ backgroundColor: `${ORANGE}15` }}>
                  <Filter className="w-4 h-4" style={{ color: ORANGE }} />
                </div>
                <CardTitle className="text-base font-semibold text-gray-800">Filtros de Búsqueda</CardTitle>
              </div>
              {hasFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFiltros}
                  className="text-gray-500 hover:text-gray-700 h-8 px-2"
                >
                  <X className="w-4 h-4 mr-1" />
                  Limpiar
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
              {/* Departamento */}
              <Select
                value={localFiltros.departamento}
                onValueChange={(v) => updateFiltro('departamento', v)}
              >
                <SelectTrigger className="w-full bg-white">
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

              {/* Provincia */}
              <Select
                value={localFiltros.provincia}
                onValueChange={(v) => updateFiltro('provincia', v)}
                disabled={!localFiltros.departamento}
              >
                <SelectTrigger className="w-full bg-white">
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

              {/* Distrito */}
              <Select
                value={localFiltros.distrito}
                onValueChange={(v) => updateFiltro('distrito', v)}
                disabled={!localFiltros.provincia}
              >
                <SelectTrigger className="w-full bg-white">
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

              {/* Partido Político */}
              <Select
                value={localFiltros.partidoPolitico}
                onValueChange={(v) => updateFiltro('partidoPolitico', v)}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Partido Político" />
                </SelectTrigger>
                <SelectContent>
                  {partidosMock.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: p.color }}
                        />
                        {p.nombre}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Fecha inicio */}
              <Input
                type="date"
                value={localFiltros.fechaInicio}
                onChange={(e) => updateFiltro('fechaInicio', e.target.value)}
                className="bg-white"
                placeholder="Fecha inicio"
              />

              {/* Fecha fin */}
              <Input
                type="date"
                value={localFiltros.fechaFin}
                onChange={(e) => updateFiltro('fechaFin', e.target.value)}
                className="bg-white"
                placeholder="Fecha fin"
              />

              {/* Número de mesa */}
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  value={localFiltros.numeroMesa}
                  onChange={(e) => updateFiltro('numeroMesa', e.target.value)}
                  placeholder="N° Mesa"
                  className="bg-white pl-8"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ============================================ */}
      {/* STATS CARDS                                  */}
      {/* ============================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          {
            title: 'Total Votos Acumulados',
            value: totalGeneral.toLocaleString(),
            icon: Vote,
            accent: ORANGE,
            trend: true,
          },
          {
            title: 'Mesas Registradas',
            value: filteredMesas.length.toString(),
            icon: Hash,
            accent: ORANGE,
          },
          {
            title: 'Actas Enviadas',
            value: filteredActas.length.toString(),
            icon: FileText,
            accent: ORANGE,
          },
          {
            title: 'Personeros Activos',
            value: activePersoneros.toString(),
            icon: Users,
            accent: ORANGE,
          },
          {
            title: '% Avance',
            value: `${avance}%`,
            icon: TrendingUp,
            accent: ORANGE,
            progress: avance,
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.title}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
          >
            <Card className="rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow bg-white h-full">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-500 font-medium truncate">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    {stat.progress !== undefined && (
                      <div className="mt-2.5">
                        <Progress value={stat.progress} className="h-2" />
                      </div>
                    )}
                  </div>
                  <div
                    className="flex items-center justify-center w-11 h-11 rounded-xl shrink-0 ml-3"
                    style={{ backgroundColor: `${stat.accent}15` }}
                  >
                    <stat.icon className="w-5 h-5" style={{ color: stat.accent }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ============================================ */}
      {/* CHARTS ROW: Pie + Bar                        */}
      {/* ============================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ---- Donut Chart: Porcentaje por Partido ---- */}
        <motion.div initial="hidden" animate="visible" variants={sectionVariants}>
          <Card className="rounded-xl shadow-sm border border-gray-100 bg-white h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ backgroundColor: `${ORANGE}15` }}>
                  <Vote className="w-4 h-4" style={{ color: ORANGE }} />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold text-gray-800">
                    Porcentaje por Partido
                  </CardTitle>
                  <CardDescription className="text-xs text-gray-500">
                    Distribución de votos por partido político
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <ChartContainer config={pieChartConfig} className="mx-auto aspect-square max-h-[320px]">
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent nameKey="fullName" />} />
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius="55%"
                      outerRadius="80%"
                      dataKey="value"
                      nameKey="name"
                      strokeWidth={2}
                      stroke="#fff"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartLegend
                      content={<ChartLegendContent nameKey="name" />}
                      className="flex-wrap gap-2"
                    />
                  </PieChart>
                </ChartContainer>
                {/* Center text overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ top: '-8%' }}>
                  <div className="text-center">
                    <p className="text-xl font-bold text-gray-900">{totalGeneral.toLocaleString()}</p>
                    <p className="text-[10px] text-gray-400 -mt-0.5">votos</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ---- Bar Chart: Votos por Partido según Ubicación ---- */}
        <motion.div initial="hidden" animate="visible" variants={sectionVariants}>
          <Card className="rounded-xl shadow-sm border border-gray-100 bg-white h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ backgroundColor: `${ORANGE}15` }}>
                  <MapPin className="w-4 h-4" style={{ color: ORANGE }} />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold text-gray-800">
                    Votos por Partido según Ubicación
                  </CardTitle>
                  <CardDescription className="text-xs text-gray-500">
                    Votos acumulados por departamento
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer config={barChartConfig} className="aspect-[4/3] max-h-[320px]">
                <BarChart data={barData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis
                    dataKey="departamento"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: '#6b7280' }}
                    interval={0}
                    angle={-20}
                    textAnchor="end"
                    height={50}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: '#6b7280' }}
                    width={45}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  {partidosMock.map((p) => (
                    <Bar
                      key={p.siglas}
                      dataKey={p.siglas}
                      fill={p.color}
                      radius={[3, 3, 0, 0]}
                      maxBarSize={24}
                    />
                  ))}
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ============================================ */}
      {/* TIMELINE + TABLE ROW                         */}
      {/* ============================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ---- Timeline of Registrations ---- */}
        <motion.div initial="hidden" animate="visible" variants={sectionVariants} className="lg:col-span-1">
          <Card className="rounded-xl shadow-sm border border-gray-100 bg-white h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ backgroundColor: `${ORANGE}15` }}>
                  <Clock className="w-4 h-4" style={{ color: ORANGE }} />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold text-gray-800">
                    Línea de Tiempo
                  </CardTitle>
                  <CardDescription className="text-xs text-gray-500">
                    Registro de actas en tiempo real
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                <div className="relative">
                  {/* Vertical line */}
                  <div
                    className="absolute left-[35px] top-2 bottom-2 w-0.5"
                    style={{ backgroundColor: '#f3e8d9' }}
                  />
                  <div className="space-y-4">
                    {timelineMock.map((entry, idx) => (
                      <div key={idx} className="relative flex items-start gap-3">
                        {/* Time */}
                        <div className="w-[30px] shrink-0 text-right">
                          <span className="text-xs font-mono font-medium text-gray-500">
                            {entry.hora}
                          </span>
                        </div>
                        {/* Dot on line */}
                        <div className="relative z-10 shrink-0 mt-0.5">
                          <div
                            className="w-3 h-3 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: entry.partidoColor }}
                          />
                        </div>
                        {/* Card */}
                        <div className="flex-1 bg-gray-50 rounded-lg p-3 border border-gray-100 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-gray-700">
                              Mesa {entry.numeroMesa}
                            </span>
                            <div
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{ backgroundColor: entry.partidoColor }}
                            />
                            <span className="text-[10px] text-gray-500 truncate">
                              {entry.partidoMayorVotacion}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-500 truncate">{entry.personero}</p>
                          <p className="text-[11px] font-semibold text-gray-700 mt-0.5">
                            {entry.totalVotos.toLocaleString()} votos
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ---- Table: Últimas Mesas Registradas ---- */}
        <motion.div initial="hidden" animate="visible" variants={sectionVariants} className="lg:col-span-2">
          <Card className="rounded-xl shadow-sm border border-gray-100 bg-white h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ backgroundColor: `${ORANGE}15` }}>
                  <Hash className="w-4 h-4" style={{ color: ORANGE }} />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold text-gray-800">
                    Últimas Mesas Registradas
                  </CardTitle>
                  <CardDescription className="text-xs text-gray-500">
                    {tableData.length} mesas encontradas
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b-0" style={{ backgroundColor: `${ORANGE}08` }}>
                      <TableHead className="text-xs font-semibold" style={{ color: ORANGE }}>N° Mesa</TableHead>
                      <TableHead className="text-xs font-semibold" style={{ color: ORANGE }}>Departamento</TableHead>
                      <TableHead className="text-xs font-semibold" style={{ color: ORANGE }}>Provincia</TableHead>
                      <TableHead className="text-xs font-semibold" style={{ color: ORANGE }}>Distrito</TableHead>
                      <TableHead className="text-xs font-semibold" style={{ color: ORANGE }}>Local</TableHead>
                      <TableHead className="text-xs font-semibold" style={{ color: ORANGE }}>Personero</TableHead>
                      <TableHead className="text-xs font-semibold" style={{ color: ORANGE }}>Hora</TableHead>
                      <TableHead className="text-xs font-semibold text-right" style={{ color: ORANGE }}>Total Votos</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tableData.map((acta, idx) => (
                      <TableRow
                        key={acta.id}
                        className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'} hover:bg-orange-50/40 transition-colors`}
                      >
                        <TableCell className="text-sm font-medium text-gray-800 py-2.5">
                          {acta.numeroMesa}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600 py-2.5">{acta.departamento}</TableCell>
                        <TableCell className="text-sm text-gray-600 py-2.5">{acta.provincia}</TableCell>
                        <TableCell className="text-sm text-gray-600 py-2.5">{acta.distrito}</TableCell>
                        <TableCell className="text-sm text-gray-600 py-2.5 max-w-[140px] truncate">
                          {acta.localVotacion}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600 py-2.5">{acta.personeroNombre}</TableCell>
                        <TableCell className="text-sm text-gray-500 py-2.5 font-mono">{acta.horaRegistro}</TableCell>
                        <TableCell className="text-sm font-semibold text-gray-800 py-2.5 text-right">
                          {acta.totalVotos.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                    {tableData.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-gray-400">
                          No se encontraron mesas con los filtros aplicados
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ============================================ */}
      {/* GEOGRAPHIC SUMMARY                           */}
      {/* ============================================ */}
      <motion.div initial="hidden" animate="visible" variants={sectionVariants}>
        <Card className="rounded-xl shadow-sm border border-gray-100 bg-white">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ backgroundColor: `${ORANGE}15` }}>
                <MapPin className="w-4 h-4" style={{ color: ORANGE }} />
              </div>
              <div>
                <CardTitle className="text-base font-semibold text-gray-800">
                  Resumen Geográfico
                </CardTitle>
                <CardDescription className="text-xs text-gray-500">
                  Resultados por departamento
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {geoSummary.map((depto, idx) => (
                <motion.div
                  key={depto.departamento}
                  custom={idx}
                  initial="hidden"
                  animate="visible"
                  variants={cardVariants}
                >
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-orange-200 hover:shadow-sm transition-all group">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 group-hover:text-orange-500 transition-colors" />
                      <h4 className="text-sm font-semibold text-gray-800 truncate">
                        {depto.departamento}
                      </h4>
                    </div>
                    <p className="text-xl font-bold text-gray-900">
                      {depto.totalVotos.toLocaleString()}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-0.5">votos totales</p>
                    <div className="flex items-center gap-2 mt-2.5 pt-2.5 border-t border-gray-200/60">
                      <div
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: depto.leadingColor }}
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-gray-700 truncate">
                          {depto.leadingParty}
                        </p>
                        <p className="text-[10px] text-gray-400">{depto.leadingPct}%</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              {geoSummary.length === 0 && (
                <div className="col-span-full text-center py-8 text-gray-400 text-sm">
                  No hay datos geográficos para los filtros aplicados
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
