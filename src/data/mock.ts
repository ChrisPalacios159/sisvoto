import {
  Personero,
  PartidoPolitico,
  ActaRegistrada,
  MesaElectoral,
  TimelineEntry,
} from "@/types/electoral";

// ===== PARTIDOS POLÍTICOS =====
export const partidosMock: PartidoPolitico[] = [
  {
    id: "p1",
    nombre: "Fuerza Popular",
    siglas: "FP",
    logo: "/partidos/fp.png",
    color: "#FF6B00",
    estado: "activo",
  },
  {
    id: "p2",
    nombre: "Perú Libre",
    siglas: "PL",
    logo: "/partidos/pl.png",
    color: "#E3292E",
    estado: "activo",
  },
  {
    id: "p3",
    nombre: "Acción Popular",
    siglas: "AP",
    logo: "/partidos/ap.png",
    color: "#1B5E8C",
    estado: "activo",
  },
  {
    id: "p4",
    nombre: "Alianza para el Progreso",
    siglas: "APP",
    logo: "/partidos/app.png",
    color: "#2E8B57",
    estado: "activo",
  },
  {
    id: "p5",
    nombre: "Avanza País",
    siglas: "AP",
    logo: "/partidos/ap2.png",
    color: "#6B3FA0",
    estado: "activo",
  },
  {
    id: "p6",
    nombre: "Juntos por el Perú",
    siglas: "JPP",
    logo: "/partidos/jpp.png",
    color: "#D4A017",
    estado: "activo",
  },
  {
    id: "p7",
    nombre: "Renovación Popular",
    siglas: "RP",
    logo: "/partidos/rp.png",
    color: "#008B8B",
    estado: "activo",
  },
  {
    id: "p8",
    nombre: "Somos Perú",
    siglas: "SP",
    logo: "/partidos/sp.png",
    color: "#CD853F",
    estado: "activo",
  },
];

// ===== PERSONEROS =====
export const personerosMock: Personero[] = [
  {
    id: "per1",
    nombreCompleto: "María García López",
    dni: "45678901",
    celular: "987654321",
    correo: "maria.garcia@email.com",
    departamento: "Lima",
    provincia: "Lima",
    distrito: "Lima Centro",
    estado: "activo",
    fechaRegistro: "2026-01-15T09:00:00Z",
  },
  {
    id: "per2",
    nombreCompleto: "Carlos Mendoza Ríos",
    dni: "45678902",
    celular: "987654322",
    correo: "carlos.mendoza@email.com",
    departamento: "Lima",
    provincia: "Lima",
    distrito: "Miraflores",
    estado: "activo",
    fechaRegistro: "2026-01-15T09:30:00Z",
  },
  {
    id: "per3",
    nombreCompleto: "Rosa Quispe Huamán",
    dni: "45678903",
    celular: "987654323",
    correo: "rosa.quispe@email.com",
    departamento: "Cusco",
    provincia: "Cusco",
    distrito: "Cusco",
    estado: "activo",
    fechaRegistro: "2026-01-16T08:00:00Z",
  },
  {
    id: "per4",
    nombreCompleto: "Jorge Ramírez Torres",
    dni: "45678904",
    celular: "987654324",
    correo: "jorge.ramirez@email.com",
    departamento: "Arequipa",
    provincia: "Arequipa",
    distrito: "Arequipa",
    estado: "activo",
    fechaRegistro: "2026-01-16T10:00:00Z",
  },
  {
    id: "per5",
    nombreCompleto: "Ana Castillo Flores",
    dni: "45678905",
    celular: "987654325",
    correo: "ana.castillo@email.com",
    departamento: "La Libertad",
    provincia: "Trujillo",
    distrito: "Trujillo",
    estado: "activo",
    fechaRegistro: "2026-01-17T07:30:00Z",
  },
  {
    id: "per6",
    nombreCompleto: "Pedro Suárez Mendoza",
    dni: "45678906",
    celular: "987654326",
    correo: "pedro.suarez@email.com",
    departamento: "Piura",
    provincia: "Piura",
    distrito: "Piura",
    estado: "activo",
    fechaRegistro: "2026-01-17T08:15:00Z",
  },
  {
    id: "per7",
    nombreCompleto: "Luisa Vargas Gutiérrez",
    dni: "45678907",
    celular: "987654327",
    correo: "luisa.vargas@email.com",
    departamento: "Junín",
    provincia: "Huancayo",
    distrito: "Huancayo",
    estado: "activo",
    fechaRegistro: "2026-01-17T09:00:00Z",
  },
  {
    id: "per8",
    nombreCompleto: "Miguel Rojas Paredes",
    dni: "45678908",
    celular: "987654328",
    correo: "miguel.rojas@email.com",
    departamento: "Loreto",
    provincia: "Maynas",
    distrito: "Iquitos",
    estado: "pendiente",
    fechaRegistro: "2026-01-18T10:00:00Z",
  },
  {
    id: "per9",
    nombreCompleto: "Carmen Delgado Vega",
    dni: "45678909",
    celular: "987654329",
    correo: "carmen.delgado@email.com",
    departamento: "Ancash",
    provincia: "Chimbote",
    distrito: "Chimbote",
    estado: "activo",
    fechaRegistro: "2026-01-18T11:00:00Z",
  },
  {
    id: "per10",
    nombreCompleto: "Roberto Espinoza Chávez",
    dni: "45678910",
    celular: "987654330",
    correo: "roberto.espinoza@email.com",
    departamento: "Lima",
    provincia: "Callao",
    distrito: "Callao",
    estado: "inactivo",
    fechaRegistro: "2026-01-19T08:00:00Z",
  },
  {
    id: "per11",
    nombreCompleto: "Patricia Nolasco Soto",
    dni: "45678911",
    celular: "987654331",
    correo: "patricia.nolasco@email.com",
    departamento: "Lima",
    provincia: "Lima",
    distrito: "La Victoria",
    estado: "activo",
    fechaRegistro: "2026-01-19T09:30:00Z",
  },
  {
    id: "per12",
    nombreCompleto: "Fernando Dávila Ríos",
    dni: "45678912",
    celular: "987654332",
    correo: "fernando.davila@email.com",
    departamento: "Cusco",
    provincia: "Urubamba",
    distrito: "Urubamba",
    estado: "pendiente",
    fechaRegistro: "2026-01-20T07:00:00Z",
  },
];

