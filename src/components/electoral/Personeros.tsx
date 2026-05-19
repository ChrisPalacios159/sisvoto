'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Plus, Search, Edit, Trash2, Users, Filter } from 'lucide-react'
import {
  type Personero,
  type EstadoPersonero,
  DEPARTAMENTOS,
  PROVINCIAS_POR_DEPARTAMENTO,
  DISTRITOS_POR_PROVINCIA,
} from '@/types/electoral'
import { personerosMock } from '@/data/mock'

const ITEMS_PER_PAGE = 8

const estadoBadgeVariant: Record<
  EstadoPersonero,
  'default' | 'secondary' | 'outline'
> = {
  activo: 'default',
  inactivo: 'secondary',
  pendiente: 'outline',
}

const estadoBadgeClass: Record<EstadoPersonero, string> = {
  activo:
    'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
  inactivo: 'bg-red-100 text-red-700 border-red-200 hover:bg-red-100',
  pendiente: 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100',
}

const estadoLabels: Record<EstadoPersonero, string> = {
  activo: 'Activo',
  inactivo: 'Inactivo',
  pendiente: 'Pendiente',
}

interface PersoneroFormData {
  nombreCompleto: string
  dni: string
  celular: string
  correo: string
  departamento: string
  provincia: string
  distrito: string
  estado: EstadoPersonero
}

const emptyForm: PersoneroFormData = {
  nombreCompleto: '',
  dni: '',
  celular: '',
  correo: '',
  departamento: '',
  provincia: '',
  distrito: '',
  estado: 'pendiente',
}

