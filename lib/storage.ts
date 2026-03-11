"use client";

import { PainRecord, Activity, Medication, SleepRecord } from "./types";
import { generateId, getTodayISO } from "./utils";

const PAIN_RECORDS_KEY = "pain-tracker:pain-records";
const ACTIVITIES_KEY = "pain-tracker:activities";

// ── Pain Records ──────────────────────────────────────────────────────────────

export function getPainRecords(): PainRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(PAIN_RECORDS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function savePainRecord(
  record: Omit<PainRecord, "id" | "createdAt">
): PainRecord {
  const records = getPainRecords();
  const newRecord: PainRecord = {
    ...record,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  records.push(newRecord);
  localStorage.setItem(PAIN_RECORDS_KEY, JSON.stringify(records));
  return newRecord;
}

export function updatePainRecord(
  id: string,
  updates: Partial<Omit<PainRecord, "id" | "createdAt">>
): PainRecord | null {
  const records = getPainRecords();
  const idx = records.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  records[idx] = { ...records[idx], ...updates };
  localStorage.setItem(PAIN_RECORDS_KEY, JSON.stringify(records));
  return records[idx];
}

export function deletePainRecord(id: string): void {
  const records = getPainRecords().filter((r) => r.id !== id);
  localStorage.setItem(PAIN_RECORDS_KEY, JSON.stringify(records));
}

export function getPainRecordsByDate(date: string): PainRecord[] {
  return getPainRecords().filter((r) => r.date === date);
}

export function getTodayPainRecords(): PainRecord[] {
  return getPainRecordsByDate(getTodayISO());
}

// ── Activities ────────────────────────────────────────────────────────────────

export function getActivities(): Activity[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(ACTIVITIES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveActivity(
  activity: Omit<Activity, "id" | "createdAt">
): Activity {
  const activities = getActivities();
  const newActivity: Activity = {
    ...activity,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  activities.push(newActivity);
  localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities));
  return newActivity;
}

export function updateActivity(
  id: string,
  updates: Partial<Omit<Activity, "id" | "createdAt">>
): Activity | null {
  const activities = getActivities();
  const idx = activities.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  activities[idx] = { ...activities[idx], ...updates };
  localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities));
  return activities[idx];
}

export function deleteActivity(id: string): void {
  const activities = getActivities().filter((a) => a.id !== id);
  localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities));
}

export function getActivitiesByDate(date: string): Activity[] {
  return getActivities().filter((a) => a.date === date);
}

export function getTodayActivities(): Activity[] {
  return getActivitiesByDate(getTodayISO());
}

// ── Medications ───────────────────────────────────────────────────────────────

const MEDICATIONS_KEY = "pain-tracker:medications";

