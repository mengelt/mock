import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Breadcrumbs,
  Link,
  IconButton,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  Chip,
  Badge,
  Tooltip,
  Button,
  CircularProgress,
  Skeleton,
  alpha,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  NavigateNextRounded,
  CloseRounded,
  BadgeRounded,
  EmailRounded,
  BusinessRounded,
  ShieldRounded,
  GroupsRounded,
  CampaignRounded,
  InfoOutlined,
  SecurityRounded,
  NewReleasesRounded,
  CheckCircleOutlineRounded,
  BuildRounded,
  FiberManualRecordRounded,
  LogoutRounded,
  BugReportRounded,
  VpnKeyRounded,
  ContentCopyRounded,
  RefreshRounded,
  DeleteOutlineRounded,
} from "@mui/icons-material";
import { SettingsRounded, CheckRounded, CoronavirusRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { DRAWER_WIDTH } from "./Sidebar";
import { useAppTheme } from "../theme/ThemeContext";
import presets from "../theme/presets";

const osvData = [
  { name: "npm", icon: "NPM", totalVulns: 14_823, malwareCount: 6_214, lastUpdated: "Feb 9, 2026, 6:00 AM", reviewed: 11_402, avgSeverity: "High" },
  { name: "PyPI", icon: "PyPI", totalVulns: 9_417, malwareCount: 3_892, lastUpdated: "Feb 9, 2026, 5:45 AM", reviewed: 7_103, avgSeverity: "High" },
  { name: "NuGet", icon: "NuGet", totalVulns: 3_241, malwareCount: 287, lastUpdated: "Feb 9, 2026, 4:30 AM", reviewed: 2_980, avgSeverity: "Medium" },
  { name: "Maven", icon: "Maven", totalVulns: 8_756, malwareCount: 412, lastUpdated: "Feb 9, 2026, 5:15 AM", reviewed: 7_644, avgSeverity: "Medium" },
  { name: "RubyGems", icon: "Gems", totalVulns: 2_108, malwareCount: 891, lastUpdated: "Feb 9, 2026, 3:00 AM", reviewed: 1_687, avgSeverity: "Medium" },
  { name: "Go", icon: "Go", totalVulns: 4_532, malwareCount: 98, lastUpdated: "Feb 9, 2026, 5:30 AM", reviewed: 4_210, avgSeverity: "Medium" },
  { name: "crates.io", icon: "Rust", totalVulns: 1_876, malwareCount: 43, lastUpdated: "Feb 9, 2026, 4:00 AM", reviewed: 1_801, avgSeverity: "Low" },
  { name: "Packagist", icon: "PHP", totalVulns: 3_694, malwareCount: 562, lastUpdated: "Feb 8, 2026, 11:00 PM", reviewed: 2_899, avgSeverity: "High" },
];

const mockUser = {
  name: "Mark Mengelt",
  initials: "MM",
  email: "mmengelt@company.com",
  department: "Application Security",
  title: "Senior Security Engineer",
  roles: ["Admin", "Scanner", "Reviewer"],
  teams: ["Platform Security", "CAIRO", "DeepView"],
};

const announcements = [
  {
    id: 1,
    date: "Feb 7, 2026",
    title: "Maven Ecosystem Support Coming Soon",
    body: "We're adding Maven/Java dependency scanning in the next release. Stay tuned for beta access.",
    tag: "Feature",
    tagColor: "#3b82f6",
    unread: true,
  },
  {
    id: 2,
    date: "Feb 3, 2026",
    title: "Improved CVE Enrichment Pipeline",
    body: "CVE data is now enriched with EPSS scores and CISA KEV status. Check the detail view for new fields.",
    tag: "Enhancement",
    tagColor: "#6366f1",
    unread: true,
  },
  {
    id: 3,
    date: "Jan 28, 2026",
    title: "Scheduled Maintenance — Feb 1",
    body: "DeepView will undergo scheduled maintenance on Feb 1 from 2:00–4:00 AM EST. Scans submitted during this window will be queued.",
    tag: "Maintenance",
    tagColor: "#f59e0b",
    unread: false,
  },
  {
    id: 4,
    date: "Jan 20, 2026",
    title: "Enterprise Health Dashboard Released",
    body: "Administrators can now view aggregated security posture across all projects from the new Enterprise Health page under Reporting.",
    tag: "Feature",
    tagColor: "#3b82f6",
    unread: false,
  },
  {
    id: 5,
    date: "Jan 12, 2026",
    title: "License Policy Engine v2",
    body: "The license compliance engine has been rewritten for accuracy. AGPL, SSPL, and dual-license detection is now supported.",
    tag: "Enhancement",
    tagColor: "#6366f1",
    unread: false,
  },
];

const mockApiKeys = [
  {
    id: "key-1",
    name: "CI/CD Pipeline",
    prefix: "dvk_prod_",
    maskedKey: "dvk_prod_••••••••••••a3f8",
    created: "Jan 5, 2026",
    lastUsed: "Feb 9, 2026",
    status: "active",
    scopes: ["scan:write", "reports:read"],
  },
  {
    id: "key-2",
    name: "Local Development",
    prefix: "dvk_dev_",
    maskedKey: "dvk_dev_••••••••••••9c12",
    created: "Dec 12, 2025",
    lastUsed: "Feb 8, 2026",
    status: "active",
    scopes: ["scan:write", "scan:read"],
  },
  {
    id: "key-3",
    name: "Reporting Dashboard",
    prefix: "dvk_read_",
    maskedKey: "dvk_read_••••••••••••7b4e",
    created: "Nov 20, 2025",
    lastUsed: "Jan 30, 2026",
    status: "active",
    scopes: ["reports:read"],
  },
  {
    id: "key-4",
    name: "Legacy Integration",
    prefix: "dvk_old_",
    maskedKey: "dvk_old_••••••••••••1d5a",
    created: "Aug 3, 2025",
    lastUsed: "Oct 14, 2025",
    status: "expired",
    scopes: ["scan:write", "reports:read", "admin:read"],
  },
];

const dialogPaperProps = {
  sx: {
    borderRadius: 3,
    width: 480,
    maxWidth: "95vw",
    border: "1px solid",
    borderColor: alpha("#94a3b8", 0.2),
  },
};

function ModalHeader({ title, onClose }) {
  return (
    <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1 }}>
      <Typography variant="h6" sx={{ fontSize: "1rem" }}>{title}</Typography>
      <IconButton size="small" onClick={onClose} sx={{ color: "#94a3b8" }}>
        <CloseRounded sx={{ fontSize: 20 }} />
      </IconButton>
    </DialogTitle>
  );
}

