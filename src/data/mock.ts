import bizBakery from "@/assets/biz-bakery.jpg";
import bizLibrary from "@/assets/biz-library.jpg";
import bizCafe from "@/assets/biz-cafe.jpg";
import bizPharmacy from "@/assets/biz-pharmacy.jpg";
import bizRestaurant from "@/assets/biz-restaurant.jpg";
import bizClinic from "@/assets/biz-clinic.jpg";

export type ReportCategory =
  | "obra"
  | "rampa-inexistente"
  | "banqueta-bloqueada"
  | "punto-descanso"
  | "rampa-operativa"
  | "elevador";

export const categoryMeta: Record<
  ReportCategory,
  { label: string; tone: "warning" | "success" | "muted"; icon: string }
> = {
  obra: { label: "Obra en curso", tone: "warning", icon: "🚧" },
  "rampa-inexistente": { label: "Rampa inexistente", tone: "warning", icon: "⛔" },
  "banqueta-bloqueada": { label: "Banqueta bloqueada", tone: "warning", icon: "🚷" },
  "punto-descanso": { label: "Punto de descanso", tone: "muted", icon: "🪑" },
  "rampa-operativa": { label: "Rampa operativa", tone: "success", icon: "♿" },
  elevador: { label: "Elevador funcional", tone: "success", icon: "🛗" },
};

export type Report = {
  id: string;
  category: ReportCategory;
  title: string;
  location: string;
  minutesAgo: number;
  verifications: number;
  status: "activo" | "verificado" | "resuelto";
};

export const reports: Report[] = [
  {
    id: "R-492",
    category: "obra",
    title: "Bloqueo total de rampa",
    location: "Av. Juárez esq. Madero",
    minutesAgo: 12,
    verifications: 7,
    status: "activo",
  },
  {
    id: "R-491",
    category: "elevador",
    title: "Elevador L8 reparado y operando",
    location: "Metro Bellas Artes",
    minutesAgo: 45,
    verifications: 14,
    status: "verificado",
  },
  {
    id: "R-490",
    category: "banqueta-bloqueada",
    title: "Vehículo estacionado sobre rampa",
    location: "Reforma 222",
    minutesAgo: 68,
    verifications: 3,
    status: "activo",
  },
  {
    id: "R-489",
    category: "rampa-inexistente",
    title: "Cruce sin rampa peatonal",
    location: "Calz. de Tlalpan 1450",
    minutesAgo: 122,
    verifications: 9,
    status: "activo",
  },
  {
    id: "R-488",
    category: "punto-descanso",
    title: "Banca pública con sombra",
    location: "Parque México",
    minutesAgo: 180,
    verifications: 22,
    status: "verificado",
  },
  {
    id: "R-487",
    category: "rampa-operativa",
    title: "Nueva rampa con barandal",
    location: "Centro Médico Siglo XXI",
    minutesAgo: 240,
    verifications: 31,
    status: "resuelto",
  },
];

export type Business = {
  id: string;
  name: string;
  category: "Restaurante" | "Clínica" | "Comercio" | "Cultura" | "Farmacia";
  neighborhood: string;
  score: number;
  seal: "Oro" | "Plata" | "Bronce";
  image: string;
  features: string[];
};

export const businesses: Business[] = [
  {
    id: "b1",
    name: "Panadería Rosetta",
    category: "Restaurante",
    neighborhood: "Roma Norte",
    score: 96,
    seal: "Oro",
    image: bizBakery,
    features: ["Rampa de acceso", "Menú en braille", "Personal capacitado", "Baño accesible"],
  },
  {
    id: "b2",
    name: "Biblioteca Vasconcelos",
    category: "Cultura",
    neighborhood: "Buenavista",
    score: 94,
    seal: "Oro",
    image: bizLibrary,
    features: ["Elevadores amplios", "Rutas señalizadas", "Loop magnético", "Audio guía"],
  },
  {
    id: "b3",
    name: "Café Tercera Ola",
    category: "Restaurante",
    neighborhood: "Condesa",
    score: 88,
    seal: "Oro",
    image: bizCafe,
    features: ["Entrada a nivel", "Mesas accesibles", "Personal capacitado"],
  },
  {
    id: "b4",
    name: "Farmacia Vida",
    category: "Farmacia",
    neighborhood: "Polanco",
    score: 78,
    seal: "Plata",
    image: bizPharmacy,
    features: ["Pasillos amplios", "Mostrador bajo"],
  },
  {
    id: "b5",
    name: "Restaurante Contramar",
    category: "Restaurante",
    neighborhood: "Roma Norte",
    score: 82,
    seal: "Plata",
    image: bizRestaurant,
    features: ["Rampa de acceso", "Baño accesible"],
  },
  {
    id: "b6",
    name: "Clínica Condesa",
    category: "Clínica",
    neighborhood: "Condesa",
    score: 91,
    seal: "Oro",
    image: bizClinic,
    features: ["Acceso a nivel", "Elevador médico", "Personal LSM", "Estacionamiento accesible"],
  },
];

