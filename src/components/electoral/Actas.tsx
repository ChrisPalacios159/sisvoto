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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FF6B00]/10">
            <FileText className="h-5 w-5 text-[#FF6B00]" />
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Actas Registradas
            </h2>
            <p className="text-sm text-muted-foreground">
              Consulta y validación de actas electorales
            </p>
          </div>
        </div>

        <Badge
          variant="secondary"
          className="w-fit border-[#FF6B00]/20 bg-[#FF6B00]/10 px-3 py-1 text-sm text-[#FF6B00]"
        >
          {actasMock.length} actas registradas
        </Badge>
      </div>

      {/* Search and Filters */}
      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por número de mesa..."
                value={searchMesa}
                onChange={(e) => setSearchMesa(e.target.value)}
                className="border-[#FF6B00]/30 bg-white pl-9 text-[#1F1308] shadow-sm placeholder:text-[#8A6A4F] focus:border-[#FF6B00] focus:ring-[#FF6B00]/20 dark:bg-[#1A0D06] dark:text-orange-50 dark:placeholder:text-orange-100/60"
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
                className="h-10 w-10 shrink-0 text-[#FF6B00] hover:bg-[#FF6B00]/10 hover:text-[#E55E00]"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border/50 hover:bg-transparent">
                  <TableHead className="text-xs font-semibold uppercase tracking-wider">
                    N° Mesa
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider">
                    Personero
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider">
                    Departamento
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider">
                    Provincia
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider">
                    Distrito
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider">
                    Local de Votación
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider">
                    Fecha/Hora
                  </TableHead>
                  <TableHead className="text-right text-xs font-semibold uppercase tracking-wider">
                    Total Votos
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider">
                    Estado
                  </TableHead>
                  <TableHead className="text-center text-xs font-semibold uppercase tracking-wider">
                    Ver Detalle
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
                      className="cursor-pointer border-b border-border/30 transition-colors hover:bg-[#FF6B00]/5"
                      onClick={() => handleViewDetail(acta)}
                    >
                      <TableCell className="font-mono font-semibold text-[#FF6B00]">
                        {acta.numeroMesa}
                      </TableCell>

                      <TableCell className="font-medium">
                        {acta.personeroNombre}
                      </TableCell>

                      <TableCell>{acta.departamento}</TableCell>
                      <TableCell>{acta.provincia}</TableCell>
                      <TableCell>{acta.distrito}</TableCell>

                      <TableCell className="max-w-[180px] truncate">
                        {acta.localVotacion}
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-col text-xs">
                          <span>{acta.fechaRegistro}</span>
                          <span className="text-muted-foreground">
                            {acta.horaRegistro}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="text-right font-semibold">
                        {acta.totalVotos.toLocaleString()}
                      </TableCell>

                      <TableCell>
                        <Badge
                          className={`${estadoColorMap[acta.estadoValidacion]} text-xs`}
                        >
                          {estadoLabelMap[acta.estadoValidacion]}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-[#FF6B00] hover:bg-[#FF6B00]/10"
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
            <div className="border-t border-border/30 px-4 py-3 text-xs text-muted-foreground">
              Mostrando {filteredActas.length} de {actasMock.length} actas
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail View */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border border-[#FF6B00]/30 bg-[#FFF7ED] p-0 text-[#1F1308] shadow-2xl dark:bg-[#1A0D06] dark:text-orange-50 sm:max-w-2xl">
          {selectedActa && (
            <div className="space-y-0">
              {/* Dialog Header */}
              <DialogHeader className="border-b border-[#FF6B00]/20 bg-[#FF6B00]/10 p-6 pb-4">
                <DialogTitle className="flex items-center gap-2 text-lg text-[#1F1308] dark:text-orange-50">
                  <FileText className="h-5 w-5 text-[#FF6B00]" />
                  Acta - Mesa {selectedActa.numeroMesa}
                </DialogTitle>

                <DialogDescription className="text-[#6B4A2B] dark:text-orange-100/70">
                  Detalle completo del acta electoral
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 p-6">
                {/* Datos del Personero */}
                <section>
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#1F1308] dark:text-orange-50">
                    <User className="h-4 w-4 text-[#FF6B00]" />
                    Datos del Personero
                  </h4>

                  <div className="grid grid-cols-1 gap-3 rounded-lg border border-[#FF6B00]/15 bg-white p-4 dark:bg-white/10 sm:grid-cols-2">
                    {(() => {
                      const personero = getPersoneroDetails(
                        selectedActa.personeroId
                      );

                      return personero ? (
                        <>
                          <div>
                            <span className="text-xs text-muted-foreground">
                              Nombre
                            </span>
                            <p className="text-sm font-medium">
                              {personero.nombreCompleto}
                            </p>
                          </div>

                          <div>
                            <span className="text-xs text-muted-foreground">
                              DNI
                            </span>
                            <p className="font-mono text-sm font-medium">
                              {personero.dni}
                            </p>
                          </div>

                          <div>
                            <span className="text-xs text-muted-foreground">
                              Celular
                            </span>
                            <p className="font-mono text-sm font-medium">
                              {personero.celular}
                            </p>
                          </div>

                          <div>
                            <span className="text-xs text-muted-foreground">
                              Correo
                            </span>
                            <p className="text-sm font-medium">
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

                <Separator className="bg-[#FF6B00]/20" />

                {/* Ubicación */}
                <section>
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#1F1308] dark:text-orange-50">
                    <MapPin className="h-4 w-4 text-[#FF6B00]" />
                    Ubicación
                  </h4>

                  <div className="grid grid-cols-1 gap-3 rounded-lg border border-[#FF6B00]/15 bg-white p-4 dark:bg-white/10 sm:grid-cols-2">
                    <div>
                      <span className="text-xs text-muted-foreground">
                        Departamento
                      </span>
                      <p className="text-sm font-medium">
                        {selectedActa.departamento}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs text-muted-foreground">
                        Provincia
                      </span>
                      <p className="text-sm font-medium">
                        {selectedActa.provincia}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs text-muted-foreground">
                        Distrito
                      </span>
                      <p className="text-sm font-medium">
                        {selectedActa.distrito}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs text-muted-foreground">
                        Local de Votación
                      </span>
                      <p className="text-sm font-medium">
                        {selectedActa.localVotacion}
                      </p>
                    </div>
                  </div>
                </section>

                <Separator className="bg-[#FF6B00]/20" />

                {/* Datos del Acta */}
                <section>
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#1F1308] dark:text-orange-50">
                    <Calendar className="h-4 w-4 text-[#FF6B00]" />
                    Datos del Acta
                  </h4>

                  <div className="grid grid-cols-1 gap-3 rounded-lg border border-[#FF6B00]/15 bg-white p-4 dark:bg-white/10 sm:grid-cols-3">
                    <div>
                      <span className="text-xs text-muted-foreground">
                        N° Mesa
                      </span>
                      <p className="font-mono text-sm font-semibold text-[#FF6B00]">
                        {selectedActa.numeroMesa}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs text-muted-foreground">
                        <Calendar className="mr-1 inline h-3 w-3" />
                        Fecha
                      </span>
                      <p className="text-sm font-medium">
                        {selectedActa.fechaRegistro}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs text-muted-foreground">
                        <Clock className="mr-1 inline h-3 w-3" />
                        Hora
                      </span>
                      <p className="text-sm font-medium">
                        {selectedActa.horaRegistro}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <Badge
                      className={`${estadoColorMap[selectedActa.estadoValidacion]} px-3 py-1 text-sm`}
                    >
                      Estado: {estadoLabelMap[selectedActa.estadoValidacion]}
                    </Badge>
                  </div>
                </section>

                <Separator className="bg-[#FF6B00]/20" />

                {/* Imagen del Acta */}
                <section>
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#1F1308] dark:text-orange-50">
                    <ImageIcon className="h-4 w-4 text-[#FF6B00]" />
                    Imagen del Acta
                  </h4>

                  <div className="overflow-hidden rounded-lg border border-[#FF6B00]/20 bg-white p-3 dark:bg-white/10">
                    <img
                      src={ACTA_IMAGE_SRC}
                      alt={`Imagen del acta de la mesa ${selectedActa.numeroMesa}`}
                      className="h-auto max-h-[520px] w-full object-contain"
                    />
                  </div>
                </section>

                <Separator className="bg-[#FF6B00]/20" />

                {/* Votos por Partido */}
                <section>
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#1F1308] dark:text-orange-50">
                    <Vote className="h-4 w-4 text-[#FF6B00]" />
                    Votos por Partido
                  </h4>

                  <div className="space-y-4 rounded-lg border border-[#FF6B00]/15 bg-white p-4 dark:bg-white/10">
                    {partidosDetalle.map((vp) => (
                      <div key={vp.partidoId} className="space-y-1.5">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span
                              className="inline-block h-3.5 w-3.5 shrink-0 rounded-full"
                              style={{ backgroundColor: vp.partidoColor }}
                            />
                            <span className="text-sm font-semibold">
                              {vp.partidoNombre}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              ({vp.partidoSiglas})
                            </span>
                          </div>

                          <span
                            className="text-sm font-bold tabular-nums"
                            style={{ color: vp.partidoColor }}
                          >
                            {vp.votos.toLocaleString()}
                          </span>
                        </div>

                        <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#F3E3D4] dark:bg-white/10">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${(vp.votos / maxVotos) * 100}%`,
                              backgroundColor: vp.partidoColor,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <Separator className="bg-[#FF6B00]/20" />

                {/* Resumen */}
                <section>
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#1F1308] dark:text-orange-50">
                    <Vote className="h-4 w-4 text-[#FF6B00]" />
                    Resumen
                  </h4>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-lg border border-red-100 bg-red-50 p-4 text-center">
                      <span className="text-xs font-medium text-red-600">
                        Votos Nulos
                      </span>
                      <p className="mt-1 text-2xl font-bold text-red-700">
                        {selectedActa.votosNulos}
                      </p>
                    </div>

                    <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 text-center">
                      <span className="text-xs font-medium text-gray-600">
                        Votos en Blanco
                      </span>
                      <p className="mt-1 text-2xl font-bold text-gray-700">
                        {selectedActa.votosBlanco}
                      </p>
                    </div>

                    <div className="rounded-lg border border-[#FF6B00]/10 bg-white p-4 text-center dark:bg-white/10">
                      <span className="text-xs font-medium text-[#FF6B00]">
                        Total Votos
                      </span>
                      <p className="mt-1 text-2xl font-bold text-[#FF6B00]">
                        {selectedActa.totalVotos.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </section>
              </div>

              {/* Footer */}
              <DialogFooter className="border-t border-[#FF6B00]/20 bg-[#FF6B00]/10 p-6 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setDetailOpen(false)}
                  className="border-[#FF6B00]/30 bg-white text-[#1F1308] hover:bg-[#FFF1E6] dark:bg-white/10 dark:text-orange-50 dark:hover:bg-white/20"
                >
                  Cerrar
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}