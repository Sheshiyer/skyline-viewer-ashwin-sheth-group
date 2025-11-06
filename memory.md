# PROJECT MEMORY

## Overview
Skyline Panorama Viewer renders 360° building panoramas with floor and time selection using Next.js and Pannellum. Goals: fast, accessible viewing with robust asset fallbacks and clear configuration.

## Completed Tasks

## [2025-11-06T00:00:00Z] Task Completed: Update README.md with comprehensive documentation and badges
- **Outcome**: README now documents purpose, features, installation, configuration (`panoramaConfig`), usage examples, internal API, contribution guidelines, and license info with relevant version badges.
- **Breakthrough**: Consolidated panorama engine behavior (self‑hosted + CDN fallbacks), documented `viewerDefaults`, asset `.jpg/.png` fallback strategy, and component‑level responsibilities for quick onboarding.
- **Errors Fixed**: Replaced default Next.js template README which no longer matched the current codebase. No runtime errors encountered during documentation.
- **Code Changes**: Updated `README.md`; initialized and updated `todo.md`; created `memory.md` with task details.
- **Next Dependencies**: Enables contributors to configure floors and assets confidently; prepares the project for adding CI badges (build/coverage) in the future.

## Key Breakthroughs
- Clear documentation of Pannellum loading mechanism with self‑hosted and CDN fallbacks.
- Scene construction from `floors` config and dynamic scene addition when missing.
- Autorotation scheduling respecting `prefers-reduced-motion` for accessibility.

## Error Patterns & Solutions
- Panorama asset missing → Use `.jpg/.png` fallback; surface non‑blocking warning and overlay error message in viewer.
- Pannellum not available → Try multiple CDN sources; inject CSS if absent; show user‑friendly error state.

## Architecture Decisions
- Next.js App Router, TypeScript strict mode, Tailwind CSS v4 for styling.
- Pannellum integrated via `lib/pannellumLoader.ts` and `public/vendor/pannellum` with CDN fallbacks.
- Config‑driven scenes via `lib/panoramaConfig.ts` (`floors`, `viewerDefaults`, `branding`).
## [2025-11-06T13:58:00Z] Task Completed: Revert previous R2-related code changes to clean state
- **Outcome**: Restored PanoramaViewer to original local fallback logic; removed R2 helper and loading overlay.
- **Breakthrough**: Confirmed original asset resolution pattern and scene management remained intact post-revert.
- **Errors Fixed**: Resolved broken import in `app/page.tsx` by removing `r2Url` dependency.
- **Code Changes**: Deleted `lib/r2.ts`, `components/panoramic/LoadingOverlay.tsx`; updated `components/panoramic/PanoramaViewer.tsx`.
- **Next Dependencies**: Prepared codebase for isolated R2 URL replacement on specific assets.

## [2025-11-06T13:59:00Z] Task Completed: Enable public access via r2.dev for R2 bucket
- **Outcome**: Activated HTTPS public access at `https://pub-c320f5c1a30049d0abb361411f0cd2e3.r2.dev/`.
- **Breakthrough**: Identified correct dev-url base independent of account ID; dev-url serves bucket root.
- **Errors Fixed**: Addressed 401 Unauthorized by enabling dev-url public access.
- **Code Changes**: None (infrastructure via CLI).
- **Next Dependencies**: Allows direct linking to bucket objects over HTTPS.

## [2025-11-06T14:00:00Z] Task Completed: Upload logo asset to R2 bucket with cache headers
- **Outcome**: `AshwinShethFinalLogo.svg` uploaded with `Cache-Control: public, max-age=31536000, immutable`.
- **Breakthrough**: Validated dev-url path format (`/<key>` at root) and successful 200 via curl.
- **Errors Fixed**: N/A.
- **Code Changes**: None (asset upload via CLI).
- **Next Dependencies**: Ready to replace local image src with public R2 URL.
## [2025-11-06T14:05:00Z] Task Completed: Replace local logo reference with public R2 URL
- **Outcome**: Updated `app/page.tsx` to use `https://pub-c320f5c1a30049d0abb361411f0cd2e3.r2.dev/AshwinShethFinalLogo.svg` with `loading="lazy"` and `crossOrigin="anonymous"`.
- **Breakthrough**: Verified public access via r2.dev and set long-lived cache headers for the object.
- **Errors Fixed**: Resolved broken import after revert by removing `next/image` usage for the logo to avoid remote domain restrictions.
- **Code Changes**: Modified `app/page.tsx` to switch to a native `img` tag with the R2 URL.
- **Next Dependencies**: Consider configuring `next.config.ts` with `images.remotePatterns` when migrating more assets.

