'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
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

  const maxVotos = selectedActa
    ? Math.max(...selectedActa.votosPorPartido.map((v) => v.votos))
    : 0;

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
          className="w-fit bg-[#FF6B00]/10 text-[#FF6B00] border-[#FF6B00]/20 text-sm px-3 py-1"
        >
          {actasMock.length} actas registradas
        </Badge>
      </div>

      {/* Search and Filters */}
      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por número de mesa..."
                value={searchMesa}
                onChange={(e) => setSearchMesa(e.target.value)}
                className="pl-9 border-border/60 focus:border-[#FF6B00] focus:ring-[#FF6B00]/20"
              />
            </div>
            <Select value={filterEstado} onValueChange={setFilterEstado}>
              <SelectTrigger className="w-full sm:w-[200px] border-border/60 focus:border-[#FF6B00]">
                <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="validada">Validada</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="observada">Observada</SelectItem>
                <SelectItem value="rechazada">Rechazada</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filterDepartamento}
              onValueChange={setFilterDepartamento}
            >
              <SelectTrigger className="w-full sm:w-[200px] border-border/60 focus:border-[#FF6B00]">
                <SelectValue placeholder="Departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los departamentos</SelectItem>
                {DEPARTAMENTOS.map((depto) => (
                  <SelectItem key={depto} value={depto}>
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
                className="h-10 w-10 shrink-0 text-muted-foreground hover:text-[#FF6B00]"
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
                  <TableHead className="font-semibold text-xs uppercase tracking-wider">
                    N° Mesa
                  </TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider">
                    Personero
                  </TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider">
                    Departamento
                  </TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider">
                    Provincia
                  </TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider">
                    Distrito
                  </TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider">
                    Local de Votación
                  </TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider">
                    Fecha/Hora
                  </TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider text-right">
                    Total Votos
                  </TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider">
                    Estado
                  </TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider text-center">
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
                      className="border-b border-border/30 hover:bg-[#FF6B00]/5 transition-colors cursor-pointer"
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
            <div className="px-4 py-3 border-t border-border/30 text-xs text-muted-foreground">
              Mostrando {filteredActas.length} de {actasMock.length} actas
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail View - Dialog for desktop, Sheet for mobile */}
      {/* We use Dialog as the primary, with responsive sizing */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar p-0">
          {selectedActa && (
            <div className="space-y-0">
              {/* Dialog Header */}
              <DialogHeader className="p-6 pb-4 border-b border-border/30">
                <DialogTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5 text-[#FF6B00]" />
                  Acta - Mesa {selectedActa.numeroMesa}
                </DialogTitle>
                <DialogDescription>
                  Detalle completo del acta electoral
                </DialogDescription>
              </DialogHeader>

              <div className="p-6 space-y-6">
                {/* Datos del Personero */}
                <section>
                  <h4 className="flex items-center gap-2 text-sm font-semibold mb-3 text-foreground">
                    <User className="h-4 w-4 text-[#FF6B00]" />
                    Datos del Personero
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-muted/30 rounded-lg p-4">
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
                            <p className="text-sm font-medium font-mono">
                              {personero.dni}
                            </p>
                          </div>
                          <div>
                            <span className="text-xs text-muted-foreground">
                              Celular
                            </span>
                            <p className="text-sm font-medium font-mono">
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
                        <p className="text-sm text-muted-foreground col-span-2">
                          {selectedActa.personeroNombre}
                        </p>
                      );
                    })()}
                  </div>
                </section>

                <Separator className="bg-border/40" />

                {/* Ubicación */}
                <section>
                  <h4 className="flex items-center gap-2 text-sm font-semibold mb-3 text-foreground">
                    <MapPin className="h-4 w-4 text-[#FF6B00]" />
                    Ubicación
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-muted/30 rounded-lg p-4">
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

                <Separator className="bg-border/40" />

                {/* Datos del Acta */}
                <section>
                  <h4 className="flex items-center gap-2 text-sm font-semibold mb-3 text-foreground">
                    <Calendar className="h-4 w-4 text-[#FF6B00]" />
                    Datos del Acta
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-muted/30 rounded-lg p-4">
                    <div>
                      <span className="text-xs text-muted-foreground">
                        N° Mesa
                      </span>
                      <p className="text-sm font-semibold font-mono text-[#FF6B00]">
                        {selectedActa.numeroMesa}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">
                        <Calendar className="inline h-3 w-3 mr-1" />
                        Fecha
                      </span>
                      <p className="text-sm font-medium">
                        {selectedActa.fechaRegistro}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">
                        <Clock className="inline h-3 w-3 mr-1" />
                        Hora
                      </span>
                      <p className="text-sm font-medium">
                        {selectedActa.horaRegistro}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Badge
                      className={`${estadoColorMap[selectedActa.estadoValidacion]} text-sm px-3 py-1`}
                    >
                      Estado: {estadoLabelMap[selectedActa.estadoValidacion]}
                    </Badge>
                  </div>
                </section>

                <Separator className="bg-border/40" />

                {/* Imagen del Acta */}
                <section>
                  <h4 className="flex items-center gap-2 text-sm font-semibold mb-3 text-foreground">
                    <ImageIcon className="h-4 w-4 text-[#FF6B00]" />
                    Imagen del Acta
                  </h4>
                  <div className="bg-muted/30 rounded-lg p-8 flex flex-col items-center justify-center border-2 border-dashed border-border/50">
                    <ImageIcon className="h-12 w-12 text-muted-foreground/40 mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Vista previa no disponible
                    </p>
                    <p className="text-xs text-muted-foreground/60">
                      {selectedActa.imagenActa}
                    </p>
                  </div>
                </section>

                <Separator className="bg-border/40" />

                {/* Votos por Partido */}
                <section>
                  <h4 className="flex items-center gap-2 text-sm font-semibold mb-3 text-foreground">
                    <Vote className="h-4 w-4 text-[#FF6B00]" />
                    Votos por Partido
                  </h4>
                  <div className="space-y-3">
                    {selectedActa.votosPorPartido.map((vp) => (
                      <div key={vp.partidoId} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className="inline-block h-3 w-3 rounded-full shrink-0"
                              style={{ backgroundColor: vp.partidoColor }}
                            />
                            <span className="text-sm font-medium">
                              {vp.partidoNombre}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              ({vp.partidoSiglas})
                            </span>
                          </div>
                          <span className="text-sm font-semibold tabular-nums">
                            {vp.votos.toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-muted/50 rounded-full overflow-hidden">
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

                <Separator className="bg-border/40" />

                {/* Resumen */}
                <section>
                  <h4 className="flex items-center gap-2 text-sm font-semibold mb-3 text-foreground">
                    <Vote className="h-4 w-4 text-[#FF6B00]" />
                    Resumen
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-red-50 border border-red-100 rounded-lg p-4 text-center">
                      <span className="text-xs text-red-600 font-medium">
                        Votos Nulos
                      </span>
                      <p className="text-2xl font-bold text-red-700 mt-1">
                        {selectedActa.votosNulos}
                      </p>
                    </div>
                    <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 text-center">
                      <span className="text-xs text-gray-600 font-medium">
                        Votos en Blanco
                      </span>
                      <p className="text-2xl font-bold text-gray-700 mt-1">
                        {selectedActa.votosBlanco}
                      </p>
                    </div>
                    <div className="bg-[#FF6B00]/5 border border-[#FF6B00]/10 rounded-lg p-4 text-center">
                      <span className="text-xs text-[#FF6B00] font-medium">
                        Total Votos
                      </span>
                      <p className="text-2xl font-bold text-[#FF6B00] mt-1">
                        {selectedActa.totalVotos.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </section>
              </div>

              {/* Footer */}
              <DialogFooter className="p-6 pt-4 border-t border-border/30">
                <Button
                  variant="outline"
                  onClick={() => setDetailOpen(false)}
                  className="border-border/60"
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
