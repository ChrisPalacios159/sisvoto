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
import { Label } from '@/components/ui/label';
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
import {
  Search,
  Plus,
  Eye,
  Hash,
  MapPin,
  Calendar,
  Filter,
} from 'lucide-react';
import {
  type MesaElectoral,
  type EstadoMesa,
  DEPARTAMENTOS,
  PROVINCIAS_POR_DEPARTAMENTO,
  DISTRITOS_POR_PROVINCIA,
  LOCALES_POR_DISTRITO,
} from '@/types/electoral';
import { mesasMock } from '@/data/mock';

const estadoMesaColorMap: Record<EstadoMesa, string> = {
  activa: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  cerrada: 'bg-gray-100 text-gray-700 border-gray-200',
  instalada: 'bg-blue-100 text-blue-800 border-blue-200',
};

const estadoMesaLabelMap: Record<EstadoMesa, string> = {
  activa: 'Activa',
  cerrada: 'Cerrada',
  instalada: 'Instalada',
};

interface NewMesaForm {
  numeroMesa: string;
  departamento: string;
  provincia: string;
  distrito: string;
  localVotacion: string;
}

const emptyForm: NewMesaForm = {
  numeroMesa: '',
  departamento: '',
  provincia: '',
  distrito: '',
  localVotacion: '',
};

