import type {
  LoginControl,
  LoginPagina,
  LoginResponse,
  LoginUsuarioInfo,
} from '@/data/api/services/apis.service'
import type { ModuleView } from '@/types/electoral'
 
export interface AuthSession {
  token: string
  nombrePersona: string
  rol: string
  paginas: LoginPagina[]
  controles: LoginControl[]
  usuarioInfo: LoginUsuarioInfo
}

const PAGE_MODULE_MAP: Record<string, ModuleView> = {
  Dashboard: 'dashboard',
  Personeros: 'personeros',
  'Actas Registradas': 'actas',
  Reportes: 'reportes',
  Configuracion: 'configuracion',
  Configuración: 'configuracion',
}

export function saveAuthSession(data: LoginResponse) {
  const token = data.Token
  const usuarioInfo = data.Datos.UsuarioInfo
  const paginas = data.Datos.Paginas || []
  const controles = data.Datos.Controles || []

  localStorage.setItem('token', token)
  localStorage.setItem('nombrePersona', usuarioInfo.NOMBREPERSONA)
  localStorage.setItem('rol', usuarioInfo.NOMBREPERFIL)
  localStorage.setItem('paginas', JSON.stringify(paginas))
  localStorage.setItem('controles', JSON.stringify(controles))
  localStorage.setItem('usuarioInfo', JSON.stringify(usuarioInfo))
}

export function getAuthSession(): AuthSession | null {
  if (typeof window === 'undefined') return null

  const token = localStorage.getItem('token')
  const nombrePersona = localStorage.getItem('nombrePersona')
  const rol = localStorage.getItem('rol')
  const paginas = localStorage.getItem('paginas')
  const controles = localStorage.getItem('controles')
  const usuarioInfo = localStorage.getItem('usuarioInfo')

  if (!token || !nombrePersona || !rol || !paginas || !controles || !usuarioInfo) {
    return null
  }

  return {
    token,
    nombrePersona,
    rol,
    paginas: JSON.parse(paginas),
    controles: JSON.parse(controles),
    usuarioInfo: JSON.parse(usuarioInfo),
  }
}

export function clearAuthSession() {
  localStorage.removeItem('token')
  localStorage.removeItem('nombrePersona')
  localStorage.removeItem('rol')
  localStorage.removeItem('paginas')
  localStorage.removeItem('controles')
  localStorage.removeItem('usuarioInfo')
  localStorage.removeItem('rememberMe')
}

export function getAllowedModules(): ModuleView[] {
  if (typeof window === 'undefined') return []

  const paginasRaw = localStorage.getItem('paginas')

  if (!paginasRaw) return []

  const paginas = JSON.parse(paginasRaw) as LoginPagina[]

  return paginas
    .filter((pagina) => pagina.VISIBLE === 1)
    .sort((a, b) => a.ORDEN - b.ORDEN)
    .map((pagina) => PAGE_MODULE_MAP[pagina.NOMBRE])
    .filter(Boolean)
}

export function canAccessModule(module: ModuleView) {
  return getAllowedModules().includes(module)
}