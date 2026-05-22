// Types for the Electoral Administration System

import { ReactNode } from "react";

export type ModuleView =
  | "dashboard"
  | "personeros"
  | "partidos"
  | "actas"
  | "mesas"
  | "reportes"
  | "configuracion";

export type EstadoPersonero = "activo" | "inactivo" | "pendiente";

export type EstadoPartido = "activo" | "inactivo";

export type EstadoValidacion = "pendiente" | "validada" | "observada" | "rechazada";

export type EstadoMesa = "activa" | "cerrada" | "instalada";

export interface Personero {
  id: string;
  nombreCompleto: string;
  dni: string;
  celular: string;
  correo: string;
  departamento: string;
  provincia: string;
  distrito: string;
  estado: EstadoPersonero;
  fechaRegistro: string;
}

export interface PartidoPolitico {
  id: string;
  nombre: string;
  siglas: string;
  logo: string;
  color: string;
  estado: EstadoPartido;
}

export interface VotoPartido {
  partidoId: string;
  partidoNombre: string;
  partidoSiglas: string;
  partidoColor: string;
  votos: number;
}

export interface ActaRegistrada {
  id: string;
  numeroMesa: string;
  personeroId: string;
  personeroNombre: string;
  departamento: string;
  provincia: string;
  distrito: string;
  localVotacion: string;
  fechaRegistro: string;
  horaRegistro: string;
  imagenActa: string;
  votosPorPartido: VotoPartido[];
  votosNulos: number;
  votosBlanco: number;
  totalVotos: number;
  estadoValidacion: EstadoValidacion;
}

export interface MesaElectoral {
  id: string;
  numeroMesa: string;
  departamento: string;
  provincia: string;
  distrito: string;
  localVotacion: string;
  estado: EstadoMesa;
  fechaRegistro: string;
}

export interface Ubicacion {
  departamento: string;
  provincia: string;
  distrito: string;
}

export interface TimelineEntry {
  evento: ReactNode;
  departamento: ReactNode;
  hora: string;
  numeroMesa: string;
  personero: string;
  partidoMayorVotacion: string;
  partidoColor: string;
  totalVotos: number;
}

export interface FiltrosGenerales {
  departamento: string;
  provincia: string;
  distrito: string;
  localVotacion: string;
  partidoPolitico: string;
  fechaInicio: string;
  fechaFin: string;
  numeroMesa: string;
}

export const DEPARTAMENTOS = [
  "Lima",
  "Arequipa",
  "Cusco",
  "La Libertad",
  "Piura",
  "Junín",
  "Loreto",
  "Ancash",
];

export const PROVINCIAS_POR_DEPARTAMENTO: Record<string, string[]> = {
  Lima: ["Lima", "Callao", "Huaral", "Cañete", "Barranca"],
  Arequipa: ["Arequipa", "Caylloma", "Islay", "Condesuyos"],
  Cusco: ["Cusco", "Urubamba", "Quispicanchi", "Anta"],
  "La Libertad": ["Trujillo", "Chepén", "Pacasmayo", "Sánchez Carrión"],
  Piura: ["Piura", "Sullana", "Talara", "Paita"],
  Junín: ["Huancayo", "Tarma", "Chanchamayo", "Jauja"],
  Loreto: ["Maynas", "Alto Amazonas", "Loreto", "Ucayali"],
  Ancash: ["Huaraz", "Sihuas", "Casma", "Chimbote"],
};

export const DISTRITOS_POR_PROVINCIA: Record<string, string[]> = {
  Lima: ["Lima Centro", "Miraflores", "San Isidro", "La Victoria", "San Juan de Lurigancho"],
  Callao: ["Callao", "La Punta", "Bellavista", "Carmen de la Legua"],
  Huaral: ["Huaral", "Chancay", "Aucallama"],
  Cañete: ["San Vicente", "Mala", "Chilca"],
  Barranca: ["Barranca", "Supe", "Pativilca"],
  Arequipa: ["Arequipa", "Cayma", "Cerro Colorado", "Yanahuara"],
  Caylloma: ["Chivay", "Cabanaconde", "Maca"],
  Islay: ["Mollendo", "Mejía"],
  Condesuyos: ["Chuquibamba", "Andaray"],
  Cusco: ["Cusco", "San Sebastián", "San Jerónimo", "Wanchaq"],
  Urubamba: ["Urubamba", "Ollantaytambo", "Yucay"],
  Quispicanchi: ["Urcos", "Andahuaylillas"],
  Anta: ["Anta", "Limatambo"],
  Trujillo: ["Trujillo", "El Porvenir", "Florencia de Mora", "La Esperanza"],
  Chepén: ["Chepén", "Pacanga"],
  Pacasmayo: ["San Pedro de Lloc", "Guadalupe"],
  "Sánchez Carrión": ["Huamachuco", "Chugay"],
  Piura: ["Piura", "Castilla", "Catacaos"],
  Sullana: ["Sullana", "Bellavista"],
  Talara: ["Pariñas", "El Alto"],
  Paita: ["Paita", "Colán"],
  Huancayo: ["Huancayo", "Chilca", "El Tambo"],
  Tarma: ["Tarma", "Acobamba"],
  Chanchamayo: ["La Merced", "San Ramón"],
  Jauja: ["Jauja", "Marco"],
  Maynas: ["Iquitos", "Punchana"],
  "Alto Amazonas": ["Yurimaguas", "Lagunas"],
  Loreto: ["Nauta"],
  Ucayali: ["Contamana", "Pucallpa"],
  Huaraz: ["Huaraz", "Independencia"],
  Sihuas: ["Sihuas", "Matacachi"],
  Casma: ["Casma", "Buenos Aires"],
  Chimbote: ["Chimbote", "Nuevo Chimbote"],
};

export const LOCALES_POR_DISTRITO: Record<string, string[]> = {
  "Lima Centro": ["I.E. Gran Unidad Escolar", "I.E. Ricardo Bentín", "I.E. Melitón Carbajo"],
  Miraflores: ["I.E. Ricardo Palma", "I.E. República de Argentina"],
  "San Isidro": ["I.E. Rosa de Santa María", "I.E. Lord Byron"],
  "La Victoria": ["I.E. Manuel Scorza", "I.E. César Vallejo"],
  "San Juan de Lurigancho": ["I.E. Ciro Alegría", "I.E. María Parado de Bellido"],
  Callao: ["I.E. San José", "I.E. Dos de Mayo"],
  Arequipa: ["I.E. Coronel Bolognesi", "I.E. Mariano Melgar"],
  Cusco: ["I.E. Garcilaso de la Vega", "I.E. Inca Gracilaso"],
  Trujillo: ["I.E. San Juan", "I.E. César Vallejo"],
  Piura: ["I.E. Miguel Grau", "I.E. San Miguel"],
  Huancayo: ["I.E. Santa Isabel", "I.E. María Auxiliadora"],
  Iquitos: ["I.E. Iquitos", "I.E. San Juan"],
  Huaraz: ["I.E. La Libertad", "I.E. Augusto Salazar Bondy"],
  Chimbote: ["I.E. San Pedro", "I.E. José Gálvez"],
};
