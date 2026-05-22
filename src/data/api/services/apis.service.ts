import { apiClient } from '../apiClient'

export interface LoginPagina {
    CODPAGINA: string
    NOMBRE: string
    DESCRIPCION: string | null
    ORDEN: number
    PARAMETRIA: number
    VISIBLE: number
    TITULO: string
}

export interface LoginControl {
    CODACCION: string
    NOMBRE: string
    COMANDO: string
    NOMBRECONTROL: string
    CODPAGINA: string
}

export interface LoginUsuarioInfo {
    TXTNOMBRES: string
    NOMBREPERSONA: string
    TXTEMAIL: string | null
    CODIGOPERFIL: string
    NOMBREPERFIL: string
    CODROL: string
    CODUSUARIO: string
    CODPERSONA: string
    CODCAJERO: string | null
    CODAGENCIA: string | null
    CODCAJA: string | null
    CODAREA: string | null
    CODAREAUSUARIO: string | null
}

export interface LoginResponse {
    CodigoRespuesta: string
    TXTRESPUESTA: string
    Token: string
    ExpiraEn: number
    Datos: {
        Paginas: LoginPagina[]
        Controles: LoginControl[]
        UsuarioInfo: LoginUsuarioInfo
    }
}

export const apiService = {
    listarDepartamentosDinamico: async (estado: boolean = true) => {
        const response = await apiClient.get('/api/ubicacion/departamentos', {
            params: { estado },
        })

        return response.data
    },

    login: async (
        usuario: string,
        password: string
    ): Promise<LoginResponse> => {
        const payload = { usuario, password }

        const response = await apiClient.post<LoginResponse>(
            '/api/auth/login',
            payload
        )

        return response.data
    },


    obtenerResultadosPrincipales: async () => {
        const response = await apiClient.get('/api/dashboard/resultados-principales')

        return response.data
    },


    obtenerLineaTiempo: async () => {
        const response = await apiClient.get('/api/dashboard/linea-tiempo')

        return response.data
    },



    ListarDepartamento: async (estado: boolean = true) => {
        const response = await apiClient.get('/api/ubicacion/departamentos', {
            params: {
                estado,
            },
        });

        return response.data;
    },

    ListarProvincia: async (
        codDepartamento: string,
        estado: boolean = true
    ) => {
        const response = await apiClient.get('/api/ubicacion/provincias', {
            params: {
                codDepartamento,
                estado,
            },
        });

        return response.data;
    },

    ListarDistrito: async (
        codDepartamento: string,
        codProvincia: string,
        estado: boolean = true
    ) => {
        const response = await apiClient.get('/api/ubicacion/distritos', {
            params: {
                codDepartamento,
                codProvincia,
                estado,
            },
        });

        return response.data;
    },

    DistribucionTerritorial: async (
        nivel: 'DEPARTAMENTO' | 'PROVINCIA' | 'DISTRITO',
        codDepartamento?: string,
        codProvincia?: string,
        codDistrito?: string,
        fechaInicio?: string,
        fechaFin?: string
    ) => {
        const response = await apiClient.get('/api/dashboard/distribucion-territorial', {
            params: {
                nivel,
                codDepartamento,
                codProvincia,
                codDistrito,
                fechaInicio,
                fechaFin,
            },
        });

        return response.data;
    },
    listarKpis: async () => {
        const response = await apiClient.get('/api/dashboard/kpis-generales')

        return response.data
    },



}