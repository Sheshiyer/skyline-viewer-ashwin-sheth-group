# Skyline Panorama Viewer

![Next.js](https://img.shields.io/badge/Next.js-16.0.1-black?logo=next.js)
![React](https://img.shields.io/badge/React-19.2.0-61dafb?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Node](https://img.shields.io/badge/Node-%E2%89%A518.18%20%7C%2020%2B-43853D?logo=node.js&logoColor=white)
![License](https://img.shields.io/badge/License-Private-lightgrey)

## Overview

Skyline Panorama Viewer is a Next.js application that showcases 360° panoramic views across multiple building floors and times of day. It uses the Pannellum engine (self‑hosted with CDN fallbacks) to render equirectangular images and provides an accessible, responsive UI for floor and time selection, zoom controls, fullscreen, and optional autorotation that respects users’ reduced‑motion preferences.

Key components live in `components/panoramic/` and include:
- `PanoramaShell` — orchestrates viewer state, autorotation, and UI controls.
- `PanoramaViewer` — initializes Pannellum, builds scenes from config, and switches views.
- `FloorSidebar`, `TimeSelector`, `MobileMenu` — interactive UI for floor/time selection across viewports.
- `ControlPanel` — reset, zoom in/out, toggle fullscreen, and toggle autorotation.

## Features
- 360° panorama rendering via Pannellum with self-hosted and CDN fallbacks.
- Floor and time‑of‑day switching with dynamic scene creation if not preloaded.
- Intelligent asset resolution with `.jpg/.jpeg` ↔ `.png` fallback.
- Autorotation after inactivity; disabled when `prefers-reduced-motion` is detected.
- Accessible controls, keyboard/mouse/touch activity detection, and responsive UI.

## Installation

Prerequisites:
- `Node.js` ≥ 18.18 (Node 20 LTS recommended)
- `npm` (or `pnpm`/`yarn`/`bun` per your preference)

Install dependencies and run locally:

```bash
npm install
npm run dev
```

Open `http://localhost:3000` to view. Production build:

```bash
npm run build
npm run start
```

Linting:

```bash
npm run lint
```

## Dependencies
- `next@16.0.1`, `react@19.2.0`, `react-dom@19.2.0`
- Styling: `tailwindcss@^4`, `clsx`, `tailwind-merge`
- Icons: `lucide-react`
- Panorama engine: `pannellum` (loaded from `/public/vendor/pannellum` with CDN fallbacks)

## Configuration

Core configuration is in `lib/panoramaConfig.ts`:

```ts
export type TimeKey = "sunrise" | "noon" | "sunset" | "night";

export type ViewConfig = {
  image: string;
  defaultYaw?: number;
  defaultPitch?: number;
  hfov?: number;
};

export type FloorConfig = {
  id: number;
  label: string;
  views: Record<TimeKey, ViewConfig>;
};

export const floors: FloorConfig[] = [ /* see file for examples */ ];

export const viewerDefaults = {
  autoLoad: true,
  minHfov: 50,
  maxHfov: 120,
  defaultHfov: 90,
  autoRotate: 0,
  inactivityTimeoutMs: 8000,
  autoRotateSpeed: -2,
  autoRotateYaw: 0,
  autoRotatePitch: 0,
  autoRotateHfov: 95,
  compass: false,
};

export const branding = {
  logo: "/next.svg",
  appTitle: "Skyline Panorama Viewer",
};
```

Assets:
- Panoramas are stored under `public/assets/panoramas/{morning|afternoon|evening|night}/floor-XX.(jpg|png)`.
- Pannellum CSS/JS are self‑hosted in `public/vendor/pannellum/` and linked in `app/layout.tsx`.
- If local assets fail to load, the app falls back to popular CDNs automatically.

Next.js config:
- `next.config.ts` currently uses default options.
- TypeScript paths: `@/*` → project root (see `tsconfig.json`).

## Usage Examples

Embed the shell with the default configuration:

```tsx
// app/page.tsx
import { PanoramaShell } from "@/components/panoramic/PanoramaShell";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <PanoramaShell />
    </main>
  );
}
```

Use `PanoramaViewer` directly with custom floors/time:

```tsx
import { PanoramaViewer } from "@/components/panoramic/PanoramaViewer";
import type { FloorConfig, TimeKey } from "@/lib/panoramaConfig";

const myFloors: FloorConfig[] = [
  { id: 1, label: "1st Floor", views: { sunrise: { image: "/assets/..." }, noon: { image: "/assets/..." }, sunset: { image: "/assets/..." }, night: { image: "/assets/..." } } },
];

export default function CustomPage() {
  const onReady = (viewer?: any) => {
    // e.g., programmatically set initial yaw or start autorotation
    viewer?.setYaw?.(0);
  };

  return (
    <div className="h-screen">
      <PanoramaViewer floors={myFloors} activeFloor={1} activeTime={"noon" as TimeKey} onReady={onReady} />
    </div>
  );
}
```

## Internal API

- `PanoramaViewer` props:
  - `floors: FloorConfig[]` — list of floors and time‑based views.
  - `activeFloor: number` — current floor id.
  - `activeTime: TimeKey` — one of `sunrise | noon | sunset | night`.
  - `onReady?: (instance?: any) => void` — receives the Pannellum viewer instance.

- `PanoramaShell` — binds UI (`FloorSidebar`, `TimeSelector`, `MobileMenu`, `ControlPanel`) to the viewer. Handles autorotation scheduling and reduced‑motion.

- `loadPannellum(): Promise<Window["pannellum"]>` — loads Pannellum from self‑hosted assets or CDNs. Adds CSS to the document if missing.

Common Pannellum instance methods used:
- `viewer.loadScene(id, pitch?, yaw?, hfov?)`
- `viewer.addScene(id, config)`
- `viewer.getYaw()`, `viewer.getPitch()`, `viewer.getHfov()`
- `viewer.setYaw(v)`, `viewer.setPitch(v)`, `viewer.setHfov(v)`
- `viewer.startAutoRotate(speed)`, `viewer.stopAutoRotate()`
- `viewer.toggleFullscreen()`

## Contributing

- Use Node 20 LTS or Node ≥ 18.18.
- Install and run `npm run lint` before committing.
- Follow TypeScript strict mode and keep components client‑safe (`"use client"` where needed).
- Prefer small, focused PRs with clear descriptions and screenshots for UI changes.
- Branch naming: `feature/…`, `fix/…`, `docs/…`.
- Commit message style: Conventional Commits (e.g., `feat: add sunrise preset`).

## License

This repository is private and intended for internal use. Licensing terms are not currently defined in a `LICENSE` file. Contact the maintainers for usage permissions or to discuss open‑sourcing under a standard license.

## Acknowledgements

- [Pannellum](https://pannellum.org/) for the panorama viewer engine.
- Next.js, React, Tailwind CSS, and Lucide for the ecosystem and tooling.
