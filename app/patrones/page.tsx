"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { detectPatterns } from "@/lib/storage";
import { PatternResult, ACTIVITY_TYPE_ICONS } from "@/lib/types";
import { getPainColor } from "@/lib/types";
import { Brain, TrendingUp, Info, Lightbulb } from "lucide-react";
import { getActivities, getPainRecords } from "@/lib/storage";

export default function PatronesPage() {
  const [patterns, setPatterns] = useState<PatternResult[]>([]);
  const [windowDays, setWindowDays] = useState(2);
  const [hasEnoughData, setHasEnoughData] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const activities = getActivities();
    const records = getPainRecords();
    const enough = activities.length >= 3 && records.length >= 3;
    setHasEnoughData(enough);

    if (enough) {
      setPatterns(detectPatterns(windowDays));
    }
    setMounted(true);
  }, [windowDays]);

  if (!mounted) return null;

  const groupedByActivity: Record<string, PatternResult[]> = {};
  for (const p of patterns) {
    if (!groupedByActivity[p.activityType]) {
      groupedByActivity[p.activityType] = [];
    }
    groupedByActivity[p.activityType].push(p);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Patrones de dolor</h1>
        <p className="text-muted-foreground">
          Detecta qué actividades pueden estar relacionadas con tu dolor
        </p>
      </div>

      {/* How it works */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">¿Cómo funciona?</p>
              <p>
                El sistema analiza si los dolores aparecen o se intensifican en las{" "}
                <strong>{windowDays * 24} horas</strong> posteriores a cada actividad.
                Solo se muestran correlaciones donde el dolor es al menos 1.5x más frecuente
                tras la actividad (con mínimo 2 ocurrencias).
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Window days selector */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">Ventana de análisis:</span>
        {[1, 2, 3].map((days) => (
          <Button
            key={days}
            variant={windowDays === days ? "default" : "outline"}
            size="sm"
            onClick={() => setWindowDays(days)}
          >
            {days === 1 ? "24 horas" : days === 2 ? "48 horas" : "72 horas"}
          </Button>
        ))}
      </div>

      {!hasEnoughData ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Brain className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground font-medium">Datos insuficientes</p>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
              Necesitas al menos 3 registros de dolor y 3 actividades para detectar
              patrones. Sigue registrando y pronto aparecerán aquí.
            </p>
          </CardContent>
        </Card>
      ) : patterns.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground font-medium">
              Sin patrones detectados
            </p>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
              No se encontraron correlaciones significativas entre tus actividades
              y los dolores registrados en el período analizado.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Prueba a ampliar la ventana de análisis o continúa registrando.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Se encontraron <strong>{patterns.length}</strong> posibles correlaciones
          </p>

          {Object.entries(groupedByActivity).map(([actType, actPatterns]) => (
            <Card key={actType}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <span className="text-xl">
                    {ACTIVITY_TYPE_ICONS[actType as keyof typeof ACTIVITY_TYPE_ICONS]}
                  </span>
                  <span>Después de: {actPatterns[0].activityLabel}</span>
                </CardTitle>
                <CardDescription>
                  {actPatterns[0].totalActivityDays} días con esta actividad registrada
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {actPatterns.map((p, i) => (
                    <div
                      key={`${p.activityType}-${p.muscleId}`}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                    >
                      <div
                        className="w-1.5 h-12 rounded-full flex-shrink-0"
                        style={{ background: getPainColor(Math.min(p.lift * 2, 10)) }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{p.muscleName}</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            Tasa tras actividad:{" "}
                            <strong className="text-foreground">
                              {p.correlationRate.toFixed(1)}%
                            </strong>{" "}
                            de los días
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Tasa base:{" "}
                            <strong className="text-foreground">
                              {p.baselineRate.toFixed(1)}%
                            </strong>
                          </span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <Badge
                          className="text-white text-xs"
                          style={{
                            background: getPainColor(
                              Math.min(p.lift * 2, 10)
                            ),
                          }}
                        >
                          {p.lift >= 999
                            ? "Solo tras activ."
                            : `${p.lift.toFixed(1)}x más`}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {p.painOccurrencesAfter} veces
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Interpretation */}
                <div className="mt-3 p-3 rounded-lg border border-yellow-200 bg-yellow-50">
                  <p className="text-xs text-yellow-800">
                    <strong>💡 Interpretación:</strong>{" "}
                    {actPatterns.length === 1
                      ? `Después de ${actPatterns[0].activityLabel}, ${actPatterns[0].muscleName} duele ${
                          actPatterns[0].lift >= 999
                            ? "casi exclusivamente"
                            : `${actPatterns[0].lift.toFixed(1)} veces más de lo habitual`
                        }.`
                      : `Después de ${actPatterns[0].activityLabel}, ${actPatterns.length} zonas corporales
                        muestran mayor incidencia de dolor.`}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Disclaimer */}
          <Card className="border-gray-200 bg-gray-50">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">
                <strong>Nota:</strong> Estos patrones son estadísticos, no diagnósticos médicos.
                La correlación no implica causalidad. Consulta a un médico o fisioterapeuta
                para una evaluación profesional.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
