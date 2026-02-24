import { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Chip,
  IconButton,
  Tooltip,
  InputBase,
  ToggleButtonGroup,
  ToggleButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Divider,
  alpha,
} from "@mui/material";
import {
  CheckCircleRounded,
  ErrorRounded,
  WarningAmberRounded,
  TimerRounded,
  SpeedRounded,
  TrendingUpRounded,
  AssignmentTurnedInRounded,
  SearchRounded,
  VisibilityRounded,
  CloseRounded,
  BugReportRounded,
  GavelRounded,
  AccountTreeRounded,
  AccessTimeRounded,
} from "@mui/icons-material";

const completedScans = [
  { id: "c1", project: "cairo-frontend", group: "CAIRO", version: "2.14.0", triggeredBy: "CI/CD Pipeline", startedAt: "Feb 9, 2026, 10:14 AM", completedAt: "Feb 9, 2026, 10:17 AM", duration: "3.4s", status: "failing", ecosystem: "NPM", branch: "main", vulns: { critical: 1, high: 3, medium: 0, low: 2 }, totalDeps: 824, licenseIssues: 2 },
  { id: "c2", project: "cairo-api", group: "CAIRO", version: "1.8.3", triggeredBy: "CI/CD Pipeline", startedAt: "Feb 9, 2026, 9:43 AM", completedAt: "Feb 9, 2026, 9:45 AM", duration: "2.1s", status: "warning", ecosystem: "NPM", branch: "main", vulns: { critical: 0, high: 1, medium: 2, low: 5 }, totalDeps: 350, licenseIssues: 0 },
  { id: "c3", project: "deepview-api-gateway", group: "DEEPVIEW", version: "3.2.0", triggeredBy: "CI/CD Pipeline", startedAt: "Feb 9, 2026, 7:56 AM", completedAt: "Feb 9, 2026, 8:00 AM", duration: "4.2s", status: "failing", ecosystem: "NPM", branch: "main", vulns: { critical: 3, high: 3, medium: 0, low: 1 }, totalDeps: 470, licenseIssues: 1 },
  { id: "c4", project: "deepview-worker", group: "DEEPVIEW", version: "1.1.7", triggeredBy: "CI/CD Pipeline", startedAt: "Feb 8, 2026, 11:19 PM", completedAt: "Feb 8, 2026, 11:22 PM", duration: "2.9s", status: "passing", ecosystem: "NPM", branch: "main", vulns: { critical: 0, high: 0, medium: 1, low: 3 }, totalDeps: 239, licenseIssues: 0 },
  { id: "c5", project: "platform-auth-service", group: "PLATFORM", version: "2.0.4", triggeredBy: "mmengelt", startedAt: "Feb 9, 2026, 7:13 AM", completedAt: "Feb 9, 2026, 7:15 AM", duration: "1.5s", status: "failing", ecosystem: "NPM", branch: "develop", vulns: { critical: 2, high: 5, medium: 1, low: 0 }, totalDeps: 200, licenseIssues: 3 },
  { id: "c6", project: "platform-ui", group: "PLATFORM", version: "4.7.1", triggeredBy: "CI/CD Pipeline", startedAt: "Feb 9, 2026, 9:57 AM", completedAt: "Feb 9, 2026, 10:02 AM", duration: "5.1s", status: "warning", ecosystem: "NPM", branch: "main", vulns: { critical: 0, high: 2, medium: 4, low: 8 }, totalDeps: 1111, licenseIssues: 1 },
  { id: "c7", project: "cairo-infra", group: "CAIRO", version: "0.9.1", triggeredBy: "CI/CD Pipeline", startedAt: "Feb 8, 2026, 4:30 PM", completedAt: "Feb 8, 2026, 4:32 PM", duration: "1.8s", status: "passing", ecosystem: "NPM", branch: "main", vulns: { critical: 0, high: 0, medium: 0, low: 0 }, totalDeps: 101, licenseIssues: 0 },
  { id: "c8", project: "cairo-frontend", group: "CAIRO", version: "2.13.2", triggeredBy: "jsmith", startedAt: "Feb 8, 2026, 2:10 PM", completedAt: "Feb 8, 2026, 2:14 PM", duration: "3.6s", status: "failing", ecosystem: "NPM", branch: "feature/auth-refactor", vulns: { critical: 1, high: 4, medium: 1, low: 2 }, totalDeps: 818, licenseIssues: 2 },
  { id: "c9", project: "deepview-api-gateway", group: "DEEPVIEW", version: "3.1.9", triggeredBy: "CI/CD Pipeline", startedAt: "Feb 8, 2026, 11:00 AM", completedAt: "Feb 8, 2026, 11:04 AM", duration: "4.0s", status: "failing", ecosystem: "NPM", branch: "main", vulns: { critical: 3, high: 4, medium: 1, low: 1 }, totalDeps: 468, licenseIssues: 1 },
  { id: "c10", project: "platform-auth-service", group: "PLATFORM", version: "2.0.3", triggeredBy: "CI/CD Pipeline", startedAt: "Feb 8, 2026, 8:30 AM", completedAt: "Feb 8, 2026, 8:31 AM", duration: "1.4s", status: "failing", ecosystem: "NPM", branch: "main", vulns: { critical: 2, high: 5, medium: 2, low: 1 }, totalDeps: 198, licenseIssues: 3 },
  { id: "c11", project: "deepview-worker", group: "DEEPVIEW", version: "1.1.6", triggeredBy: "CI/CD Pipeline", startedAt: "Feb 7, 2026, 5:20 PM", completedAt: "Feb 7, 2026, 5:23 PM", duration: "2.8s", status: "passing", ecosystem: "NPM", branch: "main", vulns: { critical: 0, high: 0, medium: 1, low: 4 }, totalDeps: 237, licenseIssues: 0 },
  { id: "c12", project: "cairo-api", group: "CAIRO", version: "1.8.2", triggeredBy: "mmengelt", startedAt: "Feb 7, 2026, 3:00 PM", completedAt: "Feb 7, 2026, 3:02 PM", duration: "2.0s", status: "warning", ecosystem: "NPM", branch: "develop", vulns: { critical: 0, high: 1, medium: 3, low: 4 }, totalDeps: 348, licenseIssues: 0 },
];

