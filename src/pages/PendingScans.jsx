import { useState } from "react";
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
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  alpha,
} from "@mui/material";
import {
  CancelRounded,
  HourglassTopRounded,
  TimerRounded,
  QueueRounded,
  SpeedRounded,
  TrendingUpRounded,
  WarningAmberRounded,
} from "@mui/icons-material";

const phaseConfig = {
  queued: { label: "Queued", color: "#94a3b8" },
  downloading: { label: "Downloading SBOM", color: "#3b82f6" },
  analyzing: { label: "Analyzing", color: "#6366f1" },
  enriching: { label: "CVE Enrichment", color: "#f59e0b" },
};

const initialScans = [
  { id: "s1", project: "cairo-frontend", group: "CAIRO", triggeredBy: "CI/CD Pipeline", triggeredAt: "Feb 9, 2026, 10:32 AM", phase: "enriching", progress: 82, queuePosition: null, estimatedWait: "< 1 min", ecosystem: "NPM", version: "2.14.1" },
  { id: "s2", project: "deepview-api-gateway", group: "DEEPVIEW", triggeredBy: "CI/CD Pipeline", triggeredAt: "Feb 9, 2026, 10:30 AM", phase: "analyzing", progress: 55, queuePosition: null, estimatedWait: "~2 min", ecosystem: "NPM", version: "3.2.1" },
  { id: "s3", project: "platform-auth-service", group: "PLATFORM", triggeredBy: "mmengelt", triggeredAt: "Feb 9, 2026, 10:28 AM", phase: "downloading", progress: 23, queuePosition: null, estimatedWait: "~4 min", ecosystem: "NPM", version: "2.0.5" },
  { id: "s4", project: "platform-ui", group: "PLATFORM", triggeredBy: "CI/CD Pipeline", triggeredAt: "Feb 9, 2026, 10:27 AM", phase: "queued", progress: 0, queuePosition: 1, estimatedWait: "~5 min", ecosystem: "NPM", version: "4.7.2" },
  { id: "s5", project: "cairo-api", group: "CAIRO", triggeredBy: "jsmith", triggeredAt: "Feb 9, 2026, 10:26 AM", phase: "queued", progress: 0, queuePosition: 2, estimatedWait: "~7 min", ecosystem: "NPM", version: "1.8.4" },
  { id: "s6", project: "deepview-worker", group: "DEEPVIEW", triggeredBy: "CI/CD Pipeline", triggeredAt: "Feb 9, 2026, 10:25 AM", phase: "queued", progress: 0, queuePosition: 3, estimatedWait: "~9 min", ecosystem: "NPM", version: "1.1.8" },
  { id: "s7", project: "cairo-infra", group: "CAIRO", triggeredBy: "CI/CD Pipeline", triggeredAt: "Feb 9, 2026, 10:24 AM", phase: "queued", progress: 0, queuePosition: 4, estimatedWait: "~11 min", ecosystem: "NPM", version: "0.9.2" },
];

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

