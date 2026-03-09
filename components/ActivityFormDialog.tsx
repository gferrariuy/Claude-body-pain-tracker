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
  ActivityType,
  ACTIVITY_TYPE_LABELS,
  ACTIVITY_TYPE_ICONS,
} from "@/lib/types";
import { cn } from "@/lib/utils";

interface ActivityFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialActivityType?: ActivityType;
  initialCustomActivity?: string;
  initialDuration?: number;
  initialNotes?: string;
  onSubmit: (data: {
    activityType: ActivityType;
    customActivity?: string;
    durationMinutes?: number;
    notes?: string;
  }) => void;
  mode?: "add" | "edit";
}

export default function ActivityFormDialog({
  open,
  onOpenChange,
  initialActivityType = "caminar",
  initialCustomActivity = "",
  initialDuration,
  initialNotes = "",
  onSubmit,
  mode = "add",
}: ActivityFormDialogProps) {
  const [activityType, setActivityType] = useState<ActivityType>(initialActivityType);
  const [customActivity, setCustomActivity] = useState(initialCustomActivity);
  const [duration, setDuration] = useState<string>(
    initialDuration ? String(initialDuration) : ""
  );
  const [notes, setNotes] = useState(initialNotes);

  function handleSubmit() {
    onSubmit({
      activityType,
      customActivity: activityType === "otro" ? customActivity.trim() : undefined,
      durationMinutes: duration ? Number(duration) : undefined,
      notes: notes.trim() || undefined,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Editar actividad" : "Registrar actividad"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Activity type grid */}
          <div className="space-y-2">
            <Label>Tipo de actividad</Label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(ACTIVITY_TYPE_LABELS) as ActivityType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setActivityType(type)}
                  className={cn(
                    "flex items-center gap-2 text-sm px-3 py-2 rounded-md border text-left transition-colors",
                    activityType === type
                      ? "border-primary bg-primary/10 text-primary font-medium"
                      : "border-input hover:bg-muted"
                  )}
                >
                  <span>{ACTIVITY_TYPE_ICONS[type]}</span>
                  <span>{ACTIVITY_TYPE_LABELS[type]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom activity name */}
          {activityType === "otro" && (
            <div className="space-y-2">
              <Label htmlFor="customActivity">Nombre de la actividad</Label>
              <Input
                id="customActivity"
                placeholder="Ej: Jardinería, Baile, Ciclismo indoor..."
                value={customActivity}
                onChange={(e) => setCustomActivity(e.target.value)}
              />
            </div>
          )}

          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration">Duración (minutos, opcional)</Label>
            <Input
              id="duration"
              type="number"
              min="1"
              max="999"
              placeholder="Ej: 30"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="actNotes">Notas (opcional)</Label>
            <Textarea
              id="actNotes"
              placeholder="Intensidad, lugar, cómo te sentiste..."
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
          <Button
            onClick={handleSubmit}
            disabled={activityType === "otro" && !customActivity.trim()}
          >
            {mode === "edit" ? "Guardar cambios" : "Registrar actividad"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