function LabeledRow({ icon, label, children }) {
  return (
    <Box sx={{ display: "flex", gap: 2, py: 1.5 }}>
      <Box sx={{ color: "#94a3b8", mt: "2px", flexShrink: 0 }}>{icon}</Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontSize: "0.7rem", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", mb: 0.2 }}>
          {label}
        </Typography>
        <Box>{children}</Box>
      </Box>
    </Box>
  );
}

export default function TopBar() {
  const [modal, setModal] = useState(null);
  const [osvLoading, setOsvLoading] = useState(false);
  const { preset, setPresetId } = useAppTheme();
  const navigate = useNavigate();
  const close = () => setModal(null);
  const unreadCount = announcements.filter((a) => a.unread).length;

  // Simulate async fetch when OSV modal opens
  useEffect(() => {
    if (modal === "osv") {
      setOsvLoading(true);
      const t = setTimeout(() => setOsvLoading(false), 1800);
      return () => clearTimeout(t);
    }
  }, [modal]);

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: `calc(100% - ${DRAWER_WIDTH}px)`,
          ml: `${DRAWER_WIDTH}px`,
          bgcolor: "#fff",
          borderBottom: "1px solid",
          borderColor: alpha("#94a3b8", 0.15),
        }}
      >
        <Toolbar sx={{ minHeight: "56px !important", px: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Breadcrumbs separator={<NavigateNextRounded sx={{ fontSize: 16 }} />} sx={{ mb: -0.3 }}>
              <Link
                underline="hover"
                color="text.secondary"
                href="#"
                sx={{ fontSize: "0.78rem", fontWeight: 500 }}
              >
                Software Composition Analysis
              </Link>
              <Typography sx={{ fontSize: "0.78rem", fontWeight: 600, color: "text.primary" }}>
                Applications
              </Typography>
            </Breadcrumbs>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            {/* OSV Source Data */}
            <Tooltip title="OSV Source Data" arrow>
              <IconButton onClick={() => setModal("osv")} sx={{ color: "#64748b" }}>
                <CoronavirusRounded sx={{ fontSize: 22 }} />
              </IconButton>
            </Tooltip>

            {/* Announcements */}
            <Tooltip title="Announcements" arrow>
              <IconButton onClick={() => setModal("announcements")} sx={{ color: "#64748b" }}>
                <Badge badgeContent={unreadCount} color="error" sx={{ "& .MuiBadge-badge": { fontSize: "0.65rem", height: 18, minWidth: 18 } }}>
                  <CampaignRounded sx={{ fontSize: 22 }} />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Report a Bug */}
            <Tooltip title="Report a Bug" arrow>
              <IconButton onClick={() => setModal("bugreport")} sx={{ color: "#64748b" }}>
                <BugReportRounded sx={{ fontSize: 22 }} />
              </IconButton>
            </Tooltip>

            {/* API Keys */}
            <Tooltip title="API Keys" arrow>
              <IconButton onClick={() => setModal("apikeys")} sx={{ color: "#64748b" }}>
                <VpnKeyRounded sx={{ fontSize: 22 }} />
              </IconButton>
            </Tooltip>

            {/* Settings */}
            <Tooltip title="Settings" arrow>
              <IconButton onClick={() => setModal("settings")} sx={{ color: "#64748b" }}>
                <SettingsRounded sx={{ fontSize: 22 }} />
              </IconButton>
            </Tooltip>

            {/* About */}
            <Tooltip title="About DeepView" arrow>
              <IconButton onClick={() => setModal("about")} sx={{ color: "#64748b" }}>
                <InfoOutlined sx={{ fontSize: 22 }} />
              </IconButton>
            </Tooltip>

            {/* Divider */}
            <Box sx={{ width: 1, height: 24, bgcolor: alpha("#94a3b8", 0.2), mx: 0.75 }} />

            {/* User profile */}
            <IconButton onClick={() => setModal("profile")} sx={{ p: 0.5 }}>
              <Avatar
                sx={{
                  width: 34,
                  height: 34,
                  bgcolor: "#3b82f6",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                }}
              >
                {mockUser.initials}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* ── Announcements Modal ── */}
      <Dialog open={modal === "announcements"} onClose={close} PaperProps={dialogPaperProps}>
        <ModalHeader title="Announcements" onClose={close} />
        <DialogContent sx={{ pt: "0 !important", px: 3, pb: 3 }}>
          {announcements.map((a, idx) => (
            <Box key={a.id}>
              {idx > 0 && <Divider sx={{ borderColor: alpha("#94a3b8", 0.12), my: 0.5 }} />}
              <Box sx={{ py: 1.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                  {a.unread && (
                    <FiberManualRecordRounded sx={{ fontSize: 8, color: "#3b82f6" }} />
                  )}
                  <Typography sx={{ fontSize: "0.68rem", color: "#94a3b8", fontWeight: 500 }}>
                    {a.date}
                  </Typography>
                  <Chip
                    label={a.tag}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      bgcolor: alpha(a.tagColor, 0.1),
                      color: a.tagColor,
                    }}
                  />
                </Box>
                <Typography sx={{ fontWeight: 600, fontSize: "0.88rem", mb: 0.3 }}>
                  {a.title}
                </Typography>
                <Typography sx={{ fontSize: "0.8rem", color: "#64748b", lineHeight: 1.5 }}>
                  {a.body}
                </Typography>
              </Box>
            </Box>
          ))}
        </DialogContent>
      </Dialog>

      {/* ── OSV Source Data Modal ── */}
      <Dialog
        open={modal === "osv"}
        onClose={close}
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 3,
            width: 780,
            maxWidth: "95vw",
            border: "1px solid",
            borderColor: alpha("#94a3b8", 0.2),
          },
        }}
      >
        <ModalHeader title="OSV Source Data" onClose={close} />
        <DialogContent sx={{ pt: "0 !important", px: 3, pb: 3 }}>
          <Typography sx={{ fontSize: "0.8rem", color: "#64748b", mb: 2 }}>
            Vulnerability and malware counts aggregated from the OSV database across major package ecosystems.
          </Typography>

          {osvLoading ? (
            <Box>
              {/* Loading skeleton for table */}
              <Box sx={{ border: "1px solid", borderColor: alpha("#94a3b8", 0.15), borderRadius: 2, overflow: "hidden" }}>
                {/* Header skeleton */}
                <Box sx={{ display: "flex", gap: 2, px: 2, py: 1.5, bgcolor: alpha("#f8fafc", 0.8) }}>
                  {[120, 80, 70, 70, 80, 130].map((w, i) => (
                    <Skeleton key={i} variant="text" width={w} height={16} />
                  ))}
                </Box>
                {/* Row skeletons */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 2, px: 2, py: 1.5, borderTop: "1px solid", borderColor: alpha("#94a3b8", 0.08) }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: 120 }}>
                      <Skeleton variant="rounded" width={48} height={24} />
                      <Skeleton variant="text" width={60} height={18} />
                    </Box>
                    <Skeleton variant="text" width={80} height={18} />
                    <Skeleton variant="text" width={70} height={18} />
                    <Skeleton variant="rounded" width={56} height={22} />
                    <Skeleton variant="rounded" width={64} height={22} />
                    <Skeleton variant="text" width={130} height={18} />
                  </Box>
                ))}
              </Box>

              {/* Loading indicator */}
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1.5, mt: 3 }}>
                <CircularProgress size={18} thickness={5} sx={{ color: "#94a3b8" }} />
                <Typography sx={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: 500 }}>
                  Fetching latest ecosystem data from OSV...
                </Typography>
              </Box>
            </Box>
          ) : (
            <>
              <Box
                component="table"
                sx={{
                  width: "100%",
                  borderCollapse: "separate",
                  borderSpacing: 0,
                  border: "1px solid",
                  borderColor: alpha("#94a3b8", 0.15),
                  borderRadius: 2,
                  overflow: "hidden",
                  "& th, & td": {
                    px: 2,
                    py: 1.5,
                    fontSize: "0.82rem",
                    borderBottom: "1px solid",
                    borderColor: alpha("#94a3b8", 0.1),
                    textAlign: "left",
                  },
                  "& th": {
                    fontWeight: 700,
                    fontSize: "0.7rem",
                    color: "#64748b",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    bgcolor: alpha("#f8fafc", 0.8),
                  },
                  "& tbody tr:last-child td": { borderBottom: "none" },
                  "& tbody tr:hover": { bgcolor: alpha("#3b82f6", 0.03) },
                }}
              >
                <Box component="thead">
                  <Box component="tr">
                    <Box component="th">Ecosystem</Box>
                    <Box component="th" sx={{ textAlign: "right !important" }}>Total Vulns</Box>
                    <Box component="th" sx={{ textAlign: "right !important" }}>Reviewed</Box>
                    <Box component="th" sx={{ textAlign: "right !important" }}>Malware</Box>
                    <Box component="th" sx={{ textAlign: "center !important" }}>Avg Severity</Box>
                    <Box component="th">Last Updated</Box>
                  </Box>
                </Box>
                <Box component="tbody">
                  {osvData.map((eco) => {
                    const sevColor = eco.avgSeverity === "High" ? "#dc2626" : eco.avgSeverity === "Medium" ? "#f59e0b" : "#22c55e";
                    return (
                      <Box component="tr" key={eco.name}>
                        <Box component="td">
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <Chip
                              label={eco.icon}
                              size="small"
                              sx={{
                                height: 24,
                                fontSize: "0.68rem",
                                fontWeight: 700,
                                bgcolor: alpha("#94a3b8", 0.08),
                                color: "#475569",
                                fontFamily: "monospace",
                                minWidth: 48,
                              }}
                            />
                            <Typography sx={{ fontWeight: 600, fontSize: "0.85rem" }}>{eco.name}</Typography>
                          </Box>
                        </Box>
                        <Box component="td" sx={{ textAlign: "right !important", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                          {eco.totalVulns.toLocaleString()}
                        </Box>
                        <Box component="td" sx={{ textAlign: "right !important", color: "#64748b", fontVariantNumeric: "tabular-nums" }}>
                          {eco.reviewed.toLocaleString()}
                        </Box>
                        <Box component="td" sx={{ textAlign: "right !important" }}>
                          <Chip
                            label={eco.malwareCount.toLocaleString()}
                            size="small"
                            sx={{
                              height: 22,
                              fontSize: "0.72rem",
                              fontWeight: 700,
                              bgcolor: eco.malwareCount > 1000 ? alpha("#dc2626", 0.08) : alpha("#94a3b8", 0.08),
                              color: eco.malwareCount > 1000 ? "#dc2626" : "#475569",
                            }}
                          />
                        </Box>
                        <Box component="td" sx={{ textAlign: "center !important" }}>
                          <Chip
                            label={eco.avgSeverity}
                            size="small"
                            sx={{
                              height: 22,
                              fontSize: "0.68rem",
                              fontWeight: 700,
                              bgcolor: alpha(sevColor, 0.1),
                              color: sevColor,
                              border: `1px solid ${alpha(sevColor, 0.25)}`,
                            }}
                          />
                        </Box>
                        <Box component="td" sx={{ color: "#94a3b8", fontSize: "0.78rem !important", whiteSpace: "nowrap" }}>
                          {eco.lastUpdated}
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </Box>

              {/* Totals row */}
              <Box sx={{ display: "flex", gap: 3, mt: 2, pt: 2, borderTop: "1px solid", borderColor: alpha("#94a3b8", 0.12) }}>
                {[
                  { label: "Total Vulnerabilities", value: osvData.reduce((s, e) => s + e.totalVulns, 0).toLocaleString(), color: "#1e293b" },
                  { label: "Total Malware", value: osvData.reduce((s, e) => s + e.malwareCount, 0).toLocaleString(), color: "#dc2626" },
                  { label: "Ecosystems Tracked", value: osvData.length, color: "#3b82f6" },
                ].map((stat) => (
                  <Box key={stat.label} sx={{ flex: 1, textAlign: "center" }}>
                    <Typography sx={{ fontWeight: 700, fontSize: "1.2rem", color: stat.color }}>{stat.value}</Typography>
                    <Typography sx={{ fontSize: "0.68rem", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>{stat.label}</Typography>
                  </Box>
                ))}
              </Box>

              <Typography sx={{ fontSize: "0.7rem", color: "#94a3b8", textAlign: "center", mt: 2 }}>
                Data sourced from osv.dev — Google Open Source Vulnerabilities
              </Typography>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Settings Modal ── */}
      <Dialog open={modal === "settings"} onClose={close} PaperProps={dialogPaperProps}>
        <ModalHeader title="Settings" onClose={close} />
        <DialogContent sx={{ pt: "0 !important", px: 3, pb: 3 }}>
          <Typography sx={{ fontSize: "0.72rem", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", mb: 1.5 }}>
            Color Theme
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {presets.map((p) => {
              const isActive = preset.id === p.id;
              return (
                <Box
                  key={p.id}
                  onClick={() => setPresetId(p.id)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 2,
                    borderRadius: 2,
                    cursor: "pointer",
                    border: "2px solid",
                    borderColor: isActive ? p.primary : alpha("#94a3b8", 0.15),
                    bgcolor: isActive ? alpha(p.primary, 0.04) : "transparent",
                    transition: "all 0.15s",
                    "&:hover": {
                      borderColor: isActive ? p.primary : alpha("#94a3b8", 0.35),
                      bgcolor: alpha(p.primary, 0.04),
                    },
                  }}
                >
                  {/* Color swatches */}
                  <Box sx={{ display: "flex", gap: 0.5, flexShrink: 0 }}>
                    {p.swatch.map((color, i) => (
                      <Box
                        key={i}
                        sx={{
                          width: i === 0 ? 32 : 20,
                          height: 32,
                          borderRadius: 1,
                          bgcolor: color,
                        }}
                      />
                    ))}
                  </Box>

                  {/* Label */}
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: "0.88rem" }}>{p.name}</Typography>
                    <Typography sx={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                      {p.id === "ocean" && "Default blue with dark navy sidebar"}
                      {p.id === "slate" && "Indigo accents with deep charcoal sidebar"}
                      {p.id === "emerald" && "Green tones with dark forest sidebar"}
                      {p.id === "crimson" && "Red accents with warm dark sidebar"}
                    </Typography>
                  </Box>

                  {/* Check */}
                  {isActive && (
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        bgcolor: p.primary,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <CheckRounded sx={{ color: "#fff", fontSize: 16 }} />
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>

          <Typography sx={{ fontSize: "0.72rem", color: "#94a3b8", mt: 2, textAlign: "center" }}>
            Theme preference is saved to your browser
          </Typography>
        </DialogContent>
      </Dialog>

      {/* ── About DeepView Modal ── */}
      <Dialog open={modal === "about"} onClose={close} PaperProps={dialogPaperProps}>
        <ModalHeader title="About DeepView" onClose={close} />
        <DialogContent sx={{ pt: "0 !important", px: 3, pb: 3 }}>
          {/* Logo block */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2, mt: 0.5 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2.5,
                bgcolor: "#3b82f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <SecurityRounded sx={{ color: "#fff", fontSize: 26 }} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: "1.15rem", lineHeight: 1.2 }}>
                DeepView
              </Typography>
              <Typography sx={{ fontSize: "0.8rem", color: "#64748b" }}>
                Software Composition Analysis Platform
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ borderColor: alpha("#94a3b8", 0.15), mb: 0.5 }} />

          <LabeledRow icon={<NewReleasesRounded sx={{ fontSize: 18 }} />} label="Version">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography sx={{ fontSize: "0.85rem", fontWeight: 600 }}>1.4.0</Typography>
              <Chip label="Latest" size="small" sx={{ height: 20, fontSize: "0.65rem", fontWeight: 700, bgcolor: alpha("#22c55e", 0.1), color: "#22c55e" }} />
            </Box>
          </LabeledRow>

          <LabeledRow icon={<BuildRounded sx={{ fontSize: 18 }} />} label="Build">
            <Typography sx={{ fontSize: "0.85rem", fontFamily: "monospace" }}>2026.02.07-a3f8c1d</Typography>
          </LabeledRow>

          <LabeledRow icon={<CheckCircleOutlineRounded sx={{ fontSize: 18 }} />} label="Environment">
            <Typography sx={{ fontSize: "0.85rem" }}>Production</Typography>
          </LabeledRow>

          <Divider sx={{ borderColor: alpha("#94a3b8", 0.15), my: 0.5 }} />

          <LabeledRow icon={<ShieldRounded sx={{ fontSize: 18 }} />} label="Supported Ecosystems">
            <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
              {[
                { label: "NPM", active: true },
                { label: "Maven", active: false },
                { label: "PyPI", active: false },
                { label: "NuGet", active: false },
              ].map((eco) => (
                <Chip
                  key={eco.label}
                  label={eco.label}
                  size="small"
                  sx={{
                    height: 24,
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    bgcolor: eco.active ? alpha("#3b82f6", 0.1) : alpha("#94a3b8", 0.08),
                    color: eco.active ? "#3b82f6" : "#94a3b8",
                    border: eco.active ? `1px solid ${alpha("#3b82f6", 0.25)}` : `1px dashed ${alpha("#94a3b8", 0.3)}`,
                  }}
                />
              ))}
            </Box>
          </LabeledRow>

          <LabeledRow icon={<InfoOutlined sx={{ fontSize: 18 }} />} label="Data Sources">
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.3 }}>
              {["NVD (National Vulnerability Database)", "GitHub Advisory Database", "OSV.dev", "CISA KEV Catalog"].map((src) => (
                <Typography key={src} sx={{ fontSize: "0.82rem" }}>{src}</Typography>
              ))}
            </Box>
          </LabeledRow>

          <Divider sx={{ borderColor: alpha("#94a3b8", 0.15), my: 0.5 }} />

          <Box sx={{ pt: 1 }}>
            <Typography sx={{ fontSize: "0.75rem", color: "#94a3b8", textAlign: "center" }}>
              Built by Application Security Engineering
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>

      {/* ── Report a Bug Modal ── */}
      <Dialog
        open={modal === "bugreport"}
        onClose={close}
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 3,
            width: 680,
            maxWidth: "95vw",
            border: "1px solid",
            borderColor: alpha("#94a3b8", 0.2),
          },
        }}
      >
        <ModalHeader title="Report a Bug" onClose={close} />
        <DialogContent sx={{ pt: "0 !important", px: 3, pb: 3 }}>
          <Typography sx={{ fontSize: "0.8rem", color: "#64748b", mb: 2 }}>
            Describe the issue you encountered. Our team will review and follow up.
          </Typography>

          <TextField
            label="Title"
            placeholder="Brief summary of the issue"
            fullWidth
            size="small"
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel>Severity</InputLabel>
            <Select label="Severity" defaultValue="">
              <MenuItem value="critical">Critical — System unusable</MenuItem>
              <MenuItem value="high">High — Major feature broken</MenuItem>
              <MenuItem value="medium">Medium — Feature impaired</MenuItem>
              <MenuItem value="low">Low — Minor / cosmetic</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select label="Category" defaultValue="">
              <MenuItem value="scanning">Scanning</MenuItem>
              <MenuItem value="reporting">Reporting</MenuItem>
              <MenuItem value="dashboard">Dashboard</MenuItem>
              <MenuItem value="api">API / Integrations</MenuItem>
              <MenuItem value="auth">Authentication</MenuItem>
              <MenuItem value="ui">UI / Display</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Steps to Reproduce"
            placeholder="1. Go to...&#10;2. Click on...&#10;3. Observe..."
            fullWidth
            size="small"
            multiline
            rows={3}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Expected Behavior"
            placeholder="What did you expect to happen?"
            fullWidth
            size="small"
            multiline
            rows={2}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Actual Behavior"
            placeholder="What actually happened?"
            fullWidth
            size="small"
            multiline
            rows={2}
            sx={{ mb: 2 }}
          />

          <Box sx={{ p: 2, border: "1px dashed", borderColor: alpha("#94a3b8", 0.3), borderRadius: 2, textAlign: "center", mb: 2.5 }}>
            <Typography sx={{ fontSize: "0.8rem", color: "#94a3b8" }}>
              Drag & drop a screenshot here, or click to browse
            </Typography>
            <Typography sx={{ fontSize: "0.68rem", color: alpha("#94a3b8", 0.6), mt: 0.5 }}>
              PNG, JPG up to 5 MB
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1.5, justifyContent: "flex-end" }}>
            <Button
              variant="outlined"
              onClick={close}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.82rem",
                color: "#64748b",
                borderColor: alpha("#94a3b8", 0.25),
                "&:hover": { borderColor: "#94a3b8", bgcolor: alpha("#94a3b8", 0.04) },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={{
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.82rem",
                bgcolor: "#3b82f6",
                "&:hover": { bgcolor: "#2563eb" },
              }}
            >
              Submit Bug Report
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* ── API Keys Modal ── */}
      <Dialog
        open={modal === "apikeys"}
        onClose={close}
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 3,
            width: 880,
            maxWidth: "95vw",
            border: "1px solid",
            borderColor: alpha("#94a3b8", 0.2),
          },
        }}
      >
        <ModalHeader title="API Keys" onClose={close} />
        <DialogContent sx={{ pt: "0 !important", px: 3, pb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
            <Typography sx={{ fontSize: "0.8rem", color: "#64748b" }}>
              Manage your personal API keys for DeepView integrations.
            </Typography>
            <Button
              variant="contained"
              size="small"
              startIcon={<VpnKeyRounded sx={{ fontSize: 16 }} />}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.78rem",
                bgcolor: "#3b82f6",
                flexShrink: 0,
                "&:hover": { bgcolor: "#2563eb" },
              }}
            >
              Generate New Key
            </Button>
          </Box>

          <Box
            component="table"
            sx={{
              width: "100%",
              borderCollapse: "separate",
              borderSpacing: 0,
              border: "1px solid",
              borderColor: alpha("#94a3b8", 0.15),
              borderRadius: 2,
              overflow: "hidden",
              "& th, & td": {
                px: 2,
                py: 1.5,
                fontSize: "0.82rem",
                borderBottom: "1px solid",
                borderColor: alpha("#94a3b8", 0.1),
                textAlign: "left",
                whiteSpace: "nowrap",
              },
              "& th": {
                fontWeight: 700,
                fontSize: "0.7rem",
                color: "#64748b",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                bgcolor: alpha("#f8fafc", 0.8),
              },
              "& tbody tr:last-child td": { borderBottom: "none" },
              "& tbody tr:hover": { bgcolor: alpha("#3b82f6", 0.03) },
            }}
          >
            <Box component="thead">
              <Box component="tr">
                <Box component="th">Name</Box>
                <Box component="th">Key</Box>
                <Box component="th">Scopes</Box>
                <Box component="th">Created</Box>
                <Box component="th">Last Used</Box>
                <Box component="th" sx={{ textAlign: "center !important" }}>Status</Box>
                <Box component="th" sx={{ textAlign: "center !important" }}>Actions</Box>
              </Box>
            </Box>
            <Box component="tbody">
              {mockApiKeys.map((key) => {
                const isExpired = key.status === "expired";
                return (
                  <Box component="tr" key={key.id}>
                    <Box component="td">
                      <Typography sx={{ fontWeight: 600, fontSize: "0.85rem" }}>{key.name}</Typography>
                    </Box>
                    <Box component="td">
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                        <Typography
                          sx={{
                            fontSize: "0.78rem",
                            fontFamily: "monospace",
                            color: isExpired ? "#94a3b8" : "#1e293b",
                            bgcolor: alpha("#94a3b8", 0.06),
                            px: 1,
                            py: 0.3,
                            borderRadius: 1,
                          }}
                        >
                          {key.maskedKey}
                        </Typography>
                        <Tooltip title="Copy" arrow>
                          <IconButton size="small" sx={{ color: "#94a3b8", p: 0.4, "&:hover": { color: "#3b82f6" } }}>
                            <ContentCopyRounded sx={{ fontSize: 15 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                    <Box component="td" sx={{ whiteSpace: "normal !important" }}>
                      <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                        {key.scopes.map((scope) => (
                          <Chip
                            key={scope}
                            label={scope}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: "0.65rem",
                              fontWeight: 600,
                              fontFamily: "monospace",
                              bgcolor: alpha("#6366f1", 0.08),
                              color: "#6366f1",
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                    <Box component="td" sx={{ color: "#64748b", fontSize: "0.78rem !important" }}>
                      {key.created}
                    </Box>
                    <Box component="td" sx={{ color: "#64748b", fontSize: "0.78rem !important" }}>
                      {key.lastUsed}
                    </Box>
                    <Box component="td" sx={{ textAlign: "center !important" }}>
                      <Chip
                        label={isExpired ? "Expired" : "Active"}
                        size="small"
                        sx={{
                          height: 22,
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          bgcolor: isExpired ? alpha("#dc2626", 0.1) : alpha("#22c55e", 0.1),
                          color: isExpired ? "#dc2626" : "#22c55e",
                          border: `1px solid ${isExpired ? alpha("#dc2626", 0.25) : alpha("#22c55e", 0.25)}`,
                        }}
                      />
                    </Box>
                    <Box component="td" sx={{ textAlign: "center !important" }}>
                      <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
                        <Tooltip title={isExpired ? "Key expired" : "Refresh key"} arrow>
                          <span>
                            <IconButton
                              size="small"
                              disabled={isExpired}
                              sx={{
                                color: "#3b82f6",
                                "&:hover": { bgcolor: alpha("#3b82f6", 0.08) },
                                "&.Mui-disabled": { color: alpha("#94a3b8", 0.4) },
                              }}
                            >
                              <RefreshRounded sx={{ fontSize: 18 }} />
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Tooltip title="Revoke key" arrow>
                          <IconButton
                            size="small"
                            sx={{
                              color: "#dc2626",
                              "&:hover": { bgcolor: alpha("#dc2626", 0.08) },
                            }}
                          >
                            <DeleteOutlineRounded sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>

          <Typography sx={{ fontSize: "0.7rem", color: "#94a3b8", textAlign: "center", mt: 2 }}>
            Keys are scoped to your user account. Revoked keys cannot be recovered.
          </Typography>
        </DialogContent>
      </Dialog>

      {/* ── User Profile Modal ── */}
      <Dialog open={modal === "profile"} onClose={close} PaperProps={dialogPaperProps}>
        <ModalHeader title="User Profile" onClose={close} />
        <DialogContent sx={{ pt: "0 !important" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2, mt: 0.5 }}>
            <Avatar sx={{ width: 52, height: 52, bgcolor: "#3b82f6", fontSize: "1.1rem", fontWeight: 700 }}>
              {mockUser.initials}
            </Avatar>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: "1.05rem", lineHeight: 1.2 }}>{mockUser.name}</Typography>
              <Typography sx={{ fontSize: "0.82rem", color: "#64748b" }}>{mockUser.title}</Typography>
            </Box>
          </Box>

          <Divider sx={{ borderColor: alpha("#94a3b8", 0.15), mb: 0.5 }} />

          <LabeledRow icon={<EmailRounded sx={{ fontSize: 18 }} />} label="Email">
            <Typography sx={{ fontSize: "0.85rem" }}>{mockUser.email}</Typography>
          </LabeledRow>
          <LabeledRow icon={<BusinessRounded sx={{ fontSize: 18 }} />} label="Department">
            <Typography sx={{ fontSize: "0.85rem" }}>{mockUser.department}</Typography>
          </LabeledRow>
          <LabeledRow icon={<BadgeRounded sx={{ fontSize: 18 }} />} label="Title">
            <Typography sx={{ fontSize: "0.85rem" }}>{mockUser.title}</Typography>
          </LabeledRow>

          <Divider sx={{ borderColor: alpha("#94a3b8", 0.15), my: 0.5 }} />

          <LabeledRow icon={<ShieldRounded sx={{ fontSize: 18 }} />} label="Roles">
            <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
              {mockUser.roles.map((role) => (
                <Chip
                  key={role}
                  label={role}
                  size="small"
                  sx={{
                    height: 24,
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    bgcolor: role === "Admin" ? alpha("#3b82f6", 0.1) : alpha("#94a3b8", 0.1),
                    color: role === "Admin" ? "#3b82f6" : "#475569",
                    border: role === "Admin" ? `1px solid ${alpha("#3b82f6", 0.25)}` : "none",
                  }}
                />
              ))}
            </Box>
          </LabeledRow>
          <LabeledRow icon={<GroupsRounded sx={{ fontSize: 18 }} />} label="Teams">
            <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
              {mockUser.teams.map((team) => (
                <Chip
                  key={team}
                  label={team}
                  size="small"
                  sx={{ height: 24, fontSize: "0.75rem", fontWeight: 600, bgcolor: alpha("#94a3b8", 0.1), color: "#475569" }}
                />
              ))}
            </Box>
          </LabeledRow>

          <Divider sx={{ borderColor: alpha("#94a3b8", 0.15), my: 1.5 }} />

          <Button
            variant="outlined"
            fullWidth
            startIcon={<LogoutRounded sx={{ fontSize: 18 }} />}
            onClick={() => {
              close();
              navigate("/", { state: { signedOut: true } });
            }}
            sx={{
              color: "#64748b",
              borderColor: alpha("#94a3b8", 0.25),
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.85rem",
              py: 1,
              "&:hover": {
                borderColor: "#dc2626",
                color: "#dc2626",
                bgcolor: alpha("#dc2626", 0.04),
              },
            }}
          >
            Sign Out
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
