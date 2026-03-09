"use client";

import React, { useState } from "react";
import { MuscleGroup } from "./muscleGroups";
import { PainRecord, getPainColor } from "@/lib/types";
import { cn } from "@/lib/utils";

interface BodySVGProps {
  muscles: MuscleGroup[];
  painRecords?: PainRecord[];
  onMuscleClick?: (muscleId: string, muscleName: string) => void;
  readOnly?: boolean;
  className?: string;
}

export default function BodySVG({
  muscles,
  painRecords = [],
  onMuscleClick,
  readOnly = false,
  className,
}: BodySVGProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Build a map of muscleId → highest intensity pain record
  const painMap: Record<string, number> = {};
  for (const r of painRecords) {
    if (!painMap[r.muscleId] || r.intensity > painMap[r.muscleId]) {
      painMap[r.muscleId] = r.intensity;
    }
  }

  function handleMouseMove(e: React.MouseEvent<SVGElement>) {
    const svgRect = (e.currentTarget as SVGElement).getBoundingClientRect();
    setTooltipPos({
      x: e.clientX - svgRect.left,
      y: e.clientY - svgRect.top,
    });
  }

  function renderShape(m: MuscleGroup) {
    const hasPain = painMap[m.id] !== undefined;
    const intensity = painMap[m.id];
    const isHovered = hoveredId === m.id;

    const fill = hasPain
      ? getPainColor(intensity)
      : isHovered && !readOnly
      ? "#94a3b8"
      : "#cbd5e1";

    const strokeColor = hasPain ? "#1e293b" : isHovered ? "#475569" : "#94a3b8";
    const strokeWidth = hasPain || isHovered ? 1.5 : 1;
    const opacity = hasPain ? 0.85 : isHovered && !readOnly ? 0.7 : 1;

    const commonProps = {
      className: cn(!readOnly && "cursor-pointer"),
      fill,
      stroke: strokeColor,
      strokeWidth,
      opacity,
      onMouseEnter: () => setHoveredId(m.id),
      onMouseLeave: () => setHoveredId(null),
      onClick: () => !readOnly && onMuscleClick?.(m.id, m.name),
    };

    if (m.shape === "ellipse") {
      return (
        <ellipse
          key={m.id}
          cx={m.attrs.cx as number}
          cy={m.attrs.cy as number}
          rx={m.attrs.rx as number}
          ry={m.attrs.ry as number}
          {...commonProps}
        />
      );
    } else {
      return (
        <rect
          key={m.id}
          x={m.attrs.x as number}
          y={m.attrs.y as number}
          width={m.attrs.width as number}
          height={m.attrs.height as number}
          rx={m.attrs.rx as number}
          {...commonProps}
        />
      );
    }
  }

  const hoveredMuscle = hoveredId ? muscles.find((m) => m.id === hoveredId) : null;

  return (
    <div className={cn("relative inline-block", className)}>
      <svg
        viewBox="0 0 200 390"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredId(null)}
      >
        {/* Body outline */}
        <ellipse cx="100" cy="40" rx="30" ry="32" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" />
        {/* Torso outline */}
        <rect x="62" y="84" width="76" height="100" rx="10" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" />
        {/* Hip area */}
        <rect x="72" y="160" width="56" height="32" rx="8" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" />
        {/* Left leg outline */}
        <rect x="72" y="184" width="26" height="178" rx="10" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" />
        {/* Right leg outline */}
        <rect x="102" y="184" width="26" height="178" rx="10" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" />
        {/* Left arm outline */}
        <rect x="38" y="92" width="22" height="128" rx="8" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" />
        {/* Right arm outline */}
        <rect x="140" y="92" width="22" height="128" rx="8" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1" />

        {/* Render muscle regions */}
        {muscles.map((m) => renderShape(m))}

        {/* Hover tooltip inside SVG */}
        {hoveredMuscle && (
          <g>
            <rect
              x={Math.min(tooltipPos.x - 10, 110)}
              y={Math.max(tooltipPos.y - 30, 5)}
              width={Math.min(hoveredMuscle.name.length * 7 + 16, 180)}
              height={22}
              rx={4}
              fill="#1e293b"
              opacity={0.9}
            />
            <text
              x={Math.min(tooltipPos.x - 2, 118)}
              y={Math.max(tooltipPos.y - 14, 19)}
              fill="white"
              fontSize={10}
              fontWeight="500"
            >
              {hoveredMuscle.name}
              {painMap[hoveredMuscle.id] !== undefined &&
                ` — Intensidad ${painMap[hoveredMuscle.id]}`}
            </text>
          </g>
        )}
      </svg>

      {/* Pain intensity legend */}
      {painRecords.length > 0 && (
        <div className="flex gap-2 justify-center mt-2 flex-wrap">
          {[2, 4, 6, 8, 10].map((v) => (
            <div key={v} className="flex items-center gap-1 text-xs">
              <span
                className="w-3 h-3 rounded-full inline-block border border-gray-300"
                style={{ background: getPainColor(v) }}
              />
              <span className="text-muted-foreground">
                {v <= 2 ? "Leve" : v <= 4 ? "Mod." : v <= 6 ? "Cons." : v <= 8 ? "Sev." : "Máx."}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
