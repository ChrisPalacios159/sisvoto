'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Settings, User, Shield, Bell, Lock, Save, Calendar } from 'lucide-react'

export default function Configuracion() {
  // ===== Profile state =====
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [adminName, setAdminName] = useState('Administrador General')
  const [adminEmail, setAdminEmail] = useState('admin@elecciones2026.gob.pe')

  // ===== Election config state =====
  const [nombreProceso, setNombreProceso] = useState('Elecciones Generales 2026')
  const [fechaEleccion, setFechaEleccion] = useState('2026-04-10')
  const [horaInicio, setHoraInicio] = useState('08:00')
  const [horaCierre, setHoraCierre] = useState('16:00')
  const [estadoProceso, setEstadoProceso] = useState('preparacion')

  // ===== Notifications state =====
  const [alertasObservadas, setAlertasObservadas] = useState(true)
  const [notificarNuevasActas, setNotificarNuevasActas] = useState(true)
  const [alertasInactivos, setAlertasInactivos] = useState(false)

  // ===== Security state =====
  const [forzarCambioClave, setForzarCambioClave] = useState(true)
  const [tiempoSesion, setTiempoSesion] = useState('30min')
  const [dobleFactor, setDobleFactor] = useState(false)

  const handleSave = () => {
    alert('✅ Configuración guardada exitosamente')
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
  }

  const estadoProcesoLabels: Record<string, string> = {
    preparacion: 'Preparación',
    en_curso: 'En Curso',
    finalizado: 'Finalizado',
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
          Configuración del Sistema
        </h2>
        <p className="text-muted-foreground mt-1">
          Administra la configuración general del sistema electoral
        </p>
      </div>

      {/* ===== Perfil del Administrador ===== */}
      <Card className="shadow-sm hover:shadow-md transition-shadow overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-[#FF6B00] to-[#FF8C38]" />
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#FF6B00]/10 flex items-center justify-center">
              <User className="h-5 w-5 text-[#FF6B00]" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Perfil del Administrador
              </CardTitle>
              <CardDescription>Información de la cuenta de administrador</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <Avatar className="h-20 w-20 text-xl font-bold border-4 border-[#FF6B00]/20">
              <AvatarFallback className="bg-[#FF6B00] text-white text-lg font-bold">
                {getInitials(adminName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4 w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-name" className="text-sm font-medium text-gray-700">
                    Nombre completo
                  </Label>
                  <Input
                    id="admin-name"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    disabled={!isEditingProfile}
                    className={!isEditingProfile ? 'bg-gray-50 text-gray-600' : ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-email" className="text-sm font-medium text-gray-700">
                    Correo electrónico
                  </Label>
                  <Input
                    id="admin-email"
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    disabled={!isEditingProfile}
                    className={!isEditingProfile ? 'bg-gray-50 text-gray-600' : ''}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-password" className="text-sm font-medium text-gray-700">
                    Contraseña actual
                  </Label>
                  <Input
                    id="admin-password"
                    type="password"
                    value="••••••••"
                    disabled
                    className="bg-gray-50 text-gray-600"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    className="w-full border-[#FF6B00]/30 text-[#FF6B00] hover:bg-[#FF6B00]/5 hover:border-[#FF6B00]"
                  >
                    {isEditingProfile ? 'Cancelar edición' : 'Editar perfil'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ===== Configuración de Elecciones ===== */}
      <Card className="shadow-sm hover:shadow-md transition-shadow overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-[#FF6B00] to-[#FF8C38]" />
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#FF6B00]/10 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-[#FF6B00]" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Configuración de Elecciones
              </CardTitle>
              <CardDescription>Parámetros del proceso electoral actual</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="nombre-proceso" className="text-sm font-medium text-gray-700">
              Nombre del Proceso Electoral
            </Label>
            <Input
              id="nombre-proceso"
              value={nombreProceso}
              onChange={(e) => setNombreProceso(e.target.value)}
              className="max-w-lg"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fecha-eleccion" className="text-sm font-medium text-gray-700">
                Fecha de Elección
              </Label>
              <Input
                id="fecha-eleccion"
                type="date"
                value={fechaEleccion}
                onChange={(e) => setFechaEleccion(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hora-inicio" className="text-sm font-medium text-gray-700">
                Hora de Inicio
              </Label>
              <Input
                id="hora-inicio"
                type="time"
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hora-cierre" className="text-sm font-medium text-gray-700">
                Hora de Cierre
              </Label>
              <Input
                id="hora-cierre"
                type="time"
                value={horaCierre}
                onChange={(e) => setHoraCierre(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2 max-w-xs">
            <Label htmlFor="estado-proceso" className="text-sm font-medium text-gray-700">
              Estado del Proceso
            </Label>
            <Select value={estadoProceso} onValueChange={setEstadoProceso}>
              <SelectTrigger id="estado-proceso" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="preparacion">Preparación</SelectItem>
                <SelectItem value="en_curso">En Curso</SelectItem>
                <SelectItem value="finalizado">Finalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {estadoProceso && (
            <div className="flex items-center gap-2">
              <div
                className={`h-2.5 w-2.5 rounded-full ${
                  estadoProceso === 'preparacion'
                    ? 'bg-amber-500'
                    : estadoProceso === 'en_curso'
                    ? 'bg-green-500'
                    : 'bg-gray-400'
                }`}
              />
              <span className="text-sm text-muted-foreground">
                Estado actual:{' '}
                <strong className="text-gray-900">
                  {estadoProcesoLabels[estadoProceso] || estadoProceso}
                </strong>
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ===== Notificaciones ===== */}
      <Card className="shadow-sm hover:shadow-md transition-shadow overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-[#FF6B00] to-[#FF8C38]" />
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#FF6B00]/10 flex items-center justify-center">
              <Bell className="h-5 w-5 text-[#FF6B00]" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">Notificaciones</CardTitle>
              <CardDescription>Configura las alertas del sistema</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-1">
          <div className="flex items-center justify-between py-4 rounded-lg hover:bg-gray-50/50 px-3 transition-colors">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium text-gray-900 cursor-pointer">
                Recibir alertas de actas observadas
              </Label>
              <p className="text-xs text-muted-foreground">
                Notificación cuando un acta sea marcada como observada
              </p>
            </div>
            <Switch
              checked={alertasObservadas}
              onCheckedChange={setAlertasObservadas}
              className="data-[state=checked]:bg-[#FF6B00]"
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between py-4 rounded-lg hover:bg-gray-50/50 px-3 transition-colors">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium text-gray-900 cursor-pointer">
                Notificar nuevas actas registradas
              </Label>
              <p className="text-xs text-muted-foreground">
                Recibir aviso cada vez que se registre un nueva acta
              </p>
            </div>
            <Switch
              checked={notificarNuevasActas}
              onCheckedChange={setNotificarNuevasActas}
              className="data-[state=checked]:bg-[#FF6B00]"
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between py-4 rounded-lg hover:bg-gray-50/50 px-3 transition-colors">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium text-gray-900 cursor-pointer">
                Alertas de personeros inactivos
              </Label>
              <p className="text-xs text-muted-foreground">
                Notificar si un personero no reporta actividad en 24 horas
              </p>
            </div>
            <Switch
              checked={alertasInactivos}
              onCheckedChange={setAlertasInactivos}
              className="data-[state=checked]:bg-[#FF6B00]"
            />
          </div>
        </CardContent>
      </Card>

      {/* ===== Seguridad ===== */}
      <Card className="shadow-sm hover:shadow-md transition-shadow overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-[#FF6B00] to-[#FF8C38]" />
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#FF6B00]/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-[#FF6B00]" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">Seguridad</CardTitle>
              <CardDescription>Opciones de seguridad y acceso al sistema</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-1">
          <div className="flex items-center justify-between py-4 rounded-lg hover:bg-gray-50/50 px-3 transition-colors">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium text-gray-900 cursor-pointer">
                Forzar cambio de contraseña para personeros
              </Label>
              <p className="text-xs text-muted-foreground">
                Los personeros deberán cambiar su contraseña en el siguiente inicio de sesión
              </p>
            </div>
            <Switch
              checked={forzarCambioClave}
              onCheckedChange={setForzarCambioClave}
              className="data-[state=checked]:bg-[#FF6B00]"
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between py-4 rounded-lg hover:bg-gray-50/50 px-3 transition-colors">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium text-gray-900 cursor-pointer">
                Tiempo de expiración de sesión
              </Label>
              <p className="text-xs text-muted-foreground">
                Duración de la sesión sin actividad antes del cierre automático
              </p>
            </div>
            <Select value={tiempoSesion} onValueChange={setTiempoSesion}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15min">15 minutos</SelectItem>
                <SelectItem value="30min">30 minutos</SelectItem>
                <SelectItem value="1hr">1 hora</SelectItem>
                <SelectItem value="2hr">2 horas</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Separator />
          <div className="flex items-center justify-between py-4 rounded-lg hover:bg-gray-50/50 px-3 transition-colors">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium text-gray-900 cursor-pointer">
                Autenticación de doble factor (2FA)
              </Label>
              <p className="text-xs text-muted-foreground">
                Requiere verificación adicional al iniciar sesión
              </p>
            </div>
            <Switch
              checked={dobleFactor}
              onCheckedChange={setDobleFactor}
              className="data-[state=checked]:bg-[#FF6B00]"
            />
          </div>
        </CardContent>
      </Card>

      {/* ===== Save button ===== */}
      <div className="flex justify-end pt-2">
        <Button
          onClick={handleSave}
          className="bg-[#FF6B00] hover:bg-[#E55D00] text-white px-8 py-2.5 text-sm font-medium shadow-md hover:shadow-lg transition-all"
        >
          <Save className="h-4 w-4 mr-2" />
          Guardar Cambios
        </Button>
      </div>
    </div>
  )
}