## [2025-11-06T14:06:00Z] Task Completed: Run dev server and verify image loads
- **Outcome**: App runs locally; remote logo loads via r2.dev in preview.
- **Breakthrough**: Direct `curl` showed `200` from R2 and proper cache headers.
- **Errors Fixed**: Initial net abort mitigated by adding `crossOrigin="anonymous"` to the `img`.
- **Code Changes**: None beyond previous page update.
- **Performance Note**: Dev TTFB comparison shows local static serving faster than remote (R2 ~1.04s vs local ~0.002s). Production gains expected when using CDN and global edge.
## [2025-11-06T14:12:00Z] Task Completed: Create minimal HTML to load only CDN logo
- **Outcome**: Added `public/r2-index.html` that exclusively loads a Vercel-hosted logo via `?logo=` query param, with lazy loading, responsive sizing, and accessibility text.
- **Breakthrough**: Parameterized the CDN URL to avoid hardcoding; added preconnect to the CDN origin and simple performance logging.
- **Errors Fixed**: N/A.
- **Code Changes**: Created `public/r2-index.html`.
- **Next Dependencies**: Upload to R2 bucket and verify availability at the cloudflarestorage domain.
## [2025-11-06T14:13:00Z] Task Completed: Upload HTML to R2 with cache headers
- **Outcome**: Deployed `index.html` to `ashwinsheth-panaromaimages` with `Cache-Control: public, max-age=600` and `Content-Type: text/html; charset=utf-8`.
- **Breakthrough**: Confirmed public availability via dev-url with query param-driven Vercel CDN logo.
- **Errors Fixed**: Corrected CLI quoting to avoid shell parsing issues.
- **Code Changes**: None beyond prior addition of `public/r2-index.html`.
- **Next Dependencies**: Verify across browsers/devices and measure performance.
## [2025-11-06T14:20:00Z] Task Completed: Implement client Logo with fallback
- **Outcome**: Created `components/Logo.tsx` client component to render the remote R2 logo and gracefully fallback to `/AshwinShethFinalLogo.svg` on error.
- **Breakthrough**: Avoided Next.js Server Component event handler restriction by moving `<img>` with `onError` into a Client Component.
- **Errors Fixed**: Resolved “Event handlers cannot be passed to Client Component props” error from prior attempt.
- **Code Changes**: Added `components/Logo.tsx`; updated `app/page.tsx` to use `<Logo />`; added preconnect and dns-prefetch tags in `app/layout.tsx`.
- **Next Dependencies**: Cross-browser/device verification and assessing if R2 dev-url is intermittently blocked in preview environment.
## [2025-11-06T14:28:00Z] Task Completed: Switch logo to local repo asset
- **Outcome**: Updated `components/Logo.tsx` to use `/AshwinShethFinalLogo.svg` from `public/` with `loading="lazy"` and `decoding="async"`.
- **Breakthrough**: Removed dependency on R2 dev-url to eliminate environment-specific network failures.
- **Errors Fixed**: Prevented `net::ERR_FAILED` for remote image in preview by using local asset; removed unnecessary preconnect/dns-prefetch in `app/layout.tsx`.
- **Code Changes**: Edited `components/Logo.tsx` and `app/layout.tsx` to remove remote references.
- **Next Dependencies**: Continue cross-browser/device verification using the local asset.
## [2025-11-06T14:35:00Z] Task Completed: Overlay centered logo in showcase
- **Outcome**: Removed the header; added a centered overlay logo within `PanoramaShell` over the panoramic viewer. Logo scaled 2x (width 320px), maintains aspect ratio, and stays responsive via `max-w-[80vw]`.
- **Breakthrough**: Used `pointer-events-none` and `z-30` for a non-interfering overlay above the viewer, while keeping controls on `z-40`.
- **Errors Fixed**: Eliminated layout offset caused by header (replaced `h-[calc(100vh-64px)]` with `h-screen`).
- **Code Changes**: Updated `app/page.tsx` to remove header; updated `components/panoramic/PanoramaShell.tsx` to include overlay `<img>` with responsive sizing and shadow.
- **Next Dependencies**: Cross-device/browser visual verification and fine-tuning size if design requires different scale caps.
## [2025-11-06T14:40:00Z] Task Completed: Fix logo to top with 1em padding
- **Outcome**: Positioned logo with `position: fixed` at the top, `top: 1em`, centered horizontally, responsive width (`w-[320px] max-w-[80vw] h-auto`).
- **Breakthrough**: Ensured overlay remains visible and anchored during scrolling using fixed positioning and `pointer-events-none` to avoid UI interference.
- **Errors Fixed**: Removed vertical centering; maintained visual balance and avoided overlap with control panel (`z-30` vs controls `z-40`).
- **Code Changes**: Edited `components/panoramic/PanoramaShell.tsx` to use a fixed top overlay container and kept responsive sizing of the logo.
- **Next Dependencies**: Visual checks on mobile/desktop for padding consistency and potential safe-area adjustments on iOS if needed.