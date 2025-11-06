"use client";

import { floors, type TimeKey } from "@/lib/panoramaConfig";
import { glass, roundedPanel, pressable } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useState } from "react";

type Props = {
  activeFloor: number;
  setActiveFloor: (id: number) => void;
  activeTime: TimeKey;
  setActiveTime: (t: TimeKey) => void;
};

export function MobileMenu({ activeFloor, setActiveFloor, activeTime, setActiveTime }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("fixed bottom-0 left-0 right-0 z-50 md:hidden")}>
      <button
        onClick={() => setOpen(!open)}
        className={cn(glass, roundedPanel, pressable, "mx-auto mb-2 flex items-center gap-2 px-4 py-2")}
        aria-label={open ? "Collapse navigation" : "Expand navigation"}
      >
        {open ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        <span className="text-xs">Navigate</span>
      </button>

      {open && (
        <div className={cn(glass, "rounded-t-2xl p-4")}>
          <div className="grid grid-cols-4 gap-2 mb-3">
            {floors.map((f) => {
              const active = f.id === activeFloor;
              return (
                <button
                  key={f.id}
                  onClick={() => setActiveFloor(f.id)}
                  className={cn(
                    pressable,
                    "px-2 py-2 rounded-xl text-xs",
                    active ? "bg-amber-400/90 text-slate-950" : "bg-white/5 text-slate-100"
                  )}
                >
                  {f.id}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            {(["sunrise", "noon", "sunset", "night"] as TimeKey[]).map((t) => {
              const active = t === activeTime;
              return (
                <button
                  key={t}
                  onClick={() => setActiveTime(t)}
                  className={cn(
                    pressable,
                    "px-3 py-2 rounded-xl text-xs",
                    active ? "bg-amber-300/90 text-slate-950" : "bg-white/5 text-slate-100"
                  )}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}