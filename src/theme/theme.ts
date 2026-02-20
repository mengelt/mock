import { createTheme, alpha } from "@mui/material/styles";
import type { ThemePreset } from "./presets";

// Severity colors stay constant across themes
export const CRITICAL = "#dc2626";
export const HIGH = "#f59e0b";
export const MEDIUM = "#6366f1";
export const LOW = "#22c55e";

export function buildTheme(preset: ThemePreset) {
  return createTheme({
    palette: {
      primary: { main: preset.primary },
      error: { main: CRITICAL },
      warning: { main: HIGH },
      info: { main: MEDIUM },
      success: { main: LOW },
      background: {
        default: "#f4f6f9",
        paper: "#ffffff",
      },
      text: {
        primary: "#1e293b",
        secondary: "#64748b",
      },
    },
    typography: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      h4: { fontWeight: 700, letterSpacing: "-0.02em" },
      h5: { fontWeight: 700, letterSpacing: "-0.01em" },
      h6: { fontWeight: 600 },
      subtitle1: { fontWeight: 600 },
      subtitle2: { fontWeight: 600, fontSize: "0.8rem", letterSpacing: "0.04em", textTransform: "uppercase" as const },
      body2: { color: "#64748b" },
    },
    shape: { borderRadius: 12 },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: { backgroundColor: "#f4f6f9" },
        },
      },
      MuiPaper: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            border: "1px solid",
            borderColor: alpha("#94a3b8", 0.2),
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { fontWeight: 600, fontSize: "0.75rem" },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: { textTransform: "none" as const, fontWeight: 600 },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            margin: "2px 8px",
            "&.Mui-selected": {
              backgroundColor: alpha(preset.primary, 0.15),
              color: preset.primary,
              "&:hover": { backgroundColor: alpha(preset.primary, 0.2) },
              "& .MuiListItemIcon-root": { color: preset.primary },
            },
          },
        },
      },
    },
  });
}
