'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from 'recharts';
import {
  MapPin,
  Clock,
  Filter,
  X,
  Search,
  CheckCircle2,
  AlertTriangle,
  Hourglass,
  ChevronDown,
  Download,
  Radio,
  Eye,
  BarChart3,
  RefreshCcw,
} from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

import {
  FiltrosGenerales,
  DEPARTAMENTOS,
  PROVINCIAS_POR_DEPARTAMENTO,
  DISTRITOS_POR_PROVINCIA,
} from '@/types/electoral';

import {
  partidosMock,
  actasMock,
  calcularVotosTotales,
} from '@/data/mock';

import { apiService } from '@/data/api/services/apis.service';

interface DashboardProps {
  filtros: FiltrosGenerales;
  onFiltrosChange: (filtros: FiltrosGenerales) => void;
}

interface CandidateDashboard {
  id: string;
  idPartido: number;
  displayName: string;
  partyName: string;
  partyShortName: string;
  votes: number;
  photo: string;
  logo: string;
  color: string;
  darkColor: string;
  accent: string;
  progress: number;
}

interface LiveStats {
  actasValidadas: number;
  actasObservadas: number;
  actasPendientes: number;
  mesasRegistradas: number;
  mesasPendientes: number;
  blancoNulo: number;
  activePersoneros: number;
}

interface KpisGenerales {
  TOTALACTAS: number;
  ACTASVALIDADAS: number;
  ACTASOBSERVADAS: number;
  ACTASPENDIENTES: number;
  PERSONEROSACTIVOS: number;
  TOTALVOTOSPARTIDOS: number;
  TOTALVOTOSESPECIALES: number;
  VOTOSBLANCOS: number;
  VOTOSNULOS: number;
  VOTOSIMPUGNADOS: number;
  TOTALVOTOSGENERAL: number;
  DIFERENCIAPRIMERSEGUNDO: number;
  PORCENTAJEMARGEN: number;
  PARTICIPACION: number;
  AVANCEGENERAL: number;
}

interface DepartmentVotes {
  departamento: string;
  votos: number;
}

interface TimelineItem {
  hora: string;
  fechaHora: string;
  actasRegistradas: number;
  votosPartidos: number;
  votos: number;
}

interface LiveActaRow {
  id: string;
  ubicacion: string;
  centro: string;
  estado: 'validada' | 'observada' | 'pendiente';
  mesa: string;
  horaRegistro: string;
}

interface RollingNumberProps {
  value: string | number;
  className?: string;
  style?: React.CSSProperties;
}

interface DepartamentoApi {
  CODDEPARTAMENTO: string;
  TXTNOMBRE: string;
  CODIGOUBIGEO: string | null;
  ESTADO: boolean;
}

interface ProvinciaApi {
  CODPROVINCIA: string;
  CODDEPARTAMENTO: string;
  DEPARTAMENTO: string;
  CODIGOUBIGEO: string | null;
  TXTNOMBRE: string;
  ESTADO: boolean;
}

interface DistritoApi {
  CODDISTRITO: string;
  CODDEPARTAMENTO: string;
  DEPARTAMENTO: string;
  CODPROVINCIA: string;
  PROVINCIA: string;
  CODIGOUBIGEO: string | null;
  TXTNOMBRE: string;
  ESTADO: boolean;
}

interface DistribucionTerritorialApi {
  NIVEL?: string;
  Nivel?: string;
  CODIGOUBICACION?: string;
  CodigoUbicacion?: string;
  NOMBREUBICACION?: string;
  NombreUbicacion?: string;
  IDPARTIDO?: number;
  IdPartido?: number;
  NOMBREPARTIDO?: string;
  NombrePartido?: string;
  SIGLAS?: string;
  Siglas?: string;
  LOGOPARTIDO?: string;
  LogoPartido?: string;
  COLOR?: string;
  Color?: string;
  TOTALVOTOS?: number;
  TotalVotos?: number;
  PORCENTAJE?: number;
  Porcentaje?: number;
}

interface TerritorialParty {
  idPartido: number;
  nombrePartido: string;
  siglas: string;
  logoPartido: string;
  color: string;
  totalVotos: number;
  porcentaje: number;
}

interface TerritorialGroup {
  nivel: string;
  codigoUbicacion: string;
  nombreUbicacion: string;
  partidos: TerritorialParty[];
}

const PRIMARY = '#F97316';
const PRIMARY_DARK = '#C2410C';
const PRIMARY_LIGHT = '#FDBA74';
const GREEN = '#16A34A';
const GREEN_DARK = '#15803D';
const GREEN_LIGHT = '#DCFCE7';
const SELECT_TODOS = 'TODOS';

const KPIS_GENERALES_INICIALES: KpisGenerales = {
  TOTALACTAS: 0,
  ACTASVALIDADAS: 0,
  ACTASOBSERVADAS: 0,
  ACTASPENDIENTES: 0,
  PERSONEROSACTIVOS: 0,
  TOTALVOTOSPARTIDOS: 0,
  TOTALVOTOSESPECIALES: 0,
  VOTOSBLANCOS: 0,
  VOTOSNULOS: 0,
  VOTOSIMPUGNADOS: 0,
  TOTALVOTOSGENERAL: 0,
  DIFERENCIAPRIMERSEGUNDO: 0,
  PORCENTAJEMARGEN: 0,
  PARTICIPACION: 0,
  AVANCEGENERAL: 0,
};


const selectTriggerClass =
  'w-full rounded-xl border-orange-200 bg-orange-50/80 text-xs text-[#24130A] shadow-sm focus:border-orange-500 focus:ring-orange-500/20 data-[placeholder]:text-orange-900/45 disabled:cursor-not-allowed disabled:bg-orange-50/40 disabled:text-orange-900/30 backdrop-blur-sm';

const selectContentClass =
  'rounded-xl border border-orange-200 bg-white p-1 shadow-xl max-h-[240px] overflow-auto';

const selectItemClass =
  'rounded-lg cursor-pointer px-3 py-2 text-xs font-semibold text-[#24130A] focus:bg-orange-100 focus:text-orange-800 data-[state=checked]:bg-orange-50';

const INITIAL_DEPARTMENT_VOTES: DepartmentVotes[] = [
  { departamento: 'Lima', votos: 1480200 },
  { departamento: 'Cusco', votos: 842500 },
  { departamento: 'La Libertad', votos: 735800 },
  { departamento: 'Piura', votos: 612400 },
  { departamento: 'Arequipa', votos: 558700 },
  { departamento: 'Junín', votos: 421900 },
];

const INITIAL_LIVE_ACTAS: LiveActaRow[] = [
  {
    id: '#ACT-92840-A',
    ubicacion: 'Lima, Miraflores',
    centro: 'Colegio San Agustín',
    estado: 'validada',
    mesa: '048291',
    horaRegistro: 'Hace 1 min',
  },
  {
    id: '#ACT-92839-B',
    ubicacion: 'Arequipa, Cercado',
    centro: 'I.E. Independencia',
    estado: 'validada',
    mesa: '012354',
    horaRegistro: 'Hace 4 min',
  },
  {
    id: '#ACT-92838-C',
    ubicacion: 'Cusco, Wanchaq',
    centro: 'U.N. San Antonio Abad',
    estado: 'pendiente',
    mesa: '085421',
    horaRegistro: 'Hace 7 min',
  },
  {
    id: '#ACT-92837-D',
    ubicacion: 'Piura, Castilla',
    centro: 'I.E. Miguel Cortés',
    estado: 'observada',
    mesa: '032158',
    horaRegistro: 'Hace 12 min',
  },
];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.35,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

