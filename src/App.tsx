import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import { AppThemeProvider, useAppTheme } from "./theme/ThemeContext";
import SplashScreen from "./pages/SplashScreen";
import AppShell from "./components/AppShell";
import Dashboard from "./pages/Dashboard";
import CreateApiToken from "./pages/CreateApiToken";
import ProjectDetail from "./pages/ProjectDetail";
import EnterpriseHealth from "./pages/EnterpriseHealth";
import PackageSearch from "./pages/PackageSearch";
import PendingScans from "./pages/PendingScans";
import GettingStarted from "./pages/GettingStarted";

function ThemedApp() {
  const { muiTheme } = useAppTheme();
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/app" element={<AppShell />}>
          <Route index element={<Dashboard />} />
          <Route path="create-token" element={<CreateApiToken />} />
          <Route path="projects/:projectId" element={<ProjectDetail />} />
          <Route path="enterprise-health" element={<EnterpriseHealth />} />
          <Route path="package-search" element={<PackageSearch />} />
          <Route path="pending-scans" element={<PendingScans />} />
          <Route path="getting-started" element={<GettingStarted />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <AppThemeProvider>
      <ThemedApp />
    </AppThemeProvider>
  );
}