export function getMedications(): Medication[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(MEDICATIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveMedication(
  medication: Omit<Medication, "id" | "createdAt">
): Medication {
  const medications = getMedications();
  const newMedication: Medication = {
    ...medication,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  medications.push(newMedication);
  localStorage.setItem(MEDICATIONS_KEY, JSON.stringify(medications));
  return newMedication;
}

export function updateMedication(
  id: string,
  updates: Partial<Omit<Medication, "id" | "createdAt">>
): Medication | null {
  const medications = getMedications();
  const idx = medications.findIndex((m) => m.id === id);
  if (idx === -1) return null;
  medications[idx] = { ...medications[idx], ...updates };
  localStorage.setItem(MEDICATIONS_KEY, JSON.stringify(medications));
  return medications[idx];
}

export function deleteMedication(id: string): void {
  const medications = getMedications().filter((m) => m.id !== id);
  localStorage.setItem(MEDICATIONS_KEY, JSON.stringify(medications));
}

export function getMedicationsByDate(date: string): Medication[] {
  return getMedications().filter((m) => m.date === date);
}

export function getTodayMedications(): Medication[] {
  return getMedicationsByDate(getTodayISO());
}

// ── Sleep Records ─────────────────────────────────────────────────────────────

const SLEEP_KEY = "pain-tracker:sleep";

export function getSleepRecords(): SleepRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(SLEEP_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveSleepRecord(
  record: Omit<SleepRecord, "id" | "createdAt">
): SleepRecord {
  const records = getSleepRecords();
  const newRecord: SleepRecord = {
    ...record,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  records.push(newRecord);
  localStorage.setItem(SLEEP_KEY, JSON.stringify(records));
  return newRecord;
}

export function updateSleepRecord(
  id: string,
  updates: Partial<Omit<SleepRecord, "id" | "createdAt">>
): SleepRecord | null {
  const records = getSleepRecords();
  const idx = records.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  records[idx] = { ...records[idx], ...updates };
  localStorage.setItem(SLEEP_KEY, JSON.stringify(records));
  return records[idx];
}

export function deleteSleepRecord(id: string): void {
  const records = getSleepRecords().filter((r) => r.id !== id);
  localStorage.setItem(SLEEP_KEY, JSON.stringify(records));
}

export function getSleepByDate(date: string): SleepRecord[] {
  return getSleepRecords().filter((r) => r.date === date);
}

export function getTodaySleep(): SleepRecord[] {
  return getSleepByDate(getTodayISO());
}

// ── Statistics ────────────────────────────────────────────────────────────────

export interface MuscleStats {
  muscleId: string;
  muscleName: string;
  count: number;
  avgIntensity: number;
  maxIntensity: number;
}

export function getTopMusclesByPeriod(
  from: string,
  to: string,
  limit = 10
): MuscleStats[] {
  const records = getPainRecords().filter(
    (r) => r.date >= from && r.date <= to
  );

  const stats: Record<string, { count: number; intensities: number[]; name: string }> =
    {};

  for (const r of records) {
    if (!stats[r.muscleId]) {
      stats[r.muscleId] = { count: 0, intensities: [], name: r.muscleName };
    }
    stats[r.muscleId].count++;
    stats[r.muscleId].intensities.push(r.intensity);
  }

  return Object.entries(stats)
    .map(([muscleId, s]) => ({
      muscleId,
      muscleName: s.name,
      count: s.count,
      avgIntensity:
        s.intensities.reduce((a, b) => a + b, 0) / s.intensities.length,
      maxIntensity: Math.max(...s.intensities),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export interface DailyPainSummary {
  date: string;
  count: number;
  avgIntensity: number;
}

export function getDailyPainSummary(from: string, to: string): DailyPainSummary[] {
  const records = getPainRecords().filter(
    (r) => r.date >= from && r.date <= to
  );

  const byDate: Record<string, number[]> = {};
  for (const r of records) {
    if (!byDate[r.date]) byDate[r.date] = [];
    byDate[r.date].push(r.intensity);
  }

  return Object.entries(byDate)
    .map(([date, intensities]) => ({
      date,
      count: intensities.length,
      avgIntensity: intensities.reduce((a, b) => a + b, 0) / intensities.length,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

// ── Patterns ──────────────────────────────────────────────────────────────────

import { PatternResult, ACTIVITY_TYPE_LABELS, SleepPatternResult, SleepQuality } from "./types";
import { getDatesAfter } from "./utils";

export function detectPatterns(windowDays = 2): PatternResult[] {
  const allRecords = getPainRecords();
  const allActivities = getActivities();

  if (allActivities.length === 0 || allRecords.length === 0) return [];

  const activityTypesSet = new Set(allActivities.map((a) => a.activityType));
  const activityTypes = Array.from(activityTypesSet);

  const results: PatternResult[] = [];

  for (const actType of activityTypes) {
    const actDates = allActivities
      .filter((a) => a.activityType === actType)
      .map((a) => a.date);

    if (actDates.length < 2) continue;

    // Dates within window days after any activity of this type
    const afterDates = new Set<string>();
    for (const d of actDates) {
      for (const next of getDatesAfter(d, windowDays)) {
        afterDates.add(next);
      }
    }

    const recordsAfter = allRecords.filter((r) => afterDates.has(r.date));
    const recordsBaseline = allRecords.filter((r) => !afterDates.has(r.date));

    // Number of days in each group (approximate)
    const afterDaysCount = afterDates.size;
    const allDates = new Set(allRecords.map((r) => r.date));
    const baselineDaysCount = Math.max(
      [...allDates].filter((d) => !afterDates.has(d)).length,
      1
    );

    // Find muscles with elevated occurrence rate after activity
    const musclesAfter: Record<string, { count: number; name: string }> = {};
    for (const r of recordsAfter) {
      if (!musclesAfter[r.muscleId]) {
        musclesAfter[r.muscleId] = { count: 0, name: r.muscleName };
      }
      musclesAfter[r.muscleId].count++;
    }

    const musclesBaseline: Record<string, number> = {};
    for (const r of recordsBaseline) {
      musclesBaseline[r.muscleId] = (musclesBaseline[r.muscleId] || 0) + 1;
    }

    for (const [muscleId, { count, name }] of Object.entries(musclesAfter)) {
      const rateAfter = (count / afterDaysCount) * 100;
      const baselineCount = musclesBaseline[muscleId] || 0;
      const rateBaseline = (baselineCount / baselineDaysCount) * 100;
      const lift = rateBaseline > 0 ? rateAfter / rateBaseline : rateAfter > 0 ? 999 : 1;

      if (lift >= 1.5 && count >= 2) {
        results.push({
          activityType: actType,
          activityLabel: ACTIVITY_TYPE_LABELS[actType],
          muscleId,
          muscleName: name,
          totalActivityDays: actDates.length,
          painOccurrencesAfter: count,
          painOccurrencesBaseline: baselineCount,
          correlationRate: Math.min(rateAfter, 100),
          baselineRate: Math.min(rateBaseline, 100),
          lift,
        });
      }
    }
  }

  return results.sort((a, b) => b.lift - a.lift);
}

export function detectSleepPatterns(windowDays = 2): SleepPatternResult[] {
  const allRecords = getPainRecords();
  const allSleep = getSleepRecords();

  if (allSleep.length === 0 || allRecords.length === 0) return [];

  const qualityTypesSet = new Set(allSleep.map((s) => s.sleepQuality));
  const qualityTypes = Array.from(qualityTypesSet) as SleepQuality[];

  const results: SleepPatternResult[] = [];

  for (const quality of qualityTypes) {
    const sleepDates = allSleep
      .filter((s) => s.sleepQuality === quality)
      .map((s) => s.date);

    if (sleepDates.length < 2) continue;

    // Dates within window days after (and including) any sleep record of this quality
    const afterDates = new Set<string>();
    for (const d of sleepDates) {
      afterDates.add(d);
      for (const next of getDatesAfter(d, windowDays)) {
        afterDates.add(next);
      }
    }

    const recordsAfter = allRecords.filter((r) => afterDates.has(r.date));
    const recordsBaseline = allRecords.filter((r) => !afterDates.has(r.date));

    const afterDaysCount = afterDates.size;
    const allDates = new Set(allRecords.map((r) => r.date));
    const baselineDaysCount = Math.max(
      Array.from(allDates).filter((d) => !afterDates.has(d)).length,
      1
    );

    const musclesAfter: Record<string, { count: number; name: string }> = {};
    for (const r of recordsAfter) {
      if (!musclesAfter[r.muscleId]) {
        musclesAfter[r.muscleId] = { count: 0, name: r.muscleName };
      }
      musclesAfter[r.muscleId].count++;
    }

    const musclesBaseline: Record<string, number> = {};
    for (const r of recordsBaseline) {
      musclesBaseline[r.muscleId] = (musclesBaseline[r.muscleId] || 0) + 1;
    }

    for (const [muscleId, { count, name }] of Object.entries(musclesAfter)) {
      const rateAfter = (count / afterDaysCount) * 100;
      const baselineCount = musclesBaseline[muscleId] || 0;
      const rateBaseline = (baselineCount / baselineDaysCount) * 100;
      const lift = rateBaseline > 0 ? rateAfter / rateBaseline : rateAfter > 0 ? 999 : 1;

      if (lift >= 1.5 && count >= 2) {
        results.push({
          sleepQuality: quality,
          muscleId,
          muscleName: name,
          totalSleepDays: sleepDates.length,
          painOccurrencesAfter: count,
          painOccurrencesBaseline: baselineCount,
          correlationRate: Math.min(rateAfter, 100),
          baselineRate: Math.min(rateBaseline, 100),
          lift,
        });
      }
    }
  }

  return results.sort((a, b) => b.lift - a.lift);
}
