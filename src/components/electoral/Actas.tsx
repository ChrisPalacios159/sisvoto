'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Search,
  Eye,
  FileText,
  MapPin,
  User,
  Calendar,
  Clock,
  Vote,
  Image as ImageIcon,
  Filter,
  X,
  Ban,
  Square,
  BarChart3,
} from 'lucide-react';
import {
  type ActaRegistrada,
  type EstadoValidacion,
  DEPARTAMENTOS,
} from '@/types/electoral';
import { actasMock, personerosMock } from '@/data/mock';

const ACTA_IMAGE_SRC = '/images/acta.jpeg';

const FUERZA_POPULAR_COLOR = '#FF6B00';
const JUNTOS_POR_EL_PERU_COLOR = '#16A34A';

const estadoColorMap: Record<EstadoValidacion, string> = {
  validada: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  pendiente: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  observada: 'bg-orange-100 text-orange-800 border-orange-200',
  rechazada: 'bg-red-100 text-red-800 border-red-200',
};

const estadoLabelMap: Record<EstadoValidacion, string> = {
  validada: 'Validada',
  pendiente: 'Pendiente',
  observada: 'Observada',
  rechazada: 'Rechazada',
};

const selectTriggerClass =
  'w-full border-[#FF6B00]/30 bg-white text-[#1F1308] shadow-sm focus:border-[#FF6B00] focus:ring-[#FF6B00]/20 data-[placeholder]:text-[#8A6A4F] dark:bg-[#1A0D06] dark:text-orange-50 dark:data-[placeholder]:text-orange-100/60 sm:w-[220px]';

const selectContentClass =
  'border-[#FF6B00]/25 bg-white text-[#1F1308] shadow-xl dark:bg-[#1A0D06] dark:text-orange-50';

const selectItemClass =
  'cursor-pointer focus:bg-[#FF6B00]/10 focus:text-[#1F1308] dark:focus:bg-[#FF6B00]/20 dark:focus:text-orange-50';

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

