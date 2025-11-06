"use client";

import { useEffect, useRef, useState } from "react";
import { floors, viewerDefaults, type TimeKey } from "@/lib/panoramaConfig";
import { PanoramaViewer } from "./PanoramaViewer";
import { FloorSidebar } from "./FloorSidebar";
import { TimeSelector } from "./TimeSelector";
import { ControlPanel } from "./ControlPanel";
import { MobileMenu } from "./MobileMenu";

export function PanoramaShell() {
  const [activeFloor, setActiveFloor] = useState<number>(floors[0].id);
  const [activeTime, setActiveTime] = useState<TimeKey>("noon");
  const [viewer, setViewer] = useState<any>(null);
  const [autoRotate, setAutoRotate] = useState(false);
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleAutorotate = () => {
    if (!viewer) return;
    // Clear any existing timer
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Respect reduced motion
    if (prefersReduced) return;

    inactivityTimerRef.current = setTimeout(() => {
      if (!viewer) return;
      // Set focus point & zoom before starting rotation
      viewer.setYaw?.(viewerDefaults.autoRotateYaw ?? 0);
      viewer.setPitch?.(viewerDefaults.autoRotatePitch ?? 0);
      viewer.setHfov?.(viewerDefaults.autoRotateHfov ?? viewerDefaults.defaultHfov);
      viewer.startAutoRotate?.(
        (viewerDefaults.autoRotateSpeed ?? viewerDefaults.autoRotate ?? -2) as number
      );
      setAutoRotate(true);
    }, viewerDefaults.inactivityTimeoutMs ?? 8000);
  };

  const handleReady = (instance?: any) => {
    if (instance) {
      setViewer(instance);
      if (viewerDefaults.autoRotate) {
        instance.startAutoRotate?.(viewerDefaults.autoRotate);
        setAutoRotate(true);
      }
    }
  };

  const zoomStep = 8;

  const onReset = () => {
    if (!viewer) return;
    viewer.setYaw(0);
    viewer.setPitch(0);
    viewer.setHfov(viewerDefaults.defaultHfov);
  };

  const onZoomIn = () => {
    if (!viewer) return;
    const current = viewer.getHfov();
    viewer.setHfov(Math.max(viewerDefaults.minHfov, current - zoomStep));
  };

  const onZoomOut = () => {
    if (!viewer) return;
    const current = viewer.getHfov();
    viewer.setHfov(Math.min(viewerDefaults.maxHfov, current + zoomStep));
  };

  const onToggleFullscreen = () => {
    if (!viewer) return;
    viewer.toggleFullscreen?.();
  };

  const onToggleAutoRotate = () => {
    if (!viewer) return;
    if (autoRotate) {
      viewer.stopAutoRotate?.();
      setAutoRotate(false);
    } else {
      viewer.startAutoRotate?.(viewerDefaults.autoRotate ?? -2);
      setAutoRotate(true);
    }
  };

  // Stop autorotation on any user activity and reschedule inactivity timer
  useEffect(() => {
    if (!viewer) return;

    const onActivity = () => {
      if (autoRotate) {
        viewer.stopAutoRotate?.();
        setAutoRotate(false);
      }
      scheduleAutorotate();
    };

    const events = ["pointerdown", "touchstart", "wheel", "keydown", "mousemove"] as const;
    events.forEach((e) => window.addEventListener(e, onActivity, { passive: true }));
    // initial schedule when viewer becomes available
    scheduleAutorotate();

    return () => {
      events.forEach((e) => window.removeEventListener(e, onActivity));
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
        inactivityTimerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewer]);

  useEffect(() => {
    if (typeof window === "undefined" || !viewer) return;
    const prefersReduced =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced && autoRotate) {
      viewer.stopAutoRotate?.();
      setAutoRotate(false);
    }
    // Reschedule inactivity timer whenever scene changes
    scheduleAutorotate();
  }, [viewer, autoRotate, activeFloor, activeTime]);

  return (
    <div className="relative w-full h-[calc(100vh-64px)] flex items-center justify-center z-10">
      <PanoramaViewer floors={floors} activeFloor={activeFloor} activeTime={activeTime} onReady={handleReady} />
      <FloorSidebar activeFloor={activeFloor} setActiveFloor={setActiveFloor} />
      <TimeSelector activeTime={activeTime} setActiveTime={setActiveTime} />
      <MobileMenu
        activeFloor={activeFloor}
        setActiveFloor={setActiveFloor}
        activeTime={activeTime}
        setActiveTime={setActiveTime}
      />
      <ControlPanel
        onReset={onReset}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onToggleFullscreen={onToggleFullscreen}
        autoRotate={autoRotate}
        onToggleAutoRotate={onToggleAutoRotate}
      />
    </div>
  );
}