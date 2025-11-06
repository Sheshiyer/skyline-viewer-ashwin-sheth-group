"use client";

import { useEffect, useRef } from "react";
import { loadPannellum } from "@/lib/pannellumLoader";
import type { FloorConfig, TimeKey } from "@/lib/panoramaConfig";

type Props = {
  floors: FloorConfig[];
  activeFloor: number;
  activeTime: TimeKey;
  onReady?: (instance?: any) => void;
};

export function PanoramaViewer({ floors, activeFloor, activeTime, onReady }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<any>(null);
  const lastSceneRef = useRef<string | null>(null);

  // init once
  useEffect(() => {
    let mounted = true;

    (async () => {
      const pannellum = await loadPannellum();
      if (!mounted || !containerRef.current) return;

      // Preload and resolve panorama URL with .jpg/.png fallback
      const preload = (url: string) =>
        new Promise<boolean>((resolve) => {
          const img = new Image();
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false);
          img.src = url;
        });

      const resolvePanoramaUrl = async (url: string): Promise<string> => {
        // try given URL first
        if (await preload(url)) return url;
        // try swapping between jpg/jpeg and png
        const alt = url.endsWith(".jpg") || url.endsWith(".jpeg")
          ? url.replace(/\.jpe?g$/i, ".png")
          : url.endsWith(".png")
          ? url.replace(/\.png$/i, ".jpg")
          : url;
        if (alt !== url && (await preload(alt))) return alt;
        // fallback to original even if not found; viewer will surface error
        console.warn("Panorama asset missing:", url);
        return url;
      };

      // build scenes from config
      const scenes: Record<string, any> = {};
      for (const floor of floors) {
        for (const time of Object.keys(floor.views) as TimeKey[]) {
          const view = floor.views[time];
          const id = `floor-${floor.id}-${time}`;
          const resolvedUrl = await resolvePanoramaUrl(view.image);
          scenes[id] = {
            type: "equirectangular",
            panorama: resolvedUrl,
            hfov: view.hfov ?? 90,
            yaw: view.defaultYaw ?? 0,
            pitch: view.defaultPitch ?? 0,
            autoLoad: true,
            showControls: false,
          };
        }
      }

      const firstId = `floor-${activeFloor}-${activeTime}`;
      viewerRef.current = (pannellum as any).viewer(containerRef.current!, {
        default: {
          firstScene: firstId,
          sceneFadeDuration: 800,
        },
        scenes,
      });

      lastSceneRef.current = firstId;
      onReady?.(viewerRef.current);
    })();

    return () => {
      mounted = false;
      if (viewerRef.current?.destroy) viewerRef.current.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // switch scenes when floor/time changes
  useEffect(() => {
    const v = viewerRef.current;
    if (!v) return;

    const targetId = `floor-${activeFloor}-${activeTime}`;
    if (targetId === lastSceneRef.current) return;

    // preserve yaw/pitch/fov
    const yaw = v.getYaw();
    const pitch = v.getPitch();
    const hfov = v.getHfov();

    v.loadScene(targetId, {
      pitch,
      yaw,
      hfov,
    });

    lastSceneRef.current = targetId;
  }, [activeFloor, activeTime]);

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center w-full h-full rounded-3xl overflow-hidden bg-[radial-gradient(circle_at_top,_#111827,_#020817)]"
      aria-label="360 degree panoramic building view"
      role="img"
    />
  );
}