import axios from 'axios'
import { environment } from '@/config/environment'

export const apiClient = axios.create({
  baseURL: environment.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')

      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined') {
      const status = error?.response?.status

      if (status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('nombrePersona')
        localStorage.removeItem('rol')
        localStorage.removeItem('paginas')
        localStorage.removeItem('controles')
        localStorage.removeItem('usuarioInfo')
        localStorage.removeItem('rememberMe')

        window.location.reload()
      }
    }

    return Promise.reject(error)
  }
)