import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
  alpha,
} from "@mui/material";
import {
  DashboardRounded,
  VpnKeyRounded,
  RocketLaunchRounded,
  SearchRounded,
  BugReportRounded,
  InventoryRounded,
  FactCheckRounded,
  PendingActionsRounded,
  CheckCircleRounded,
  MonitorHeartRounded,
  DescriptionRounded,
  SecurityRounded,
  AssessmentRounded,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppTheme } from "../theme/ThemeContext";

const DRAWER_WIDTH = 260;

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path?: string;
}

const mainNav: NavItem[] = [
  { label: "Applications", icon: <DashboardRounded />, path: "/app" },
  { label: "Create API Token", icon: <VpnKeyRounded />, path: "/app/create-token" },
  { label: "Getting Started", icon: <RocketLaunchRounded />, path: "/app/getting-started" },
];

const analysisNav: NavItem[] = [
  { label: "Package Search", icon: <SearchRounded />, path: "/app/package-search" },
  { label: "Vendor SBOM Analysis", icon: <FactCheckRounded /> },
  { label: "CVE Search", icon: <BugReportRounded /> },
  { label: "Inventory & Licenses", icon: <InventoryRounded /> },
];

const scanNav: NavItem[] = [
  { label: "Pending Scans", icon: <PendingActionsRounded />, path: "/app/pending-scans" },
  { label: "Completed Scans", icon: <CheckCircleRounded /> },
];

const reportingNav: NavItem[] = [
  { label: "Enterprise Health", icon: <AssessmentRounded />, path: "/app/enterprise-health" },
];

const systemNav: NavItem[] = [
  { label: "Service Health", icon: <MonitorHeartRounded /> },
  { label: "Application Logs", icon: <DescriptionRounded /> },
];

function NavSection({
  items,
  label,
  activePath,
  onNavigate,
  primary,
  primaryLight,
}: {
  items: NavItem[];
  label?: string;
  activePath: string;
  onNavigate: (path: string) => void;
  primary: string;
  primaryLight: string;
}) {
  return (
    <Box sx={{ mb: 1 }}>
      {label && (
        <Typography
          variant="caption"
          sx={{
            color: alpha("#fff", 0.4),
            fontWeight: 700,
            fontSize: "0.65rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            px: 2.5,
            pt: 2,
            pb: 0.5,
            display: "block",
          }}
        >
          {label}
        </Typography>
      )}
      <List dense disablePadding>
        {items.map((item) => {
          const isActive =
            item.path != null &&
            (item.path === "/app"
              ? activePath === "/app"
              : activePath.startsWith(item.path));

          return (
            <ListItemButton
              key={item.label}
              selected={isActive}
              onClick={() => item.path && onNavigate(item.path)}
              sx={{
                py: 0.8,
                color: isActive ? "#fff" : alpha("#fff", 0.65),
                opacity: item.path ? 1 : 0.5,
                "&.Mui-selected": {
                  bgcolor: alpha(primary, 0.2),
                  color: "#fff",
                  "& .MuiListItemIcon-root": { color: primaryLight },
                },
                "&:hover": {
                  bgcolor: alpha("#fff", 0.06),
                  color: "#fff",
                },
              }}
            >
              <ListItemIcon sx={{ color: "inherit", minWidth: 36, "& svg": { fontSize: 20 } }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontSize: "0.85rem", fontWeight: isActive ? 600 : 400 }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
}

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { preset } = useAppTheme();
  const activePath = location.pathname.replace(/\/$/, "") || "/app";

  const navProps = { activePath, onNavigate: navigate, primary: preset.primary, primaryLight: preset.primaryLight };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          bgcolor: preset.sidebar,
          border: "none",
          boxSizing: "border-box",
        },
      }}
    >
      {/* Logo */}
      <Box sx={{ px: 2.5, py: 2.5, display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: 2,
            bgcolor: preset.primary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SecurityRounded sx={{ color: "#fff", fontSize: 20 }} />
        </Box>
        <Box>
          <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "1.05rem", lineHeight: 1.2 }}>
            DeepView
          </Typography>
          <Typography sx={{ color: alpha("#fff", 0.45), fontSize: "0.65rem", fontWeight: 500, letterSpacing: "0.04em" }}>
            SCA Platform
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: alpha("#fff", 0.08), mx: 2 }} />

      <Box sx={{ mt: 1, flex: 1, overflowY: "auto" }}>
        <NavSection items={mainNav} {...navProps} />
        <NavSection items={analysisNav} label="Analysis" {...navProps} />
        <NavSection items={scanNav} label="Scans" {...navProps} />
        <NavSection items={reportingNav} label="Reporting" {...navProps} />
        <NavSection items={systemNav} label="System" {...navProps} />
      </Box>
    </Drawer>
  );
}

export { DRAWER_WIDTH };
