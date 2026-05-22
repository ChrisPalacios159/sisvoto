'use client'

import { useState } from 'react'
import type { FormEvent } from 'react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  User,
  Lock,
  Eye,
  EyeOff,
  Shield,
  Vote,
  BarChart3,
  ChevronRight,
  Loader2,
} from 'lucide-react'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { apiService } from '@/data/api/services/apis.service'
import { saveAuthSession } from '@/lib/authStorage'

interface LoginProps {
  onLogin: () => void
}

interface LoginErrors {
  username?: string
  password?: string
  general?: string
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<LoginErrors>({})

  const validateForm = () => {
    const newErrors: LoginErrors = {}

    if (!username.trim()) {
      newErrors.username = 'El usuario es requerido'
    } else if (username.trim().length < 3) {
      newErrors.username = 'El usuario debe tener al menos 3 caracteres'
    }

    if (!password.trim()) {
      newErrors.password = 'La contraseña es requerida'
    } else if (password.trim().length < 2) {
      newErrors.password = 'La contraseña debe tener al menos 4 caracteres'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      setIsLoading(true)
      setErrors({})

      const data = await apiService.login(username.trim(), password)

      if (data.CodigoRespuesta !== '01') {
        setErrors({
          general: data.TXTRESPUESTA || 'No se pudo iniciar sesión',
        })

        return
      }

      if (!data.Token) {
        setErrors({
          general: 'El servidor no devolvió un token válido',
        })

        return
      }

      saveAuthSession(data)

      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true')
      } else {
        localStorage.removeItem('rememberMe')
      }

      onLogin()
    } catch (error: unknown) {
      let message = 'Usuario o contraseña incorrectos'

      if (typeof error === 'object' && error !== null && 'response' in error) {
        const axiosError = error as {
          response?: {
            data?: {
              TXTRESPUESTA?: string
              message?: string
              mensaje?: string
              error?: string
            }
          }
        }

        message =
          axiosError.response?.data?.TXTRESPUESTA ||
          axiosError.response?.data?.message ||
          axiosError.response?.data?.mensaje ||
          axiosError.response?.data?.error ||
          message
      }

      setErrors({
        general: message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fadeUp: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: 'easeOut' as const,
      },
    }),
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, #FF6B00 0%, #E05500 50%, #C44A00 100%)',
          }}
        />

        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <div className="absolute top-[-10%] right-[-5%] w-80 h-80 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute top-[40%] right-[10%] w-40 h-40 rounded-full bg-white/5 blur-xl" />

        <div className="relative z-10 flex flex-col justify-center items-center w-full px-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="flex flex-col items-center text-center"
          >
            <div className="relative mb-10">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="relative"
              >
                <div className="w-28 h-28 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-2xl overflow-hidden">
                  <Image
                    src="/images/k.png"
                    alt="Icono central"
                    width={72}
                    height={72}
                    priority
                    className="object-contain"
                  />
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.5,
                }}
                className="absolute -left-14 top-1/2 -translate-y-1/2"
              >
                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/15">
                  <Vote className="w-6 h-6 text-white/90" strokeWidth={1.5} />
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 1,
                }}
                className="absolute -right-14 top-1/2 -translate-y-1/2"
              >
                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/15">
                  <BarChart3 className="w-6 h-6 text-white/90" strokeWidth={1.5} />
                </div>
              </motion.div>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-5xl font-bold text-white mb-4 tracking-tight"
            >
              Sistema Electoral
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-lg text-white/80 max-w-md leading-relaxed"
            >
              Plataforma de Monitoreo Electoral en Tiempo Real
            </motion.p>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="w-24 h-0.5 bg-white/30 mt-8 mb-8"
            />

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="flex gap-3 flex-wrap justify-center"
            >
              {['Seguro', 'Transparente', 'Eficiente'].map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm font-medium backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-6 py-12">
        <motion.div initial="hidden" animate="visible" className="w-full max-w-md">
          <motion.div
            custom={0}
            variants={fadeUp}
            className="flex items-center gap-3 mb-8 lg:hidden"
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #FF6B00, #E05500)',
              }}
            >
              <Shield className="w-5 h-5 text-white" strokeWidth={1.5} />
            </div>

            <span className="text-xl font-bold text-gray-900">
              Sistema Electoral
            </span>
          </motion.div>

          <motion.div custom={1} variants={fadeUp} className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              Bienvenido
            </h2>

            <p className="text-gray-500 mt-2">
              Ingrese sus credenciales para acceder al sistema
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
              >
                {errors.general}
              </motion.div>
            )}

            <motion.div custom={2} variants={fadeUp} className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                Usuario
              </Label>

              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <User className="w-4 h-4" />
                </div>

                <Input
                  id="username"
                  type="text"
                  placeholder="Ingrese su usuario"
                  value={username}
                  disabled={isLoading}
                  onChange={(e) => {
                    setUsername(e.target.value)

                    if (errors.username || errors.general) {
                      setErrors((prev) => ({
                        ...prev,
                        username: undefined,
                        general: undefined,
                      }))
                    }
                  }}
                  className={`pl-10 h-11 rounded-lg border-gray-200 bg-gray-50/50 focus:bg-white transition-colors ${
                    errors.username
                      ? 'border-red-400 focus-visible:border-red-500 focus-visible:ring-red-500/20'
                      : ''
                  }`}
                  aria-invalid={!!errors.username}
                  autoComplete="username"
                />
              </div>

              {errors.username && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 flex items-center gap-1"
                >
                  <span className="w-1 h-1 rounded-full bg-red-500" />
                  {errors.username}
                </motion.p>
              )}
            </motion.div>

            <motion.div custom={3} variants={fadeUp} className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Contraseña
              </Label>

              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>

                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Ingrese su contraseña"
                  value={password}
                  disabled={isLoading}
                  onChange={(e) => {
                    setPassword(e.target.value)

                    if (errors.password || errors.general) {
                      setErrors((prev) => ({
                        ...prev,
                        password: undefined,
                        general: undefined,
                      }))
                    }
                  }}
                  className={`pl-10 pr-10 h-11 rounded-lg border-gray-200 bg-gray-50/50 focus:bg-white transition-colors ${
                    errors.password
                      ? 'border-red-400 focus-visible:border-red-500 focus-visible:ring-red-500/20'
                      : ''
                  }`}
                  aria-invalid={!!errors.password}
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500 flex items-center gap-1"
                >
                  <span className="w-1 h-1 rounded-full bg-red-500" />
                  {errors.password}
                </motion.p>
              )}
            </motion.div>

            <motion.div custom={4} variants={fadeUp} className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                disabled={isLoading}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
                className="data-[state=checked]:border-transparent"
                style={{
                  ...(rememberMe
                    ? { backgroundColor: '#FF6B00', borderColor: '#FF6B00' }
                    : {}),
                }}
              />

              <Label
                htmlFor="remember"
                className="text-sm text-gray-600 font-normal cursor-pointer"
              >
                Recordar mi sesión
              </Label>
            </motion.div>

            <motion.div custom={5} variants={fadeUp}>
              <motion.div whileHover={{ scale: isLoading ? 1 : 1.01 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 rounded-lg text-white font-semibold text-base shadow-lg border-0 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                  style={{
                    background: 'linear-gradient(135deg, #FF6B00, #E05500)',
                    boxShadow: '0 4px 14px rgba(255, 107, 0, 0.35)',
                  }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Validando...
                    </>
                  ) : (
                    <>
                      Iniciar Sesión
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </Button>
              </motion.div>
            </motion.div>
          </form>

          <motion.div
            custom={6}
            variants={fadeUp}
            className="mt-10 pt-6 border-t border-gray-100 text-center"
          >
            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} Sistema Electoral - Plataforma de Monitoreo Electoral
            </p>

            <p className="text-xs text-gray-300 mt-1">
              Todos los derechos reservados
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}