// ===== MESAS ELECTORALES =====
export const mesasMock: MesaElectoral[] = [
  { id: "m1", numeroMesa: "000001", departamento: "Lima", provincia: "Lima", distrito: "Lima Centro", localVotacion: "I.E. Gran Unidad Escolar", estado: "cerrada", fechaRegistro: "2026-03-01T07:00:00Z" },
  { id: "m2", numeroMesa: "000002", departamento: "Lima", provincia: "Lima", distrito: "Lima Centro", localVotacion: "I.E. Gran Unidad Escolar", estado: "cerrada", fechaRegistro: "2026-03-01T07:00:00Z" },
  { id: "m3", numeroMesa: "000003", departamento: "Lima", provincia: "Lima", distrito: "Miraflores", localVotacion: "I.E. Ricardo Palma", estado: "cerrada", fechaRegistro: "2026-03-01T07:00:00Z" },
  { id: "m4", numeroMesa: "000004", departamento: "Lima", provincia: "Lima", distrito: "San Isidro", localVotacion: "I.E. Rosa de Santa María", estado: "cerrada", fechaRegistro: "2026-03-01T07:00:00Z" },
  { id: "m5", numeroMesa: "000005", departamento: "Lima", provincia: "Callao", distrito: "Callao", localVotacion: "I.E. San José", estado: "cerrada", fechaRegistro: "2026-03-01T07:00:00Z" },
  { id: "m6", numeroMesa: "000006", departamento: "Lima", provincia: "Lima", distrito: "La Victoria", localVotacion: "I.E. Manuel Scorza", estado: "cerrada", fechaRegistro: "2026-03-01T07:00:00Z" },
  { id: "m7", numeroMesa: "000007", departamento: "Lima", provincia: "Lima", distrito: "San Juan de Lurigancho", localVotacion: "I.E. Ciro Alegría", estado: "cerrada", fechaRegistro: "2026-03-01T07:00:00Z" },
  { id: "m8", numeroMesa: "000008", departamento: "Arequipa", provincia: "Arequipa", distrito: "Arequipa", localVotacion: "I.E. Coronel Bolognesi", estado: "cerrada", fechaRegistro: "2026-03-01T07:00:00Z" },
  { id: "m9", numeroMesa: "000009", departamento: "Arequipa", provincia: "Arequipa", distrito: "Cerro Colorado", localVotacion: "I.E. Mariano Melgar", estado: "instalada", fechaRegistro: "2026-03-01T07:00:00Z" },
  { id: "m10", numeroMesa: "000010", departamento: "Cusco", provincia: "Cusco", distrito: "Cusco", localVotacion: "I.E. Garcilaso de la Vega", estado: "cerrada", fechaRegistro: "2026-03-01T07:00:00Z" },
  { id: "m11", numeroMesa: "000011", departamento: "Cusco", provincia: "Urubamba", distrito: "Urubamba", localVotacion: "I.E. Inca Gracilaso", estado: "cerrada", fechaRegistro: "2026-03-01T07:00:00Z" },
  { id: "m12", numeroMesa: "000012", departamento: "La Libertad", provincia: "Trujillo", distrito: "Trujillo", localVotacion: "I.E. San Juan", estado: "cerrada", fechaRegistro: "2026-03-01T07:00:00Z" },
  { id: "m13", numeroMesa: "000013", departamento: "La Libertad", provincia: "Trujillo", distrito: "El Porvenir", localVotacion: "I.E. César Vallejo", estado: "cerrada", fechaRegistro: "2026-03-01T07:00:00Z" },
  { id: "m14", numeroMesa: "000014", departamento: "Piura", provincia: "Piura", distrito: "Piura", localVotacion: "I.E. Miguel Grau", estado: "cerrada", fechaRegistro: "2026-03-01T07:00:00Z" },
  { id: "m15", numeroMesa: "000015", departamento: "Junín", provincia: "Huancayo", distrito: "Huancayo", localVotacion: "I.E. Santa Isabel", estado: "cerrada", fechaRegistro: "2026-03-01T07:00:00Z" },
  { id: "m16", numeroMesa: "000016", departamento: "Loreto", provincia: "Maynas", distrito: "Iquitos", localVotacion: "I.E. Iquitos", estado: "instalada", fechaRegistro: "2026-03-01T07:00:00Z" },
  { id: "m17", numeroMesa: "000017", departamento: "Ancash", provincia: "Chimbote", distrito: "Chimbote", localVotacion: "I.E. San Pedro", estado: "cerrada", fechaRegistro: "2026-03-01T07:00:00Z" },
  { id: "m18", numeroMesa: "000018", departamento: "Ancash", provincia: "Huaraz", distrito: "Huaraz", localVotacion: "I.E. La Libertad", estado: "activa", fechaRegistro: "2026-03-01T07:00:00Z" },
  { id: "m19", numeroMesa: "000019", departamento: "Lima", provincia: "Huaral", distrito: "Huaral", localVotacion: "I.E. Ricardo Bentín", estado: "activa", fechaRegistro: "2026-03-01T07:00:00Z" },
  { id: "m20", numeroMesa: "000020", departamento: "Piura", provincia: "Sullana", distrito: "Sullana", localVotacion: "I.E. San Miguel", estado: "activa", fechaRegistro: "2026-03-01T07:00:00Z" },
];

