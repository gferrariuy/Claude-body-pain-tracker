import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO, startOfWeek, startOfMonth, isWithinInterval, addDays } from "date-fns";
import { es } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string): string {
  return format(parseISO(dateStr), "d 'de' MMMM, yyyy", { locale: es });
}

export function formatDateShort(dateStr: string): string {
  return format(parseISO(dateStr), "d MMM", { locale: es });
}

export function getTodayISO(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export function getWeekStart(): string {
  return format(startOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd");
}

export function getMonthStart(): string {
  return format(startOfMonth(new Date()), "yyyy-MM-dd");
}

export function isDateInRange(dateStr: string, from: string, to: string): boolean {
  const date = parseISO(dateStr);
  const fromDate = parseISO(from);
  const toDate = parseISO(to);
  return isWithinInterval(date, { start: fromDate, end: toDate });
}

export function getDatesAfter(dateStr: string, days: number): string[] {
  const start = parseISO(dateStr);
  const result: string[] = [];
  for (let i = 1; i <= days; i++) {
    result.push(format(addDays(start, i), "yyyy-MM-dd"));
  }
  return result;
}

export function generateId(): string {
  return crypto.randomUUID();
}
