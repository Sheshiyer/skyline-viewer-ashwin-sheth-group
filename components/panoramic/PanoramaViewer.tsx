"use client";

import { useEffect, useRef, useState } from "react";
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
  const [error, setError] = useState<string | null>(null);

  const buildSceneConfig = (view: { image: string; hfov?: number; defaultYaw?: number; defaultPitch?: number }) => {
    return {
      type: "equirectangular",
      panorama: view.image,
      hfov: view.hfov ?? 90,
      yaw: view.defaultYaw ?? 0,
      pitch: view.defaultPitch ?? 0,
      autoLoad: true,
      showControls: false,
    } as const;
  };

  // init once
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
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
          scenes[id] = buildSceneConfig({ ...view, image: resolvedUrl });
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
      } catch (e: any) {
        console.error("Failed to initialize panorama viewer:", e);
        setError("Failed to load panorama engine. Please check your network.");
      }
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

    // Ensure the target scene exists; if missing add it dynamically from config
    const cfg = v.getConfig?.();
    const hasScene = !!cfg?.scenes?.[targetId];
    if (!hasScene) {
      const floorCfg = floors.find((f) => f.id === activeFloor);
      const viewCfg = floorCfg?.views?.[activeTime];
      if (!viewCfg) {
        console.error("Scene config missing for", targetId);
        return;
      }
      const sceneConfig = buildSceneConfig(viewCfg);
      try {
        v.addScene?.(targetId, sceneConfig);
        console.debug("Added missing scene", { targetId, sceneConfig });
      } catch (e) {
        console.error("Failed adding scene", e);
      }
    }

    console.debug("Switching scene", { targetId, yaw, pitch, hfov });
    try {
      // Use Pannellum's documented signature: (id, pitch?, yaw?, hfov?, fadeDuration?)
      v.loadScene(targetId, pitch, yaw, hfov);
    } catch (e) {
      console.error("loadScene error with preserved view values, retrying default", e);
      try {
        v.loadScene(targetId);
      } catch (err) {
        console.error("loadScene default retry failed", err);
        setError("Failed to load the selected panorama scene.");
        return;
      }
    }

    lastSceneRef.current = targetId;
  }, [activeFloor, activeTime]);

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center w-full h-full rounded-3xl overflow-hidden bg-[radial-gradient(circle_at_top,_#111827,_#020817)]"
      aria-label="360 degree panoramic building view"
      role="img"
    >
      {error && (
        <div className="absolute inset-0 flex items-center justify-center text-center p-6 text-sm text-slate-200 bg-slate-900/60">
          <div>
            <p className="mb-2 font-medium">{error}</p>
            <p className="opacity-80">Try reloading the page or checking if the CDN is blocked. We now try multiple sources automatically.</p>
          </div>
        </div>
      )}
    </div>
  );
}
