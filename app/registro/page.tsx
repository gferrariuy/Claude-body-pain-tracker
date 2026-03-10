"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BodyMap from "@/components/BodyMap/BodyMap";
import PainFormDialog from "@/components/PainFormDialog";
import ActivityFormDialog from "@/components/ActivityFormDialog";
import MedicationFormDialog from "@/components/MedicationFormDialog";
import PainRecordCard from "@/components/PainRecordCard";
import ActivityCard from "@/components/ActivityCard";
import MedicationCard from "@/components/MedicationCard";
import {
  PainRecord,
  Activity,
  Medication,
  PainType,
  ActivityType,
  MedicationType,
} from "@/lib/types";
import {
  getTodayPainRecords,
  getTodayActivities,
  getTodayMedications,
  savePainRecord,
  saveActivity,
  saveMedication,
} from "@/lib/storage";
import { formatDate, getTodayISO } from "@/lib/utils";
import { Activity as ActivityIcon, AlertCircle, Pill, Plus } from "lucide-react";
import { toast } from "sonner";

interface PendingPain {
  muscleId: string;
  muscleName: string;
  view: "front" | "back";
}

export default function RegistroPage() {
  const [painRecords, setPainRecords] = useState<PainRecord[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [pendingPain, setPendingPain] = useState<PendingPain | null>(null);
  const [activityDialogOpen, setActivityDialogOpen] = useState(false);
  const [medicationDialogOpen, setMedicationDialogOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  function refresh() {
    setPainRecords(getTodayPainRecords());
    setActivities(getTodayActivities());
    setMedications(getTodayMedications());
  }

  useEffect(() => {
    refresh();
    setMounted(true);
  }, []);

  function handleMuscleClick(muscleId: string, muscleName: string, view: "front" | "back") {
    setPendingPain({ muscleId, muscleName, view });
  }

  function handlePainSubmit(data: { intensity: number; painType: PainType; notes?: string }) {
    if (!pendingPain) return;
    savePainRecord({
      date: getTodayISO(),
      muscleId: pendingPain.muscleId,
      muscleName: pendingPain.muscleName,
      view: pendingPain.view,
      intensity: data.intensity,
      painType: data.painType,
      notes: data.notes,
    });
    toast.success(`Dolor en ${pendingPain.muscleName} registrado`);
    setPendingPain(null);
    refresh();
  }

  function handleActivitySubmit(data: {
    activityType: ActivityType;
    customActivity?: string;
    durationMinutes?: number;
    notes?: string;
  }) {
    saveActivity({ date: getTodayISO(), ...data });
    toast.success("Actividad registrada");
    setActivityDialogOpen(false);
    refresh();
  }

  function handleMedicationSubmit(data: {
    medicationType: MedicationType;
    quantity: number;
    notes?: string;
  }) {
    saveMedication({ date: getTodayISO(), ...data });
    toast.success("Medicamento registrado");
    setMedicationDialogOpen(false);
    refresh();
  }

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Registrar</h1>
        <p className="text-muted-foreground">{formatDate(getTodayISO())}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Body map */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              Registrar dolor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BodyMap
              painRecords={painRecords}
              onMuscleClick={handleMuscleClick}
            />
          </CardContent>
        </Card>

        {/* Records list */}
        <div className="space-y-4">
          {/* Pain records */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Dolores de hoy ({painRecords.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {painRecords.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Haz clic en una zona del mapa para registrar dolor
                </p>
              ) : (
                painRecords
                  .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                  .map((r) => (
                    <PainRecordCard key={r.id} record={r} onUpdate={refresh} />
                  ))
              )}
            </CardContent>
          </Card>

          {/* Activities */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Actividades de hoy ({activities.length})
                </CardTitle>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setActivityDialogOpen(true)}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Actividad
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {activities.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No has registrado actividades hoy
                </p>
              ) : (
                activities
                  .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                  .map((a) => (
                    <ActivityCard key={a.id} activity={a} onUpdate={refresh} />
                  ))
              )}
            </CardContent>
          </Card>

          {/* Medications */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Medicamentos de hoy ({medications.length})
                </CardTitle>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setMedicationDialogOpen(true)}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Medicamento
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {medications.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No has registrado medicamentos hoy
                </p>
              ) : (
                medications
                  .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                  .map((m) => (
                    <MedicationCard key={m.id} medication={m} onUpdate={refresh} />
                  ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Pain form dialog */}
      {pendingPain && (
        <PainFormDialog
          open={!!pendingPain}
          onOpenChange={(open) => !open && setPendingPain(null)}
          muscleId={pendingPain.muscleId}
          muscleName={pendingPain.muscleName}
          view={pendingPain.view}
          onSubmit={handlePainSubmit}
        />
      )}

      {/* Activity form dialog */}
      <ActivityFormDialog
        open={activityDialogOpen}
        onOpenChange={setActivityDialogOpen}
        onSubmit={handleActivitySubmit}
      />

      {/* Medication form dialog */}
      <MedicationFormDialog
        open={medicationDialogOpen}
        onOpenChange={setMedicationDialogOpen}
        onSubmit={handleMedicationSubmit}
      />
    </div>
  );
}
