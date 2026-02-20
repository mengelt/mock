import { createContext, useContext, useState, useMemo } from "react";
import presets from "./presets";
import { buildTheme } from "./theme";

const STORAGE_KEY = "deepview-theme";

function loadPreset() {
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

const ThemeContext = createContext(null);

export function AppThemeProvider({ children }) {
  const [preset, setPreset] = useState(loadPreset);

  const muiTheme = useMemo(() => buildTheme(preset), [preset]);

  const setPresetId = (id) => {
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
