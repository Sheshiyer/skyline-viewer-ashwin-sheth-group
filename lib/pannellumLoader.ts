// Augment the global Window type so TypeScript recognizes the Pannellum global
declare global {
  interface Window {
    pannellum: {
      viewer: (...args: any[]) => any;
    } & Record<string, any>;
  }
}

let pannellumPromise: Promise<Window["pannellum"]> | null = null;

export function loadPannellum(): Promise<Window["pannellum"]> {
  if (typeof window === "undefined") throw new Error("No window");
  if (pannellumPromise) return pannellumPromise;

  const JS_SRCS = [
    "/vendor/pannellum/pannellum.js", // self-hosted
    "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js",
    "https://unpkg.com/pannellum@2.5.6/build/pannellum.js",
    "https://cdnjs.cloudflare.com/ajax/libs/pannellum/2.5.6/pannellum.js",
  ];
  const CSS_HREFS = [
    "/vendor/pannellum/pannellum.css", // self-hosted
    "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css",
    "https://unpkg.com/pannellum@2.5.6/build/pannellum.css",
    "https://cdnjs.cloudflare.com/ajax/libs/pannellum/2.5.6/pannellum.css",
  ];

  const ensureCss = () => {
    for (const href of CSS_HREFS) {
      if (document.querySelector(`link[href="${href}"]`)) return;
    }
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = CSS_HREFS[0];
    document.head.appendChild(l);
  };

  const loadScript = (src: string) =>
    new Promise<void>((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.body.appendChild(s);
    });

  pannellumPromise = new Promise(async (resolve, reject) => {
    // Already available
    if ((window as Window).pannellum) {
      resolve((window as Window).pannellum);
      return;
    }

    ensureCss();

    let lastErr: unknown = null;
    for (const src of JS_SRCS) {
      try {
        await loadScript(src);
        if ((window as Window).pannellum) {
          resolve((window as Window).pannellum);
          return;
        }
      } catch (e) {
        lastErr = e;
        // try next src
      }
    }

    reject(lastErr ?? new Error("Pannellum failed to load from all sources"));
  });

  return pannellumPromise;
}