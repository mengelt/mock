import {
  Paper,
  Typography,
  Box,
  Chip,
  Button,
  Divider,
  alpha,
} from "@mui/material";
import {
  AccessTimeRounded,
  AccountTreeRounded,
  ArrowForwardRounded,
  CoronavirusRounded,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import SeverityChip from "./SeverityChip";

const statusConfig = {
  passing: { label: "Passing", color: "#22c55e" },
  warning: { label: "Warning", color: "#f59e0b" },
  failing: { label: "Failing", color: "#dc2626" },
};

export default function ProjectCard({ project }) {
  const navigate = useNavigate();
  const { vulnerabilities, status, malware } = project;
  const totalVulns = vulnerabilities.critical + vulnerabilities.high + vulnerabilities.medium + vulnerabilities.low;
  const malwareCount = malware || 0;
  const statusCfg = statusConfig[status];

  return (
    <Paper
      sx={{
        p: 0,
        overflow: "hidden",
        transition: "box-shadow 0.2s, border-color 0.2s",
        "&:hover": {
          borderColor: alpha("#3b82f6", 0.3),
          boxShadow: `0 4px 24px ${alpha("#3b82f6", 0.08)}`,
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 3,
          py: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.3 }}>
            <Typography variant="h6" sx={{ fontSize: "1rem" }} noWrap>
              {project.name}
            </Typography>
            <Chip
              label={`v${project.version}`}
              size="small"
              sx={{
                height: 22,
                fontSize: "0.7rem",
                bgcolor: alpha("#94a3b8", 0.1),
                color: "#64748b",
              }}
            />
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#94a3b8" }}>
            <AccessTimeRounded sx={{ fontSize: 14 }} />
            <Typography sx={{ fontSize: "0.75rem", color: "#94a3b8" }}>
              Scanned {project.lastScanned} · {project.scanDuration} · {project.fileSize}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
          {totalVulns > 0 && (
            <Chip
              label={`${totalVulns} vulns`}
              size="small"
              sx={{
                bgcolor: alpha(statusCfg.color, 0.1),
                color: statusCfg.color,
                fontWeight: 700,
                height: 26,
              }}
            />
          )}
          <Chip
            label={statusCfg.label}
            size="small"
            sx={{
              bgcolor: alpha(statusCfg.color, 0.1),
              color: statusCfg.color,
              fontWeight: 700,
              height: 26,
              border: "1px solid",
              borderColor: alpha(statusCfg.color, 0.25),
            }}
          />
        </Box>
      </Box>

      <Divider sx={{ borderColor: alpha("#94a3b8", 0.12) }} />

      {/* Metrics row */}
      <Box sx={{ px: 3, py: 2.5, display: "flex", alignItems: "center" }}>
        {/* Vulnerabilities */}
        <Box sx={{ display: "flex", gap: 2 }}>
          {["critical", "high", "medium", "low"].map((sev) => (
            <SeverityChip key={sev} severity={sev} count={vulnerabilities[sev]} />
          ))}
        </Box>

        {/* Divider between vulns and malware */}
        <Divider orientation="vertical" flexItem sx={{ mx: 2, borderColor: alpha("#94a3b8", 0.15) }} />

        {/* Malware — square to distinguish from vuln circles */}
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 56 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 1.5,
              bgcolor: malwareCount > 0 ? alpha("#e11d48", 0.1) : alpha("#94a3b8", 0.08),
              border: "2px solid",
              borderColor: malwareCount > 0 ? alpha("#e11d48", 0.35) : alpha("#94a3b8", 0.15),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 0.5,
            }}
          >
            {malwareCount > 0 ? (
              <Typography sx={{ fontWeight: 700, fontSize: "1rem", color: "#e11d48", lineHeight: 1 }}>
                {malwareCount}
              </Typography>
            ) : (
              <CoronavirusRounded sx={{ fontSize: 18, color: "#94a3b8" }} />
            )}
          </Box>
          <Typography
            sx={{
              fontSize: "0.65rem",
              fontWeight: 600,
              color: malwareCount > 0 ? "#e11d48" : "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Malware
          </Typography>
        </Box>

        <Box sx={{ flex: 1 }} />

        {/* Vertical divider */}
        <Divider orientation="vertical" flexItem sx={{ mx: 3, borderColor: alpha("#94a3b8", 0.15) }} />

        {/* Dependency counts */}
        <Box sx={{ display: "flex", gap: 4 }}>
          <Box sx={{ textAlign: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, justifyContent: "center", mb: 0.3 }}>
              <AccountTreeRounded sx={{ fontSize: 15, color: "#94a3b8" }} />
              <Typography sx={{ fontWeight: 700, fontSize: "1.1rem", color: "#1e293b" }}>
                {project.directDeps}
              </Typography>
            </Box>
            <Typography sx={{ fontSize: "0.65rem", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Direct
            </Typography>
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, justifyContent: "center", mb: 0.3 }}>
              <AccountTreeRounded sx={{ fontSize: 15, color: "#94a3b8", opacity: 0.6 }} />
              <Typography sx={{ fontWeight: 700, fontSize: "1.1rem", color: "#1e293b" }}>
                {project.indirectDeps.toLocaleString()}
              </Typography>
            </Box>
            <Typography sx={{ fontSize: "0.65rem", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Indirect
            </Typography>
          </Box>
        </Box>

        <Divider orientation="vertical" flexItem sx={{ mx: 3, borderColor: alpha("#94a3b8", 0.15) }} />

        {/* View details */}
        <Button
          endIcon={<ArrowForwardRounded sx={{ fontSize: "16px !important" }} />}
          size="small"
          onClick={() => navigate(`/app/projects/${project.id}`)}
          sx={{ color: "#3b82f6", fontWeight: 600, fontSize: "0.8rem", whiteSpace: "nowrap" }}
        >
          View Details
        </Button>
      </Box>
    </Paper>
  );
}
