"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
import SleepFormDialog from "@/components/SleepFormDialog";
import {
  SleepRecord,
  SleepQuality,
  SLEEP_QUALITY_LABELS,
  SLEEP_QUALITY_ICONS,
  SLEEP_QUALITY_COLORS,
} from "@/lib/types";
import { Edit2, Trash2 } from "lucide-react";
import { updateSleepRecord, deleteSleepRecord } from "@/lib/storage";
import { toast } from "sonner";

interface SleepCardProps {
  record: SleepRecord;
  onUpdate: () => void;
}

export default function SleepCard({ record, onUpdate }: SleepCardProps) {
  const [editOpen, setEditOpen] = useState(false);

  function handleDelete() {
    deleteSleepRecord(record.id);
    toast.success("Registro de sueño eliminado");
    onUpdate();
  }

  function handleEdit(data: { sleepQuality: SleepQuality; notes?: string; date?: string }) {
    updateSleepRecord(record.id, data);
    toast.success("Sueño actualizado");
    onUpdate();
  }

  const icon = SLEEP_QUALITY_ICONS[record.sleepQuality];
  const label = SLEEP_QUALITY_LABELS[record.sleepQuality];
  const colorClass = SLEEP_QUALITY_COLORS[record.sleepQuality];

  return (
    <>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-lg">{icon}</span>
                <span
                  className={`text-sm font-medium px-2 py-0.5 rounded-full border ${colorClass}`}
                >
                  {label}
                </span>
              </div>
              <div className="mt-1">
                <span className="text-xs text-muted-foreground">
                  {new Date(record.createdAt).toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              {record.notes && (
                <p className="text-xs text-muted-foreground mt-1.5 italic">
                  &ldquo;{record.notes}&rdquo;
                </p>
              )}
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
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Eliminar registro de sueño?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Se eliminará el registro de calidad del sueño. Esta acción
                      no se puede deshacer.
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

      <SleepFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        initialQuality={record.sleepQuality}
        initialNotes={record.notes}
        initialDate={record.date}
        onSubmit={handleEdit}
        mode="edit"
      />
    </>
  );
}