export default function Mesas() {
  const [mesas, setMesas] = useState<MesaElectoral[]>(mesasMock);
  const [searchMesa, setSearchMesa] = useState('');
  const [filterDepartamento, setFilterDepartamento] = useState<string>('todos');
  const [filterEstado, setFilterEstado] = useState<string>('todos');
  const [selectedMesa, setSelectedMesa] = useState<MesaElectoral | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [form, setForm] = useState<NewMesaForm>(emptyForm);
  const [formError, setFormError] = useState<string>('');

  // Dependent selects
  const provincias =
    form.departamento && PROVINCIAS_POR_DEPARTAMENTO[form.departamento]
      ? PROVINCIAS_POR_DEPARTAMENTO[form.departamento]
      : [];
  const distritos =
    form.provincia && DISTRITOS_POR_PROVINCIA[form.provincia]
      ? DISTRITOS_POR_PROVINCIA[form.provincia]
      : [];
  const locales =
    form.distrito && LOCALES_POR_DISTRITO[form.distrito]
      ? LOCALES_POR_DISTRITO[form.distrito]
      : [];

  const filteredMesas = mesas.filter((mesa) => {
    const matchMesa = mesa.numeroMesa
      .toLowerCase()
      .includes(searchMesa.toLowerCase());
    const matchDepto =
      filterDepartamento === 'todos' ||
      mesa.departamento === filterDepartamento;
    const matchEstado =
      filterEstado === 'todos' || mesa.estado === filterEstado;
    return matchMesa && matchDepto && matchEstado;
  });

  const handleViewDetail = (mesa: MesaElectoral) => {
    setSelectedMesa(mesa);
    setDetailOpen(true);
  };

  const handleOpenAddDialog = () => {
    setForm(emptyForm);
    setFormError('');
    setAddDialogOpen(true);
  };

  const handleFormChange = (field: keyof NewMesaForm, value: string) => {
    // Reset dependent fields when parent changes
    if (field === 'departamento') {
      setForm((prev) => ({
        ...prev,
        departamento: value,
        provincia: '',
        distrito: '',
        localVotacion: '',
      }));
    } else if (field === 'provincia') {
      setForm((prev) => ({
        ...prev,
        provincia: value,
        distrito: '',
        localVotacion: '',
      }));
    } else if (field === 'distrito') {
      setForm((prev) => ({
        ...prev,
        distrito: value,
        localVotacion: '',
      }));
    } else {
      setForm((prev) => ({ ...prev, [field]: value }));
    }
    setFormError('');
  };

  const handleAddMesa = () => {
    // Validate all fields
    if (!form.numeroMesa.trim()) {
      setFormError('El número de mesa es obligatorio');
      return;
    }
    if (!form.departamento) {
      setFormError('Seleccione un departamento');
      return;
    }
    if (!form.provincia) {
      setFormError('Seleccione una provincia');
      return;
    }
    if (!form.distrito) {
      setFormError('Seleccione un distrito');
      return;
    }
    if (!form.localVotacion) {
      setFormError('Seleccione un local de votación');
      return;
    }

    // Check unique mesa number
    const mesaNumber = form.numeroMesa.trim().padStart(6, '0');
    if (mesas.some((m) => m.numeroMesa === mesaNumber)) {
      setFormError('Ya existe una mesa con ese número');
      return;
    }

    const newMesa: MesaElectoral = {
      id: `m${Date.now()}`,
      numeroMesa: mesaNumber,
      departamento: form.departamento,
      provincia: form.provincia,
      distrito: form.distrito,
      localVotacion: form.localVotacion,
      estado: 'activa',
      fechaRegistro: new Date().toISOString(),
    };

    setMesas((prev) => [newMesa, ...prev]);
    setAddDialogOpen(false);
    setForm(emptyForm);
    setFormError('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FF6B00]/10">
            <Hash className="h-5 w-5 text-[#FF6B00]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Mesas Electorales
            </h2>
            <p className="text-sm text-muted-foreground">
              Gestión de mesas de sufragio
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant="secondary"
            className="bg-[#FF6B00]/10 text-[#FF6B00] border-[#FF6B00]/20 text-sm px-3 py-1"
          >
            {mesas.length} mesas
          </Badge>
          <Button
            onClick={handleOpenAddDialog}
            className="bg-[#FF6B00] hover:bg-[#E05500] text-white gap-2"
          >
            <Plus className="h-4 w-4" />
            Nueva Mesa
          </Button>
        </div>
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
            <Select value={filterDepartamento} onValueChange={setFilterDepartamento}>
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
            <Select value={filterEstado} onValueChange={setFilterEstado}>
              <SelectTrigger className="w-full sm:w-[180px] border-border/60 focus:border-[#FF6B00]">
                <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="activa">Activa</SelectItem>
                <SelectItem value="cerrada">Cerrada</SelectItem>
                <SelectItem value="instalada">Instalada</SelectItem>
              </SelectContent>
            </Select>
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
                    Estado
                  </TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider">
                    Fecha Registro
                  </TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider text-center">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMesas.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="h-32 text-center text-muted-foreground"
                    >
                      No se encontraron mesas con los filtros aplicados
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMesas.map((mesa) => (
                    <TableRow
                      key={mesa.id}
                      className="border-b border-border/30 hover:bg-[#FF6B00]/5 transition-colors cursor-pointer"
                      onClick={() => handleViewDetail(mesa)}
                    >
                      <TableCell className="font-mono font-semibold text-[#FF6B00]">
                        {mesa.numeroMesa}
                      </TableCell>
                      <TableCell>{mesa.departamento}</TableCell>
                      <TableCell>{mesa.provincia}</TableCell>
                      <TableCell>{mesa.distrito}</TableCell>
                      <TableCell className="max-w-[180px] truncate">
                        {mesa.localVotacion}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${estadoMesaColorMap[mesa.estado]} text-xs`}
                        >
                          {estadoMesaLabelMap[mesa.estado]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs">
                          {new Date(mesa.fechaRegistro).toLocaleDateString('es-PE')}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-[#FF6B00] hover:bg-[#FF6B00]/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetail(mesa);
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
          {filteredMesas.length > 0 && (
            <div className="px-4 py-3 border-t border-border/30 text-xs text-muted-foreground">
              Mostrando {filteredMesas.length} de {mesas.length} mesas
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Mesa Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-[#FF6B00]" />
              Registrar Nueva Mesa
            </DialogTitle>
            <DialogDescription>
              Complete los datos para registrar una nueva mesa electoral
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="numeroMesa" className="text-sm font-medium">
                Número de Mesa
              </Label>
              <Input
                id="numeroMesa"
                placeholder="Ej: 000021"
                value={form.numeroMesa}
                onChange={(e) =>
                  handleFormChange('numeroMesa', e.target.value)
                }
                className="border-border/60 focus:border-[#FF6B00] focus:ring-[#FF6B00]/20 font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Departamento</Label>
              <Select
                value={form.departamento}
                onValueChange={(v) => handleFormChange('departamento', v)}
              >
                <SelectTrigger className="border-border/60 focus:border-[#FF6B00]">
                  <SelectValue placeholder="Seleccionar departamento" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTAMENTOS.map((depto) => (
                    <SelectItem key={depto} value={depto}>
                      {depto}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Provincia</Label>
              <Select
                value={form.provincia}
                onValueChange={(v) => handleFormChange('provincia', v)}
                disabled={!form.departamento}
              >
                <SelectTrigger className="border-border/60 focus:border-[#FF6B00]">
                  <SelectValue
                    placeholder={
                      form.departamento
                        ? 'Seleccionar provincia'
                        : 'Primero seleccione departamento'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {provincias.map((prov) => (
                    <SelectItem key={prov} value={prov}>
                      {prov}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Distrito</Label>
              <Select
                value={form.distrito}
                onValueChange={(v) => handleFormChange('distrito', v)}
                disabled={!form.provincia}
              >
                <SelectTrigger className="border-border/60 focus:border-[#FF6B00]">
                  <SelectValue
                    placeholder={
                      form.provincia
                        ? 'Seleccionar distrito'
                        : 'Primero seleccione provincia'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {distritos.map((dist) => (
                    <SelectItem key={dist} value={dist}>
                      {dist}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Local de Votación</Label>
              <Select
                value={form.localVotacion}
                onValueChange={(v) => handleFormChange('localVotacion', v)}
                disabled={!form.distrito}
              >
                <SelectTrigger className="border-border/60 focus:border-[#FF6B00]">
                  <SelectValue
                    placeholder={
                      form.distrito
                        ? 'Seleccionar local'
                        : 'Primero seleccione distrito'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {locales.map((local) => (
                    <SelectItem key={local} value={local}>
                      {local}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formError && (
              <div className="bg-red-50 border border-red-200 rounded-md px-3 py-2 text-sm text-red-700">
                {formError}
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setAddDialogOpen(false)}
              className="border-border/60"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAddMesa}
              className="bg-[#FF6B00] hover:bg-[#E05500] text-white"
            >
              Registrar Mesa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-lg">
          {selectedMesa && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Hash className="h-5 w-5 text-[#FF6B00]" />
                  Mesa Electoral {selectedMesa.numeroMesa}
                </DialogTitle>
                <DialogDescription>
                  Detalle de la mesa electoral
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-5 py-2">
                {/* Mesa Number & Status */}
                <div className="flex items-center justify-between bg-muted/30 rounded-lg p-4">
                  <div>
                    <span className="text-xs text-muted-foreground">
                      Número de Mesa
                    </span>
                    <p className="text-2xl font-bold font-mono text-[#FF6B00]">
                      {selectedMesa.numeroMesa}
                    </p>
                  </div>
                  <Badge
                    className={`${estadoMesaColorMap[selectedMesa.estado]} text-sm px-3 py-1`}
                  >
                    {estadoMesaLabelMap[selectedMesa.estado]}
                  </Badge>
                </div>

                {/* Location */}
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-semibold mb-3 text-foreground">
                    <MapPin className="h-4 w-4 text-[#FF6B00]" />
                    Ubicación
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-xs text-muted-foreground">
                        Departamento
                      </span>
                      <p className="text-sm font-medium">
                        {selectedMesa.departamento}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">
                        Provincia
                      </span>
                      <p className="text-sm font-medium">
                        {selectedMesa.provincia}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-xs text-muted-foreground">
                        Distrito
                      </span>
                      <p className="text-sm font-medium">
                        {selectedMesa.distrito}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-xs text-muted-foreground">
                        Local de Votación
                      </span>
                      <p className="text-sm font-medium">
                        {selectedMesa.localVotacion}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Registration date */}
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-semibold mb-3 text-foreground">
                    <Calendar className="h-4 w-4 text-[#FF6B00]" />
                    Fecha de Registro
                  </h4>
                  <p className="text-sm font-medium">
                    {new Date(selectedMesa.fechaRegistro).toLocaleDateString(
                      'es-PE',
                      {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      }
                    )}
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDetailOpen(false)}
                  className="border-border/60"
                >
                  Cerrar
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
