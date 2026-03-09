"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  Cell,
} from "recharts";
import {
  getTopMusclesByPeriod,
  getDailyPainSummary,
  MuscleStats,
  DailyPainSummary,
} from "@/lib/storage";
import { getPainColor, getPainColor as getColor } from "@/lib/types";
import { formatDateShort, getWeekStart, getMonthStart, getTodayISO } from "@/lib/utils";
import { BarChart3, TrendingUp } from "lucide-react";

type Period = "week" | "month" | "all";

const PERIOD_LABELS: Record<Period, string> = {
  week: "Esta semana",
  month: "Este mes",
  all: "Siempre",
};

export default function EstadisticasPage() {
  const [period, setPeriod] = useState<Period>("month");
  const [topMuscles, setTopMuscles] = useState<MuscleStats[]>([]);
  const [dailySummary, setDailySummary] = useState<DailyPainSummary[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const today = getTodayISO();
    let fromDate: string;

    if (period === "week") {
      fromDate = getWeekStart();
    } else if (period === "month") {
      fromDate = getMonthStart();
    } else {
      fromDate = "2000-01-01";
    }

    setTopMuscles(getTopMusclesByPeriod(fromDate, today, 10));
    setDailySummary(getDailyPainSummary(fromDate, today));
    setMounted(true);
  }, [period]);

  const noData = topMuscles.length === 0;

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Estadísticas</h1>
        <p className="text-muted-foreground">Análisis de tus registros de dolor</p>
      </div>

      {/* Period selector */}
      <div className="flex gap-2">
        {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
          <Button
            key={p}
            variant={period === p ? "default" : "outline"}
            size="sm"
            onClick={() => setPeriod(p)}
          >
            {PERIOD_LABELS[p]}
          </Button>
        ))}
      </div>

      {noData ? (
        <Card>
          <CardContent className="py-16 text-center">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground font-medium">
              Sin datos para el período seleccionado
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Registra dolores para ver estadísticas
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Top 10 pain locations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-orange-500" />
                Top 10 zonas con más dolor
              </CardTitle>
              <CardDescription>{PERIOD_LABELS[period]}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart
                  data={topMuscles}
                  layout="vertical"
                  margin={{ top: 0, right: 30, left: 10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis
                    type="category"
                    dataKey="muscleName"
                    width={150}
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(value, name) =>
                      name === "count"
                        ? [`${value} veces`, "Registros"]
                        : [`${Number(value).toFixed(1)}`, "Int. promedio"]
                    }
                  />
                  <Bar dataKey="count" name="Registros" radius={[0, 4, 4, 0]}>
                    {topMuscles.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={getPainColor(entry.avgIntensity)}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Average intensity per location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                Intensidad promedio por zona
              </CardTitle>
              <CardDescription>{PERIOD_LABELS[period]}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={topMuscles}
                  layout="vertical"
                  margin={{ top: 0, right: 30, left: 10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis
                    type="number"
                    domain={[0, 10]}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="muscleName"
                    width={150}
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(value) => [
                      `${Number(value).toFixed(1)}/10`,
                      "Intensidad promedio",
                    ]}
                  />
                  <Bar dataKey="avgIntensity" name="Int. promedio" radius={[0, 4, 4, 0]}>
                    {topMuscles.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={getPainColor(entry.avgIntensity)}
                        opacity={0.8}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Daily pain trend */}
          {dailySummary.length > 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Evolución del dolor
                </CardTitle>
                <CardDescription>
                  Registros y intensidad por día — {PERIOD_LABELS[period]}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart
                    data={dailySummary.map((d) => ({
                      ...d,
                      dateLabel: formatDateShort(d.date),
                    }))}
                    margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="dateLabel"
                      tick={{ fontSize: 11 }}
                      tickLine={false}
                    />
                    <YAxis yAxisId="left" tickLine={false} tick={{ fontSize: 11 }} />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      domain={[0, 10]}
                      tickLine={false}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="count"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      name="Nº de registros"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="avgIntensity"
                      stroke="#ef4444"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      name="Intensidad promedio"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Summary table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Detalle por zona</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium text-muted-foreground">
                        Zona
                      </th>
                      <th className="text-center py-2 font-medium text-muted-foreground">
                        Registros
                      </th>
                      <th className="text-center py-2 font-medium text-muted-foreground">
                        Int. prom.
                      </th>
                      <th className="text-center py-2 font-medium text-muted-foreground">
                        Int. máx.
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {topMuscles.map((m, i) => (
                      <tr key={m.muscleId} className="border-b last:border-0">
                        <td className="py-2.5">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground text-xs w-5 text-right">
                              {i + 1}.
                            </span>
                            <span>{m.muscleName}</span>
                          </div>
                        </td>
                        <td className="text-center py-2.5 font-medium">{m.count}</td>
                        <td className="text-center py-2.5">
                          <span
                            className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                            style={{ background: getPainColor(m.avgIntensity) }}
                          >
                            {m.avgIntensity.toFixed(1)}
                          </span>
                        </td>
                        <td className="text-center py-2.5">
                          <span
                            className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                            style={{ background: getPainColor(m.maxIntensity) }}
                          >
                            {m.maxIntensity}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
