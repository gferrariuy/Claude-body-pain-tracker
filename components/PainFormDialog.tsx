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
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PainType,
  PAIN_TYPE_LABELS,
  getPainColor,
  getPainIntensityLabel,
} from "@/lib/types";
import { BodyView } from "@/lib/types";
import { cn, getTodayISO } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface PainFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  muscleId: string;
  muscleName: string;
  view: BodyView;
  initialIntensity?: number;
  initialPainType?: PainType;
  initialNotes?: string;
  initialDate?: string;
  onSubmit: (data: {
    intensity: number;
    painType: PainType;
    notes?: string;
    date?: string;
  }) => void;
  mode?: "add" | "edit";
}

export default function PainFormDialog({
  open,
  onOpenChange,
  muscleId,
  muscleName,
  view,
  initialIntensity = 5,
  initialPainType = "sordo",
  initialNotes = "",
  initialDate,
  onSubmit,
  mode = "add",
}: PainFormDialogProps) {
  const [intensity, setIntensity] = useState(initialIntensity);
  const [painType, setPainType] = useState<PainType>(initialPainType);
  const [notes, setNotes] = useState(initialNotes);
  const [date, setDate] = useState(initialDate ?? getTodayISO());

  function handleSubmit() {
    onSubmit({ intensity, painType, notes: notes.trim() || undefined, date });
    onOpenChange(false);
  }

  const painColor = getPainColor(intensity);
  const intensityLabel = getPainIntensityLabel(intensity);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full inline-block"
              style={{ background: painColor }}
            />
            {mode === "edit" ? "Editar dolor" : "Registrar dolor"} —{" "}
            <span className="text-primary">{muscleName}</span>
          </DialogTitle>
          <p className="text-xs text-muted-foreground">
            {view === "front" ? "Vista frontal" : "Vista posterior"}
          </p>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Intensity */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Intensidad del dolor</Label>
              <span
                className="text-sm font-bold px-2 py-0.5 rounded-full text-white"
                style={{ background: painColor }}
              >
                {intensity}/10 — {intensityLabel}
              </span>
            </div>
            <Slider
              min={1}
              max={10}
              step={1}
              value={[intensity]}
              onValueChange={([v]) => setIntensity(v)}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1 – Mínimo</span>
              <span>10 – Máximo</span>
            </div>
          </div>

          {/* Pain type */}
          <div className="space-y-2">
            <Label>Tipo de dolor</Label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(PAIN_TYPE_LABELS) as PainType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setPainType(type)}
                  className={cn(
                    "text-sm px-3 py-2 rounded-md border text-left transition-colors",
                    painType === type
                      ? "border-primary bg-primary/10 text-primary font-medium"
                      : "border-input hover:bg-muted"
                  )}
                >
                  {PAIN_TYPE_LABELS[type]}
                </button>
              ))}
            </div>
          </div>

          {/* Date (edit only) */}
          {mode === "edit" && (
            <div className="space-y-2">
              <Label htmlFor="date">Fecha</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                max={getTodayISO()}
              />
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notas (opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Describe el dolor, cuándo comenzó, qué lo alivia..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            {mode === "edit" ? "Guardar cambios" : "Registrar dolor"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
