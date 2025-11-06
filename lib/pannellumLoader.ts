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

  pannellumPromise = new Promise((resolve, reject) => {
    const cssHref =
      "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css";
    const jsSrc =
      "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js";

    if (!document.querySelector(`link[href="${cssHref}"]`)) {
      const l = document.createElement("link");
      l.rel = "stylesheet";
      l.href = cssHref;
      document.head.appendChild(l);
    }

    if ((window as Window).pannellum) {
      resolve((window as Window).pannellum);
      return;
    }

    const s = document.createElement("script");
    s.src = jsSrc;
    s.async = true;
    s.onload = () => {
      if ((window as Window).pannellum) resolve((window as Window).pannellum);
      else reject(new Error("Pannellum failed to load"));
    };
    s.onerror = reject;
    document.body.appendChild(s);
  });

  return pannellumPromise;
}