// ===== ACTAS REGISTRADAS =====
function generarVotosAleatorios() {
  return partidosMock.map((p) => ({
    partidoId: p.id,
    partidoNombre: p.nombre,
    partidoSiglas: p.siglas,
    partidoColor: p.color,
    votos: Math.floor(Math.random() * 120) + 10,
  }));
}

export const actasMock: ActaRegistrada[] = [
  {
    id: "a1", numeroMesa: "000001", personeroId: "per1", personeroNombre: "María García López",
    departamento: "Lima", provincia: "Lima", distrito: "Lima Centro", localVotacion: "I.E. Gran Unidad Escolar",
    fechaRegistro: "2026-03-01", horaRegistro: "08:15:00", imagenActa: "/actas/acta_001.jpg",
    votosPorPartido: [
      { partidoId: "p1", partidoNombre: "Fuerza Popular", partidoSiglas: "FP", partidoColor: "#FF6B00", votos: 95 },
      { partidoId: "p2", partidoNombre: "Perú Libre", partidoSiglas: "PL", partidoColor: "#E3292E", votos: 67 },
      { partidoId: "p3", partidoNombre: "Acción Popular", partidoSiglas: "AP", partidoColor: "#1B5E8C", votos: 45 },
      { partidoId: "p4", partidoNombre: "Alianza para el Progreso", partidoSiglas: "APP", partidoColor: "#2E8B57", votos: 38 },
      { partidoId: "p5", partidoNombre: "Avanza País", partidoSiglas: "AP", partidoColor: "#6B3FA0", votos: 29 },
      { partidoId: "p6", partidoNombre: "Juntos por el Perú", partidoSiglas: "JPP", partidoColor: "#D4A017", votos: 22 },
      { partidoId: "p7", partidoNombre: "Renovación Popular", partidoSiglas: "RP", partidoColor: "#008B8B", votos: 18 },
      { partidoId: "p8", partidoNombre: "Somos Perú", partidoSiglas: "SP", partidoColor: "#CD853F", votos: 15 },
    ],
    votosNulos: 8, votosBlanco: 12, totalVotos: 349, estadoValidacion: "validada",
  },
  {
    id: "a2", numeroMesa: "000002", personeroId: "per1", personeroNombre: "María García López",
    departamento: "Lima", provincia: "Lima", distrito: "Lima Centro", localVotacion: "I.E. Gran Unidad Escolar",
    fechaRegistro: "2026-03-01", horaRegistro: "08:45:00", imagenActa: "/actas/acta_002.jpg",
    votosPorPartido: [
      { partidoId: "p1", partidoNombre: "Fuerza Popular", partidoSiglas: "FP", partidoColor: "#FF6B00", votos: 78 },
      { partidoId: "p2", partidoNombre: "Perú Libre", partidoSiglas: "PL", partidoColor: "#E3292E", votos: 85 },
      { partidoId: "p3", partidoNombre: "Acción Popular", partidoSiglas: "AP", partidoColor: "#1B5E8C", votos: 52 },
      { partidoId: "p4", partidoNombre: "Alianza para el Progreso", partidoSiglas: "APP", partidoColor: "#2E8B57", votos: 41 },
      { partidoId: "p5", partidoNombre: "Avanza País", partidoSiglas: "AP", partidoColor: "#6B3FA0", votos: 33 },
      { partidoId: "p6", partidoNombre: "Juntos por el Perú", partidoSiglas: "JPP", partidoColor: "#D4A017", votos: 27 },
      { partidoId: "p7", partidoNombre: "Renovación Popular", partidoSiglas: "RP", partidoColor: "#008B8B", votos: 20 },
      { partidoId: "p8", partidoNombre: "Somos Perú", partidoSiglas: "SP", partidoColor: "#CD853F", votos: 14 },
    ],
    votosNulos: 6, votosBlanco: 10, totalVotos: 366, estadoValidacion: "validada",
  },
  {
    id: "a3", numeroMesa: "000003", personeroId: "per2", personeroNombre: "Carlos Mendoza Ríos",
    departamento: "Lima", provincia: "Lima", distrito: "Miraflores", localVotacion: "I.E. Ricardo Palma",
    fechaRegistro: "2026-03-01", horaRegistro: "09:10:00", imagenActa: "/actas/acta_003.jpg",
    votosPorPartido: [
      { partidoId: "p1", partidoNombre: "Fuerza Popular", partidoSiglas: "FP", partidoColor: "#FF6B00", votos: 110 },
      { partidoId: "p2", partidoNombre: "Perú Libre", partidoSiglas: "PL", partidoColor: "#E3292E", votos: 42 },
      { partidoId: "p3", partidoNombre: "Acción Popular", partidoSiglas: "AP", partidoColor: "#1B5E8C", votos: 68 },
      { partidoId: "p4", partidoNombre: "Alianza para el Progreso", partidoSiglas: "APP", partidoColor: "#2E8B57", votos: 55 },
      { partidoId: "p5", partidoNombre: "Avanza País", partidoSiglas: "AP", partidoColor: "#6B3FA0", votos: 47 },
      { partidoId: "p6", partidoNombre: "Juntos por el Perú", partidoSiglas: "JPP", partidoColor: "#D4A017", votos: 19 },
      { partidoId: "p7", partidoNombre: "Renovación Popular", partidoSiglas: "RP", partidoColor: "#008B8B", votos: 25 },
      { partidoId: "p8", partidoNombre: "Somos Perú", partidoSiglas: "SP", partidoColor: "#CD853F", votos: 21 },
    ],
    votosNulos: 5, votosBlanco: 8, totalVotos: 400, estadoValidacion: "validada",
  },
  {
    id: "a4", numeroMesa: "000004", personeroId: "per11", personeroNombre: "Patricia Nolasco Soto",
    departamento: "Lima", provincia: "Lima", distrito: "San Isidro", localVotacion: "I.E. Rosa de Santa María",
    fechaRegistro: "2026-03-01", horaRegistro: "09:30:00", imagenActa: "/actas/acta_004.jpg",
    votosPorPartido: [
      { partidoId: "p1", partidoNombre: "Fuerza Popular", partidoSiglas: "FP", partidoColor: "#FF6B00", votos: 102 },
      { partidoId: "p2", partidoNombre: "Perú Libre", partidoSiglas: "PL", partidoColor: "#E3292E", votos: 35 },
      { partidoId: "p3", partidoNombre: "Acción Popular", partidoSiglas: "AP", partidoColor: "#1B5E8C", votos: 72 },
      { partidoId: "p4", partidoNombre: "Alianza para el Progreso", partidoSiglas: "APP", partidoColor: "#2E8B57", votos: 48 },
      { partidoId: "p5", partidoNombre: "Avanza País", partidoSiglas: "AP", partidoColor: "#6B3FA0", votos: 55 },
      { partidoId: "p6", partidoNombre: "Juntos por el Perú", partidoSiglas: "JPP", partidoColor: "#D4A017", votos: 18 },
      { partidoId: "p7", partidoNombre: "Renovación Popular", partidoSiglas: "RP", partidoColor: "#008B8B", votos: 30 },
      { partidoId: "p8", partidoNombre: "Somos Perú", partidoSiglas: "SP", partidoColor: "#CD853F", votos: 22 },
    ],
    votosNulos: 4, votosBlanco: 7, totalVotos: 393, estadoValidacion: "validada",
  },
  {
    id: "a5", numeroMesa: "000005", personeroId: "per10", personeroNombre: "Roberto Espinoza Chávez",
    departamento: "Lima", provincia: "Callao", distrito: "Callao", localVotacion: "I.E. San José",
    fechaRegistro: "2026-03-01", horaRegistro: "09:50:00", imagenActa: "/actas/acta_005.jpg",
    votosPorPartido: [
      { partidoId: "p1", partidoNombre: "Fuerza Popular", partidoSiglas: "FP", partidoColor: "#FF6B00", votos: 88 },
      { partidoId: "p2", partidoNombre: "Perú Libre", partidoSiglas: "PL", partidoColor: "#E3292E", votos: 56 },
      { partidoId: "p3", partidoNombre: "Acción Popular", partidoSiglas: "AP", partidoColor: "#1B5E8C", votos: 40 },
      { partidoId: "p4", partidoNombre: "Alianza para el Progreso", partidoSiglas: "APP", partidoColor: "#2E8B57", votos: 35 },
      { partidoId: "p5", partidoNombre: "Avanza País", partidoSiglas: "AP", partidoColor: "#6B3FA0", votos: 28 },
      { partidoId: "p6", partidoNombre: "Juntos por el Perú", partidoSiglas: "JPP", partidoColor: "#D4A017", votos: 32 },
      { partidoId: "p7", partidoNombre: "Renovación Popular", partidoSiglas: "RP", partidoColor: "#008B8B", votos: 24 },
      { partidoId: "p8", partidoNombre: "Somos Perú", partidoSiglas: "SP", partidoColor: "#CD853F", votos: 18 },
    ],
    votosNulos: 9, votosBlanco: 11, totalVotos: 341, estadoValidacion: "pendiente",
  },
  {
    id: "a6", numeroMesa: "000006", personeroId: "per11", personeroNombre: "Patricia Nolasco Soto",
    departamento: "Lima", provincia: "Lima", distrito: "La Victoria", localVotacion: "I.E. Manuel Scorza",
    fechaRegistro: "2026-03-01", horaRegistro: "10:15:00", imagenActa: "/actas/acta_006.jpg",
    votosPorPartido: [
      { partidoId: "p1", partidoNombre: "Fuerza Popular", partidoSiglas: "FP", partidoColor: "#FF6B00", votos: 72 },
      { partidoId: "p2", partidoNombre: "Perú Libre", partidoSiglas: "PL", partidoColor: "#E3292E", votos: 90 },
      { partidoId: "p3", partidoNombre: "Acción Popular", partidoSiglas: "AP", partidoColor: "#1B5E8C", votos: 38 },
      { partidoId: "p4", partidoNombre: "Alianza para el Progreso", partidoSiglas: "APP", partidoColor: "#2E8B57", votos: 42 },
      { partidoId: "p5", partidoNombre: "Avanza País", partidoSiglas: "AP", partidoColor: "#6B3FA0", votos: 25 },
      { partidoId: "p6", partidoNombre: "Juntos por el Perú", partidoSiglas: "JPP", partidoColor: "#D4A017", votos: 35 },
      { partidoId: "p7", partidoNombre: "Renovación Popular", partidoSiglas: "RP", partidoColor: "#008B8B", votos: 20 },
      { partidoId: "p8", partidoNombre: "Somos Perú", partidoSiglas: "SP", partidoColor: "#CD853F", votos: 16 },
    ],
    votosNulos: 7, votosBlanco: 9, totalVotos: 354, estadoValidacion: "validada",
  },
  {
    id: "a7", numeroMesa: "000007", personeroId: "per11", personeroNombre: "Patricia Nolasco Soto",
    departamento: "Lima", provincia: "Lima", distrito: "San Juan de Lurigancho", localVotacion: "I.E. Ciro Alegría",
    fechaRegistro: "2026-03-01", horaRegistro: "10:40:00", imagenActa: "/actas/acta_007.jpg",
    votosPorPartido: [
      { partidoId: "p1", partidoNombre: "Fuerza Popular", partidoSiglas: "FP", partidoColor: "#FF6B00", votos: 65 },
      { partidoId: "p2", partidoNombre: "Perú Libre", partidoSiglas: "PL", partidoColor: "#E3292E", votos: 98 },
      { partidoId: "p3", partidoNombre: "Acción Popular", partidoSiglas: "AP", partidoColor: "#1B5E8C", votos: 30 },
      { partidoId: "p4", partidoNombre: "Alianza para el Progreso", partidoSiglas: "APP", partidoColor: "#2E8B57", votos: 45 },
      { partidoId: "p5", partidoNombre: "Avanza País", partidoSiglas: "AP", partidoColor: "#6B3FA0", votos: 22 },
      { partidoId: "p6", partidoNombre: "Juntos por el Perú", partidoSiglas: "JPP", partidoColor: "#D4A017", votos: 40 },
      { partidoId: "p7", partidoNombre: "Renovación Popular", partidoSiglas: "RP", partidoColor: "#008B8B", votos: 15 },
      { partidoId: "p8", partidoNombre: "Somos Perú", partidoSiglas: "SP", partidoColor: "#CD853F", votos: 12 },
    ],
    votosNulos: 10, votosBlanco: 8, totalVotos: 345, estadoValidacion: "validada",
  },
  {
    id: "a8", numeroMesa: "000008", personeroId: "per4", personeroNombre: "Jorge Ramírez Torres",
    departamento: "Arequipa", provincia: "Arequipa", distrito: "Arequipa", localVotacion: "I.E. Coronel Bolognesi",
    fechaRegistro: "2026-03-01", horaRegistro: "08:30:00", imagenActa: "/actas/acta_008.jpg",
    votosPorPartido: [
      { partidoId: "p1", partidoNombre: "Fuerza Popular", partidoSiglas: "FP", partidoColor: "#FF6B00", votos: 58 },
      { partidoId: "p2", partidoNombre: "Perú Libre", partidoSiglas: "PL", partidoColor: "#E3292E", votos: 45 },
      { partidoId: "p3", partidoNombre: "Acción Popular", partidoSiglas: "AP", partidoColor: "#1B5E8C", votos: 82 },
      { partidoId: "p4", partidoNombre: "Alianza para el Progreso", partidoSiglas: "APP", partidoColor: "#2E8B57", votos: 36 },
      { partidoId: "p5", partidoNombre: "Avanza País", partidoSiglas: "AP", partidoColor: "#6B3FA0", votos: 42 },
      { partidoId: "p6", partidoNombre: "Juntos por el Perú", partidoSiglas: "JPP", partidoColor: "#D4A017", votos: 20 },
      { partidoId: "p7", partidoNombre: "Renovación Popular", partidoSiglas: "RP", partidoColor: "#008B8B", votos: 28 },
      { partidoId: "p8", partidoNombre: "Somos Perú", partidoSiglas: "SP", partidoColor: "#CD853F", votos: 32 },
    ],
    votosNulos: 6, votosBlanco: 10, totalVotos: 359, estadoValidacion: "validada",
  },
  {
    id: "a9", numeroMesa: "000010", personeroId: "per3", personeroNombre: "Rosa Quispe Huamán",
    departamento: "Cusco", provincia: "Cusco", distrito: "Cusco", localVotacion: "I.E. Garcilaso de la Vega",
    fechaRegistro: "2026-03-01", horaRegistro: "09:00:00", imagenActa: "/actas/acta_010.jpg",
    votosPorPartido: [
      { partidoId: "p1", partidoNombre: "Fuerza Popular", partidoSiglas: "FP", partidoColor: "#FF6B00", votos: 40 },
      { partidoId: "p2", partidoNombre: "Perú Libre", partidoSiglas: "PL", partidoColor: "#E3292E", votos: 105 },
      { partidoId: "p3", partidoNombre: "Acción Popular", partidoSiglas: "AP", partidoColor: "#1B5E8C", votos: 35 },
      { partidoId: "p4", partidoNombre: "Alianza para el Progreso", partidoSiglas: "APP", partidoColor: "#2E8B57", votos: 28 },
      { partidoId: "p5", partidoNombre: "Avanza País", partidoSiglas: "AP", partidoColor: "#6B3FA0", votos: 20 },
      { partidoId: "p6", partidoNombre: "Juntos por el Perú", partidoSiglas: "JPP", partidoColor: "#D4A017", votos: 48 },
      { partidoId: "p7", partidoNombre: "Renovación Popular", partidoSiglas: "RP", partidoColor: "#008B8B", votos: 12 },
      { partidoId: "p8", partidoNombre: "Somos Perú", partidoSiglas: "SP", partidoColor: "#CD853F", votos: 25 },
    ],
    votosNulos: 8, votosBlanco: 6, totalVotos: 327, estadoValidacion: "validada",
  },
  {
    id: "a10", numeroMesa: "000012", personeroId: "per5", personeroNombre: "Ana Castillo Flores",
    departamento: "La Libertad", provincia: "Trujillo", distrito: "Trujillo", localVotacion: "I.E. San Juan",
    fechaRegistro: "2026-03-01", horaRegistro: "09:20:00", imagenActa: "/actas/acta_012.jpg",
    votosPorPartido: [
      { partidoId: "p1", partidoNombre: "Fuerza Popular", partidoSiglas: "FP", partidoColor: "#FF6B00", votos: 85 },
      { partidoId: "p2", partidoNombre: "Perú Libre", partidoSiglas: "PL", partidoColor: "#E3292E", votos: 62 },
      { partidoId: "p3", partidoNombre: "Acción Popular", partidoSiglas: "AP", partidoColor: "#1B5E8C", votos: 75 },
      { partidoId: "p4", partidoNombre: "Alianza para el Progreso", partidoSiglas: "APP", partidoColor: "#2E8B57", votos: 44 },
      { partidoId: "p5", partidoNombre: "Avanza País", partidoSiglas: "AP", partidoColor: "#6B3FA0", votos: 38 },
      { partidoId: "p6", partidoNombre: "Juntos por el Perú", partidoSiglas: "JPP", partidoColor: "#D4A017", votos: 25 },
      { partidoId: "p7", partidoNombre: "Renovación Popular", partidoSiglas: "RP", partidoColor: "#008B8B", votos: 22 },
      { partidoId: "p8", partidoNombre: "Somos Perú", partidoSiglas: "SP", partidoColor: "#CD853F", votos: 18 },
    ],
    votosNulos: 7, votosBlanco: 9, totalVotos: 385, estadoValidacion: "validada",
  },
  {
    id: "a11", numeroMesa: "000014", personeroId: "per6", personeroNombre: "Pedro Suárez Mendoza",
    departamento: "Piura", provincia: "Piura", distrito: "Piura", localVotacion: "I.E. Miguel Grau",
    fechaRegistro: "2026-03-01", horaRegistro: "09:45:00", imagenActa: "/actas/acta_014.jpg",
    votosPorPartido: [
      { partidoId: "p1", partidoNombre: "Fuerza Popular", partidoSiglas: "FP", partidoColor: "#FF6B00", votos: 92 },
      { partidoId: "p2", partidoNombre: "Perú Libre", partidoSiglas: "PL", partidoColor: "#E3292E", votos: 48 },
      { partidoId: "p3", partidoNombre: "Acción Popular", partidoSiglas: "AP", partidoColor: "#1B5E8C", votos: 55 },
      { partidoId: "p4", partidoNombre: "Alianza para el Progreso", partidoSiglas: "APP", partidoColor: "#2E8B57", votos: 62 },
      { partidoId: "p5", partidoNombre: "Avanza País", partidoSiglas: "AP", partidoColor: "#6B3FA0", votos: 30 },
      { partidoId: "p6", partidoNombre: "Juntos por el Perú", partidoSiglas: "JPP", partidoColor: "#D4A017", votos: 22 },
      { partidoId: "p7", partidoNombre: "Renovación Popular", partidoSiglas: "RP", partidoColor: "#008B8B", votos: 18 },
      { partidoId: "p8", partidoNombre: "Somos Perú", partidoSiglas: "SP", partidoColor: "#CD853F", votos: 15 },
    ],
    votosNulos: 5, votosBlanco: 8, totalVotos: 355, estadoValidacion: "validada",
  },
  {
    id: "a12", numeroMesa: "000015", personeroId: "per7", personeroNombre: "Luisa Vargas Gutiérrez",
    departamento: "Junín", provincia: "Huancayo", distrito: "Huancayo", localVotacion: "I.E. Santa Isabel",
    fechaRegistro: "2026-03-01", horaRegistro: "10:00:00", imagenActa: "/actas/acta_015.jpg",
    votosPorPartido: [
      { partidoId: "p1", partidoNombre: "Fuerza Popular", partidoSiglas: "FP", partidoColor: "#FF6B00", votos: 55 },
      { partidoId: "p2", partidoNombre: "Perú Libre", partidoSiglas: "PL", partidoColor: "#E3292E", votos: 78 },
      { partidoId: "p3", partidoNombre: "Acción Popular", partidoSiglas: "AP", partidoColor: "#1B5E8C", votos: 42 },
      { partidoId: "p4", partidoNombre: "Alianza para el Progreso", partidoSiglas: "APP", partidoColor: "#2E8B57", votos: 35 },
      { partidoId: "p5", partidoNombre: "Avanza País", partidoSiglas: "AP", partidoColor: "#6B3FA0", votos: 28 },
      { partidoId: "p6", partidoNombre: "Juntos por el Perú", partidoSiglas: "JPP", partidoColor: "#D4A017", votos: 45 },
      { partidoId: "p7", partidoNombre: "Renovación Popular", partidoSiglas: "RP", partidoColor: "#008B8B", votos: 20 },
      { partidoId: "p8", partidoNombre: "Somos Perú", partidoSiglas: "SP", partidoColor: "#CD853F", votos: 22 },
    ],
    votosNulos: 6, votosBlanco: 10, totalVotos: 341, estadoValidacion: "observada",
  },
  {
    id: "a13", numeroMesa: "000017", personeroId: "per9", personeroNombre: "Carmen Delgado Vega",
    departamento: "Ancash", provincia: "Chimbote", distrito: "Chimbote", localVotacion: "I.E. San Pedro",
    fechaRegistro: "2026-03-01", horaRegistro: "10:30:00", imagenActa: "/actas/acta_017.jpg",
    votosPorPartido: [
      { partidoId: "p1", partidoNombre: "Fuerza Popular", partidoSiglas: "FP", partidoColor: "#FF6B00", votos: 70 },
      { partidoId: "p2", partidoNombre: "Perú Libre", partidoSiglas: "PL", partidoColor: "#E3292E", votos: 55 },
      { partidoId: "p3", partidoNombre: "Acción Popular", partidoSiglas: "AP", partidoColor: "#1B5E8C", votos: 48 },
      { partidoId: "p4", partidoNombre: "Alianza para el Progreso", partidoSiglas: "APP", partidoColor: "#2E8B57", votos: 40 },
      { partidoId: "p5", partidoNombre: "Avanza País", partidoSiglas: "AP", partidoColor: "#6B3FA0", votos: 32 },
      { partidoId: "p6", partidoNombre: "Juntos por el Perú", partidoSiglas: "JPP", partidoColor: "#D4A017", votos: 25 },
      { partidoId: "p7", partidoNombre: "Renovación Popular", partidoSiglas: "RP", partidoColor: "#008B8B", votos: 22 },
      { partidoId: "p8", partidoNombre: "Somos Perú", partidoSiglas: "SP", partidoColor: "#CD853F", votos: 18 },
    ],
    votosNulos: 4, votosBlanco: 7, totalVotos: 321, estadoValidacion: "validada",
  },
  {
    id: "a14", numeroMesa: "000011", personeroId: "per12", personeroNombre: "Fernando Dávila Ríos",
    departamento: "Cusco", provincia: "Urubamba", distrito: "Urubamba", localVotacion: "I.E. Inca Gracilaso",
    fechaRegistro: "2026-03-01", horaRegistro: "11:00:00", imagenActa: "/actas/acta_011.jpg",
    votosPorPartido: [
      { partidoId: "p1", partidoNombre: "Fuerza Popular", partidoSiglas: "FP", partidoColor: "#FF6B00", votos: 35 },
      { partidoId: "p2", partidoNombre: "Perú Libre", partidoSiglas: "PL", partidoColor: "#E3292E", votos: 88 },
      { partidoId: "p3", partidoNombre: "Acción Popular", partidoSiglas: "AP", partidoColor: "#1B5E8C", votos: 30 },
      { partidoId: "p4", partidoNombre: "Alianza para el Progreso", partidoSiglas: "APP", partidoColor: "#2E8B57", votos: 25 },
      { partidoId: "p5", partidoNombre: "Avanza País", partidoSiglas: "AP", partidoColor: "#6B3FA0", votos: 18 },
      { partidoId: "p6", partidoNombre: "Juntos por el Perú", partidoSiglas: "JPP", partidoColor: "#D4A017", votos: 42 },
      { partidoId: "p7", partidoNombre: "Renovación Popular", partidoSiglas: "RP", partidoColor: "#008B8B", votos: 10 },
      { partidoId: "p8", partidoNombre: "Somos Perú", partidoSiglas: "SP", partidoColor: "#CD853F", votos: 20 },
    ],
    votosNulos: 5, votosBlanco: 8, totalVotos: 281, estadoValidacion: "pendiente",
  },
  {
    id: "a15", numeroMesa: "000013", personeroId: "per5", personeroNombre: "Ana Castillo Flores",
    departamento: "La Libertad", provincia: "Trujillo", distrito: "El Porvenir", localVotacion: "I.E. César Vallejo",
    fechaRegistro: "2026-03-01", horaRegistro: "11:20:00", imagenActa: "/actas/acta_013.jpg",
    votosPorPartido: [
      { partidoId: "p1", partidoNombre: "Fuerza Popular", partidoSiglas: "FP", partidoColor: "#FF6B00", votos: 78 },
      { partidoId: "p2", partidoNombre: "Perú Libre", partidoSiglas: "PL", partidoColor: "#E3292E", votos: 70 },
      { partidoId: "p3", partidoNombre: "Acción Popular", partidoSiglas: "AP", partidoColor: "#1B5E8C", votos: 50 },
      { partidoId: "p4", partidoNombre: "Alianza para el Progreso", partidoSiglas: "APP", partidoColor: "#2E8B57", votos: 38 },
      { partidoId: "p5", partidoNombre: "Avanza País", partidoSiglas: "AP", partidoColor: "#6B3FA0", votos: 30 },
      { partidoId: "p6", partidoNombre: "Juntos por el Perú", partidoSiglas: "JPP", partidoColor: "#D4A017", votos: 28 },
      { partidoId: "p7", partidoNombre: "Renovación Popular", partidoSiglas: "RP", partidoColor: "#008B8B", votos: 22 },
      { partidoId: "p8", partidoNombre: "Somos Perú", partidoSiglas: "SP", partidoColor: "#CD853F", votos: 16 },
    ],
    votosNulos: 6, votosBlanco: 9, totalVotos: 347, estadoValidacion: "validada",
  },
];

