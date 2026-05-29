import evidencia1 from "@/assets/evidencia1.jpeg";
import evidencia2 from "@/assets/evidencia2.jpeg";
import evidencia3 from "@/assets/evidencia3.jpeg";

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
  image?: string;
  images?: string[];
  description?: string;
  accessibilityImpact?: string;
  recommendations?: string[];
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
  image?: string;
  images?: string[];
  accessibilityImpact?: string;
  recommendations?: string[];
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
    description: "Un vehículo de transporte comercial se encuentra estacionado cubriendo toda el área de la rampa peatonal de acceso. Esto obstruye por completo el cruce seguro hacia la acera norte.",
    accessibilityImpact: "Afecta severamente a usuarios de silla de ruedas, andadores y carriolas infantiles. Para rodear el vehículo, los peatones deben bajar al arroyo vehicular, exponiéndose al tráfico rápido.",
    recommendations: [
      "Utilice la rampa alternativa ubicada a 60 metros sobre la Calle Madero.",
      "Extreme precauciones al circular por el arroyo vehicular y cruce con asistencia."
    ],
    image: evidencia1,
    images: [evidencia1]
  },
  {
    id: "A-491",
    category: "rampa-faltante",
    title: "Cruce peatonal inaccesible",
    location: "Calz. Tlalpan 1450",
    distanceM: 240,
    minutesAgo: 28,
    severity: "alta",
    status: "activo",
    verifications: 9,
    description: "Esquina transitada que carece de rampa de transición hacia el paso de cebra. La altura de la banqueta supera los 15 cm de desnivel, impidiendo el descenso suave a nivel de calle.",
    accessibilityImpact: "Impide el cruce autónomo para personas con movilidad reducida (sillas de ruedas, andadores). Los peatones deben buscar vados vehiculares distantes o arriesgarse a descensos bruscos.",
    recommendations: [
      "Se recomienda rodear el cruce por la esquina contraria donde sí hay rampa rebajada.",
      "Solicite apoyo si requiere subir o bajar el escalón pronunciado."
    ],
    image: evidencia2,
    images: [evidencia2]
  },
  {
    id: "A-490",
    category: "banqueta-rota",
    title: "Banqueta dañada",
    location: "Reforma 222",
    distanceM: 380,
    minutesAgo: 45,
    severity: "media",
    status: "verificado",
    verifications: 14,
    description: "Las raíces de un árbol de gran tamaño han roto e inclinado las losas de concreto de la acera, creando un escalón irregular de aproximadamente 12 cm de altura.",
    accessibilityImpact: "Riesgo elevado de tropiezos y caídas para personas mayores y niños. Impide el tránsito fluido de sillas de ruedas debido a la inclinación lateral severa de la losa.",
    recommendations: [
      "Transite con cuidado y reduzca la velocidad al aproximarse.",
      "De ser necesario, utilice el andador plano del lado opuesto de la avenida."
    ],
    image: evidencia3,
    images: [evidencia3]
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
    description: "El dispositivo sonoro peatonal del semáforo en este cruce ha dejado de emitir la señal acústica intermitente que guía a los peatones visualmente impedidos.",
    accessibilityImpact: "Afecta directamente a personas ciegas o con baja visión, quienes dependen de la alerta sonora para saber cuándo es seguro cruzar la calle sin asistencia visual.",
    recommendations: [
      "Cruce en compañía de otros peatones o preste mucha atención al flujo del motor de los autos.",
      "Espere indicaciones táctiles o guías peatonales si viaja asistido."
    ],
    images: [
      "https://images.unsplash.com/photo-1508962914676-134849a727f0?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1473163928189-364b2c4e1135?w=800&auto=format&fit=crop"
    ]
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
    description: "Módulo de sanitario público adaptado dentro del parque. Cuenta con puerta de apertura amplia, barras de apoyo metálicas a los costados del retrete y lavabo rebajado.",
    accessibilityImpact: "Facilita la autonomía y el bienestar de personas con discapacidades motrices durante su trayecto o estancia en el parque público.",
    recommendations: [
      "El acceso está disponible en horario de 8:00 AM a 8:00 PM.",
      "Requiere solicitar la llave en la caseta de administración central del parque."
    ],
    images: [
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=800&auto=format&fit=crop"
    ]
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
