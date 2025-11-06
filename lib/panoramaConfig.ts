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

export const floors: FloorConfig[] = [
  {
    id: 6,
    label: "6th Floor",
    views: {
      sunrise: { image: "/assets/panoramas/morning/floor-06.jpg" },
      noon: { image: "/assets/panoramas/afternoon/floor-06.jpg" },
      sunset: { image: "/assets/panoramas/evening/floor-06.jpg" },
      night: { image: "/assets/panoramas/night/floor-06.jpg" },
    },
  },
  {
    id: 11,
    label: "11th Floor",
    views: {
      sunrise: { image: "/assets/panoramas/morning/floor-11.jpg" },
      noon: { image: "/assets/panoramas/afternoon/floor-11.jpg" },
      sunset: { image: "/assets/panoramas/evening/floor-11.jpg" },
      night: { image: "/assets/panoramas/night/floor-11.jpg" },
    },
  },
  {
    id: 16,
    label: "16th Floor",
    views: {
      sunrise: { image: "/assets/panoramas/morning/floor-16.jpg" },
      noon: { image: "/assets/panoramas/afternoon/floor-16.png" },
      sunset: { image: "/assets/panoramas/evening/floor-16.jpg" },
      night: { image: "/assets/panoramas/night/floor-16.jpg" },
    },
  },
  {
    id: 21,
    label: "21st Floor",
    views: {
      sunrise: { image: "/assets/panoramas/morning/floor-21.jpg" },
      noon: { image: "/assets/panoramas/afternoon/floor-21.jpg" },
      sunset: { image: "/assets/panoramas/evening/floor-21.jpg" },
      night: { image: "/assets/panoramas/night/floor-21.jpg" },
    },
  },
];

export const viewerDefaults = {
  autoLoad: true,
  minHfov: 50,
  maxHfov: 120,
  defaultHfov: 90,
  // Manual toggle speed (deg/sec); 0 disables default autorotation
  autoRotate: 0,
  // Inactivity-driven autorotation config
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