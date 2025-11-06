"use client";

import { glass, roundedPanel, pressable } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { RotateCcw, Plus, Minus, Maximize2, Play, Pause } from "lucide-react";

type Props = {
  onReset: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleFullscreen: () => void;
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
};

export function ControlPanel(props: Props) {
  const { onReset, onZoomIn, onZoomOut, onToggleFullscreen, autoRotate, onToggleAutoRotate } = props;

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-40 flex items-center gap-2 px-2 py-2",
        glass,
        roundedPanel
      )}
    >
      <IconBtn label="Reset view" onClick={onReset}>
        <RotateCcw className="w-4 h-4" />
      </IconBtn>
      <div className="w-px h-6 bg-white/15" />
      <IconBtn label="Zoom in" onClick={onZoomIn}>
        <Plus className="w-4 h-4" />
      </IconBtn>
      <IconBtn label="Zoom out" onClick={onZoomOut}>
        <Minus className="w-4 h-4" />
      </IconBtn>
      <div className="w-px h-6 bg-white/15" />
      <IconBtn label="Fullscreen" onClick={onToggleFullscreen}>
        <Maximize2 className="w-4 h-4" />
      </IconBtn>
      <IconBtn label="Toggle auto-rotate" onClick={onToggleAutoRotate} active={autoRotate}>
        {autoRotate ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      </IconBtn>
    </div>
  );
}

function IconBtn({ children, label, onClick, active }: { children: React.ReactNode; label: string; onClick: () => void; active?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        pressable,
        "w-9 h-9 flex items-center justify-center rounded-xl text-slate-100",
        active ? "bg-amber-400/90 text-slate-950 shadow-lg" : "bg-transparent hover:bg-white/8"
      )}
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  );
}