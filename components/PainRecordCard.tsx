"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import PainFormDialog from "@/components/PainFormDialog";
import {
  PainRecord,
  PainType,
  PAIN_TYPE_LABELS,
  PAIN_TYPE_COLORS,
  getPainColor,
  getPainIntensityLabel,
} from "@/lib/types";
import { Edit2, Trash2, MapPin } from "lucide-react";
import { updatePainRecord, deletePainRecord } from "@/lib/storage";
import { toast } from "sonner";

interface PainRecordCardProps {
  record: PainRecord;
  onUpdate: () => void;
}

export default function PainRecordCard({ record, onUpdate }: PainRecordCardProps) {
  const [editOpen, setEditOpen] = useState(false);

  function handleDelete() {
    deletePainRecord(record.id);
    toast.success("Registro de dolor eliminado");
    onUpdate();
  }

  function handleEdit(data: { intensity: number; painType: PainType; notes?: string }) {
    updatePainRecord(record.id, data);
    toast.success("Registro actualizado");
    onUpdate();
  }

  const painColor = getPainColor(record.intensity);

  return (
    <>
      <Card className="overflow-hidden">
        <div
          className="h-1 w-full"
          style={{ background: painColor }}
        />
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                <p className="font-medium text-sm truncate">{record.muscleName}</p>
                <span className="text-xs text-muted-foreground">
                  ({record.view === "front" ? "frontal" : "posterior"})
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                  style={{ background: painColor }}
                >
                  {record.intensity}/10 — {getPainIntensityLabel(record.intensity)}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${PAIN_TYPE_COLORS[record.painType]}`}
                >
                  {PAIN_TYPE_LABELS[record.painType]}
                </span>
              </div>
              {record.notes && (
                <p className="text-xs text-muted-foreground mt-2 italic">
                  &ldquo;{record.notes}&rdquo;
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1.5">
                {new Date(record.createdAt).toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div className="flex gap-1.5 flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setEditOpen(true)}
              >
                <Edit2 className="h-3.5 w-3.5" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Eliminar registro?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Se eliminará el registro de dolor en{" "}
                      <strong>{record.muscleName}</strong>. Esta acción no se puede deshacer.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      Eliminar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
      </Card>

      <PainFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        muscleId={record.muscleId}
        muscleName={record.muscleName}
        view={record.view}
        initialIntensity={record.intensity}
        initialPainType={record.painType}
        initialNotes={record.notes}
        onSubmit={handleEdit}
        mode="edit"
      />
    </>
  );
}
