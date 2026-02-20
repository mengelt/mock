export interface ThemePreset {
  id: string;
  name: string;
  primary: string;
  primaryLight: string;
  sidebar: string;
  swatch: [string, string, string]; // preview colors for the settings UI
}

const presets: ThemePreset[] = [
  {
    id: "ocean",
    name: "Ocean",
    primary: "#3b82f6",
    primaryLight: "#60a5fa",
    sidebar: "#1a2332",
    swatch: ["#1a2332", "#3b82f6", "#60a5fa"],
  },
  {
    id: "slate",
    name: "Graphite",
    primary: "#6366f1",
    primaryLight: "#818cf8",
    sidebar: "#1e1e2e",
    swatch: ["#1e1e2e", "#6366f1", "#818cf8"],
  },
  {
    id: "emerald",
    name: "Evergreen",
    primary: "#059669",
    primaryLight: "#34d399",
    sidebar: "#132a1f",
    swatch: ["#132a1f", "#059669", "#34d399"],
  },
  {
    id: "crimson",
    name: "Ember",
    primary: "#dc2626",
    primaryLight: "#f87171",
    sidebar: "#2a1215",
    swatch: ["#2a1215", "#dc2626", "#f87171"],
  },
];

export default presets;
