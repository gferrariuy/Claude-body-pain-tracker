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
import MedicationFormDialog from "@/components/MedicationFormDialog";
import {
  Medication,
  MedicationType,
  MEDICATION_TYPE_LABELS,
  MEDICATION_TYPE_ICONS,
} from "@/lib/types";
import { Edit2, Trash2 } from "lucide-react";
import { updateMedication, deleteMedication } from "@/lib/storage";
import { toast } from "sonner";

interface MedicationCardProps {
  medication: Medication;
  onUpdate: () => void;
}

export default function MedicationCard({
  medication,
  onUpdate,
}: MedicationCardProps) {
  const [editOpen, setEditOpen] = useState(false);

  function handleDelete() {
    deleteMedication(medication.id);
    toast.success("Medicamento eliminado");
    onUpdate();
  }

  function handleEdit(data: {
    medicationType: MedicationType;
    quantity: number;
    notes?: string;
    date?: string;
  }) {
    updateMedication(medication.id, data);
    toast.success("Medicamento actualizado");
    onUpdate();
  }

  const icon = MEDICATION_TYPE_ICONS[medication.medicationType];
  const label = MEDICATION_TYPE_LABELS[medication.medicationType];

  return (
    <>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-lg">{icon}</span>
                <p className="font-medium text-sm">{label}</p>
                <span className="ml-auto text-sm font-semibold text-primary">
                  {medication.quantity}{" "}
                  <span className="text-xs font-normal text-muted-foreground">
                    {medication.quantity === 1 ? "unidad" : "unidades"}
                  </span>
                </span>
              </div>
              <div className="mt-1">
                <span className="text-xs text-muted-foreground">
                  {new Date(medication.createdAt).toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              {medication.notes && (
                <p className="text-xs text-muted-foreground mt-1.5 italic">
                  &ldquo;{medication.notes}&rdquo;
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
                    <AlertDialogTitle>¿Eliminar medicamento?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Se eliminará el registro de{" "}
                      <strong>{label}</strong>. Esta acción no se puede
                      deshacer.
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

      <MedicationFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        initialMedicationType={medication.medicationType}
        initialQuantity={medication.quantity}
        initialNotes={medication.notes}
        initialDate={medication.date}
        onSubmit={handleEdit}
        mode="edit"
      />
    </>
  );
}