export default function Personeros() {
  const [personeros, setPersoneros] = useState<Personero[]>(personerosMock)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDepartamento, setFilterDepartamento] = useState<string>('all')
  const [filterEstado, setFilterEstado] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<PersoneroFormData>(emptyForm)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filteredPersoneros = useMemo(() => {
    return personeros.filter((p) => {
      const matchesSearch =
        searchTerm === '' ||
        p.nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.dni.includes(searchTerm)

      const matchesDepto =
        filterDepartamento === 'all' || p.departamento === filterDepartamento

      const matchesEstado = filterEstado === 'all' || p.estado === filterEstado

      return matchesSearch && matchesDepto && matchesEstado
    })
  }, [personeros, searchTerm, filterDepartamento, filterEstado])

  const totalPages = Math.ceil(filteredPersoneros.length / ITEMS_PER_PAGE)

  const paginatedPersoneros = filteredPersoneros.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleFilterDeptoChange = (value: string) => {
    setFilterDepartamento(value)
    setCurrentPage(1)
  }

  const handleFilterEstadoChange = (value: string) => {
    setFilterEstado(value)
    setCurrentPage(1)
  }

  const openAddDialog = () => {
    setEditingId(null)
    setFormData(emptyForm)
    setIsDialogOpen(true)
  }

  const openEditDialog = (personero: Personero) => {
    setEditingId(personero.id)
    setFormData({
      nombreCompleto: personero.nombreCompleto,
      dni: personero.dni,
      celular: personero.celular,
      correo: personero.correo,
      departamento: personero.departamento,
      provincia: personero.provincia,
      distrito: personero.distrito,
      estado: personero.estado,
    })
    setIsDialogOpen(true)
  }

  const handleDepartamentoChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      departamento: value,
      provincia: '',
      distrito: '',
    }))
  }

  const handleProvinciaChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      provincia: value,
      distrito: '',
    }))
  }

  const handleSubmit = () => {
    if (
      !formData.nombreCompleto ||
      !formData.dni ||
      !formData.celular ||
      !formData.correo
    ) {
      return
    }

    if (editingId) {
      setPersoneros((prev) =>
        prev.map((p) => (p.id === editingId ? { ...p, ...formData } : p))
      )
    } else {
      const newPersonero: Personero = {
        id: `per${Date.now()}`,
        ...formData,
        fechaRegistro: new Date().toISOString(),
      }

      setPersoneros((prev) => [...prev, newPersonero])
    }

    setIsDialogOpen(false)
    setFormData(emptyForm)
    setEditingId(null)
  }

  const handleDelete = () => {
    if (deleteId) {
      setPersoneros((prev) => prev.filter((p) => p.id !== deleteId))
      setDeleteId(null)
    }
  }

  const availableProvincias = formData.departamento
    ? PROVINCIAS_POR_DEPARTAMENTO[formData.departamento] || []
    : []

  const availableDistritos = formData.provincia
    ? DISTRITOS_POR_PROVINCIA[formData.provincia] || []
    : []

  const getPageNumbers = () => {
    const pages: number[] = []

    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }

    return pages
  }

  return (
    <Card className="overflow-hidden border-0 shadow-lg">
      {/* Orange accent bar */}
      <div className="h-1.5 bg-gradient-to-r from-[#FF6B00] to-[#FF8C38]" />

      <CardHeader className="pb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FF6B00]/10">
              <Users className="h-6 w-6 text-[#FF6B00]" />
            </div>

            <div>
              <CardTitle className="text-xl font-bold text-gray-900">
                Gestión de Personeros
              </CardTitle>
              <CardDescription>
                Administra los personeros electorales registrados
              </CardDescription>
            </div>
          </div>

          <Button
            onClick={openAddDialog}
            className="bg-[#FF6B00] text-white shadow-md shadow-[#FF6B00]/25 transition-all duration-200 hover:bg-[#E55E00] hover:shadow-lg hover:shadow-[#FF6B00]/30"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Personero
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search & Filter Bar */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Buscar por nombre o DNI..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="border-gray-200 pl-9 focus:border-[#FF6B00] focus:ring-[#FF6B00]/20"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex items-center gap-2">
              <Filter className="hidden h-4 w-4 text-gray-400 sm:block" />
              <Select
                value={filterDepartamento}
                onValueChange={handleFilterDeptoChange}
              >
                <SelectTrigger className="w-[160px] border-gray-200 focus:border-[#FF6B00]">
                  <SelectValue placeholder="Departamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {DEPARTAMENTOS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Select
              value={filterEstado}
              onValueChange={handleFilterEstadoChange}
            >
              <SelectTrigger className="w-[140px] border-gray-200 focus:border-[#FF6B00]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="inactivo">Inactivo</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {filteredPersoneros.length} personero
            {filteredPersoneros.length !== 1 ? 's' : ''} encontrado
            {filteredPersoneros.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-gray-100">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
                  <TableHead className="font-semibold text-gray-700">
                    Nombre Completo
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    DNI
                  </TableHead>
                  <TableHead className="hidden font-semibold text-gray-700 md:table-cell">
                    Celular
                  </TableHead>
                  <TableHead className="hidden font-semibold text-gray-700 lg:table-cell">
                    Correo
                  </TableHead>
                  <TableHead className="hidden font-semibold text-gray-700 sm:table-cell">
                    Ubicación
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Estado
                  </TableHead>
                  <TableHead className="text-right font-semibold text-gray-700">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                <AnimatePresence mode="popLayout">
                  {paginatedPersoneros.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="h-32 text-center text-gray-400"
                      >
                        No se encontraron personeros
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedPersoneros.map((personero, index) => (
                      <motion.tr
                        key={personero.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2, delay: index * 0.03 }}
                        className="border-b border-gray-50 transition-colors hover:bg-orange-50/30"
                      >
                        <TableCell className="font-medium text-gray-900">
                          {personero.nombreCompleto}
                        </TableCell>

                        <TableCell className="font-mono text-sm text-gray-600">
                          {personero.dni}
                        </TableCell>

                        <TableCell className="hidden text-gray-600 md:table-cell">
                          {personero.celular}
                        </TableCell>

                        <TableCell className="hidden text-sm text-gray-600 lg:table-cell">
                          {personero.correo}
                        </TableCell>

                        <TableCell className="hidden text-sm text-gray-600 sm:table-cell">
                          <div>
                            <div>{personero.departamento}</div>
                            <div className="text-xs text-gray-400">
                              {personero.provincia} / {personero.distrito}
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <Badge
                            variant={estadoBadgeVariant[personero.estado]}
                            className={`${estadoBadgeClass[personero.estado]} text-xs font-medium`}
                          >
                            {estadoLabels[personero.estado]}
                          </Badge>
                        </TableCell>

                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-500 hover:bg-[#FF6B00]/10 hover:text-[#FF6B00]"
                              onClick={() => openEditDialog(personero)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-500 hover:bg-red-50 hover:text-red-600"
                              onClick={() => setDeleteId(personero.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center pt-2">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage > 1) {
                        setCurrentPage((prev) => prev - 1)
                      }
                    }}
                    className={
                      currentPage === 1
                        ? 'pointer-events-none opacity-50'
                        : 'cursor-pointer hover:text-[#FF6B00]'
                    }
                  />
                </PaginationItem>

                {getPageNumbers().map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        setCurrentPage(page)
                      }}
                      isActive={currentPage === page}
                      className={`cursor-pointer ${
                        currentPage === page
                          ? 'border-[#FF6B00] bg-[#FF6B00] text-white hover:bg-[#E55E00]'
                          : 'hover:text-[#FF6B00]'
                      }`}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage < totalPages) {
                        setCurrentPage((prev) => prev + 1)
                      }
                    }}
                    className={
                      currentPage === totalPages
                        ? 'pointer-events-none opacity-50'
                        : 'cursor-pointer hover:text-[#FF6B00]'
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border border-[#FF6B00]/30 bg-[#FFF7ED] text-[#1F1308] shadow-2xl dark:bg-[#1A0D06] dark:text-orange-50 sm:max-w-[540px]">
          <DialogHeader className="rounded-lg border border-[#FF6B00]/15 bg-white p-4 dark:bg-white/10">
            <DialogTitle className="flex items-center gap-2 text-[#1F1308] dark:text-orange-50">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FF6B00]/10">
                <Users className="h-4 w-4 text-[#FF6B00]" />
              </div>
              {editingId ? 'Editar Personero' : 'Nuevo Personero'}
            </DialogTitle>

            <DialogDescription className="text-[#6B4A2B] dark:text-orange-100/70">
              {editingId
                ? 'Modifica los datos del personero electoral'
                : 'Completa los datos para registrar un nuevo personero'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 rounded-lg border border-[#FF6B00]/15 bg-white p-4 dark:bg-white/10">
            {/* Nombre completo */}
            <div className="grid gap-2">
              <Label
                htmlFor="nombreCompleto"
                className="font-medium text-gray-700 dark:text-orange-50"
              >
                Nombre Completo
              </Label>
              <Input
                id="nombreCompleto"
                value={formData.nombreCompleto}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    nombreCompleto: e.target.value,
                  }))
                }
                placeholder="Ingrese el nombre completo"
                className="border-gray-200 bg-white focus:border-[#FF6B00] focus:ring-[#FF6B00]/20 dark:bg-white/10"
              />
            </div>

            {/* DNI & Celular */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label
                  htmlFor="dni"
                  className="font-medium text-gray-700 dark:text-orange-50"
                >
                  DNI
                </Label>
                <Input
                  id="dni"
                  value={formData.dni}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 8)
                    setFormData((prev) => ({ ...prev, dni: val }))
                  }}
                  placeholder="8 dígitos"
                  maxLength={8}
                  className="border-gray-200 bg-white focus:border-[#FF6B00] focus:ring-[#FF6B00]/20 dark:bg-white/10"
                />
              </div>

              <div className="grid gap-2">
                <Label
                  htmlFor="celular"
                  className="font-medium text-gray-700 dark:text-orange-50"
                >
                  Celular
                </Label>
                <Input
                  id="celular"
                  value={formData.celular}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 9)
                    setFormData((prev) => ({ ...prev, celular: val }))
                  }}
                  placeholder="9 dígitos"
                  maxLength={9}
                  className="border-gray-200 bg-white focus:border-[#FF6B00] focus:ring-[#FF6B00]/20 dark:bg-white/10"
                />
              </div>
            </div>

            {/* Correo */}
            <div className="grid gap-2">
              <Label
                htmlFor="correo"
                className="font-medium text-gray-700 dark:text-orange-50"
              >
                Correo Electrónico
              </Label>
              <Input
                id="correo"
                type="email"
                value={formData.correo}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    correo: e.target.value,
                  }))
                }
                placeholder="correo@ejemplo.com"
                className="border-gray-200 bg-white focus:border-[#FF6B00] focus:ring-[#FF6B00]/20 dark:bg-white/10"
              />
            </div>

            {/* Departamento */}
            <div className="grid gap-2">
              <Label className="font-medium text-gray-700 dark:text-orange-50">
                Departamento
              </Label>
              <Select
                value={formData.departamento}
                onValueChange={handleDepartamentoChange}
              >
                <SelectTrigger className="border-gray-200 bg-white focus:border-[#FF6B00] dark:bg-white/10">
                  <SelectValue placeholder="Seleccione departamento" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTAMENTOS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Provincia & Distrito */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="font-medium text-gray-700 dark:text-orange-50">
                  Provincia
                </Label>
                <Select
                  value={formData.provincia}
                  onValueChange={handleProvinciaChange}
                  disabled={!formData.departamento}
                >
                  <SelectTrigger className="border-gray-200 bg-white focus:border-[#FF6B00] dark:bg-white/10">
                    <SelectValue placeholder="Seleccione provincia" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableProvincias.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label className="font-medium text-gray-700 dark:text-orange-50">
                  Distrito
                </Label>
                <Select
                  value={formData.distrito}
                  onValueChange={(val) =>
                    setFormData((prev) => ({ ...prev, distrito: val }))
                  }
                  disabled={!formData.provincia}
                >
                  <SelectTrigger className="border-gray-200 bg-white focus:border-[#FF6B00] dark:bg-white/10">
                    <SelectValue placeholder="Seleccione distrito" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDistritos.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Estado */}
            <div className="grid gap-2">
              <Label className="font-medium text-gray-700 dark:text-orange-50">
                Estado
              </Label>
              <Select
                value={formData.estado}
                onValueChange={(val) =>
                  setFormData((prev) => ({
                    ...prev,
                    estado: val as EstadoPersonero,
                  }))
                }
              >
                <SelectTrigger className="border-gray-200 bg-white focus:border-[#FF6B00] dark:bg-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="rounded-lg border border-[#FF6B00]/15 bg-white p-4 dark:bg-white/10">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="border-[#FF6B00]/30 bg-white hover:bg-[#FFF1E6] dark:bg-white/10 dark:hover:bg-white/20"
            >
              Cancelar
            </Button>

            <Button
              onClick={handleSubmit}
              className="bg-[#FF6B00] text-white shadow-md shadow-[#FF6B00]/25 hover:bg-[#E55E00]"
            >
              {editingId ? 'Guardar Cambios' : 'Registrar Personero'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent className="border border-[#FF6B00]/30 bg-[#FFF7ED] text-[#1F1308] shadow-2xl dark:bg-[#1A0D06] dark:text-orange-50">
          <AlertDialogHeader className="rounded-lg border border-[#FF6B00]/15 bg-white p-4 dark:bg-white/10">
            <AlertDialogTitle className="text-[#1F1308] dark:text-orange-50">
              ¿Eliminar Personero?
            </AlertDialogTitle>

            <AlertDialogDescription className="text-[#6B4A2B] dark:text-orange-100/70">
              Esta acción no se puede deshacer. Se eliminará permanentemente el
              registro del personero del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="rounded-lg border border-[#FF6B00]/15 bg-white p-4 dark:bg-white/10">
            <AlertDialogCancel className="border-[#FF6B00]/30 bg-white hover:bg-[#FFF1E6] dark:bg-white/10 dark:hover:bg-white/20">
              Cancelar
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}