// ===== TIMELINE =====
export const timelineMock: TimelineEntry[] = [
  { hora: "08:15", numeroMesa: "000001", personero: "María García López", partidoMayorVotacion: "Fuerza Popular", partidoColor: "#FF6B00", totalVotos: 349 },
  { hora: "08:30", numeroMesa: "000008", personero: "Jorge Ramírez Torres", partidoMayorVotacion: "Acción Popular", partidoColor: "#1B5E8C", totalVotos: 359 },
  { hora: "08:45", numeroMesa: "000002", personero: "María García López", partidoMayorVotacion: "Perú Libre", partidoColor: "#E3292E", totalVotos: 366 },
  { hora: "09:00", numeroMesa: "000010", personero: "Rosa Quispe Huamán", partidoMayorVotacion: "Perú Libre", partidoColor: "#E3292E", totalVotos: 327 },
  { hora: "09:10", numeroMesa: "000003", personero: "Carlos Mendoza Ríos", partidoMayorVotacion: "Fuerza Popular", partidoColor: "#FF6B00", totalVotos: 400 },
  { hora: "09:20", numeroMesa: "000012", personero: "Ana Castillo Flores", partidoMayorVotacion: "Fuerza Popular", partidoColor: "#FF6B00", totalVotos: 385 },
  { hora: "09:30", numeroMesa: "000004", personero: "Patricia Nolasco Soto", partidoMayorVotacion: "Fuerza Popular", partidoColor: "#FF6B00", totalVotos: 393 },
  { hora: "09:45", numeroMesa: "000014", personero: "Pedro Suárez Mendoza", partidoMayorVotacion: "Fuerza Popular", partidoColor: "#FF6B00", totalVotos: 355 },
  { hora: "09:50", numeroMesa: "000005", personero: "Roberto Espinoza Chávez", partidoMayorVotacion: "Fuerza Popular", partidoColor: "#FF6B00", totalVotos: 341 },
  { hora: "10:00", numeroMesa: "000015", personero: "Luisa Vargas Gutiérrez", partidoMayorVotacion: "Perú Libre", partidoColor: "#E3292E", totalVotos: 341 },
  { hora: "10:15", numeroMesa: "000006", personero: "Patricia Nolasco Soto", partidoMayorVotacion: "Perú Libre", partidoColor: "#E3292E", totalVotos: 354 },
  { hora: "10:30", numeroMesa: "000017", personero: "Carmen Delgado Vega", partidoMayorVotacion: "Fuerza Popular", partidoColor: "#FF6B00", totalVotos: 321 },
  { hora: "10:40", numeroMesa: "000007", personero: "Patricia Nolasco Soto", partidoMayorVotacion: "Perú Libre", partidoColor: "#E3292E", totalVotos: 345 },
  { hora: "11:00", numeroMesa: "000011", personero: "Fernando Dávila Ríos", partidoMayorVotacion: "Perú Libre", partidoColor: "#E3292E", totalVotos: 281 },
  { hora: "11:20", numeroMesa: "000013", personero: "Ana Castillo Flores", partidoMayorVotacion: "Fuerza Popular", partidoColor: "#FF6B00", totalVotos: 347 },
];