export type Kpi = {
  label: string;
  value: string;
  delta?: string;
  hint?: string;
};

export const cityKpis: Kpi[] = [
  { label: "Km accesibles", value: "1,240", delta: "+12%", hint: "vs trimestre" },
  { label: "Reportes resueltos", value: "92%", delta: "+4.2%", hint: "últimos 30 días" },
  { label: "Puntos de apoyo", value: "458", delta: "+38", hint: "nuevos esta semana" },
  { label: "Confianza ciudadana", value: "84/100", hint: "validación cruzada" },
];

export const intelligenceKpis: Kpi[] = [
  { label: "Barreras detectadas", value: "342", delta: "−18%", hint: "vs Q anterior" },
  { label: "Tiempo medio de resolución", value: "4.2 h", delta: "−1.1 h", hint: "respuesta municipal" },
  { label: "Cobertura ciudadana", value: "76%", delta: "+9%", hint: "colonias activas" },
  { label: "Acceso a servicios", value: "+22%", hint: "hospitales y trámites" },
];

export const priorityZones = [
  { zone: "Doctores", score: 91, reports: 64, service: "Hospital General" },
  { zone: "Centro Histórico", score: 87, reports: 58, service: "Trámites municipales" },
  { zone: "Iztapalapa Centro", score: 84, reports: 51, service: "Centro de salud T-III" },
  { zone: "Pino Suárez", score: 78, reports: 42, service: "Estación Metro" },
  { zone: "Tacuba", score: 72, reports: 36, service: "Mercado y CESAC" },
];

export const accessibilityTrend = [
  { mes: "Ene", indice: 64 },
  { mes: "Feb", indice: 66 },
  { mes: "Mar", indice: 70 },
  { mes: "Abr", indice: 71 },
  { mes: "May", indice: 75 },
  { mes: "Jun", indice: 78 },
  { mes: "Jul", indice: 80 },
  { mes: "Ago", indice: 84 },
];

export const profile = {
  name: "Elena Jiménez",
  role: "Auditora verificada",
  level: 12,
  nextLevelProgress: 0.74,
  metrics: [
    { label: "Reportes hechos", value: 184 },
    { label: "Rutas optimizadas", value: 42 },
    { label: "Personas ayudadas", value: 1280 },
    { label: "Precisión", value: "96%" },
  ],
  badges: [
    { name: "Medalla vial", desc: "20 rampas reportadas" },
    { name: "Reporta-hit", desc: "10 reportes verificados en 1 día" },
    { name: "Auditora", desc: "Verificó 50 reportes de otros" },
    { name: "Guía urbana", desc: "Trazó 30 rutas inclusivas" },
    { name: "Centinela", desc: "30 días consecutivos activos" },
    { name: "Embajadora", desc: "Invitó a 5 usuarios" },
  ],
  timeline: [
    { id: "R-492", title: "Obra en Av. Juárez", status: "activo" as const, when: "Hoy" },
    { id: "R-485", title: "Rampa operativa en Roma Norte", status: "resuelto" as const, when: "Ayer" },
    { id: "R-478", title: "Elevador Metro Hidalgo", status: "verificado" as const, when: "Lun" },
    { id: "R-470", title: "Banqueta bloqueada en Reforma", status: "resuelto" as const, when: "Vie" },
  ],
};
