import { createContext, useContext, useState, useMemo, type ReactNode } from "react";
import presets, { type ThemePreset } from "./presets";
import { buildTheme } from "./theme";
import { type Theme } from "@mui/material/styles";

interface ThemeContextValue {
  preset: ThemePreset;
  muiTheme: Theme;
  setPresetId: (id: string) => void;
}

const STORAGE_KEY = "deepview-theme";

function loadPreset(): ThemePreset {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const found = presets.find((p) => p.id === stored);
      if (found) return found;
    }
  } catch {
    // ignore
  }
  return presets[0];
}

const ThemeContext = createContext<ThemeContextValue>(null!);

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const [preset, setPreset] = useState<ThemePreset>(loadPreset);

  const muiTheme = useMemo(() => buildTheme(preset), [preset]);

  const setPresetId = (id: string) => {
    const found = presets.find((p) => p.id === id);
    if (found) {
      setPreset(found);
      try { localStorage.setItem(STORAGE_KEY, id); } catch { /* ignore */ }
    }
  };

  return (
    <ThemeContext.Provider value={{ preset, muiTheme, setPresetId }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  return useContext(ThemeContext);
}