export default function Actas() {
  const [searchMesa, setSearchMesa] = useState('');
  const [filterEstado, setFilterEstado] = useState<string>('todos');
  const [filterDepartamento, setFilterDepartamento] = useState<string>('todos');
  const [selectedActa, setSelectedActa] = useState<ActaRegistrada | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const filteredActas = actasMock.filter((acta) => {
    const matchMesa = acta.numeroMesa
      .toLowerCase()
      .includes(searchMesa.toLowerCase());

    const matchEstado =
      filterEstado === 'todos' || acta.estadoValidacion === filterEstado;

    const matchDepto =
      filterDepartamento === 'todos' ||
      acta.departamento === filterDepartamento;

    return matchMesa && matchEstado && matchDepto;
  });

  const getPersoneroDetails = (personeroId: string) => {
    return personerosMock.find((p) => p.id === personeroId);
  };

  const handleViewDetail = (acta: ActaRegistrada) => {
    setSelectedActa(acta);
    setDetailOpen(true);
  };

  const getVotosPartido = (acta: ActaRegistrada, partido: string) => {
    const partidoNormalizado = normalizeText(partido);

    const found = acta.votosPorPartido.find((vp) =>
      normalizeText(vp.partidoNombre).includes(partidoNormalizado)
    );

    return found?.votos ?? 0;
  };

  const partidosDetalle = selectedActa
    ? [
        {
          partidoId: 'fuerza-popular',
          partidoNombre: 'Fuerza Popular',
          partidoSiglas: 'FP',
          partidoColor: FUERZA_POPULAR_COLOR,
          votos: getVotosPartido(selectedActa, 'Fuerza Popular'),
        },
        {
          partidoId: 'juntos-por-el-peru',
          partidoNombre: 'Juntos por el Perú',
          partidoSiglas: 'JPP',
          partidoColor: JUNTOS_POR_EL_PERU_COLOR,
          votos: getVotosPartido(selectedActa, 'Juntos por el Perú'),
        },
      ]
    : [];

  const maxVotos = Math.max(...partidosDetalle.map((v) => v.votos), 1);

  const clearFilters = () => {
    setSearchMesa('');
    setFilterEstado('todos');
    setFilterDepartamento('todos');
  };

  const hasActiveFilters =
    searchMesa !== '' ||
    filterEstado !== 'todos' ||
    filterDepartamento !== 'todos';

  return (
    <div className="space-y-8">
      {/* Header - Gradiente Mejorado */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6B00] to-[#E55E00] shadow-md shadow-[#FF6B00]/20">
            <FileText className="h-6 w-6 text-white" />
          </div>

          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-[#1F1308] dark:text-orange-50">
              Actas Registradas
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Consulta y validación de actas electorales
            </p>
          </div>
        </div>

        <Badge
          variant="secondary"
          className="w-fit border border-[#FF6B00]/30 bg-gradient-to-r from-[#FF6B00]/10 to-[#E55E00]/5 px-4 py-1.5 text-sm font-semibold text-[#FF6B00] shadow-sm"
        >
          {actasMock.length} actas registradas
        </Badge>
      </div>

      {/* Search and Filters - Card Mejorada */}
      <Card className="border-border/50 bg-gradient-to-b from-white to-orange-50/30 shadow-sm dark:from-[#1A0D06] dark:to-[#1A0D06]/80">
        <CardContent className="p-5">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#FF6B00]/60" />
              <Input
                placeholder="Buscar por número de mesa..."
                value={searchMesa}
                onChange={(e) => setSearchMesa(e.target.value)}
                className="border-[#FF6B00]/30 bg-white pl-10 text-[#1F1308] shadow-sm placeholder:text-[#8A6A4F] focus:border-[#FF6B00] focus:ring-[#FF6B00]/20 dark:bg-[#1A0D06] dark:text-orange-50 dark:placeholder:text-orange-100/60"
              />
            </div>

            <Select value={filterEstado} onValueChange={setFilterEstado}>
              <SelectTrigger className={selectTriggerClass}>
                <Filter className="mr-2 h-4 w-4 text-[#FF6B00]" />
                <SelectValue placeholder="Estado" />
              </SelectTrigger>

              <SelectContent className={selectContentClass}>
                <SelectItem className={selectItemClass} value="todos">
                  Todos los estados
                </SelectItem>
                <SelectItem className={selectItemClass} value="validada">
                  Validada
                </SelectItem>
                <SelectItem className={selectItemClass} value="pendiente">
                  Pendiente
                </SelectItem>
                <SelectItem className={selectItemClass} value="observada">
                  Observada
                </SelectItem>
                <SelectItem className={selectItemClass} value="rechazada">
                  Rechazada
                </SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filterDepartamento}
              onValueChange={setFilterDepartamento}
            >
              <SelectTrigger className={selectTriggerClass}>
                <SelectValue placeholder="Departamento" />
              </SelectTrigger>

              <SelectContent className={selectContentClass}>
                <SelectItem className={selectItemClass} value="todos">
                  Todos los departamentos
                </SelectItem>
                {DEPARTAMENTOS.map((depto) => (
                  <SelectItem
                    key={depto}
                    value={depto}
                    className={selectItemClass}
                  >
                    {depto}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="icon"
                onClick={clearFilters}
                className="h-10 w-10 shrink-0 rounded-lg bg-[#FF6B00]/10 text-[#FF6B00] hover:bg-[#FF6B00]/20 hover:text-[#E55E00] transition-colors"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Table - Diseño type Dashboard */}
      <Card className="border-border/50 overflow-hidden shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[#FF6B00]/20 bg-gradient-to-r from-[#FFF7ED] to-[#FFECD2] hover:bg-[#FFECD2] dark:from-[#1A0D06] dark:to-[#2A1A0E]">
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-[#9A5B2B] dark:text-orange-200">
                    N° Mesa
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-[#9A5B2B] dark:text-orange-200">
                    Personero
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-[#9A5B2B] dark:text-orange-200">
                    Departamento
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-[#9A5B2B] dark:text-orange-200">
                    Provincia
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-[#9A5B2B] dark:text-orange-200">
                    Distrito
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-[#9A5B2B] dark:text-orange-200">
                    Local de Votación
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-[#9A5B2B] dark:text-orange-200">
                    Fecha/Hora
                  </TableHead>
                  <TableHead className="text-right text-xs font-bold uppercase tracking-wider text-[#9A5B2B] dark:text-orange-200">
                    Total Votos
                  </TableHead>
                  <TableHead className="text-xs font-bold uppercase tracking-wider text-[#9A5B2B] dark:text-orange-200">
                    Estado
                  </TableHead>
                  <TableHead className="text-center text-xs font-bold uppercase tracking-wider text-[#9A5B2B] dark:text-orange-200">
                    Acción
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredActas.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      className="h-32 text-center text-muted-foreground"
                    >
                      No se encontraron actas con los filtros aplicados
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredActas.map((acta) => (
                    <TableRow
                      key={acta.id}
                      className="cursor-pointer border-b border-border/30 transition-all duration-200 hover:bg-[#FF6B00]/5 hover:shadow-sm"
                      onClick={() => handleViewDetail(acta)}
                    >
                      <TableCell>
                        <span className="rounded-md bg-[#FF6B00]/10 px-2 py-1 font-mono text-sm font-bold text-[#FF6B00]">
                          {acta.numeroMesa}
                        </span>
                      </TableCell>

                      <TableCell className="font-medium text-[#1F1308] dark:text-orange-50">
                        {acta.personeroNombre}
                      </TableCell>

                      <TableCell className="text-muted-foreground">{acta.departamento}</TableCell>
                      <TableCell className="text-muted-foreground">{acta.provincia}</TableCell>
                      <TableCell className="text-muted-foreground">{acta.distrito}</TableCell>

                      <TableCell className="max-w-[180px] truncate text-muted-foreground">
                        {acta.localVotacion}
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-col text-xs">
                          <span className="font-medium text-[#1F1308] dark:text-orange-50">{acta.fechaRegistro}</span>
                          <span className="text-muted-foreground">
                            {acta.horaRegistro}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="text-right font-bold tabular-nums text-[#1F1308] dark:text-orange-50">
                        {acta.totalVotos.toLocaleString()}
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`${estadoColorMap[acta.estadoValidacion]} text-xs font-semibold`}
                        >
                          {estadoLabelMap[acta.estadoValidacion]}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-lg text-[#FF6B00] hover:bg-[#FF6B00]/10 hover:text-[#E55E00] transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetail(acta);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {filteredActas.length > 0 && (
            <div className="border-t border-[#FF6B00]/10 bg-[#FFF7ED]/50 px-6 py-3 text-xs font-medium text-[#9A5B2B] dark:bg-[#1A0D06] dark:text-orange-200">
              Mostrando {filteredActas.length} de {actasMock.length} actas
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail View - Modal Premium */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border border-[#FF6B00]/30 bg-[#FFF7ED] p-0 text-[#1F1308] shadow-2xl dark:bg-[#1A0D06] dark:text-orange-50 sm:max-w-2xl">
          {selectedActa && (
            <div className="space-y-0">
              {/* Dialog Header con Gradiente */}
              <DialogHeader className="border-b border-[#FF6B00]/20 bg-gradient-to-r from-[#FF6B00] to-[#E55E00] p-6 pb-4">
                <DialogTitle className="flex items-center gap-2 text-lg font-bold text-white">
                  <FileText className="h-5 w-5 text-white/90" />
                  Acta - Mesa {selectedActa.numeroMesa}
                </DialogTitle>

                <DialogDescription className="text-white/80">
                  Detalle completo del acta electoral
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 p-6">
                {/* Datos del Personero */}
                <section>
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#1F1308] dark:text-orange-50">
                    <User className="h-4 w-4 text-[#FF6B00]" />
                    Datos del Personero
                  </h4>

                  <div className="grid grid-cols-1 gap-4 rounded-xl border border-[#FF6B00]/15 bg-white/70 p-5 shadow-sm backdrop-blur-sm dark:bg-white/5 sm:grid-cols-2">
                    {(() => {
                      const personero = getPersoneroDetails(
                        selectedActa.personeroId
                      );

                      return personero ? (
                        <>
                          <div>
                            <span className="text-xs font-semibold text-[#FF6B00]">
                              Nombre Completo
                            </span>
                            <p className="mt-1 text-sm font-semibold text-[#1F1308] dark:text-orange-50">
                              {personero.nombreCompleto}
                            </p>
                          </div>

                          <div>
                            <span className="text-xs font-semibold text-[#FF6B00]">
                              DNI
                            </span>
                            <p className="mt-1 font-mono text-sm font-semibold text-[#1F1308] dark:text-orange-50">
                              {personero.dni}
                            </p>
                          </div>

                          <div>
                            <span className="text-xs font-semibold text-[#FF6B00]">
                              Celular
                            </span>
                            <p className="mt-1 font-mono text-sm font-semibold text-[#1F1308] dark:text-orange-50">
                              {personero.celular}
                            </p>
                          </div>

                          <div>
                            <span className="text-xs font-semibold text-[#FF6B00]">
                              Correo
                            </span>
                            <p className="mt-1 text-sm font-semibold text-[#1F1308] dark:text-orange-50">
                              {personero.correo}
                            </p>
                          </div>
                        </>
                      ) : (
                        <p className="col-span-2 text-sm text-muted-foreground">
                          {selectedActa.personeroNombre}
                        </p>
                      );
                    })()}
                  </div>
                </section>

                <Separator className="bg-[#FF6B00]/10" />

                {/* Ubicación */}
                <section>
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#1F1308] dark:text-orange-50">
                    <MapPin className="h-4 w-4 text-[#FF6B00]" />
                    Ubicación
                  </h4>

                  <div className="grid grid-cols-1 gap-4 rounded-xl border border-[#FF6B00]/15 bg-white/70 p-5 shadow-sm backdrop-blur-sm dark:bg-white/5 sm:grid-cols-2">
                    <div>
                      <span className="text-xs font-semibold text-[#FF6B00]">
                        Departamento
                      </span>
                      <p className="mt-1 text-sm font-semibold text-[#1F1308] dark:text-orange-50">
                        {selectedActa.departamento}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs font-semibold text-[#FF6B00]">
                        Provincia
                      </span>
                      <p className="mt-1 text-sm font-semibold text-[#1F1308] dark:text-orange-50">
                        {selectedActa.provincia}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs font-semibold text-[#FF6B00]">
                        Distrito
                      </span>
                      <p className="mt-1 text-sm font-semibold text-[#1F1308] dark:text-orange-50">
                        {selectedActa.distrito}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs font-semibold text-[#FF6B00]">
                        Local de Votación
                      </span>
                      <p className="mt-1 text-sm font-semibold text-[#1F1308] dark:text-orange-50">
                        {selectedActa.localVotacion}
                      </p>
                    </div>
                  </div>
                </section>

                <Separator className="bg-[#FF6B00]/10" />

                {/* Datos del Acta */}
                <section>
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#1F1308] dark:text-orange-50">
                    <Calendar className="h-4 w-4 text-[#FF6B00]" />
                    Datos del Acta
                  </h4>

                  <div className="grid grid-cols-1 gap-4 rounded-xl border border-[#FF6B00]/15 bg-white/70 p-5 shadow-sm backdrop-blur-sm dark:bg-white/5 sm:grid-cols-3">
                    <div>
                      <span className="text-xs font-semibold text-[#FF6B00]">
                        N° Mesa
                      </span>
                      <p className="mt-1 font-mono text-lg font-extrabold text-[#FF6B00]">
                        {selectedActa.numeroMesa}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs font-semibold text-[#FF6B00]">
                        <Calendar className="mr-1 inline h-3 w-3" />
                        Fecha
                      </span>
                      <p className="mt-1 text-sm font-semibold text-[#1F1308] dark:text-orange-50">
                        {selectedActa.fechaRegistro}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs font-semibold text-[#FF6B00]">
                        <Clock className="mr-1 inline h-3 w-3" />
                        Hora
                      </span>
                      <p className="mt-1 text-sm font-semibold text-[#1F1308] dark:text-orange-50">
                        {selectedActa.horaRegistro}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Badge
                      variant="outline"
                      className={`${estadoColorMap[selectedActa.estadoValidacion]} px-4 py-1.5 text-sm font-bold border`}
                    >
                      Estado: {estadoLabelMap[selectedActa.estadoValidacion]}
                    </Badge>
                  </div>
                </section>

                <Separator className="bg-[#FF6B00]/10" />

                {/* Imagen del Acta */}
                <section>
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#1F1308] dark:text-orange-50">
                    <ImageIcon className="h-4 w-4 text-[#FF6B00]" />
                    Imagen del Acta
                  </h4>

                  <div className="overflow-hidden rounded-xl border border-[#FF6B00]/20 bg-white p-3 shadow-inner dark:bg-white/5">
                    <img
                      src={ACTA_IMAGE_SRC}
                      alt={`Imagen del acta de la mesa ${selectedActa.numeroMesa}`}
                      className="h-auto max-h-[520px] w-full rounded-lg object-contain"
                    />
                  </div>
                </section>

                <Separator className="bg-[#FF6B00]/10" />

                {/* Votos por Partido */}
                <section>
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#1F1308] dark:text-orange-50">
                    <Vote className="h-4 w-4 text-[#FF6B00]" />
                    Votos por Partido
                  </h4>

                  <div className="space-y-5 rounded-xl border border-[#FF6B00]/15 bg-white/70 p-5 shadow-sm backdrop-blur-sm dark:bg-white/5">
                    {partidosDetalle.map((vp) => (
                      <div key={vp.partidoId} className="space-y-2">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <span
                              className="inline-block h-4 w-4 shrink-0 rounded-full shadow-sm"
                              style={{ backgroundColor: vp.partidoColor }}
                            />
                            <span className="text-sm font-bold text-[#1F1308] dark:text-orange-50">
                              {vp.partidoNombre}
                            </span>
                            <span className="text-xs text-muted-foreground font-semibold">
                              ({vp.partidoSiglas})
                            </span>
                          </div>

                          <span
                            className="text-base font-extrabold tabular-nums"
                            style={{ color: vp.partidoColor }}
                          >
                            {vp.votos.toLocaleString()}
                          </span>
                        </div>

                        <div className="h-3 w-full overflow-hidden rounded-full bg-[#F3E3D4]/70 shadow-inner dark:bg-white/10">
                          <div
                            className="h-full rounded-full transition-all duration-700 ease-out"
                            style={{
                              width: `${(vp.votos / maxVotos) * 100}%`,
                              background: `linear-gradient(90deg, ${vp.partidoColor} 0%, ${vp.partidoColor}CC 100%)`,
                              boxShadow: `0 0 8px ${vp.partidoColor}40`
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <Separator className="bg-[#FF6B00]/10" />

                {/* Resumen - Style Dashboard Cards */}
                <section>
                  <h4 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#1F1308] dark:text-orange-50">
                    <BarChart3 className="h-4 w-4 text-[#FF6B00]" />
                    Resumen de Votación
                  </h4>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="relative overflow-hidden rounded-xl border border-red-100 bg-gradient-to-br from-red-50 to-red-100/50 p-5 shadow-sm dark:from-red-900/20 dark:to-red-800/10 dark:border-red-900/30">
                      <div className="absolute -right-2 -top-2 text-red-100 dark:text-red-900/30">
                        <Ban className="h-16 w-16" />
                      </div>
                      <span className="relative text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                        Votos Nulos
                      </span>
                      <p className="relative mt-2 text-3xl font-extrabold text-red-700 dark:text-red-300">
                        {selectedActa.votosNulos}
                      </p>
                    </div>

                    <div className="relative overflow-hidden rounded-xl border border-gray-100 bg-gradient-to-br from-gray-50 to-gray-100/50 p-5 shadow-sm dark:from-gray-900/20 dark:to-gray-800/10 dark:border-gray-900/30">
                      <div className="absolute -right-2 -top-2 text-gray-100 dark:text-gray-900/30">
                        <Square className="h-16 w-16" />
                      </div>
                      <span className="relative text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                        Votos en Blanco
                      </span>
                      <p className="relative mt-2 text-3xl font-extrabold text-gray-700 dark:text-gray-300">
                        {selectedActa.votosBlanco}
                      </p>
                    </div>

                    <div className="relative overflow-hidden rounded-xl border border-[#FF6B00]/20 bg-gradient-to-br from-[#FFF7ED] to-[#FFECD2] p-5 shadow-sm dark:from-orange-900/20 dark:to-orange-800/10 dark:border-orange-900/30">
                      <div className="absolute -right-2 -top-2 text-[#FF6B00]/10 dark:text-orange-900/20">
                        <Vote className="h-16 w-16" />
                      </div>
                      <span className="relative text-xs font-bold uppercase tracking-wider text-[#FF6B00] dark:text-orange-400">
                        Total Votos
                      </span>
                      <p className="relative mt-2 text-3xl font-extrabold text-[#FF6B00] dark:text-orange-300">
                        {selectedActa.totalVotos.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </section>
              </div>

              {/* Footer */}
              <DialogFooter className="border-t border-[#FF6B00]/20 bg-[#FFF7ED]/80 p-6 pt-4 dark:bg-[#1A0D06]/80">
                <Button
                  onClick={() => setDetailOpen(false)}
                  className="bg-gradient-to-r from-[#FF6B00] to-[#E55E00] text-white font-bold hover:from-[#E55E00] hover:to-[#CC5200] shadow-md shadow-[#FF6B00]/20 transition-all"
                >
                  Cerrar Detalle
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}