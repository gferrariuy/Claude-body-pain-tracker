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
import ActivityFormDialog from "@/components/ActivityFormDialog";
import {
  Activity,
  ActivityType,
  ACTIVITY_TYPE_LABELS,
  ACTIVITY_TYPE_ICONS,
} from "@/lib/types";
import { Edit2, Trash2, Clock } from "lucide-react";
import { updateActivity, deleteActivity } from "@/lib/storage";
import { toast } from "sonner";

interface ActivityCardProps {
  activity: Activity;
  onUpdate: () => void;
}

export default function ActivityCard({ activity, onUpdate }: ActivityCardProps) {
  const [editOpen, setEditOpen] = useState(false);

  function handleDelete() {
    deleteActivity(activity.id);
    toast.success("Actividad eliminada");
    onUpdate();
  }

  function handleEdit(data: {
    activityType: ActivityType;
    customActivity?: string;
    durationMinutes?: number;
    notes?: string;
    date?: string;
  }) {
    updateActivity(activity.id, data);
    toast.success("Actividad actualizada");
    onUpdate();
  }

  const icon = ACTIVITY_TYPE_ICONS[activity.activityType];
  const label =
    activity.activityType === "otro" && activity.customActivity
      ? activity.customActivity
      : ACTIVITY_TYPE_LABELS[activity.activityType];

  return (
    <>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-lg">{icon}</span>
                <p className="font-medium text-sm">{label}</p>
              </div>
              <div className="flex items-center gap-3 mt-1.5">
                {activity.durationMinutes && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{activity.durationMinutes} min</span>
                  </div>
                )}
                <span className="text-xs text-muted-foreground">
                  {new Date(activity.createdAt).toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              {activity.notes && (
                <p className="text-xs text-muted-foreground mt-1.5 italic">
                  &ldquo;{activity.notes}&rdquo;
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
                    <AlertDialogTitle>¿Eliminar actividad?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Se eliminará el registro de <strong>{label}</strong>. Esta
                      acción no se puede deshacer.
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

      <ActivityFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        initialActivityType={activity.activityType}
        initialCustomActivity={activity.customActivity}
        initialDuration={activity.durationMinutes}
        initialNotes={activity.notes}
        initialDate={activity.date}
        onSubmit={handleEdit}
        mode="edit"
      />
    </>
  );
}
