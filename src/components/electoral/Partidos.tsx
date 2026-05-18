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
import { Separator } from '@/components/ui/separator'
import { Plus, Search, Edit, Trash2, Flag, Palette } from 'lucide-react'
import {
  type PartidoPolitico,
  type EstadoPartido,
} from '@/types/electoral'
import { partidosMock } from '@/data/mock'

const estadoBadgeClass: Record<EstadoPartido, string> = {
  activo: 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
  inactivo: 'bg-red-100 text-red-700 border-red-200 hover:bg-red-100',
}

const estadoLabels: Record<EstadoPartido, string> = {
  activo: 'Activo',
  inactivo: 'Inactivo',
}

interface PartidoFormData {
  nombre: string
  siglas: string
  color: string
  estado: EstadoPartido
}

const emptyForm: PartidoFormData = {
  nombre: '',
  siglas: '',
  color: '#FF6B00',
  estado: 'activo',
}

export default function Partidos() {
  const [partidos, setPartidos] = useState<PartidoPolitico[]>(partidosMock)
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<PartidoFormData>(emptyForm)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Filtered data
  const filteredPartidos = useMemo(() => {
    return partidos.filter((p) => {
      const matchesSearch =
        searchTerm === '' ||
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.siglas.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesSearch
    })
  }, [partidos, searchTerm])

  // Dialog handlers
  const openAddDialog = () => {
    setEditingId(null)
    setFormData(emptyForm)
    setIsDialogOpen(true)
  }

  const openEditDialog = (partido: PartidoPolitico) => {
    setEditingId(partido.id)
    setFormData({
      nombre: partido.nombre,
      siglas: partido.siglas,
      color: partido.color,
      estado: partido.estado,
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = () => {
    if (!formData.nombre || !formData.siglas) return

    if (editingId) {
      setPartidos((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? { ...p, nombre: formData.nombre, siglas: formData.siglas.toUpperCase(), color: formData.color, estado: formData.estado }
            : p
        )
      )
    } else {
      const newPartido: PartidoPolitico = {
        id: `p${Date.now()}`,
        nombre: formData.nombre,
        siglas: formData.siglas.toUpperCase(),
        logo: `/partidos/${formData.siglas.toLowerCase()}.png`,
        color: formData.color,
        estado: formData.estado,
      }
      setPartidos((prev) => [...prev, newPartido])
    }
    setIsDialogOpen(false)
    setFormData(emptyForm)
    setEditingId(null)
  }

  const handleDelete = () => {
    if (deleteId) {
      setPartidos((prev) => prev.filter((p) => p.id !== deleteId))
      setDeleteId(null)
    }
  }

  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      {/* Orange accent bar */}
      <div className="h-1.5 bg-gradient-to-r from-[#FF6B00] to-[#FF8C38]" />

      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FF6B00]/10">
              <Flag className="h-6 w-6 text-[#FF6B00]" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">
                Partidos Políticos
              </CardTitle>
              <CardDescription>
                Administra los partidos políticos del sistema electoral
              </CardDescription>
            </div>
          </div>
          <Button
            onClick={openAddDialog}
            className="bg-[#FF6B00] hover:bg-[#E55E00] text-white shadow-md shadow-[#FF6B00]/25 transition-all duration-200 hover:shadow-lg hover:shadow-[#FF6B00]/30"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Partido
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por nombre o siglas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 border-gray-200 focus:border-[#FF6B00] focus:ring-[#FF6B00]/20"
          />
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-500">
          {filteredPartidos.length} partido{filteredPartidos.length !== 1 ? 's' : ''} político{filteredPartidos.length !== 1 ? 's' : ''}
        </p>

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredPartidos.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-16 text-center text-gray-400"
              >
                No se encontraron partidos políticos
              </motion.div>
            ) : (
              filteredPartidos.map((partido, index) => (
                <motion.div
                  key={partido.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -15 }}
                  transition={{ duration: 0.25, delay: index * 0.05 }}
                >
                  <div className="group relative rounded-xl border border-gray-100 bg-white overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-300">
                    {/* Party color top bar */}
                    <div
                      className="h-2 transition-all duration-300 group-hover:h-2.5"
                      style={{ backgroundColor: partido.color }}
                    />

                    <div className="p-5">
                      <div className="flex items-start gap-4">
                        {/* Logo placeholder */}
                        <div
                          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-white font-bold text-lg shadow-md transition-transform duration-300 group-hover:scale-105"
                          style={{ backgroundColor: partido.color }}
                        >
                          {partido.siglas.slice(0, 2)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate text-base">
                            {partido.nombre}
                          </h3>
                          <p className="text-sm text-gray-500 mt-0.5">
                            {partido.siglas}
                          </p>
                        </div>
                      </div>

                      <Separator className="my-4 bg-gray-100" />

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {/* Color indicator */}
                          <div className="flex items-center gap-1.5">
                            <Palette className="h-3.5 w-3.5 text-gray-400" />
                            <div
                              className="h-4 w-4 rounded-full border border-gray-200 shadow-sm"
                              style={{ backgroundColor: partido.color }}
                            />
                            <span className="text-xs text-gray-500 font-mono">
                              {partido.color}
                            </span>
                          </div>
                        </div>

                        <Badge
                          variant="outline"
                          className={`${estadoBadgeClass[partido.estado]} text-xs font-medium`}
                        >
                          {estadoLabels[partido.estado]}
                        </Badge>
                      </div>

                      {/* Actions */}
                      <div className="flex justify-end gap-1 mt-3 pt-3 border-t border-gray-50">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-gray-500 hover:text-[#FF6B00] hover:bg-[#FF6B00]/10 gap-1.5"
                          onClick={() => openEditDialog(partido)}
                        >
                          <Edit className="h-3.5 w-3.5" />
                          Editar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-gray-500 hover:text-red-600 hover:bg-red-50 gap-1.5"
                          onClick={() => setDeleteId(partido.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </CardContent>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FF6B00]/10">
                <Flag className="h-4 w-4 text-[#FF6B00]" />
              </div>
              {editingId ? 'Editar Partido Político' : 'Nuevo Partido Político'}
            </DialogTitle>
            <DialogDescription>
              {editingId
                ? 'Modifica los datos del partido político'
                : 'Completa los datos para registrar un nuevo partido político'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            {/* Nombre del partido */}
            <div className="grid gap-2">
              <Label htmlFor="nombre" className="text-gray-700 font-medium">
                Nombre del Partido
              </Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData((prev) => ({ ...prev, nombre: e.target.value }))}
                placeholder="Ingrese el nombre del partido"
                className="border-gray-200 focus:border-[#FF6B00] focus:ring-[#FF6B00]/20"
              />
            </div>

            {/* Siglas */}
            <div className="grid gap-2">
              <Label htmlFor="siglas" className="text-gray-700 font-medium">
                Siglas
              </Label>
              <Input
                id="siglas"
                value={formData.siglas}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    siglas: e.target.value.toUpperCase(),
                  }))
                }
                placeholder="Ej: FP, PL, AP"
                className="border-gray-200 focus:border-[#FF6B00] focus:ring-[#FF6B00]/20 uppercase"
              />
            </div>

            {/* Color representativo */}
            <div className="grid gap-2">
              <Label className="text-gray-700 font-medium">
                Color Representativo
              </Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData((prev) => ({ ...prev, color: e.target.value }))}
                  className="h-10 w-14 cursor-pointer rounded-lg border border-gray-200 p-1"
                />
                <Input
                  value={formData.color}
                  onChange={(e) => setFormData((prev) => ({ ...prev, color: e.target.value }))}
                  placeholder="#FF6B00"
                  className="flex-1 border-gray-200 focus:border-[#FF6B00] focus:ring-[#FF6B00]/20 font-mono"
                />
                <div
                  className="h-10 w-10 rounded-lg border border-gray-200 shadow-sm shrink-0"
                  style={{ backgroundColor: formData.color }}
                />
              </div>
            </div>

            {/* Estado */}
            <div className="grid gap-2">
              <Label className="text-gray-700 font-medium">Estado</Label>
              <Select
                value={formData.estado}
                onValueChange={(val) =>
                  setFormData((prev) => ({ ...prev, estado: val as EstadoPartido }))
                }
              >
                <SelectTrigger className="border-gray-200 focus:border-[#FF6B00]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="border-gray-200"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-[#FF6B00] hover:bg-[#E55E00] text-white shadow-md shadow-[#FF6B00]/25"
            >
              {editingId ? 'Guardar Cambios' : 'Registrar Partido'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar Partido Político?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el partido político del
              sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-200">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
