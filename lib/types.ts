export type PainType =
  | "agudo"
  | "sordo"
  | "quemante"
  | "punzante"
  | "pulsante"
  | "hormigueo";

export type BodyView = "front" | "back";

export interface PainRecord {
  id: string;
  date: string; // YYYY-MM-DD
  muscleId: string;
  muscleName: string;
  view: BodyView;
  side?: "left" | "right" | "center";
  intensity: number; // 1-10
  painType: PainType;
  notes?: string;
  createdAt: string; // ISO datetime
}

export type ActivityType =
  | "caminar"
  | "correr"
  | "conducir"
  | "ejercicio"
  | "ciclismo"
  | "natacion"
  | "trabajo_oficina"
  | "pesas"
  | "yoga_pilates"
  | "otro";

export interface Activity {
  id: string;
  date: string; // YYYY-MM-DD
  activityType: ActivityType;
  customActivity?: string;
  durationMinutes?: number;
  notes?: string;
  createdAt: string; // ISO datetime
}

export interface PatternResult {
  activityType: ActivityType;
  activityLabel: string;
  muscleId: string;
  muscleName: string;
  totalActivityDays: number;
  painOccurrencesAfter: number;
  painOccurrencesBaseline: number;
  correlationRate: number; // percentage
  baselineRate: number; // percentage
  lift: number; // how many times more likely
}

export const PAIN_TYPE_LABELS: Record<PainType, string> = {
  agudo: "Agudo",
  sordo: "Sordo/Opresivo",
  quemante: "Quemante",
  punzante: "Punzante",
  pulsante: "Pulsante",
  hormigueo: "Hormigueo",
};

export const PAIN_TYPE_COLORS: Record<PainType, string> = {
  agudo: "bg-red-100 text-red-800",
  sordo: "bg-blue-100 text-blue-800",
  quemante: "bg-orange-100 text-orange-800",
  punzante: "bg-purple-100 text-purple-800",
  pulsante: "bg-pink-100 text-pink-800",
  hormigueo: "bg-yellow-100 text-yellow-800",
};

export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  caminar: "Caminar",
  correr: "Correr",
  conducir: "Conducir",
  ejercicio: "Ejercicio",
  ciclismo: "Ciclismo",
  natacion: "Natación",
  trabajo_oficina: "Trabajo de oficina",
  pesas: "Levantar pesas",
  yoga_pilates: "Yoga/Pilates",
  otro: "Otro",
};

export const ACTIVITY_TYPE_ICONS: Record<ActivityType, string> = {
  caminar: "👟",
  correr: "🏃",
  conducir: "🚗",
  ejercicio: "💪",
  ciclismo: "🚴",
  natacion: "🏊",
  trabajo_oficina: "💼",
  pesas: "🏋️",
  yoga_pilates: "🧘",
  otro: "⚡",
};

export const MUSCLE_NAMES: Record<string, string> = {
  // Front
  head: "Cabeza",
  neck: "Cuello",
  "left-shoulder": "Hombro izquierdo",
  "right-shoulder": "Hombro derecho",
  "left-chest": "Pecho izquierdo",
  "right-chest": "Pecho derecho",
  "left-bicep": "Bíceps izquierdo",
  "right-bicep": "Bíceps derecho",
  "left-oblique": "Oblicuo izquierdo",
  "right-oblique": "Oblicuo derecho",
  "left-abs": "Abdomen izquierdo",
  "right-abs": "Abdomen derecho",
  "left-forearm": "Antebrazo izquierdo",
  "right-forearm": "Antebrazo derecho",
  "left-hand": "Mano izquierda",
  "right-hand": "Mano derecha",
  "left-quad": "Cuádriceps izquierdo",
  "right-quad": "Cuádriceps derecho",
  "left-knee": "Rodilla izquierda",
  "right-knee": "Rodilla derecha",
  "left-shin": "Espinilla izquierda",
  "right-shin": "Espinilla derecha",
  "left-ankle": "Tobillo izquierdo",
  "right-ankle": "Tobillo derecho",
  "left-foot": "Pie izquierdo",
  "right-foot": "Pie derecho",
  "left-groin": "Ingle izquierda",
  "right-groin": "Ingle derecha",
  // Back
  "head-back": "Cabeza (posterior)",
  "neck-back": "Cuello (posterior)",
  "left-trapezius": "Trapecio izquierdo",
  "right-trapezius": "Trapecio derecho",
  "left-upper-back": "Espalda alta izquierda",
  "right-upper-back": "Espalda alta derecha",
  "left-mid-back": "Espalda media izquierda",
  "right-mid-back": "Espalda media derecha",
  "left-lower-back": "Espalda baja izquierda",
  "right-lower-back": "Espalda baja derecha",
  "left-glute": "Glúteo izquierdo",
  "right-glute": "Glúteo derecho",
  "left-tricep": "Tríceps izquierdo",
  "right-tricep": "Tríceps derecho",
  "left-hamstring": "Isquiotibial izquierdo",
  "right-hamstring": "Isquiotibial derecho",
  "left-calf": "Pantorrilla izquierda",
  "right-calf": "Pantorrilla derecha",
  "left-heel": "Talón izquierdo",
  "right-heel": "Talón derecho",
};

export function getPainColor(intensity: number): string {
  if (intensity <= 2) return "#22c55e"; // green
  if (intensity <= 4) return "#eab308"; // yellow
  if (intensity <= 6) return "#f97316"; // orange
  if (intensity <= 8) return "#ef4444"; // red
  return "#7f1d1d"; // dark red
}

export function getPainColorLight(intensity: number): string {
  if (intensity <= 2) return "#dcfce7";
  if (intensity <= 4) return "#fef9c3";
  if (intensity <= 6) return "#ffedd5";
  if (intensity <= 8) return "#fee2e2";
  return "#fecaca";
}

export function getPainIntensityLabel(intensity: number): string {
  if (intensity <= 2) return "Leve";
  if (intensity <= 4) return "Moderado";
  if (intensity <= 6) return "Considerable";
  if (intensity <= 8) return "Severo";
  return "Insoportable";
}