export default function PendingScans() {
  const [scans, setScans] = useState(initialScans);
  const [cancelTarget, setCancelTarget] = useState(null);

  const handleCancel = () => {
    if (cancelTarget) {
      setScans((prev) => prev.filter((s) => s.id !== cancelTarget.id));
      setCancelTarget(null);
    }
  };

  const activeCount = scans.filter((s) => s.phase !== "queued").length;
  const queuedCount = scans.filter((s) => s.phase === "queued").length;
  const avgWait = "4.2 min";
  const throughput = "~18/hr";

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontSize: "1.65rem", mb: 0.3 }}>
          Pending Scans
        </Typography>
        <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>
          SBOM analysis scans currently in progress or waiting in the queue
        </Typography>
      </Box>

      {/* Metric cards */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <MetricCard
          icon={<QueueRounded sx={{ color: "#3b82f6" }} />}
          label="Pending Scans"
          value={scans.length}
          sub={`${activeCount} active, ${queuedCount} queued`}
          color="#3b82f6"
        />
        <MetricCard
          icon={<TimerRounded sx={{ color: "#f59e0b" }} />}
          label="Avg Wait Time"
          value={avgWait}
          sub="From queue to completion"
          color="#f59e0b"
        />
        <MetricCard
          icon={<SpeedRounded sx={{ color: "#6366f1" }} />}
          label="Throughput"
          value={throughput}
          sub="Scans completed per hour"
          color="#6366f1"
        />
        <MetricCard
          icon={<TrendingUpRounded sx={{ color: "#22c55e" }} />}
          label="Success Rate"
          value="98.4%"
          sub="Last 24 hours"
          color="#22c55e"
        />
      </Box>

      {/* Active alert */}
      {scans.length > 5 && (
        <Paper
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            px: 2.5,
            py: 1.5,
            mb: 2,
            bgcolor: alpha("#f59e0b", 0.05),
            borderColor: alpha("#f59e0b", 0.2),
          }}
        >
          <WarningAmberRounded sx={{ color: "#f59e0b", fontSize: 20 }} />
          <Typography sx={{ fontSize: "0.82rem", color: "#92400e" }}>
            Queue is elevated — {queuedCount} scans waiting. Estimated processing time may be longer than usual.
          </Typography>
        </Paper>
      )}

      {/* Table */}
      <TableContainer component={Paper} sx={{ "& .MuiTableCell-root": { fontSize: "0.82rem", py: 1.5 } }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ "& .MuiTableCell-head": { fontWeight: 700, color: "#64748b", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em", bgcolor: alpha("#f8fafc", 0.8) } }}>
              <TableCell>Project</TableCell>
              <TableCell>Group</TableCell>
              <TableCell>Version</TableCell>
              <TableCell>Phase</TableCell>
              <TableCell sx={{ minWidth: 160 }}>Progress</TableCell>
              <TableCell>Est. Remaining</TableCell>
              <TableCell>Triggered By</TableCell>
              <TableCell>Submitted</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {scans.map((scan) => {
              const phase = phaseConfig[scan.phase];
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
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                      {scan.phase === "queued" ? (
                        <HourglassTopRounded sx={{ fontSize: 16, color: "#94a3b8" }} />
                      ) : (
                        <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: phase.color, animation: scan.phase !== "queued" ? "pulse 1.5s ease-in-out infinite" : "none", "@keyframes pulse": { "0%, 100%": { opacity: 1 }, "50%": { opacity: 0.4 } } }} />
                      )}
                      <Typography sx={{ fontSize: "0.8rem", fontWeight: 600, color: phase.color }}>{phase.label}</Typography>
                      {scan.queuePosition != null && (
                        <Chip label={`#${scan.queuePosition}`} size="small" sx={{ height: 20, fontSize: "0.65rem", fontWeight: 700, bgcolor: alpha("#94a3b8", 0.08), color: "#94a3b8", ml: 0.5 }} />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {scan.phase === "queued" ? (
                      <Typography sx={{ fontSize: "0.78rem", color: "#94a3b8" }}>—</Typography>
                    ) : (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <LinearProgress
                          variant="determinate"
                          value={scan.progress}
                          sx={{
                            flex: 1,
                            height: 6,
                            borderRadius: 3,
                            bgcolor: alpha("#94a3b8", 0.1),
                            "& .MuiLinearProgress-bar": { bgcolor: phase.color, borderRadius: 3 },
                          }}
                        />
                        <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: phase.color, minWidth: 32, textAlign: "right" }}>
                          {scan.progress}%
                        </Typography>
                      </Box>
                    )}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    <Typography sx={{ fontSize: "0.8rem", color: "#64748b" }}>{scan.estimatedWait}</Typography>
                  </TableCell>
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
                    {scan.triggeredAt}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Cancel scan" arrow>
                      <IconButton
                        size="small"
                        onClick={() => setCancelTarget(scan)}
                        sx={{ color: "#94a3b8", "&:hover": { color: "#dc2626", bgcolor: alpha("#dc2626", 0.08) } }}
                      >
                        <CancelRounded sx={{ fontSize: 20 }} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
            {scans.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} sx={{ py: 6, textAlign: "center" }}>
                  <Typography sx={{ color: "#94a3b8", fontSize: "0.9rem" }}>No pending scans — the queue is empty</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Cancel confirmation dialog */}
      <Dialog
        open={cancelTarget !== null}
        onClose={() => setCancelTarget(null)}
        PaperProps={{ sx: { borderRadius: 3, width: 400, border: "1px solid", borderColor: alpha("#94a3b8", 0.2) } }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" sx={{ fontSize: "1rem" }}>Cancel Scan</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: "0.85rem", color: "#64748b" }}>
            Are you sure you want to cancel the scan for <strong>{cancelTarget?.project}</strong> (v{cancelTarget?.version})?
            {cancelTarget?.phase !== "queued" && " The scan is currently in progress and any partial results will be discarded."}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setCancelTarget(null)} sx={{ color: "#64748b" }}>Keep</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleCancel}
            sx={{ boxShadow: "none", "&:hover": { boxShadow: "none" } }}
          >
            Cancel Scan
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
