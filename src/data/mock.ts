export type ReportCategory =
  | "rampa-faltante"
  | "banqueta-rota"
  | "obstaculo"
  | "semaforo"
  | "bano"
  | "otro";

export const categoryMeta: Record<
  ReportCategory,
  { label: string; tone: "warning" | "success" | "muted" | "danger"; icon: string }
> = {
  "rampa-faltante": { label: "Rampa faltante", tone: "warning", icon: "♿" },
  "banqueta-rota": { label: "Banqueta rota", tone: "danger", icon: "⚠️" },
  obstaculo: { label: "Obstáculo", tone: "warning", icon: "🚧" },
  semaforo: { label: "Semáforo", tone: "warning", icon: "🚦" },
  bano: { label: "Baño accesible", tone: "success", icon: "🚻" },
  otro: { label: "Otro", tone: "muted", icon: "📍" },
};

export type Alert = {
  id: string;
  category: ReportCategory;
  title: string;
  location: string;
  distanceM: number;
  minutesAgo: number;
  severity: "alta" | "media" | "baja";
  status: "activo" | "verificado" | "resuelto";
  verifications: number;
};

export type Report = {
  id: string;
  category: ReportCategory;
  description: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  photo: string | null;
  severity: "alta" | "media" | "baja";
  createdAt: string;
  status: "nuevo" | "pendiente";
};

export const alerts: Alert[] = [
  {
    id: "A-492",
    category: "obstaculo",
    title: "Bloqueo total de rampa",
    location: "Av. Juárez esq. Madero",
    distanceM: 120,
    minutesAgo: 12,
    severity: "alta",
    status: "activo",
    verifications: 7,
  },
  {
    id: "A-491",
    category: "rampa-faltante",
    title: "Cruce sin rampa peatonal",
    location: "Calz. Tlalpan 1450",
    distanceM: 240,
    minutesAgo: 28,
    severity: "alta",
    status: "activo",
    verifications: 9,
  },
  {
    id: "A-490",
    category: "banqueta-rota",
    title: "Banqueta levantada",
    location: "Reforma 222",
    distanceM: 380,
    minutesAgo: 45,
    severity: "media",
    status: "verificado",
    verifications: 14,
  },
  {
    id: "A-489",
    category: "semaforo",
    title: "Semáforo sin audio",
    location: "Insurgentes Sur 800",
    distanceM: 520,
    minutesAgo: 68,
    severity: "media",
    status: "activo",
    verifications: 3,
  },
  {
    id: "A-488",
    category: "bano",
    title: "Baño accesible disponible",
    location: "Parque México",
    distanceM: 640,
    minutesAgo: 180,
    severity: "baja",
    status: "verificado",
    verifications: 22,
  },
];

export type Route = {
  id: string;
  summary: string;
  durationMin: number;
  score: number;
  rampas: number;
  pendiente: "suave" | "moderada" | "alta";
  via: string;
};

export const routes: Route[] = [
  {
    id: "RT-1",
    summary: "Ruta accesible recomendada",
    durationMin: 22,
    score: 96,
    rampas: 8,
    pendiente: "suave",
    via: "vía Av. Juárez",
  },
  {
    id: "RT-2",
    summary: "Ruta alternativa más corta",
    durationMin: 18,
    score: 74,
    rampas: 5,
    pendiente: "moderada",
    via: "vía Reforma",
  },
  {
    id: "RT-3",
    summary: "Ruta panorámica",
    durationMin: 31,
    score: 88,
    rampas: 11,
    pendiente: "suave",
    via: "vía Parque México",
  },
];

export const profile = {
  name: "Elena Jiménez",
  role: "Validadora",
  level: 12,
  nextLevelProgress: 0.74,
  metrics: [
    { label: "Reportes", value: 184 },
    { label: "Rutas", value: 42 },
    { label: "Personas", value: "1.2k" },
  ],
  badges: [
    { name: "Medalla vial", desc: "20 rampas reportadas" },
    { name: "Auditora", desc: "Verificó 50 reportes" },
    { name: "Guía urbana", desc: "30 rutas inclusivas" },
    { name: "Centinela", desc: "30 días activos" },
  ],
  history: [
    { id: "R-492", title: "Obra en Av. Juárez", status: "activo" as const, when: "Hoy" },
    { id: "R-485", title: "Rampa operativa Roma Norte", status: "resuelto" as const, when: "Ayer" },
    { id: "R-478", title: "Elevador Metro Hidalgo", status: "verificado" as const, when: "Lun" },
    { id: "R-470", title: "Banqueta bloqueada Reforma", status: "resuelto" as const, when: "Vie" },
  ],
};