function normalizeHexColor(color?: string | null, fallback: string = PRIMARY) {
  if (!color) return fallback;

  const clean = color.replace('#', '').trim();

  if (!clean) return fallback;

  return `#${clean}`;
}

function getCandidateId(idPartido: number) {
  if (idPartido === 1) return 'keiko';
  if (idPartido === 2) return 'roberto';

  return `partido-${idPartido}`;
}

function getCandidateDarkColor(idPartido: number, color: string) {
  if (idPartido === 1) return PRIMARY_DARK;
  if (idPartido === 2) return GREEN_DARK;

  return color;
}

function getCandidateAccent(idPartido: number, color: string) {
  if (idPartido === 1) return '#FFF7ED';
  if (idPartido === 2) return GREEN_LIGHT;

  return `${color}18`;
}

function mapResultadoPrincipalToCandidate(item: any, index: number): CandidateDashboard {
  const idPartido = Number(item?.IDPARTIDO ?? index + 1);
  const fallbackColor = idPartido === 2 ? GREEN : PRIMARY;
  const color = normalizeHexColor(item?.COLOR, fallbackColor);

  return {
    id: getCandidateId(idPartido),
    idPartido,
    displayName: item?.NOMBREREPRESENTANTE ?? 'Sin representante',
    partyName: item?.NOMBREPARTIDO ?? 'Sin partido',
    partyShortName: item?.SIGLAS ?? '',
    votes: Number(item?.TOTALVOTOS ?? 0),
    photo: item?.IMAGENREPRESENTANTEURL ?? '',
    logo: item?.LOGOPARTIDO ?? '',
    color,
    darkColor: getCandidateDarkColor(idPartido, color),
    accent: getCandidateAccent(idPartido, color),
    progress: Number(item?.PORCENTAJE ?? 0),
  };
}

function formatHourAmPm(value?: string | null) {
  if (!value) return '';

  const hourText = value.split(':')[0];
  const minuteText = value.split(':')[1] ?? '00';

  const hour = Number(hourText);

  if (Number.isNaN(hour)) return value;

  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;

  return `${hour12.toString().padStart(2, '0')}:${minuteText} ${period}`;
}

function mapLineaTiempoItem(item: any): TimelineItem {
  return {
    hora: formatHourAmPm(item?.HORA),
    fechaHora: item?.FECHAHORA ?? '',
    actasRegistradas: Number(item?.ACTASREGISTRADAS ?? 0),
    votosPartidos: Number(item?.TOTALVOTOSPARTIDOS ?? 0),
    votos: Number(item?.TOTALVOTOSGENERAL ?? 0),
  };
}

function mapDistribucionItem(item: DistribucionTerritorialApi): {
  nivel: string;
  codigoUbicacion: string;
  nombreUbicacion: string;
  partido: TerritorialParty;
} {
  const idPartido = Number(item.IDPARTIDO ?? item.IdPartido ?? 0);
  const color = normalizeHexColor(item.COLOR ?? item.Color, idPartido === 2 ? GREEN : PRIMARY);

  return {
    nivel: String(item.NIVEL ?? item.Nivel ?? ''),
    codigoUbicacion: String(item.CODIGOUBICACION ?? item.CodigoUbicacion ?? ''),
    nombreUbicacion: String(item.NOMBREUBICACION ?? item.NombreUbicacion ?? ''),
    partido: {
      idPartido,
      nombrePartido: String(item.NOMBREPARTIDO ?? item.NombrePartido ?? ''),
      siglas: String(item.SIGLAS ?? item.Siglas ?? ''),
      logoPartido: String(item.LOGOPARTIDO ?? item.LogoPartido ?? ''),
      color,
      totalVotos: Number(item.TOTALVOTOS ?? item.TotalVotos ?? 0),
      porcentaje: Number(item.PORCENTAJE ?? item.Porcentaje ?? 0),
    },
  };
}

function groupDistribucionTerritorial(items: DistribucionTerritorialApi[]): TerritorialGroup[] {
  const map = new Map<string, TerritorialGroup>();

  items.forEach((item) => {
    const mapped = mapDistribucionItem(item);
    const key = mapped.codigoUbicacion || mapped.nombreUbicacion;

    if (!map.has(key)) {
      map.set(key, {
        nivel: mapped.nivel,
        codigoUbicacion: mapped.codigoUbicacion,
        nombreUbicacion: mapped.nombreUbicacion,
        partidos: [],
      });
    }

    map.get(key)?.partidos.push(mapped.partido);
  });

  return Array.from(map.values()).map((group) => ({
    ...group,
    partidos: group.partidos.sort((a, b) => b.totalVotos - a.totalVotos),
  }));
}

function getNivelTerritorial(
  codDepartamento: string,
  codProvincia: string,
  codDistrito: string,
): 'DEPARTAMENTO' | 'PROVINCIA' | 'DISTRITO' {
  if (codProvincia !== SELECT_TODOS || codDistrito !== SELECT_TODOS) return 'DISTRITO';
  if (codDepartamento !== SELECT_TODOS) return 'PROVINCIA';

  return 'DEPARTAMENTO';
}

function CustomChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    color: string;
    payload?: Partial<TimelineItem> & Record<string, any>;
  }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  const item = payload[0]?.payload;
  const value = Number(payload[0]?.value ?? 0);

  const votosGenerales = Number(item?.votos ?? value ?? 0);
  const votosPartidos = Number(item?.votosPartidos ?? 0);
  const actasRegistradas = Number(item?.actasRegistradas ?? 0);

  const esLineaTiempo =
    item &&
    Object.prototype.hasOwnProperty.call(item, 'votosPartidos') &&
    Object.prototype.hasOwnProperty.call(item, 'actasRegistradas');

  return (
    <div className="rounded-xl border border-orange-200 bg-white px-4 py-3 shadow-xl">
      {label && (
        <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-orange-500">
          {label}
        </p>
      )}

      <p className="text-sm font-black text-[#24130A]">
        {votosGenerales.toLocaleString('es-PE')}
        <span className="ml-1.5 text-[11px] font-semibold text-orange-400">
          votos
        </span>
      </p>

      {esLineaTiempo && (
        <>
          <p className="mt-1 text-[11px] font-bold text-orange-900/50">
            Voto total de Partidos: {votosPartidos.toLocaleString('es-PE')}
          </p>
          <p className="text-[11px] font-bold text-orange-900/50">
            Actas: {actasRegistradas.toLocaleString('es-PE')}
          </p>
        </>
      )}
    </div>
  );
}

