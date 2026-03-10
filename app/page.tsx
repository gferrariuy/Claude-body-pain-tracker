"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BodyMap from "@/components/BodyMap/BodyMap";
import {
  getTodayPainRecords,
  getTodayActivities,
  getTodayMedications,
  getPainRecords,
  getActivities,
} from "@/lib/storage";
import {
  PainRecord,
  Activity,
  Medication,
  getPainColor,
  ACTIVITY_TYPE_LABELS,
  ACTIVITY_TYPE_ICONS,
  MEDICATION_TYPE_LABELS,
  MEDICATION_TYPE_ICONS,
} from "@/lib/types";
import { formatDate, getTodayISO } from "@/lib/utils";
import {
  Activity as ActivityIcon,
  AlertCircle,
  BarChart3,
  Brain,
  Calendar,
  Pill,
  Plus,
} from "lucide-react";

export default function HomePage() {
  const [todayPain, setTodayPain] = useState<PainRecord[]>([]);
  const [todayActivities, setTodayActivities] = useState<Activity[]>([]);
  const [todayMedications, setTodayMedications] = useState<Medication[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalActivities, setTotalActivities] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTodayPain(getTodayPainRecords());
    setTodayActivities(getTodayActivities());
    setTodayMedications(getTodayMedications());
    setTotalRecords(getPainRecords().length);
    setTotalActivities(getActivities().length);
    setMounted(true);
  }, []);

  const today = getTodayISO();
  const avgIntensity =
    todayPain.length > 0
      ? todayPain.reduce((s, r) => s + r.intensity, 0) / todayPain.length
      : 0;

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Hoy</h1>
        <p className="text-muted-foreground">{formatDate(today)}</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-xs font-medium text-muted-foreground">
                Dolores hoy
              </span>
            </div>
            <p className="text-2xl font-bold">{todayPain.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="h-4 w-4 text-orange-500" />
              <span className="text-xs font-medium text-muted-foreground">
                Int. promedio
              </span>
            </div>
            <p
              className="text-2xl font-bold"
              style={{ color: avgIntensity > 0 ? getPainColor(avgIntensity) : undefined }}
            >
              {avgIntensity > 0 ? avgIntensity.toFixed(1) : "—"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <ActivityIcon className="h-4 w-4 text-blue-500" />
              <span className="text-xs font-medium text-muted-foreground">
                Actividades hoy
              </span>
            </div>
            <p className="text-2xl font-bold">{todayActivities.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Pill className="h-4 w-4 text-green-600" />
              <span className="text-xs font-medium text-muted-foreground">
                Medicamentos hoy
              </span>
            </div>
            <p className="text-2xl font-bold">{todayMedications.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Body map and records */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Mapa corporal de hoy</CardTitle>
          </CardHeader>
          <CardContent>
            {todayPain.length > 0 ? (
              <BodyMap painRecords={todayPain} readOnly />
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Sin registros de dolor hoy</p>
                <Link href="/registro">
                  <Button variant="outline" size="sm" className="mt-3">
                    <Plus className="h-3.5 w-3.5 mr-1" /> Registrar dolor
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          {/* Today's pain list */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Dolores registrados</CardTitle>
                <Link href="/registro">
                  <Button variant="ghost" size="sm">
                    <Plus className="h-3.5 w-3.5 mr-1" /> Agregar
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {todayPain.length > 0 ? (
                <ul className="space-y-2">
                  {todayPain.map((r) => (
                    <li
                      key={r.id}
                      className="flex items-center gap-2 text-sm py-1"
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ background: getPainColor(r.intensity) }}
                      />
                      <span className="flex-1 font-medium truncate">
                        {r.muscleName}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {r.intensity}/10
                      </Badge>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-3">
                  Sin registros
                </p>
              )}
            </CardContent>
          </Card>

          {/* Today's activities */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Actividades de hoy</CardTitle>
                <Link href="/registro">
                  <Button variant="ghost" size="sm">
                    <Plus className="h-3.5 w-3.5 mr-1" /> Agregar
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {todayActivities.length > 0 ? (
                <ul className="space-y-2">
                  {todayActivities.map((a) => (
                    <li key={a.id} className="flex items-center gap-2 text-sm py-1">
                      <span>{ACTIVITY_TYPE_ICONS[a.activityType]}</span>
                      <span className="flex-1">
                        {a.activityType === "otro" && a.customActivity
                          ? a.customActivity
                          : ACTIVITY_TYPE_LABELS[a.activityType]}
                      </span>
                      {a.durationMinutes && (
                        <span className="text-xs text-muted-foreground">
                          {a.durationMinutes} min
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-3">
                  Sin actividades
                </p>
              )}
            </CardContent>
          </Card>

          {/* Today's medications */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Medicamentos de hoy</CardTitle>
                <Link href="/registro">
                  <Button variant="ghost" size="sm">
                    <Plus className="h-3.5 w-3.5 mr-1" /> Agregar
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {todayMedications.length > 0 ? (
                <ul className="space-y-2">
                  {todayMedications.map((m) => (
                    <li key={m.id} className="flex items-center gap-2 text-sm py-1">
                      <span>{MEDICATION_TYPE_ICONS[m.medicationType]}</span>
                      <span className="flex-1">
                        {MEDICATION_TYPE_LABELS[m.medicationType]}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {m.quantity} {m.quantity === 1 ? "unidad" : "unidades"}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-3">
                  Sin medicamentos
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Link href="/registro" className="block">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="p-4 flex flex-col items-center gap-2 text-center">
              <Plus className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium">Registrar</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/historial" className="block">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="p-4 flex flex-col items-center gap-2 text-center">
              <Calendar className="h-6 w-6 text-blue-500" />
              <span className="text-sm font-medium">Historial</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/estadisticas" className="block">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="p-4 flex flex-col items-center gap-2 text-center">
              <BarChart3 className="h-6 w-6 text-orange-500" />
              <span className="text-sm font-medium">Estadísticas</span>
            </CardContent>
          </Card>
        </Link>
        <Link href="/patrones" className="block">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="p-4 flex flex-col items-center gap-2 text-center">
              <Brain className="h-6 w-6 text-purple-500" />
              <span className="text-sm font-medium">Patrones</span>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
