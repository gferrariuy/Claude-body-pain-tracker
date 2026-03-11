"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  MedicationType,
  MEDICATION_TYPE_LABELS,
  MEDICATION_TYPE_ICONS,
} from "@/lib/types";
import { cn, getTodayISO } from "@/lib/utils";

interface MedicationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialMedicationType?: MedicationType;
  initialQuantity?: number;
  initialNotes?: string;
  initialDate?: string;
  onSubmit: (data: {
    medicationType: MedicationType;
    quantity: number;
    notes?: string;
    date?: string;
  }) => void;
  mode?: "add" | "edit";
}

export default function MedicationFormDialog({
  open,
  onOpenChange,
  initialMedicationType = "tramadol",
  initialQuantity = 1,
  initialNotes = "",
  initialDate,
  onSubmit,
  mode = "add",
}: MedicationFormDialogProps) {
  const [medicationType, setMedicationType] =
    useState<MedicationType>(initialMedicationType);
  const [quantity, setQuantity] = useState<string>(String(initialQuantity));
  const [notes, setNotes] = useState(initialNotes);
  const [date, setDate] = useState(initialDate ?? getTodayISO());

  function handleSubmit() {
    const qty = parseFloat(quantity);
    if (!qty || qty <= 0) return;
    onSubmit({
      medicationType,
      quantity: qty,
      notes: notes.trim() || undefined,
      date,
    });
    onOpenChange(false);
  }

  const isQuantityValid = parseFloat(quantity) > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Editar medicamento" : "Registrar medicamento"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Medication type grid */}
          <div className="space-y-2">
            <Label>Medicamento</Label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(MEDICATION_TYPE_LABELS) as MedicationType[]).map(
                (type) => (
                  <button
                    key={type}
                    onClick={() => setMedicationType(type)}
                    className={cn(
                      "flex items-center gap-2 text-sm px-3 py-2.5 rounded-md border text-left transition-colors",
                      medicationType === type
                        ? "border-primary bg-primary/10 text-primary font-medium"
                        : "border-input hover:bg-muted"
                    )}
                  >
                    <span className="text-base">{MEDICATION_TYPE_ICONS[type]}</span>
                    <span>{MEDICATION_TYPE_LABELS[type]}</span>
                  </button>
                )
              )}
            </div>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Cantidad tomada</Label>
            <div className="flex items-center gap-2">
              <Input
                id="quantity"
                type="number"
                min="0.5"
                step="0.5"
                placeholder="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-32"
              />
              <span className="text-sm text-muted-foreground">unidades / comprimidos</span>
            </div>
          </div>

          {/* Date (edit only) */}
          {mode === "edit" && (
            <div className="space-y-2">
              <Label htmlFor="medDate">Fecha</Label>
              <Input
                id="medDate"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                max={getTodayISO()}
              />
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="medNotes">Notas (opcional)</Label>
            <Textarea
              id="medNotes"
              placeholder="Ej: dosis de mañana, con comida..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!isQuantityValid}>
            {mode === "edit" ? "Guardar cambios" : "Registrar medicamento"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
