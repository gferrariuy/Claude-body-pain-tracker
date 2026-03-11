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
  SleepQuality,
  SLEEP_QUALITY_LABELS,
  SLEEP_QUALITY_ICONS,
} from "@/lib/types";
import { cn, getTodayISO } from "@/lib/utils";

interface SleepFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialQuality?: SleepQuality;
  initialNotes?: string;
  initialDate?: string;
  onSubmit: (data: { sleepQuality: SleepQuality; notes?: string; date?: string }) => void;
  mode?: "add" | "edit";
}

export default function SleepFormDialog({
  open,
  onOpenChange,
  initialQuality = "bueno",
  initialNotes = "",
  initialDate,
  onSubmit,
  mode = "add",
}: SleepFormDialogProps) {
  const [sleepQuality, setSleepQuality] = useState<SleepQuality>(initialQuality);
  const [notes, setNotes] = useState(initialNotes);
  const [date, setDate] = useState(initialDate ?? getTodayISO());

  function handleSubmit() {
    onSubmit({ sleepQuality, notes: notes.trim() || undefined, date });
    onOpenChange(false);
  }

  const qualityBorderColors: Record<SleepQuality, string> = {
    bueno: "border-green-400 bg-green-50 text-green-800 font-medium",
    regular: "border-yellow-400 bg-yellow-50 text-yellow-800 font-medium",
    malo: "border-red-400 bg-red-50 text-red-800 font-medium",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Editar sueño" : "Registrar sueño de anoche"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Quality selector */}
          <div className="space-y-2">
            <Label>Calidad del sueño</Label>
            <div className="grid grid-cols-3 gap-2">
              {(["bueno", "regular", "malo"] as SleepQuality[]).map((q) => (
                <button
                  key={q}
                  onClick={() => setSleepQuality(q)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 py-4 rounded-md border-2 transition-colors",
                    sleepQuality === q
                      ? qualityBorderColors[q]
                      : "border-input hover:bg-muted"
                  )}
                >
                  <span className="text-2xl">{SLEEP_QUALITY_ICONS[q]}</span>
                  <span className="text-sm">{SLEEP_QUALITY_LABELS[q]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date (edit only) */}
          {mode === "edit" && (
            <div className="space-y-2">
              <Label htmlFor="sleepDate">Fecha</Label>
              <Input
                id="sleepDate"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                max={getTodayISO()}
              />
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="sleepNotes">Notas (opcional)</Label>
            <Textarea
              id="sleepNotes"
              placeholder="Ej: me desperté varias veces, pesadillas, hora de acostarse..."
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
          <Button onClick={handleSubmit}>
            {mode === "edit" ? "Guardar cambios" : "Registrar sueño"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
