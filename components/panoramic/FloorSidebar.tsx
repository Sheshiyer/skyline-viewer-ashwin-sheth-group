"use client";

import { floors } from "@/lib/panoramaConfig";
import { glass, roundedPanel, pressable } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

type Props = {
  activeFloor: number;
  setActiveFloor: (id: number) => void;
};

export function FloorSidebar({ activeFloor, setActiveFloor }: Props) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "fixed right-6 top-24 z-40 flex flex-col gap-3",
        collapsed ? "w-14" : "w-48"
      )}
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={cn(
          glass,
          roundedPanel,
          pressable,
          "flex items-center justify-center h-10 w-10 self-end"
        )}
        aria-label={collapsed ? "Expand floor menu" : "Collapse floor menu"}
      >
        {collapsed ? (
          <ChevronLeft className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>

      <div className={cn(glass, roundedPanel, "p-3 flex flex-col gap-2")}>
        {!collapsed && (
          <p className="text-[10px] uppercase tracking-[0.16em] text-slate-300/90 mb-1">
            Floors
          </p>
        )}

        {floors.map((f) => {
          const active = f.id === activeFloor;
          return (
            <button
              key={f.id}
              onClick={() => setActiveFloor(f.id)}
              className={cn(
                pressable,
                "relative w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-200",
                active
                  ? "bg-amber-400/95 text-slate-950 shadow-lg"
                  : "bg-white/0 hover:bg-white/5"
              )}
            >
              <span className="font-semibold">{f.id}</span>
              {!collapsed && (
                <span className="text-[10px] opacity-80">{f.label}</span>
              )}
              {active && (
                <span className="absolute -left-1 top-1.5 h-5 w-0.5 bg-amber-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
}