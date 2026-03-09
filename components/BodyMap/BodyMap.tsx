"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BodySVG from "./BodySVG";
import { FRONT_MUSCLES, BACK_MUSCLES } from "./muscleGroups";
import { PainRecord } from "@/lib/types";

interface BodyMapProps {
  painRecords?: PainRecord[];
  onMuscleClick?: (muscleId: string, muscleName: string, view: "front" | "back") => void;
  readOnly?: boolean;
}

export default function BodyMap({
  painRecords = [],
  onMuscleClick,
  readOnly = false,
}: BodyMapProps) {
  const frontRecords = painRecords.filter((r) => r.view === "front");
  const backRecords = painRecords.filter((r) => r.view === "back");

  return (
    <Tabs defaultValue="front" className="w-full">
      <TabsList className="grid grid-cols-2 mb-4">
        <TabsTrigger value="front">Vista frontal</TabsTrigger>
        <TabsTrigger value="back">Vista posterior</TabsTrigger>
      </TabsList>

      <TabsContent value="front">
        <div className="flex justify-center">
          <div className="w-full max-w-[280px]">
            <BodySVG
              muscles={FRONT_MUSCLES}
              painRecords={frontRecords}
              onMuscleClick={
                onMuscleClick
                  ? (id, name) => onMuscleClick(id, name, "front")
                  : undefined
              }
              readOnly={readOnly}
            />
          </div>
        </div>
        {!readOnly && (
          <p className="text-center text-xs text-muted-foreground mt-2">
            Haz clic en una zona del cuerpo para registrar dolor
          </p>
        )}
      </TabsContent>

      <TabsContent value="back">
        <div className="flex justify-center">
          <div className="w-full max-w-[280px]">
            <BodySVG
              muscles={BACK_MUSCLES}
              painRecords={backRecords}
              onMuscleClick={
                onMuscleClick
                  ? (id, name) => onMuscleClick(id, name, "back")
                  : undefined
              }
              readOnly={readOnly}
            />
          </div>
        </div>
        {!readOnly && (
          <p className="text-center text-xs text-muted-foreground mt-2">
            Haz clic en una zona del cuerpo para registrar dolor
          </p>
        )}
      </TabsContent>
    </Tabs>
  );
}
