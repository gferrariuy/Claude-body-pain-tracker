"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import PainRecordCard from "@/components/PainRecordCard";
import ActivityCard from "@/components/ActivityCard";
import MedicationCard from "@/components/MedicationCard";
import { getPainRecords, getActivities, getMedications } from "@/lib/storage";
import { PainRecord, Activity, Medication } from "@/lib/types";
import { formatDate, getTodayISO } from "@/lib/utils";
import { Calendar, ChevronLeft, ChevronRight, AlertCircle, Activity as ActivityIcon, Pill } from "lucide-react";
import {
  format,
  parseISO,
  addDays,
  subDays,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { es } from "date-fns/locale";

export default function HistorialPage() {
  const [selectedDate, setSelectedDate] = useState(getTodayISO());
  const [painRecords, setPainRecords] = useState<PainRecord[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [allDatesWithData, setAllDatesWithData] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  function loadData() {
    const allPain = getPainRecords();
    const allActs = getActivities();
    const allMeds = getMedications();

    setPainRecords(allPain.filter((r) => r.date === selectedDate));
    setActivities(allActs.filter((a) => a.date === selectedDate));
    setMedications(allMeds.filter((m) => m.date === selectedDate));

    const datesSet = new Set([
      ...allPain.map((r) => r.date),
      ...allActs.map((a) => a.date),
      ...allMeds.map((m) => m.date),
    ]);
    setAllDatesWithData(datesSet);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadData();
    setMounted(true);
  }, [selectedDate]);

  function goToPrevDay() {
    setSelectedDate((d) => format(subDays(parseISO(d), 1), "yyyy-MM-dd"));
  }

  function goToNextDay() {
    const next = format(addDays(parseISO(selectedDate), 1), "yyyy-MM-dd");
    if (next <= getTodayISO()) {
      setSelectedDate(next);
    }
  }

  function goToToday() {
    setSelectedDate(getTodayISO());
  }

  const isToday = selectedDate === getTodayISO();
  const hasData = painRecords.length > 0 || activities.length > 0 || medications.length > 0;

  // Build mini calendar for current month
  const monthStart = startOfMonth(parseISO(selectedDate));
  const monthEnd = endOfMonth(parseISO(selectedDate));
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const firstDayOfWeek = (monthStart.getDay() + 6) % 7; // Monday-first

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Historial</h1>
        <p className="text-muted-foreground">Consulta y edita registros pasados</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">
                {format(parseISO(selectedDate), "MMMM yyyy", { locale: es })}
              </CardTitle>
              {!isToday && (
                <Button variant="ghost" size="sm" onClick={goToToday} className="text-xs h-7">
                  Hoy
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-3">
            {/* Day navigation */}
            <div className="flex items-center justify-between mb-4">
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={goToPrevDay}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">
                {format(parseISO(selectedDate), "d MMM", { locale: es })}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={goToNextDay}
                disabled={isToday}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Mini calendar */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {["L", "M", "X", "J", "V", "S", "D"].map((d) => (
                <div key={d} className="text-xs font-medium text-muted-foreground py-1">
                  {d}
                </div>
              ))}
              {/* Empty cells for alignment */}
              {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {calendarDays.map((day) => {
                const dayStr = format(day, "yyyy-MM-dd");
                const isSelected = dayStr === selectedDate;
                const hasDataForDay = allDatesWithData.has(dayStr);
                const isFuture = dayStr > getTodayISO();

                return (
                  <button
                    key={dayStr}
                    disabled={isFuture}
                    onClick={() => setSelectedDate(dayStr)}
                    className={[
                      "text-xs h-7 w-7 mx-auto rounded-full flex items-center justify-center relative transition-colors",
                      isSelected ? "bg-primary text-white font-bold" : "",
                      !isSelected && hasDataForDay ? "font-semibold text-primary" : "",
                      !isSelected && !isFuture ? "hover:bg-muted" : "",
                      isFuture ? "opacity-30 cursor-not-allowed" : "cursor-pointer",
                    ].join(" ")}
                  >
                    {format(day, "d")}
                    {hasDataForDay && !isSelected && (
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Day detail */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">{formatDate(selectedDate)}</h2>
            {isToday && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                Hoy
              </span>
            )}
          </div>

          {!hasData ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="h-10 w-10 mx-auto mb-3 opacity-20" />
                <p className="text-muted-foreground">
                  Sin registros para este día
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Pain records */}
              {painRecords.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Dolores ({painRecords.length})
                  </h3>
                  <div className="space-y-2">
                    {painRecords
                      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                      .map((r) => (
                        <PainRecordCard
                          key={r.id}
                          record={r}
                          onUpdate={loadData}
                        />
                      ))}
                  </div>
                </div>
              )}

              {/* Activities */}
              {activities.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <ActivityIcon className="h-3.5 w-3.5" />
                    Actividades ({activities.length})
                  </h3>
                  <div className="space-y-2">
                    {activities
                      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                      .map((a) => (
                        <ActivityCard key={a.id} activity={a} onUpdate={loadData} />
                      ))}
                  </div>
                </div>
              )}

              {/* Medications */}
              {medications.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <Pill className="h-3.5 w-3.5" />
                    Medicamentos ({medications.length})
                  </h3>
                  <div className="space-y-2">
                    {medications
                      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                      .map((m) => (
                        <MedicationCard key={m.id} medication={m} onUpdate={loadData} />
                      ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
