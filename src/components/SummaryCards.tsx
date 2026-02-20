import { Paper, Typography, Box, alpha } from "@mui/material";
import {
  FolderRounded,
  WarningAmberRounded,
  ErrorRounded,
  UpdateRounded,
  GavelRounded,
} from "@mui/icons-material";
import { summaryStats } from "../data/mockData";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  return (
    <Paper
      sx={{
        flex: 1,
        p: 2.5,
        display: "flex",
        alignItems: "center",
        gap: 2,
        minWidth: 0,
      }}
    >
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: 2,
          bgcolor: alpha(color, 0.1),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="h5" sx={{ lineHeight: 1.1 }}>
          {value}
        </Typography>
        <Typography
          variant="body2"
          sx={{ fontSize: "0.78rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
        >
          {label}
        </Typography>
      </Box>
    </Paper>
  );
}

export default function SummaryCards() {
  const { totalProjects, totalVulnerabilities, criticalCount, outdatedDeps, licenseIssues } =
    summaryStats;
  return (
    <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
      <StatCard
        icon={<FolderRounded sx={{ color: "#3b82f6" }} />}
        label="Total Projects"
        value={totalProjects}
        color="#3b82f6"
      />
      <StatCard
        icon={<WarningAmberRounded sx={{ color: "#f59e0b" }} />}
        label="Vulnerabilities"
        value={totalVulnerabilities}
        color="#f59e0b"
      />
      <StatCard
        icon={<ErrorRounded sx={{ color: "#dc2626" }} />}
        label="Critical"
        value={criticalCount}
        color="#dc2626"
      />
      <StatCard
        icon={<UpdateRounded sx={{ color: "#6366f1" }} />}
        label="Outdated Deps"
        value={outdatedDeps}
        color="#6366f1"
      />
      <StatCard
        icon={<GavelRounded sx={{ color: "#0ea5e9" }} />}
        label="License Issues"
        value={licenseIssues}
        color="#0ea5e9"
      />
    </Box>
  );
}