export default function Dashboard({ filtros, onFiltrosChange }: DashboardProps) {
  const [localFiltros, setLocalFiltros] = useState<FiltrosGenerales>(filtros);
  const [showFilters, setShowFilters] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const [liveCandidates, setLiveCandidates] = useState<CandidateDashboard[]>([]);
  const [loadingResultadosPrincipales, setLoadingResultadosPrincipales] = useState(true);
  const [errorResultadosPrincipales, setErrorResultadosPrincipales] = useState<string | null>(null);

  const [liveTimeline, setLiveTimeline] = useState<TimelineItem[]>([]);
  const [loadingLineaTiempo, setLoadingLineaTiempo] = useState(true);
  const [errorLineaTiempo, setErrorLineaTiempo] = useState<string | null>(null);

  const [departamentosApi, setDepartamentosApi] = useState<DepartamentoApi[]>([]);
  const [provinciasApi, setProvinciasApi] = useState<ProvinciaApi[]>([]);
  const [distritosApi, setDistritosApi] = useState<DistritoApi[]>([]);

  const [codDepartamentoTerritorial, setCodDepartamentoTerritorial] = useState(SELECT_TODOS);
  const [codProvinciaTerritorial, setCodProvinciaTerritorial] = useState(SELECT_TODOS);
  const [codDistritoTerritorial, setCodDistritoTerritorial] = useState(SELECT_TODOS);

  const [territorialData, setTerritorialData] = useState<TerritorialGroup[]>([]);
  const [loadingTerritorial, setLoadingTerritorial] = useState(true);
  const [errorTerritorial, setErrorTerritorial] = useState<string | null>(null);

  const [liveStats, setLiveStats] = useState<LiveStats>({
    actasValidadas: 82400,
    actasObservadas: 1800,
    actasPendientes: 920,
    mesasRegistradas: 84200,
    mesasPendientes: 1800,
    blancoNulo: 350000,
    activePersoneros: 128,
  });

  const [kpisGenerales, setKpisGenerales] = useState<KpisGenerales>(KPIS_GENERALES_INICIALES);
  const [loadingKpisGenerales, setLoadingKpisGenerales] = useState(true);
  const [errorKpisGenerales, setErrorKpisGenerales] = useState<string | null>(null);

  const [liveDepartmentVotes, setLiveDepartmentVotes] =
    useState<DepartmentVotes[]>(INITIAL_DEPARTMENT_VOTES);

  const [liveActas, setLiveActas] =
    useState<LiveActaRow[]>(INITIAL_LIVE_ACTAS);

  const cargarKpisGenerales = useCallback(async () => {
    try {
      setErrorKpisGenerales(null);

      const response = await apiService.listarKpis();

      console.log('KPIS GENERALES:', response);

      if (response?.CodigoRespuesta !== '01') {
        setKpisGenerales(KPIS_GENERALES_INICIALES);
        setErrorKpisGenerales(
          response?.TXTRESPUESTA ?? 'No se pudieron cargar los KPIs generales',
        );
        return;
      }

      const datos = response?.Datos ?? {};

      setKpisGenerales({
        TOTALACTAS: Number(datos?.TOTALACTAS ?? 0),
        ACTASVALIDADAS: Number(datos?.ACTASVALIDADAS ?? 0),
        ACTASOBSERVADAS: Number(datos?.ACTASOBSERVADAS ?? 0),
        ACTASPENDIENTES: Number(datos?.ACTASPENDIENTES ?? 0),
        PERSONEROSACTIVOS: Number(datos?.PERSONEROSACTIVOS ?? 0),
        TOTALVOTOSPARTIDOS: Number(datos?.TOTALVOTOSPARTIDOS ?? 0),
        TOTALVOTOSESPECIALES: Number(datos?.TOTALVOTOSESPECIALES ?? 0),
        VOTOSBLANCOS: Number(datos?.VOTOSBLANCOS ?? 0),
        VOTOSNULOS: Number(datos?.VOTOSNULOS ?? 0),
        VOTOSIMPUGNADOS: Number(datos?.VOTOSIMPUGNADOS ?? 0),
        TOTALVOTOSGENERAL: Number(datos?.TOTALVOTOSGENERAL ?? 0),
        DIFERENCIAPRIMERSEGUNDO: Number(datos?.DIFERENCIAPRIMERSEGUNDO ?? 0),
        PORCENTAJEMARGEN: Number(datos?.PORCENTAJEMARGEN ?? 0),
        PARTICIPACION: Number(datos?.PARTICIPACION ?? 0),
        AVANCEGENERAL: Number(datos?.AVANCEGENERAL ?? 0),
      });

      setLastUpdate(new Date());
    } catch (error) {
      console.error('ERROR KPIS GENERALES:', error);
      setKpisGenerales(KPIS_GENERALES_INICIALES);
      setErrorKpisGenerales('Error al conectar con el servidor');
    } finally {
      setLoadingKpisGenerales(false);
    }
  }, []);

  const cargarResultadosPrincipales = useCallback(async () => {
    try {
      setErrorResultadosPrincipales(null);

      const response = await apiService.obtenerResultadosPrincipales();

      console.log('RESULTADOS PRINCIPALES:', response);

      if (response?.CodigoRespuesta !== '01') {
        setLiveCandidates([]);
        setErrorResultadosPrincipales(
          response?.TXTRESPUESTA ?? 'No se pudieron cargar los resultados principales',
        );
        return;
      }

      const datos = Array.isArray(response?.Datos) ? response.Datos : [];

      const candidatos = datos
        .map((item: any, index: number) => mapResultadoPrincipalToCandidate(item, index))
        .sort((a: CandidateDashboard, b: CandidateDashboard) => a.idPartido - b.idPartido);

      setLiveCandidates(candidatos);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('ERROR RESULTADOS PRINCIPALES:', error);
      setLiveCandidates([]);
      setErrorResultadosPrincipales('Error al conectar con el servidor');
    } finally {
      setLoadingResultadosPrincipales(false);
    }
  }, []);

  const cargarLineaTiempo = useCallback(async () => {
    try {
      setErrorLineaTiempo(null);

      const response = await apiService.obtenerLineaTiempo();

      console.log('LINEA TIEMPO:', response);

      if (response?.CodigoRespuesta !== '01') {
        setLiveTimeline([]);
        setErrorLineaTiempo(
          response?.TXTRESPUESTA ?? 'No se pudo cargar la línea de tiempo',
        );
        return;
      }

      const datos = Array.isArray(response?.Datos) ? response.Datos : [];

      const timeline = datos.map((item: any) => mapLineaTiempoItem(item));

      setLiveTimeline(timeline);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('ERROR LINEA TIEMPO:', error);
      setLiveTimeline([]);
      setErrorLineaTiempo('Error al conectar con el servidor');
    } finally {
      setLoadingLineaTiempo(false);
    }
  }, []);

  const cargarDepartamentos = useCallback(async () => {
    try {
      const response = await apiService.ListarDepartamento(true);

      console.log('DEPARTAMENTOS:', response);

      if (response?.CodigoRespuesta !== '01') {
        setDepartamentosApi([]);
        return;
      }

      setDepartamentosApi(Array.isArray(response?.Datos) ? response.Datos : []);
    } catch (error) {
      console.error('ERROR DEPARTAMENTOS:', error);
      setDepartamentosApi([]);
    }
  }, []);

  const cargarProvincias = useCallback(async (codDepartamento: string) => {
    if (codDepartamento === SELECT_TODOS) {
      setProvinciasApi([]);
      return;
    }

    try {
      const response = await apiService.ListarProvincia(codDepartamento, true);

      console.log('PROVINCIAS:', response);

      if (response?.CodigoRespuesta !== '01') {
        setProvinciasApi([]);
        return;
      }

      setProvinciasApi(Array.isArray(response?.Datos) ? response.Datos : []);
    } catch (error) {
      console.error('ERROR PROVINCIAS:', error);
      setProvinciasApi([]);
    }
  }, []);

  const cargarDistritos = useCallback(async (codDepartamento: string, codProvincia: string) => {
    if (codDepartamento === SELECT_TODOS || codProvincia === SELECT_TODOS) {
      setDistritosApi([]);
      return;
    }

    try {
      const response = await apiService.ListarDistrito(codDepartamento, codProvincia, true);

      console.log('DISTRITOS:', response);

      if (response?.CodigoRespuesta !== '01') {
        setDistritosApi([]);
        return;
      }

      setDistritosApi(Array.isArray(response?.Datos) ? response.Datos : []);
    } catch (error) {
      console.error('ERROR DISTRITOS:', error);
      setDistritosApi([]);
    }
  }, []);

  const cargarDistribucionTerritorial = useCallback(async () => {
    try {
      setLoadingTerritorial(true);
      setErrorTerritorial(null);

      const nivel = getNivelTerritorial(
        codDepartamentoTerritorial,
        codProvinciaTerritorial,
        codDistritoTerritorial,
      );

      const response = await apiService.DistribucionTerritorial(
        nivel,
        codDepartamentoTerritorial === SELECT_TODOS ? undefined : codDepartamentoTerritorial,
        codProvinciaTerritorial === SELECT_TODOS ? undefined : codProvinciaTerritorial,
        codDistritoTerritorial === SELECT_TODOS ? undefined : codDistritoTerritorial,
        localFiltros.fechaInicio || undefined,
        localFiltros.fechaFin || undefined,
      );

      console.log('DISTRIBUCION TERRITORIAL:', response);

      if (response?.CodigoRespuesta !== '01') {
        setTerritorialData([]);
        setErrorTerritorial(response?.TXTRESPUESTA ?? 'No se pudo cargar la distribución territorial');
        return;
      }

      const datos = Array.isArray(response?.Datos) ? response.Datos : [];

      setTerritorialData(groupDistribucionTerritorial(datos));
      setLastUpdate(new Date());
    } catch (error) {
      console.error('ERROR DISTRIBUCION TERRITORIAL:', error);
      setTerritorialData([]);
      setErrorTerritorial('Error al conectar con el servidor');
    } finally {
      setLoadingTerritorial(false);
    }
  }, [
    codDepartamentoTerritorial,
    codProvinciaTerritorial,
    codDistritoTerritorial,
    localFiltros.fechaInicio,
    localFiltros.fechaFin,
  ]);

  useEffect(() => {
    cargarDepartamentos();
    cargarKpisGenerales();
    cargarResultadosPrincipales();
    cargarLineaTiempo();
  }, [cargarDepartamentos, cargarKpisGenerales, cargarResultadosPrincipales, cargarLineaTiempo]);

  useEffect(() => {
    cargarDistribucionTerritorial();
  }, [cargarDistribucionTerritorial]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      cargarKpisGenerales();
      cargarResultadosPrincipales();
      cargarLineaTiempo();
      cargarDistribucionTerritorial();
    }, 5000);

    return () => window.clearInterval(interval);
  }, [cargarKpisGenerales, cargarResultadosPrincipales, cargarLineaTiempo, cargarDistribucionTerritorial]);

  const handleDepartamentoTerritorialChange = (value: string) => {
    setCodDepartamentoTerritorial(value);
    setCodProvinciaTerritorial(SELECT_TODOS);
    setCodDistritoTerritorial(SELECT_TODOS);
    setDistritosApi([]);

    if (value !== SELECT_TODOS) {
      cargarProvincias(value);
    } else {
      setProvinciasApi([]);
    }
  };

  const handleProvinciaTerritorialChange = (value: string) => {
    setCodProvinciaTerritorial(value);
    setCodDistritoTerritorial(SELECT_TODOS);

    if (value !== SELECT_TODOS) {
      cargarDistritos(codDepartamentoTerritorial, value);
    } else {
      setDistritosApi([]);
    }
  };

  const handleDistritoTerritorialChange = (value: string) => {
    setCodDistritoTerritorial(value);
  };

  const limpiarFiltrosTerritoriales = () => {
    setCodDepartamentoTerritorial(SELECT_TODOS);
    setCodProvinciaTerritorial(SELECT_TODOS);
    setCodDistritoTerritorial(SELECT_TODOS);
    setProvinciasApi([]);
    setDistritosApi([]);
  };

  const updateFiltro = (key: keyof FiltrosGenerales, value: string) => {
    const next = { ...localFiltros, [key]: value };

    if (key === 'departamento') {
      next.provincia = '';
      next.distrito = '';
    }

    if (key === 'provincia') {
      next.distrito = '';
    }

    setLocalFiltros(next);
    onFiltrosChange(next);
  };

  const clearFiltros = () => {
    const empty: FiltrosGenerales = {
      departamento: '',
      provincia: '',
      distrito: '',
      localVotacion: '',
      partidoPolitico: '',
      fechaInicio: '',
      fechaFin: '',
      numeroMesa: '',
    };

    setLocalFiltros(empty);
    onFiltrosChange(empty);
  };

  useEffect(() => {
    const interval = window.setInterval(() => {
      setLiveStats((prev) => {
        const n = randomInt(6, 18);
        const v = randomInt(4, n);
        const o = randomInt(0, 2);
        const p = Math.max(0, n - v - o);

        return {
          ...prev,
          actasValidadas: prev.actasValidadas + v,
          actasObservadas: prev.actasObservadas + o,
          actasPendientes: prev.actasPendientes + p,
          mesasRegistradas: prev.mesasRegistradas + n,
          mesasPendientes: Math.max(0, prev.mesasPendientes - n),
          blancoNulo: prev.blancoNulo + randomInt(5, 18),
          activePersoneros: prev.activePersoneros + randomInt(0, 1),
        };
      });

      setLiveDepartmentVotes((prev) =>
        prev.map((item) => ({ ...item, votos: item.votos + randomInt(180, 850) })),
      );

      setLiveActas((prev) => {
        const newRow = createLiveActaRow();

        return [newRow, ...prev]
          .map((row, index) => ({
            ...row,
            horaRegistro: index === 0 ? 'Hace 0 min' : updateRelativeTime(index),
          }))
          .slice(0, 8);
      });
    }, 5000);

    return () => window.clearInterval(interval);
  }, []);

  const filteredActas = useMemo(() => {
    return actasMock.filter((a) => {
      if (localFiltros.departamento && a.departamento !== localFiltros.departamento) return false;
      if (localFiltros.provincia && a.provincia !== localFiltros.provincia) return false;
      if (localFiltros.distrito && a.distrito !== localFiltros.distrito) return false;

      if (localFiltros.partidoPolitico) {
        if (!a.votosPorPartido.some((vp) => vp.partidoId === localFiltros.partidoPolitico)) return false;
      }

      if (localFiltros.fechaInicio && a.fechaRegistro < localFiltros.fechaInicio) return false;
      if (localFiltros.fechaFin && a.fechaRegistro > localFiltros.fechaFin) return false;
      if (localFiltros.numeroMesa && !a.numeroMesa.includes(localFiltros.numeroMesa)) return false;

      return true;
    });
  }, [localFiltros]);

  const { totalNulos, totalBlanco } = useMemo(
    () => calcularVotosTotales(filteredActas),
    [filteredActas],
  );

  const totalMesas = liveStats.mesasRegistradas + liveStats.mesasPendientes;

  const avance =
    totalMesas > 0
      ? Math.min(100, Number(((liveStats.mesasRegistradas / totalMesas) * 100).toFixed(2)))
      : 0;

  const firstCandidate = liveCandidates[0];
  const secondCandidate = liveCandidates[1];

  const totalMainVotes = liveCandidates.reduce((sum, candidate) => sum + candidate.votes, 0);

  const diferencia =
    firstCandidate && secondCandidate
      ? Math.abs(firstCandidate.votes - secondCandidate.votes)
      : 0;

  const margen =
    totalMainVotes > 0
      ? ((diferencia / totalMainVotes) * 100).toFixed(2)
      : '0.00';

  const participacion =
    totalMesas > 0
      ? Math.min(100, Math.round((liveStats.mesasRegistradas / totalMesas) * 100))
      : 0;

  const availableProvincias = localFiltros.departamento
    ? PROVINCIAS_POR_DEPARTAMENTO[localFiltros.departamento] || []
    : [];

  const availableDistritos = localFiltros.provincia
    ? DISTRITOS_POR_PROVINCIA[localFiltros.provincia] || []
    : [];

  const hasFilters = Object.values(localFiltros).some((v) => v !== '');

  const hasTerritorialFilters =
    codDepartamentoTerritorial !== SELECT_TODOS ||
    codProvinciaTerritorial !== SELECT_TODOS ||
    codDistritoTerritorial !== SELECT_TODOS;

  const lastUpdateText = useMemo(() => {
    return lastUpdate.toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  }, [lastUpdate]);

  const formatNumber = (value: number) => value.toLocaleString('es-PE');

  const totalActasKpi = kpisGenerales.TOTALACTAS;
  const totalVotosEspecialesKpi = kpisGenerales.TOTALVOTOSESPECIALES;
  const totalVotosGeneralKpi = kpisGenerales.TOTALVOTOSGENERAL;
  const diferenciaPrimerSegundoKpi = kpisGenerales.DIFERENCIAPRIMERSEGUNDO;


  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'validada':
        return (
          <Badge className="border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700 hover:bg-emerald-50">
            <CheckCircle2 className="mr-1 h-3 w-3" /> Contabilizada
          </Badge>
        );

      case 'observada':
        return (
          <Badge className="border-red-200 bg-red-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-700 hover:bg-red-50">
            <AlertTriangle className="mr-1 h-3 w-3" /> Observada
          </Badge>
        );

      case 'pendiente':
        return (
          <Badge className="border-orange-200 bg-orange-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-orange-700 hover:bg-orange-50">
            <Hourglass className="mr-1 h-3 w-3" /> En proceso
          </Badge>
        );

      default:
        return (
          <Badge variant="secondary" className="text-[10px]">
            {status}
          </Badge>
        );
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-[#FFFBF7] text-[#24130A]"
      style={{
        fontFamily:
          'Inter, Manrope, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
      }}
    >
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.025]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #9A3412 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative mx-auto w-full max-w-[1480px] space-y-6 px-4 py-5 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between"
        >
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[#24130A] sm:text-3xl">
              Dashboard Electoral
            </h1>
            <p className="mt-1 text-sm font-medium text-orange-900/50">
              Seguimiento general de actas, mesas, votos y actividad operativa.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex items-center justify-center gap-2 rounded-xl border border-orange-200 bg-white px-4 py-2.5 text-[11px] font-black uppercase tracking-[0.16em] text-orange-700 shadow-sm backdrop-blur-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              <Radio className="h-3.5 w-3.5" />
              En línea
              <span className="hidden text-[10px] font-semibold normal-case tracking-normal text-orange-900/45 sm:inline">
                Actualizado: {lastUpdateText}
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="rounded-xl border-orange-200 bg-white text-orange-700 hover:bg-orange-50"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="mr-1.5 h-4 w-4" />
              Filtros
              <ChevronDown
                className={`ml-1 h-3.5 w-3.5 transition-transform ${
                  showFilters ? 'rotate-180' : ''
                }`}
              />
            </Button>
          </div>
        </motion.div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -8 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <Card className="rounded-2xl border border-orange-200/80 bg-white/90 shadow-sm backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
                    <Select
                      value={localFiltros.departamento}
                      onValueChange={(v) => updateFiltro('departamento', v)}
                    >
                      <SelectTrigger className={selectTriggerClass}>
                        <SelectValue placeholder="Departamento" />
                      </SelectTrigger>
                      <SelectContent className={selectContentClass}>
                        {DEPARTAMENTOS.map((d) => (
                          <SelectItem key={d} value={d} className={selectItemClass}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={localFiltros.provincia}
                      onValueChange={(v) => updateFiltro('provincia', v)}
                      disabled={!localFiltros.departamento}
                    >
                      <SelectTrigger className={selectTriggerClass}>
                        <SelectValue placeholder="Provincia" />
                      </SelectTrigger>
                      <SelectContent className={selectContentClass}>
                        {availableProvincias.map((p) => (
                          <SelectItem key={p} value={p} className={selectItemClass}>
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={localFiltros.distrito}
                      onValueChange={(v) => updateFiltro('distrito', v)}
                      disabled={!localFiltros.provincia}
                    >
                      <SelectTrigger className={selectTriggerClass}>
                        <SelectValue placeholder="Distrito" />
                      </SelectTrigger>
                      <SelectContent className={selectContentClass}>
                        {availableDistritos.map((d) => (
                          <SelectItem key={d} value={d} className={selectItemClass}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={localFiltros.partidoPolitico}
                      onValueChange={(v) => updateFiltro('partidoPolitico', v)}
                    >
                      <SelectTrigger className={selectTriggerClass}>
                        <SelectValue placeholder="Partido político" />
                      </SelectTrigger>
                      <SelectContent className={selectContentClass}>
                        {partidosMock.map((p) => (
                          <SelectItem key={p.id} value={p.id} className={selectItemClass}>
                            <div className="flex items-center gap-2">
                              <span
                                className="h-2.5 w-2.5 shrink-0 rounded-full"
                                style={{ backgroundColor: p.color }}
                              />
                              {p.nombre}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Input
                      type="date"
                      value={localFiltros.fechaInicio}
                      onChange={(e) => updateFiltro('fechaInicio', e.target.value)}
                      className="rounded-xl border-orange-200 bg-orange-50/80 text-xs backdrop-blur-sm"
                    />

                    <Input
                      type="date"
                      value={localFiltros.fechaFin}
                      onChange={(e) => updateFiltro('fechaFin', e.target.value)}
                      className="rounded-xl border-orange-200 bg-orange-50/80 text-xs backdrop-blur-sm"
                    />

                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-orange-400" />
                      <Input
                        value={localFiltros.numeroMesa}
                        onChange={(e) => updateFiltro('numeroMesa', e.target.value)}
                        placeholder="N° mesa"
                        className="rounded-xl border-orange-200 bg-orange-50/80 pl-8 text-xs backdrop-blur-sm"
                      />
                    </div>
                  </div>

                  {hasFilters && (
                    <div className="mt-3 flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFiltros}
                        className="h-8 text-xs text-orange-700 hover:bg-orange-50 hover:text-orange-800"
                      >
                        <X className="mr-1 h-3.5 w-3.5" />
                        Limpiar filtros
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div initial="hidden" animate="visible" variants={sectionVariants}>
          <Card className="overflow-hidden rounded-3xl border border-orange-100 shadow-xl shadow-orange-200/40">
            <div className="relative bg-gradient-to-br from-orange-50 via-white to-orange-100/50">
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-orange-200/30 blur-3xl" />
                <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-orange-100/40 blur-3xl" />
                <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-100/30 blur-2xl" />
              </div>

              <div className="relative p-5 sm:p-7 lg:p-9">
                <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-black tracking-tight text-[#24130A] sm:text-3xl lg:text-4xl">
                        Resultados Principales
                      </h2>
                    </div>
                    <p className="mt-1.5 text-sm font-medium text-orange-900/50">
                      Escrutinio en vivo con datos actualizados desde el servidor
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        cargarKpisGenerales();
                        cargarResultadosPrincipales();
                        cargarLineaTiempo();
                        cargarDistribucionTerritorial();
                      }}
                      className="rounded-full border-orange-200 bg-white text-[10px] font-black uppercase tracking-[0.12em] text-orange-700 hover:bg-orange-50"
                    >
                      <RefreshCcw className="mr-1.5 h-3.5 w-3.5" />
                      Actualizar
                    </Button>

                    <Badge className="w-fit rounded-full border border-orange-200 bg-orange-100 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-orange-700 backdrop-blur-sm hover:bg-orange-100">
                      <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                      En vivo
                    </Badge>
                  </div>
                </div>

                <div className="relative grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
                  {liveCandidates.length >= 2 && (
                    <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 lg:flex">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-orange-200 bg-gradient-to-br from-orange-500 to-orange-600 text-base font-black text-white shadow-lg shadow-orange-300/50">
                        VS
                      </div>
                    </div>
                  )}

                  {loadingResultadosPrincipales ? (
                    <div className="col-span-1 rounded-2xl border border-orange-100 bg-white/80 p-6 text-center shadow-sm backdrop-blur-sm lg:col-span-2">
                      <p className="text-sm font-bold text-orange-700">
                        Cargando resultados principales...
                      </p>
                    </div>
                  ) : errorResultadosPrincipales ? (
                    <div className="col-span-1 rounded-2xl border border-red-100 bg-red-50 p-6 text-center shadow-sm lg:col-span-2">
                      <p className="text-sm font-bold text-red-700">
                        {errorResultadosPrincipales}
                      </p>
                    </div>
                  ) : liveCandidates.length === 0 ? (
                    <div className="col-span-1 rounded-2xl border border-orange-100 bg-white/80 p-6 text-center shadow-sm backdrop-blur-sm lg:col-span-2">
                      <p className="text-sm font-bold text-orange-700">
                        No hay resultados principales disponibles
                      </p>
                    </div>
                  ) : (
                    liveCandidates.map((candidate) => (
                      <div
                        key={candidate.id}
                        className="relative overflow-hidden rounded-2xl border border-orange-100 bg-white/80 p-5 shadow-sm backdrop-blur-sm sm:p-6"
                      >
                        <div
                          className="absolute inset-x-0 top-0 h-1"
                          style={{ backgroundColor: candidate.color }}
                        />

                        <div
                          className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full blur-2xl"
                          style={{ backgroundColor: candidate.color, opacity: 0.08 }}
                        />

                        <div className="relative flex items-start gap-4">
                          <div className="relative shrink-0">
                            <div
                              className="h-[76px] w-[76px] overflow-hidden rounded-2xl border-[3px] bg-white shadow-lg sm:h-[84px] sm:w-[84px]"
                              style={{ borderColor: candidate.color }}
                            >
                              <img
                                src={candidate.photo}
                                alt={candidate.displayName}
                                className="h-full w-full object-cover"
                              />
                            </div>

                            <div className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-white shadow-md">
                              <img
                                src={candidate.logo}
                                alt={candidate.partyName}
                                className="h-full w-full object-contain p-1"
                              />
                            </div>
                          </div>

                          <div className="min-w-0 flex-1">
                            <h3 className="truncate text-xl font-black leading-tight text-[#24130A] sm:text-2xl">
                              {candidate.displayName}
                            </h3>

                            <span
                              className="mt-1.5 inline-block rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em]"
                              style={{
                                backgroundColor: `${candidate.color}18`,
                                color: candidate.darkColor,
                              }}
                            >
                              {candidate.partyName}
                            </span>
                          </div>
                        </div>

                        <div className="mt-6 flex items-end gap-2">
                          <RollingNumber
                            value={formatNumber(candidate.votes)}
                            className="text-4xl font-black tracking-tight sm:text-5xl lg:text-[3.4rem]"
                            style={{ color: candidate.color }}
                          />
                          <span className="mb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-orange-900/40">
                            votos
                          </span>
                        </div>

                        <div className="mt-5 h-3.5 overflow-hidden rounded-full bg-orange-100">
                          <motion.div
                            initial={false}
                            animate={{ width: `${Math.min(100, candidate.progress)}%` }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="h-full rounded-full"
                            style={{
                              backgroundColor: candidate.color,
                              boxShadow: `0 0 12px ${candidate.color}40`,
                            }}
                          />
                        </div>

                        <div className="mt-2 flex items-center justify-between text-[10px] font-bold text-orange-900/40">
                          <span>{candidate.progress.toFixed(2)}% de votos</span>
                          <span>{candidate.partyShortName}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
                  <div className="rounded-2xl border border-orange-100 bg-white/60 p-4 text-center backdrop-blur-sm">
                    <div className="text-[9px] font-black uppercase tracking-[0.16em] text-orange-900/50">
                      Total actas
                    </div>
                    <RollingNumber
                      value={loadingKpisGenerales ? '...' : formatNumber(totalActasKpi)}
                      className="mt-1 block text-2xl font-black text-[#24130A] sm:text-3xl"
                    />
                    <div className="text-[10px] font-bold text-orange-900/40">
                      Hay {formatNumber(totalActasKpi)} actas registradas
                    </div>
                  </div>

                  <div className="rounded-2xl border border-orange-100 bg-white/60 p-4 text-center backdrop-blur-sm">
                    <div className="text-[9px] font-black uppercase tracking-[0.16em] text-orange-900/50">
                      Votos especiales
                    </div>
                    <RollingNumber
                      value={loadingKpisGenerales ? '...' : formatNumber(totalVotosEspecialesKpi)}
                      className="mt-1 block text-2xl font-black text-[#24130A] sm:text-3xl"
                    />
                     <div className="text-[9px] font-black uppercase tracking-[0.16em] text-orange-900/50">
                      Blanco / Nulo / Impugnado
                    </div>
                  </div>

                  <div className="rounded-2xl border border-orange-100 bg-white/60 p-4 text-center backdrop-blur-sm">
                    <div className="text-[9px] font-black uppercase tracking-[0.16em] text-orange-900/50">
                      Total votos
                    </div>
                    <RollingNumber
                      value={loadingKpisGenerales ? '...' : formatNumber(totalVotosGeneralKpi)}
                      className="mt-1 block text-2xl font-black text-[#24130A] sm:text-3xl"
                    />
                    <div className="text-[10px] font-bold text-orange-900/40">
                      Votos partidos + votos especiales
                    </div>
                  </div>

                  <div className="rounded-2xl border border-orange-100 bg-white/60 p-4 text-center backdrop-blur-sm">
                    <div className="text-[9px] font-black uppercase tracking-[0.16em] text-orange-900/50">
                      Diferencia
                    </div>
                    <RollingNumber
                      value={loadingKpisGenerales ? '...' : formatNumber(diferenciaPrimerSegundoKpi)}
                      className="mt-1 block text-2xl font-black text-[#24130A] sm:text-3xl"
                    />
                    <div className="text-[10px] font-bold text-orange-900/40">
                      El primer partido supera al segundo
                    </div>
                  </div>

                  {errorKpisGenerales && (
                    <div className="col-span-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-center text-[11px] font-bold text-red-700 md:col-span-4">
                      {errorKpisGenerales}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <motion.div initial="hidden" animate="visible" variants={sectionVariants}>
            <Card className="h-full rounded-2xl border border-orange-100/80 bg-white shadow-sm">
              <CardContent className="p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-black text-[#24130A]">
                      Distribución territorial
                    </h2>
                    <p className="mt-0.5 text-[11px] font-medium text-orange-900/45">
                      Comparativo dinámico por ubicación y partido
                    </p>
                  </div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50">
                    <MapPin className="h-4 w-4 text-orange-600" />
                  </div>
                </div>

                <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                  <Select
                    value={codDepartamentoTerritorial}
                    onValueChange={handleDepartamentoTerritorialChange}
                  >
                    <SelectTrigger className={selectTriggerClass}>
                      <SelectValue placeholder="Departamento" />
                    </SelectTrigger>
                    <SelectContent className={selectContentClass}>
                      <SelectItem value={SELECT_TODOS} className={selectItemClass}>
                        Todos los departamentos
                      </SelectItem>
                      {departamentosApi.map((item) => (
                        <SelectItem
                          key={item.CODDEPARTAMENTO}
                          value={item.CODDEPARTAMENTO}
                          className={selectItemClass}
                        >
                          {item.TXTNOMBRE}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={codProvinciaTerritorial}
                    onValueChange={handleProvinciaTerritorialChange}
                    disabled={codDepartamentoTerritorial === SELECT_TODOS}
                  >
                    <SelectTrigger className={selectTriggerClass}>
                      <SelectValue placeholder="Provincia" />
                    </SelectTrigger>
                    <SelectContent className={selectContentClass}>
                      <SelectItem value={SELECT_TODOS} className={selectItemClass}>
                        Todas las provincias
                      </SelectItem>
                      {provinciasApi.map((item) => (
                        <SelectItem
                          key={item.CODPROVINCIA}
                          value={item.CODPROVINCIA}
                          className={selectItemClass}
                        >
                          {item.TXTNOMBRE}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={codDistritoTerritorial}
                    onValueChange={handleDistritoTerritorialChange}
                    disabled={codDepartamentoTerritorial === SELECT_TODOS || codProvinciaTerritorial === SELECT_TODOS}
                  >
                    <SelectTrigger className={selectTriggerClass}>
                      <SelectValue placeholder="Distrito" />
                    </SelectTrigger>
                    <SelectContent className={selectContentClass}>
                      <SelectItem value={SELECT_TODOS} className={selectItemClass}>
                        Todos los distritos
                      </SelectItem>
                      {distritosApi.map((item) => (
                        <SelectItem
                          key={item.CODDISTRITO}
                          value={item.CODDISTRITO}
                          className={selectItemClass}
                        >
                          {item.TXTNOMBRE}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {hasTerritorialFilters && (
                  <div className="mb-4 flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={limpiarFiltrosTerritoriales}
                      className="h-8 text-xs text-orange-700 hover:bg-orange-50 hover:text-orange-800"
                    >
                      <X className="mr-1 h-3.5 w-3.5" />
                      Limpiar ubicación
                    </Button>
                  </div>
                )}

                {loadingTerritorial ? (
                  <div className="flex min-h-[260px] items-center justify-center rounded-xl border border-orange-100 bg-orange-50/50">
                    <p className="text-xs font-bold text-orange-700">
                      Cargando distribución territorial...
                    </p>
                  </div>
                ) : errorTerritorial ? (
                  <div className="flex min-h-[260px] items-center justify-center rounded-xl border border-red-100 bg-red-50">
                    <p className="text-xs font-bold text-red-700">
                      {errorTerritorial}
                    </p>
                  </div>
                ) : territorialData.length === 0 ? (
                  <div className="flex min-h-[260px] items-center justify-center rounded-xl border border-orange-100 bg-orange-50/50">
                    <p className="text-xs font-bold text-orange-700">
                      No hay datos de distribución territorial
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {territorialData.map((item, index) => (
                      <div key={`${item.codigoUbicacion}-${index}`}>
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <div>
                            <div className="text-xs font-black text-[#24130A]">
                              {item.nombreUbicacion}
                            </div>
                            <div className="text-[9px] font-bold uppercase tracking-[0.12em] text-orange-900/40">
                              {item.nivel} {item.codigoUbicacion ? `- ${item.codigoUbicacion}` : ''}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {item.partidos.map((party) => (
                            <div key={`${item.codigoUbicacion}-${party.idPartido}`}>
                              <div className="mb-1 flex items-center justify-between text-[10px] font-bold">
                                <div
                                  className="flex min-w-0 items-center gap-1.5"
                                  style={{ color: party.color }}
                                >
                                  {party.logoPartido && (
                                    <img
                                      src={party.logoPartido}
                                      alt={party.siglas}
                                      className="h-4 w-4 shrink-0 rounded-full object-contain"
                                    />
                                  )}
                                  <span className="truncate">{party.nombrePartido}</span>
                                </div>

                                <div className="flex shrink-0 items-center gap-2">
                                  <span className="text-orange-900/40">
                                    {formatNumber(party.totalVotos)} votos
                                  </span>
                                  <span style={{ color: party.color }}>
                                    <RollingNumber value={`${party.porcentaje.toFixed(2)}%`} />
                                  </span>
                                </div>
                              </div>

                              <div className="h-2 overflow-hidden rounded-full bg-orange-100">
                                <motion.div
                                  initial={false}
                                  animate={{ width: `${Math.min(100, party.porcentaje)}%` }}
                                  transition={{
                                    duration: 0.7,
                                    delay: index * 0.05,
                                    ease: [0.16, 1, 0.3, 1],
                                  }}
                                  className="h-full rounded-full"
                                  style={{ backgroundColor: party.color }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

               
              </CardContent>
            </Card>
          </motion.div>

          <div className="space-y-5">
            <motion.div initial="hidden" animate="visible" variants={sectionVariants}>
              <Card className="rounded-2xl border border-orange-100/80 bg-white shadow-sm">
                <CardContent className="p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-black text-[#24130A]">
                        Línea de tiempo
                      </h2>
                      <p className="mt-0.5 text-[11px] font-medium text-orange-900/45">
                        Flujo de votos por hora
                      </p>
                    </div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50">
                      <Clock className="h-4 w-4 text-orange-600" />
                    </div>
                  </div>

                  <div className="h-[170px]">
                    {loadingLineaTiempo ? (
                      <div className="flex h-full items-center justify-center rounded-xl border border-orange-100 bg-orange-50/50">
                        <p className="text-xs font-bold text-orange-700">
                          Cargando línea de tiempo...
                        </p>
                      </div>
                    ) : errorLineaTiempo ? (
                      <div className="flex h-full items-center justify-center rounded-xl border border-red-100 bg-red-50">
                        <p className="text-xs font-bold text-red-700">
                          {errorLineaTiempo}
                        </p>
                      </div>
                    ) : liveTimeline.length === 0 ? (
                      <div className="flex h-full items-center justify-center rounded-xl border border-orange-100 bg-orange-50/50">
                        <p className="text-xs font-bold text-orange-700">
                          No hay datos de línea de tiempo
                        </p>
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={liveTimeline}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#FFF0E0" />
                          <XAxis
                            dataKey="hora"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: '#9A3412', fontWeight: 700 }}
                          />
                          <YAxis hide />
                          <Tooltip
                            cursor={{ fill: 'rgba(249, 115, 22, 0.06)' }}
                            content={<CustomChartTooltip />}
                          />
                          <Bar dataKey="votos" radius={[6, 6, 0, 0]}>
                            {liveTimeline.map((_, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={
                                  index === liveTimeline.length - 1
                                    ? PRIMARY
                                    : index >= liveTimeline.length - 2
                                      ? PRIMARY_LIGHT
                                      : '#FED7AA'
                                }
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

           
          </div>
        </div>

        <motion.div initial="hidden" animate="visible" variants={sectionVariants}>
          <Card className="overflow-hidden rounded-2xl border border-orange-100/80 bg-white shadow-sm">
            <CardContent className="p-0">
              <div className="flex flex-col gap-4 border-b border-orange-100/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-base font-black text-[#24130A]">
                    Últimas actas recibidas
                  </h2>
                  <p className="mt-0.5 text-[11px] font-medium text-orange-900/45">
                    Registro operativo simulado en tiempo real
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-xl border-orange-200 bg-white text-orange-700 hover:bg-orange-50"
                  >
                    <Filter className="h-4 w-4" />
                  </Button>

                  <Button className="h-9 rounded-xl bg-orange-600 px-4 text-[11px] font-bold uppercase tracking-[0.08em] text-white hover:bg-orange-700">
                    <Download className="mr-2 h-4 w-4" />
                    Descargar reporte
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table className="min-w-[820px]">
                  <TableHeader>
                    <TableRow className="border-orange-100/80 bg-orange-50/60 hover:bg-orange-50/60">
                      <TableHead className="h-10 w-[170px] whitespace-nowrap text-[9px] font-black uppercase tracking-[0.14em] text-orange-800/60">
                        ID acta
                      </TableHead>
                      <TableHead className="h-10 min-w-[260px] whitespace-nowrap text-[9px] font-black uppercase tracking-[0.14em] text-orange-800/60">
                        Ubicación
                      </TableHead>
                      <TableHead className="h-10 w-[160px] whitespace-nowrap text-[9px] font-black uppercase tracking-[0.14em] text-orange-800/60">
                        Estado
                      </TableHead>
                      <TableHead className="h-10 w-[120px] whitespace-nowrap text-[9px] font-black uppercase tracking-[0.14em] text-orange-800/60">
                        Mesa
                      </TableHead>
                      <TableHead className="h-10 w-[150px] whitespace-nowrap text-right text-[9px] font-black uppercase tracking-[0.14em] text-orange-800/60">
                        Hora registro
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {liveActas.map((acta) => (
                      <TableRow key={acta.id} className="border-orange-100/60 hover:bg-orange-50/40">
                        <TableCell className="py-3.5 text-sm font-black text-[#24130A]">
                          <div className="flex items-center gap-2">
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                acta.estado === 'validada'
                                  ? 'bg-emerald-400'
                                  : acta.estado === 'observada'
                                    ? 'bg-red-400'
                                    : 'bg-orange-400'
                              }`}
                            />
                            <span className="whitespace-nowrap">{acta.id}</span>
                          </div>
                        </TableCell>

                        <TableCell className="py-3.5">
                          <div className="text-sm font-black text-[#24130A]">
                            {acta.ubicacion}
                          </div>
                          <div className="mt-0.5 text-[10px] font-semibold text-orange-900/40">
                            {acta.centro}
                          </div>
                        </TableCell>

                        <TableCell className="py-3.5">
                          {getStatusBadge(acta.estado)}
                        </TableCell>

                        <TableCell className="py-3.5 text-sm font-black text-[#24130A]">
                          <RollingNumber value={acta.mesa} />
                        </TableCell>

                        <TableCell className="py-3.5 text-right text-sm font-black text-[#24130A]">
                          {acta.horaRegistro}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="border-t border-orange-100/80 py-3.5 text-center">
                <Button
                  variant="ghost"
                  className="h-8 text-[11px] font-bold uppercase tracking-[0.12em] text-orange-700 hover:bg-orange-50"
                >
                  Cargar más actas
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function RollingNumber({ value, className = '', style }: RollingNumberProps) {
  const text = String(value);
  const characters = Array.from(text);

  const getCharacterWidth = (character: string) => {
    if (character === ',') return '0.22em';
    if (character === '.') return '0.22em';
    if (character === '%') return '0.58em';
    if (character === ' ') return '0.28em';

    return '0.58em';
  };

  return (
    <span
      className={`inline-flex max-w-full items-baseline whitespace-nowrap tabular-nums ${className}`}
      style={style}
      aria-label={text}
    >
      {characters.map((character, index) => (
        <span
          key={`${index}-${character}`}
          className="relative inline-flex h-[1.18em] overflow-visible align-baseline leading-none"
          style={{ minWidth: getCharacterWidth(character), perspective: 120 }}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={`${character}-${index}-${text}`}
              initial={{ y: '0.9em', rotateX: 90, opacity: 0, filter: 'blur(2px)' }}
              animate={{ y: '0em', rotateX: 0, opacity: 1, filter: 'blur(0px)' }}
              exit={{ y: '-0.9em', rotateX: -90, opacity: 0, filter: 'blur(2px)' }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="inline-block origin-center leading-none"
            >
              {character === ' ' ? '\u00A0' : character}
            </motion.span>
          </AnimatePresence>
        </span>
      ))}
    </span>
  );
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createLiveActaRow(): LiveActaRow {
  const locations = [
    { ubicacion: 'Lima, San Isidro', centro: 'I.E. Alfonso Ugarte' },
    { ubicacion: 'Lima, Miraflores', centro: 'Colegio San Agustín' },
    { ubicacion: 'Arequipa, Cercado', centro: 'I.E. Independencia' },
    { ubicacion: 'Cusco, Wanchaq', centro: 'U.N. San Antonio Abad' },
    { ubicacion: 'Piura, Castilla', centro: 'I.E. Miguel Cortés' },
    { ubicacion: 'La Libertad, Trujillo', centro: 'Colegio Modelo' },
  ];

  const estados: LiveActaRow['estado'][] = [
    'validada',
    'validada',
    'validada',
    'pendiente',
    'observada',
  ];

  const loc = locations[randomInt(0, locations.length - 1)];
  const status = estados[randomInt(0, estados.length - 1)];
  const num = randomInt(92841, 99999);
  const letter = String.fromCharCode(65 + randomInt(0, 25));

  return {
    id: `#ACT-${num}-${letter}`,
    ubicacion: loc.ubicacion,
    centro: loc.centro,
    estado: status,
    mesa: String(randomInt(10000, 99999)).padStart(6, '0'),
    horaRegistro: 'Hace 0 min',
  };
}

function updateRelativeTime(index: number) {
  const minutes = Math.max(1, index * randomInt(2, 4));

  if (minutes < 60) return `Hace ${minutes} min`;

  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;

  return `Hace ${hours}h ${rest}m`;
}