// ===== HELPER FUNCTIONS =====
export function calcularVotosTotales(actas: ActaRegistrada[]) {
  const votosPorPartido: Record<string, { nombre: string; siglas: string; color: string; votos: number }> = {};
  let totalGeneral = 0;
  let totalNulos = 0;
  let totalBlanco = 0;

  actas.forEach((acta) => {
    acta.votosPorPartido.forEach((vp) => {
      if (!votosPorPartido[vp.partidoId]) {
        votosPorPartido[vp.partidoId] = {
          nombre: vp.partidoNombre,
          siglas: vp.partidoSiglas,
          color: vp.partidoColor,
          votos: 0,
        };
      }
      votosPorPartido[vp.partidoId].votos += vp.votos;
    });
    totalGeneral += acta.totalVotos;
    totalNulos += acta.votosNulos;
    totalBlanco += acta.votosBlanco;
  });

  return { votosPorPartido, totalGeneral, totalNulos, totalBlanco };
}

export function calcularPorcentajes(votosPorPartido: Record<string, { nombre: string; siglas: string; color: string; votos: number }>, totalGeneral: number) {
  return Object.entries(votosPorPartido).map(([id, data]) => ({
    id,
    ...data,
    porcentaje: totalGeneral > 0 ? ((data.votos / totalGeneral) * 100).toFixed(1) : "0",
  })).sort((a, b) => b.votos - a.votos);
}

export function getVotosPorDepartamento(actas: ActaRegistrada[]) {
  const result: Record<string, Record<string, number>> = {};
  actas.forEach((acta) => {
    if (!result[acta.departamento]) result[acta.departamento] = {};
    acta.votosPorPartido.forEach((vp) => {
      if (!result[acta.departamento][vp.partidoSiglas]) result[acta.departamento][vp.partidoSiglas] = 0;
      result[acta.departamento][vp.partidoSiglas] += vp.votos;
    });
  });
  return result;
}