const statusConfig = {
  passing: { label: "Passing", color: "#22c55e", icon: <CheckCircleRounded sx={{ fontSize: 16 }} /> },
  warning: { label: "Warning", color: "#f59e0b", icon: <WarningAmberRounded sx={{ fontSize: 16 }} /> },
  failing: { label: "Failing", color: "#dc2626", icon: <ErrorRounded sx={{ fontSize: 16 }} /> },
};

const severityColor = { critical: "#dc2626", high: "#f59e0b", medium: "#6366f1", low: "#22c55e" };

function MetricCard({ icon, label, value, sub, color }) {
  return (
    <Paper sx={{ flex: 1, p: 2.5, minWidth: 0 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box sx={{ width: 42, height: 42, borderRadius: 2, bgcolor: alpha(color, 0.1), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {icon}
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontSize: "0.72rem", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</Typography>
          <Typography sx={{ fontWeight: 700, fontSize: "1.35rem", lineHeight: 1.1 }}>{value}</Typography>
          {sub && <Typography sx={{ fontSize: "0.72rem", color: "#94a3b8", mt: 0.2 }}>{sub}</Typography>}
        </Box>
      </Box>
    </Paper>
  );
}

function ScanDetailModal({ scan, onClose }) {
  if (!scan) return null;
  const sc = statusConfig[scan.status];
  const totalVulns = scan.vulns.critical + scan.vulns.high + scan.vulns.medium + scan.vulns.low;

  return (
    <Dialog
      open
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 3,
          width: 540,
          maxWidth: "95vw",
          border: "1px solid",
          borderColor: alpha("#94a3b8", 0.2),
        },
      }}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1 }}>
        <Typography variant="h6" sx={{ fontSize: "1rem" }}>Scan Result</Typography>
        <IconButton size="small" onClick={onClose} sx={{ color: "#94a3b8" }}>
          <CloseRounded sx={{ fontSize: 20 }} />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: "0 !important", px: 3, pb: 3 }}>
        {/* Project header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
          <Typography sx={{ fontWeight: 700, fontSize: "1.1rem" }}>{scan.project}</Typography>
          <Chip label={`v${scan.version}`} size="small" sx={{ height: 22, fontSize: "0.7rem", bgcolor: alpha("#94a3b8", 0.1), color: "#64748b" }} />
          <Chip label={scan.group} size="small" sx={{ height: 22, fontSize: "0.68rem", fontWeight: 700, bgcolor: alpha("#3b82f6", 0.08), color: "#3b82f6" }} />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#94a3b8", mb: 2 }}>
          <AccessTimeRounded sx={{ fontSize: 14 }} />
          <Typography sx={{ fontSize: "0.75rem" }}>
            Completed {scan.completedAt} &middot; {scan.duration} &middot; {scan.branch}
          </Typography>
        </Box>

        <Divider sx={{ borderColor: alpha("#94a3b8", 0.12), mb: 2 }} />

        {/* Status */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Chip
            icon={sc.icon}
            label={sc.label}
            size="small"
            sx={{ height: 28, fontSize: "0.78rem", fontWeight: 700, bgcolor: alpha(sc.color, 0.1), color: sc.color, "& .MuiChip-icon": { ml: 0.5 } }}
          />
          <Typography sx={{ fontSize: "0.82rem", color: "#64748b" }}>
            {totalVulns} {totalVulns === 1 ? "vulnerability" : "vulnerabilities"} found across {scan.totalDeps.toLocaleString()} dependencies
          </Typography>
        </Box>

        {/* Vulnerability breakdown */}
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          {["critical", "high", "medium", "low"].map((sev) => (
            <Paper key={sev} sx={{ flex: 1, p: 1.5, textAlign: "center" }}>
              <Typography sx={{ fontWeight: 700, fontSize: "1.2rem", color: scan.vulns[sev] > 0 ? severityColor[sev] : "#94a3b8", lineHeight: 1 }}>
                {scan.vulns[sev]}
              </Typography>
              <Typography sx={{ fontSize: "0.65rem", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", mt: 0.5 }}>
                {sev}
              </Typography>
            </Paper>
          ))}
        </Box>

        <Divider sx={{ borderColor: alpha("#94a3b8", 0.12), mb: 2 }} />

        {/* Details grid */}
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}>
          {[
            { icon: <AccountTreeRounded sx={{ fontSize: 16 }} />, label: "Total Dependencies", value: scan.totalDeps.toLocaleString() },
            { icon: <GavelRounded sx={{ fontSize: 16 }} />, label: "License Issues", value: scan.licenseIssues, highlight: scan.licenseIssues > 0 },
            { icon: <TimerRounded sx={{ fontSize: 16 }} />, label: "Scan Duration", value: scan.duration },
            { icon: <BugReportRounded sx={{ fontSize: 16 }} />, label: "Ecosystem", value: scan.ecosystem },
          ].map((item) => (
            <Box key={item.label} sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 1.5, borderRadius: 1.5, bgcolor: alpha("#f8fafc", 0.8), border: "1px solid", borderColor: alpha("#94a3b8", 0.1) }}>
              <Box sx={{ color: "#94a3b8" }}>{item.icon}</Box>
              <Box>
                <Typography sx={{ fontSize: "0.65rem", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>{item.label}</Typography>
                <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: item.highlight ? "#dc2626" : "#1e293b" }}>{item.value}</Typography>
              </Box>
            </Box>
          ))}
        </Box>

        <Divider sx={{ borderColor: alpha("#94a3b8", 0.12), my: 2 }} />

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography sx={{ fontSize: "0.75rem", color: "#94a3b8" }}>
            Triggered by {scan.triggeredBy} &middot; Started {scan.startedAt}
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default function CompletedScans() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortField, setSortField] = useState("completedAt");
  const [sortDir, setSortDir] = useState("desc");
  const [detailScan, setDetailScan] = useState(null);

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir(field === "completedAt" ? "desc" : "asc");
    }
  };

  const filtered = useMemo(() => {
    let list = completedScans;

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) => s.project.toLowerCase().includes(q) || s.group.toLowerCase().includes(q) || s.branch.toLowerCase().includes(q),
      );
    }

    if (filter === "passing") list = list.filter((s) => s.status === "passing");
    else if (filter === "warning") list = list.filter((s) => s.status === "warning");
    else if (filter === "failing") list = list.filter((s) => s.status === "failing");

    list = [...list].sort((a, b) => {
      let cmp = 0;
      if (sortField === "project") cmp = a.project.localeCompare(b.project);
      else if (sortField === "completedAt") cmp = a.id.localeCompare(b.id);
      else if (sortField === "vulns") {
        const va = a.vulns.critical + a.vulns.high + a.vulns.medium + a.vulns.low;
        const vb = b.vulns.critical + b.vulns.high + b.vulns.medium + b.vulns.low;
        cmp = va - vb;
      } else if (sortField === "duration") {
        cmp = parseFloat(a.duration) - parseFloat(b.duration);
      }
      return sortDir === "desc" ? -cmp : cmp;
    });

    return list;
  }, [search, filter, sortField, sortDir]);

  const passingCount = completedScans.filter((s) => s.status === "passing").length;
  const warningCount = completedScans.filter((s) => s.status === "warning").length;
  const failingCount = completedScans.filter((s) => s.status === "failing").length;
  const avgDuration = (completedScans.reduce((sum, s) => sum + parseFloat(s.duration), 0) / completedScans.length).toFixed(1) + "s";

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontSize: "1.65rem", mb: 0.3 }}>
          Completed Scans
        </Typography>
        <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>
          History of completed SBOM analysis scans and their results
        </Typography>
      </Box>

      {/* Metric cards */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <MetricCard
          icon={<AssignmentTurnedInRounded sx={{ color: "#3b82f6" }} />}
          label="Total Completed"
          value={completedScans.length}
          sub="Last 7 days"
          color="#3b82f6"
        />
        <MetricCard
          icon={<TimerRounded sx={{ color: "#f59e0b" }} />}
          label="Avg Duration"
          value={avgDuration}
          sub="Across all scans"
          color="#f59e0b"
        />
        <MetricCard
          icon={<SpeedRounded sx={{ color: "#6366f1" }} />}
          label="Pass Rate"
          value={`${Math.round(((passingCount + warningCount) / completedScans.length) * 100)}%`}
          sub={`${failingCount} failing`}
          color="#6366f1"
        />
        <MetricCard
          icon={<TrendingUpRounded sx={{ color: "#22c55e" }} />}
          label="Clean Scans"
          value={passingCount}
          sub="No critical or high vulns"
          color="#22c55e"
        />
      </Box>

      {/* Toolbar */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            bgcolor: "#fff",
            border: "1px solid",
            borderColor: alpha("#94a3b8", 0.25),
            borderRadius: 2,
            px: 1.5,
            height: 38,
            flex: 1,
            maxWidth: 360,
          }}
        >
          <SearchRounded sx={{ color: "#94a3b8", fontSize: 20 }} />
          <InputBase
            placeholder="Search projects, groups, or branches..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ fontSize: "0.85rem", flex: 1 }}
          />
        </Box>

        <ToggleButtonGroup
          size="small"
          value={filter}
          exclusive
          onChange={(_, v) => v && setFilter(v)}
          sx={{
            "& .MuiToggleButton-root": {
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.78rem",
              px: 1.5,
              height: 38,
              borderColor: alpha("#94a3b8", 0.25),
              "&.Mui-selected": { bgcolor: alpha("#3b82f6", 0.08), color: "#3b82f6", borderColor: alpha("#3b82f6", 0.3) },
            },
          }}
        >
          <ToggleButton value="all">All ({completedScans.length})</ToggleButton>
          <ToggleButton value="passing">Passing ({passingCount})</ToggleButton>
          <ToggleButton value="warning">Warning ({warningCount})</ToggleButton>
          <ToggleButton value="failing">Failing ({failingCount})</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} sx={{ "& .MuiTableCell-root": { fontSize: "0.82rem", py: 1.5 } }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ "& .MuiTableCell-head": { fontWeight: 700, color: "#64748b", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em", bgcolor: alpha("#f8fafc", 0.8) } }}>
              <TableCell>
                <TableSortLabel active={sortField === "project"} direction={sortField === "project" ? sortDir : "asc"} onClick={() => handleSort("project")}>
                  Project
                </TableSortLabel>
              </TableCell>
              <TableCell>Group</TableCell>
              <TableCell>Version</TableCell>
              <TableCell>Branch</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">
                <TableSortLabel active={sortField === "vulns"} direction={sortField === "vulns" ? sortDir : "asc"} onClick={() => handleSort("vulns")}>
                  Vulns
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">C</TableCell>
              <TableCell align="center">H</TableCell>
              <TableCell align="center">M</TableCell>
              <TableCell align="center">L</TableCell>
              <TableCell>
                <TableSortLabel active={sortField === "duration"} direction={sortField === "duration" ? sortDir : "asc"} onClick={() => handleSort("duration")}>
                  Duration
                </TableSortLabel>
              </TableCell>
              <TableCell>Triggered By</TableCell>
              <TableCell>
                <TableSortLabel active={sortField === "completedAt"} direction={sortField === "completedAt" ? sortDir : "asc"} onClick={() => handleSort("completedAt")}>
                  Completed
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((scan) => {
              const sc = statusConfig[scan.status];
              const totalVulns = scan.vulns.critical + scan.vulns.high + scan.vulns.medium + scan.vulns.low;
              return (
                <TableRow
                  key={scan.id}
                  sx={{
                    "&:hover": { bgcolor: alpha("#3b82f6", 0.03) },
                    "& td": { borderColor: alpha("#94a3b8", 0.1) },
                  }}
                >
                  <TableCell sx={{ fontWeight: 600, color: "#1e293b" }}>{scan.project}</TableCell>
                  <TableCell>
                    <Chip label={scan.group} size="small" sx={{ height: 22, fontSize: "0.68rem", fontWeight: 700, bgcolor: alpha("#3b82f6", 0.08), color: "#3b82f6" }} />
                  </TableCell>
                  <TableCell sx={{ fontFamily: "monospace", fontSize: "0.78rem !important" }}>{scan.version}</TableCell>
                  <TableCell>
                    <Chip
                      label={scan.branch}
                      size="small"
                      sx={{
                        height: 22,
                        fontSize: "0.68rem",
                        fontWeight: 600,
                        bgcolor: scan.branch === "main" ? alpha("#22c55e", 0.08) : alpha("#94a3b8", 0.08),
                        color: scan.branch === "main" ? "#16a34a" : "#475569",
                        fontFamily: "monospace",
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={sc.icon}
                      label={sc.label}
                      size="small"
                      sx={{ height: 24, fontSize: "0.72rem", fontWeight: 600, bgcolor: alpha(sc.color, 0.1), color: sc.color, "& .MuiChip-icon": { ml: 0.5 } }}
                    />
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, color: totalVulns > 0 ? "#1e293b" : "#94a3b8" }}>
                    {totalVulns}
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, color: scan.vulns.critical > 0 ? severityColor.critical : "#94a3b8" }}>{scan.vulns.critical}</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, color: scan.vulns.high > 0 ? severityColor.high : "#94a3b8" }}>{scan.vulns.high}</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, color: scan.vulns.medium > 0 ? severityColor.medium : "#94a3b8" }}>{scan.vulns.medium}</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, color: scan.vulns.low > 0 ? severityColor.low : "#94a3b8" }}>{scan.vulns.low}</TableCell>
                  <TableCell sx={{ fontFamily: "monospace", fontSize: "0.78rem !important", color: "#64748b" }}>{scan.duration}</TableCell>
                  <TableCell>
                    <Chip
                      label={scan.triggeredBy}
                      size="small"
                      sx={{
                        height: 22,
                        fontSize: "0.68rem",
                        fontWeight: 600,
                        bgcolor: scan.triggeredBy === "CI/CD Pipeline" ? alpha("#6366f1", 0.08) : alpha("#94a3b8", 0.08),
                        color: scan.triggeredBy === "CI/CD Pipeline" ? "#6366f1" : "#475569",
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: "#94a3b8", fontSize: "0.78rem !important", whiteSpace: "nowrap" }}>
                    {scan.completedAt}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="View scan details" arrow>
                      <IconButton
                        size="small"
                        onClick={() => setDetailScan(scan)}
                        sx={{ color: "#94a3b8", "&:hover": { color: "#3b82f6", bgcolor: alpha("#3b82f6", 0.08) } }}
                      >
                        <VisibilityRounded sx={{ fontSize: 20 }} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={14} sx={{ py: 6, textAlign: "center" }}>
                  <Typography sx={{ color: "#94a3b8", fontSize: "0.9rem" }}>
                    {search ? `No completed scans matching "${search}"` : "No completed scans yet"}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Detail modal */}
      <ScanDetailModal scan={detailScan} onClose={() => setDetailScan(null)} />
    </Box>
  );
}
