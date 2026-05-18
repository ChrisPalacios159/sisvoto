'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Legend } from 'recharts'
import { BarChart3, FileText, MapPin, Vote, Download } from 'lucide-react'
import {
  actasMock,
  partidosMock,
  mesasMock,
  calcularVotosTotales,
  calcularPorcentajes,
  getVotosPorDepartamento,
} from '@/data/mock'

export default function Reportes() {
  const [departamentoFilter, setDepartamentoFilter] = useState<string>('all')

  // ===== Computed data =====
  const { votosPorPartido, totalGeneral, totalNulos, totalBlanco } = useMemo(
    () => calcularVotosTotales(actasMock),
    []
  )

  const porcentajes = useMemo(
    () => calcularPorcentajes(votosPorPartido, totalGeneral),
    [votosPorPartido, totalGeneral]
  )

  const votosPorDepto = useMemo(
    () => getVotosPorDepartamento(actasMock),
    []
  )

  const departamentos = useMemo(
    () => Object.keys(votosPorDepto).sort(),
    [votosPorDepto]
  )

  // Actas stats
  const actasStats = useMemo(() => {
    const stats = { validada: 0, pendiente: 0, observada: 0, rechazada: 0 }
    actasMock.forEach((a) => { stats[a.estadoValidacion]++ })
    return stats
  }, [])

  const totalActas = actasMock.length
  const actasValidadas = actasStats.validada

  // ===== Chart data: Por Partido (horizontal bar) =====
  const partidoChartData = useMemo(
    () =>
      porcentajes.map((p) => ({
        name: p.siglas,
        fullName: p.nombre,
        votos: p.votos,
        porcentaje: p.porcentaje,
        fill: p.color,
      })),
    [porcentajes]
  )

  const partidoChartConfig = useMemo(() => {
    const config: Record<string, { label: string; color: string }> = {}
    porcentajes.forEach((p) => {
      config[p.siglas] = { label: p.nombre, color: p.color }
    })
    return config
  }, [porcentajes])

  // ===== Chart data: Por Ubicación (stacked bar) =====
  const ubicacionChartData = useMemo(() => {
    const filteredDepts =
      departamentoFilter === 'all' ? departamentos : [departamentoFilter]
    return filteredDepts.map((depto) => {
      const entry: Record<string, string | number> = { departamento: depto }
      partidosMock.forEach((p) => {
        entry[p.siglas] = votosPorDepto[depto]?.[p.siglas] || 0
      })
      return entry
    })
  }, [departamentoFilter, departamentos, votosPorDepto])

  const ubicacionChartConfig = useMemo(() => {
    const config: Record<string, { label: string; color: string }> = {}
    partidosMock.forEach((p) => {
      config[p.siglas] = { label: p.nombre, color: p.color }
    })
    return config
  }, [])

  // ===== Chart data: Actas donut =====
  const actasDonutData = useMemo(
    () => [
      { name: 'Validadas', value: actasStats.validada, fill: '#2E8B57' },
      { name: 'Pendientes', value: actasStats.pendiente, fill: '#FF6B00' },
      { name: 'Observadas', value: actasStats.observada, fill: '#D4A017' },
      { name: 'Rechazadas', value: actasStats.rechazada, fill: '#E3292E' },
    ],
    [actasStats]
  )

  const actasChartConfig = useMemo(
    () => ({
      Validadas: { label: 'Validadas', color: '#2E8B57' },
      Pendientes: { label: 'Pendientes', color: '#FF6B00' },
      Observadas: { label: 'Observadas', color: '#D4A017' },
      Rechazadas: { label: 'Rechazadas', color: '#E3292E' },
    }),
    []
  )

  // ===== Votos por partido por departamento (detailed cards) =====
  const votosPorPartidoPorDepto = useMemo(() => {
    const result: Record<string, Record<string, number>> = {}
    partidosMock.forEach((p) => {
      result[p.id] = {}
      departamentos.forEach((d) => {
        result[p.id][d] = votosPorDepto[d]?.[p.siglas] || 0
      })
    })
    return result
  }, [departamentos, votosPorDepto])

  // ===== Actas with issues =====
  const actasConProblemas = useMemo(
    () =>
      actasMock.filter(
        (a) => a.estadoValidacion === 'observada' || a.estadoValidacion === 'pendiente' || a.estadoValidacion === 'rechazada'
      ),
    []
  )

  const statusColorMap: Record<string, string> = {
    validada: 'bg-emerald-100 text-emerald-800',
    pendiente: 'bg-orange-100 text-orange-800',
    observada: 'bg-yellow-100 text-yellow-800',
    rechazada: 'bg-red-100 text-red-800',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            Reportes Electorales
          </h2>
          <p className="text-muted-foreground mt-1">
            Análisis detallado y estadísticas del proceso electoral
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-[#FF6B00] px-4 py-2.5 text-sm font-medium text-white shadow-md hover:bg-[#E55D00] transition-colors">
          <Download className="h-4 w-4" />
          Exportar PDF
        </button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="resumen" className="space-y-6">
        <TabsList className="flex w-full flex-wrap h-auto gap-1 bg-gray-100 p-1 rounded-xl">
          <TabsTrigger
            value="resumen"
            className="flex-1 min-w-[140px] data-[state=active]:bg-[#FF6B00] data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg transition-all"
          >
            <BarChart3 className="h-4 w-4 mr-1.5" />
            Resumen General
          </TabsTrigger>
          <TabsTrigger
            value="partidos"
            className="flex-1 min-w-[140px] data-[state=active]:bg-[#FF6B00] data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg transition-all"
          >
            <Vote className="h-4 w-4 mr-1.5" />
            Por Partido
          </TabsTrigger>
          <TabsTrigger
            value="ubicacion"
            className="flex-1 min-w-[140px] data-[state=active]:bg-[#FF6B00] data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg transition-all"
          >
            <MapPin className="h-4 w-4 mr-1.5" />
            Por Ubicación
          </TabsTrigger>
          <TabsTrigger
            value="actas"
            className="flex-1 min-w-[140px] data-[state=active]:bg-[#FF6B00] data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg transition-all"
          >
            <FileText className="h-4 w-4 mr-1.5" />
            Actas
          </TabsTrigger>
        </TabsList>

        {/* ===== RESUMEN GENERAL ===== */}
        <TabsContent value="resumen" className="space-y-6">
          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-l-4 border-l-[#FF6B00] shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Votos</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {totalGeneral.toLocaleString()}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-[#FF6B00]/10 flex items-center justify-center">
                    <Vote className="h-6 w-6 text-[#FF6B00]" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Actas</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{totalActas}</p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-emerald-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-green-600 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Actas Validadas</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{actasValidadas}</p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-green-50 flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Actas Pendientes</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {actasStats.pendiente + actasStats.observada}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-amber-50 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-amber-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary table */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900">
                Resultados por Partido Político
              </CardTitle>
              <CardDescription>
                Resumen de votos y porcentajes de todos los partidos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/80">
                      <TableHead className="w-12 text-center font-semibold">#</TableHead>
                      <TableHead className="font-semibold">Partido</TableHead>
                      <TableHead className="font-semibold">Siglas</TableHead>
                      <TableHead className="text-right font-semibold">Total Votos</TableHead>
                      <TableHead className="text-right font-semibold">Porcentaje</TableHead>
                      <TableHead className="text-center font-semibold">Ranking</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {porcentajes.map((p, idx) => (
                      <TableRow key={p.id} className="hover:bg-gray-50/50 transition-colors">
                        <TableCell className="text-center">
                          <div
                            className="h-3 w-3 rounded-full mx-auto"
                            style={{ backgroundColor: p.color }}
                          />
                        </TableCell>
                        <TableCell className="font-medium text-gray-900">{p.nombre}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="font-semibold"
                            style={{ borderColor: p.color, color: p.color }}
                          >
                            {p.siglas}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono font-semibold">
                          {p.votos.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all"
                                style={{
                                  width: `${Math.min(parseFloat(p.porcentaje), 100)}%`,
                                  backgroundColor: p.color,
                                }}
                              />
                            </div>
                            <span className="font-mono text-sm font-medium w-12 text-right">
                              {p.porcentaje}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            className={
                              idx === 0
                                ? 'bg-[#FF6B00] text-white'
                                : idx === 1
                                ? 'bg-gray-600 text-white'
                                : idx === 2
                                ? 'bg-amber-700 text-white'
                                : 'bg-gray-200 text-gray-700'
                            }
                          >
                            {idx + 1}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4 flex gap-6 text-sm text-muted-foreground border-t pt-4">
                <span>Votos nulos: <strong className="text-gray-900">{totalNulos.toLocaleString()}</strong></span>
                <span>Votos en blanco: <strong className="text-gray-900">{totalBlanco.toLocaleString()}</strong></span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== POR PARTIDO ===== */}
        <TabsContent value="partidos" className="space-y-6">
          {/* Horizontal Bar Chart */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Votos Totales por Partido
              </CardTitle>
              <CardDescription>
                Comparación visual del total de votos obtenidos por cada partido político
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={partidoChartConfig} className="h-[400px] w-full">
                <BarChart
                  data={partidoChartData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 13, fontWeight: 600 }}
                    width={70}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value, name) => (
                          <span className="font-mono font-bold">
                            {Number(value).toLocaleString()} votos
                          </span>
                        )}
                      />
                    }
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="votos" radius={[0, 6, 6, 0]} barSize={28}>
                    {partidoChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Detailed cards per party */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {partidosMock.map((partido) => {
              const votoData = votosPorPartidoPorDepto[partido.id] || {}
              const totalPartido = Object.values(votoData).reduce((s, v) => s + v, 0)
              const pctTotal = totalGeneral > 0 ? ((totalPartido / totalGeneral) * 100).toFixed(1) : '0'

              return (
                <Card key={partido.id} className="shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <div className="h-1" style={{ backgroundColor: partido.color }} />
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-semibold text-gray-900">
                        {partido.nombre}
                      </CardTitle>
                      <Badge
                        style={{ backgroundColor: partido.color, color: '#fff' }}
                        className="font-semibold"
                      >
                        {partido.siglas}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center gap-3 mt-1">
                      <span>{totalPartido.toLocaleString()} votos</span>
                      <span className="font-semibold" style={{ color: partido.color }}>
                        {pctTotal}%
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {departamentos.map((depto) => {
                        const v = votoData[depto] || 0
                        const deptMax = Math.max(...Object.values(votoData), 1)
                        const pct = (v / deptMax) * 100
                        return (
                          <div key={depto} className="flex items-center gap-3 text-sm">
                            <span className="w-24 text-muted-foreground shrink-0 truncate">
                              {depto}
                            </span>
                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${pct}%`,
                                  backgroundColor: partido.color,
                                  opacity: 0.7,
                                }}
                              />
                            </div>
                            <span className="w-10 text-right font-mono font-medium text-gray-700">
                              {v}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* ===== POR UBICACIÓN ===== */}
        <TabsContent value="ubicacion" className="space-y-6">
          {/* Filter */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    Resultados por Ubicación
                  </CardTitle>
                  <CardDescription>
                    Distribución de votos por departamento y partido político
                  </CardDescription>
                </div>
                <div className="w-full sm:w-60">
                  <Select value={departamentoFilter} onValueChange={setDepartamentoFilter}>
                    <SelectTrigger className="w-full">
                      <MapPin className="h-4 w-4 mr-1 text-[#FF6B00]" />
                      <SelectValue placeholder="Filtrar departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los departamentos</SelectItem>
                      {departamentos.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer config={ubicacionChartConfig} className="h-[400px] w-full">
                <BarChart data={ubicacionChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="departamento" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  {partidosMock.map((p) => (
                    <Bar
                      key={p.id}
                      dataKey={p.siglas}
                      stackId="a"
                      fill={p.color}
                      radius={undefined}
                    />
                  ))}
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Table by location */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Votos por Departamento y Partido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/80">
                      <TableHead className="font-semibold">Departamento</TableHead>
                      {partidosMock.map((p) => (
                        <TableHead key={p.id} className="text-right font-semibold">
                          <div className="flex items-center justify-end gap-1.5">
                            <div
                              className="h-2.5 w-2.5 rounded-sm"
                              style={{ backgroundColor: p.color }}
                            />
                            <span className="hidden xl:inline">{p.siglas}</span>
                          </div>
                        </TableHead>
                      ))}
                      <TableHead className="text-right font-semibold">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(departamentoFilter === 'all' ? departamentos : [departamentoFilter]).map(
                      (depto) => {
                        const totalDepto = partidosMock.reduce(
                          (s, p) => s + (votosPorDepto[depto]?.[p.siglas] || 0),
                          0
                        )
                        return (
                          <TableRow key={depto} className="hover:bg-gray-50/50 transition-colors">
                            <TableCell className="font-medium text-gray-900">{depto}</TableCell>
                            {partidosMock.map((p) => (
                              <TableCell key={p.id} className="text-right font-mono">
                                {votosPorDepto[depto]?.[p.siglas] || 0}
                              </TableCell>
                            ))}
                            <TableCell className="text-right font-mono font-bold text-[#FF6B00]">
                              {totalDepto.toLocaleString()}
                            </TableCell>
                          </TableRow>
                        )
                      }
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== ACTAS ===== */}
        <TabsContent value="actas" className="space-y-6">
          {/* Donut chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Estado de Validación de Actas
                </CardTitle>
                <CardDescription>
                  Distribución del estado de validación del total de actas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={actasChartConfig} className="h-[300px] w-full">
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Pie
                      data={actasDonutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={110}
                      paddingAngle={3}
                      dataKey="value"
                      nameKey="name"
                    >
                      {actasDonutData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartLegend content={<ChartLegendContent />} />
                  </PieChart>
                </ChartContainer>
                <div className="flex justify-center mt-2">
                  <span className="text-sm text-muted-foreground">
                    Total de actas: <strong className="text-gray-900">{totalActas}</strong>
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Count by status */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Resumen por Estado
                </CardTitle>
                <CardDescription>Cantidad de actas por cada estado de validación</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {actasDonutData.map((item) => {
                    const pct = totalActas > 0 ? ((item.value / totalActas) * 100).toFixed(1) : '0'
                    return (
                      <div key={item.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className="h-4 w-4 rounded-md"
                              style={{ backgroundColor: item.fill }}
                            />
                            <span className="font-medium text-gray-900">{item.name}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-mono font-bold text-lg">{item.value}</span>
                            <span className="text-sm text-muted-foreground">({pct}%)</span>
                          </div>
                        </div>
                        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: item.fill,
                            }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Table of actas with issues */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Actas con Incidencias
              </CardTitle>
              <CardDescription>
                Actas que requieren atención (pendientes, observadas o rechazadas)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto max-h-96 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/80">
                      <TableHead className="font-semibold">Mesa</TableHead>
                      <TableHead className="font-semibold">Departamento</TableHead>
                      <TableHead className="font-semibold">Personero</TableHead>
                      <TableHead className="text-right font-semibold">Total Votos</TableHead>
                      <TableHead className="text-center font-semibold">Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {actasConProblemas.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No hay actas con incidencias
                        </TableCell>
                      </TableRow>
                    ) : (
                      actasConProblemas.map((acta) => (
                        <TableRow key={acta.id} className="hover:bg-gray-50/50 transition-colors">
                          <TableCell className="font-mono font-medium">{acta.numeroMesa}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                              {acta.departamento}
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-700">{acta.personeroNombre}</TableCell>
                          <TableCell className="text-right font-mono">
                            {acta.totalVotos.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              className={
                                statusColorMap[acta.estadoValidacion] || 'bg-gray-100 text-gray-700'
                              }
                            >
                              {acta.estadoValidacion.charAt(0).toUpperCase() +
                                acta.estadoValidacion.slice(1)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
