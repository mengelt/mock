import { useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  alpha,
} from "@mui/material";
import {
  ShieldRounded,
  TrendingDownRounded,
  TrendingUpRounded,
  CheckCircleRounded,
  ErrorRounded,
  WarningAmberRounded,
  GavelRounded,
  AccountTreeRounded,
} from "@mui/icons-material";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { projectGroups } from "../data/mockData";
import type { ProjectScan } from "../data/types";

const COLORS = {
  critical: "#dc2626",
  high: "#f59e0b",
  medium: "#6366f1",
  low: "#22c55e",
  passing: "#22c55e",
  warning: "#f59e0b",
  failing: "#dc2626",
};

// Mock trend data (last 12 weeks)
const trendData = [
  { week: "W48", critical: 12, high: 28, medium: 15, low: 22 },
  { week: "W49", critical: 11, high: 26, medium: 14, low: 20 },
  { week: "W50", critical: 13, high: 24, medium: 16, low: 19 },
  { week: "W51", critical: 10, high: 22, medium: 13, low: 18 },
  { week: "W52", critical: 9, high: 20, medium: 12, low: 21 },
  { week: "W1", critical: 8, high: 19, medium: 14, low: 20 },
  { week: "W2", critical: 10, high: 18, medium: 11, low: 18 },
  { week: "W3", critical: 9, high: 17, medium: 10, low: 19 },
  { week: "W4", critical: 7, high: 16, medium: 9, low: 17 },
  { week: "W5", critical: 8, high: 15, medium: 8, low: 16 },
  { week: "W6", critical: 6, high: 14, medium: 8, low: 19 },
];

function useAggregatedData() {
  return useMemo(() => {
    const allProjects: ProjectScan[] = projectGroups.flatMap((g) => g.projects);

    const vulns = { critical: 0, high: 0, medium: 0, low: 0 };
    const licenses = { compliant: 0, nonCompliant: 0, unknown: 0 };
    let totalDirect = 0;
    let totalIndirect = 0;
    const statusCounts = { passing: 0, warning: 0, failing: 0 };

    for (const p of allProjects) {
      vulns.critical += p.vulnerabilities.critical;
      vulns.high += p.vulnerabilities.high;
      vulns.medium += p.vulnerabilities.medium;
      vulns.low += p.vulnerabilities.low;
      licenses.compliant += p.licenses.compliant;
      licenses.nonCompliant += p.licenses.nonCompliant;
      licenses.unknown += p.licenses.unknown;
      totalDirect += p.directDeps;
      totalIndirect += p.indirectDeps;
      statusCounts[p.status]++;
    }

    const totalVulns = vulns.critical + vulns.high + vulns.medium + vulns.low;
    const totalLicenses = licenses.compliant + licenses.nonCompliant + licenses.unknown;

    // Risk score: 0-100 (lower is better)
    const riskScore = Math.round(
      Math.min(100, (vulns.critical * 15 + vulns.high * 6 + vulns.medium * 2 + vulns.low * 0.5 + licenses.nonCompliant * 8) * 100 / (allProjects.length * 50))
    );

    // Grade
    const grade = riskScore <= 20 ? "A" : riskScore <= 40 ? "B" : riskScore <= 60 ? "C" : riskScore <= 80 ? "D" : "F";
    const gradeColor = riskScore <= 20 ? "#22c55e" : riskScore <= 40 ? "#84cc16" : riskScore <= 60 ? "#f59e0b" : riskScore <= 80 ? "#f97316" : "#dc2626";

    // Per-group breakdown
    const groupBreakdown = projectGroups.map((g) => {
      const gVulns = g.projects.reduce((s, p) => s + p.vulnerabilities.critical + p.vulnerabilities.high + p.vulnerabilities.medium + p.vulnerabilities.low, 0);
      const gCrit = g.projects.reduce((s, p) => s + p.vulnerabilities.critical, 0);
      const gFailing = g.projects.filter((p) => p.status === "failing").length;
      return { name: g.name, projects: g.projects.length, vulns: gVulns, critical: gCrit, failing: gFailing };
    });

    // Top risky projects
    const riskySorted = [...allProjects].sort((a, b) => {
      const scoreA = a.vulnerabilities.critical * 10 + a.vulnerabilities.high * 4 + a.vulnerabilities.medium * 2 + a.vulnerabilities.low;
      const scoreB = b.vulnerabilities.critical * 10 + b.vulnerabilities.high * 4 + b.vulnerabilities.medium * 2 + b.vulnerabilities.low;
      return scoreB - scoreA;
    });

    const sevPieData = [
      { name: "Critical", value: vulns.critical, color: COLORS.critical },
      { name: "High", value: vulns.high, color: COLORS.high },
      { name: "Medium", value: vulns.medium, color: COLORS.medium },
      { name: "Low", value: vulns.low, color: COLORS.low },
    ].filter((d) => d.value > 0);

    const statusPieData = [
      { name: "Passing", value: statusCounts.passing, color: COLORS.passing },
      { name: "Warning", value: statusCounts.warning, color: COLORS.warning },
      { name: "Failing", value: statusCounts.failing, color: COLORS.failing },
    ].filter((d) => d.value > 0);

    const licensePct = totalLicenses > 0 ? Math.round((licenses.compliant / totalLicenses) * 100) : 100;

    return {
      allProjects,
      vulns,
      totalVulns,
      licenses,
      totalLicenses,
      licensePct,
      totalDirect,
      totalIndirect,
      statusCounts,
      riskScore,
      grade,
      gradeColor,
      groupBreakdown,
      riskySorted,
      sevPieData,
      statusPieData,
    };
  }, []);
}

function ScoreCard({ icon, label, value, subtext, color }: { icon: React.ReactNode; label: string; value: string | number; subtext?: string; color: string }) {
  return (
    <Paper sx={{ flex: 1, p: 2.5, minWidth: 0 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box sx={{ width: 42, height: 42, borderRadius: 2, bgcolor: alpha(color, 0.1), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {icon}
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontSize: "0.72rem", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</Typography>
          <Typography sx={{ fontWeight: 700, fontSize: "1.35rem", lineHeight: 1.1, color: "#1e293b" }}>{value}</Typography>
          {subtext && <Typography sx={{ fontSize: "0.72rem", color: "#94a3b8", mt: 0.2 }}>{subtext}</Typography>}
        </Box>
      </Box>
    </Paper>
  );
}

export default function EnterpriseHealth() {
  const d = useAggregatedData();

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontSize: "1.65rem", mb: 0.3 }}>Enterprise Health</Typography>
        <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>Aggregated security posture across {d.allProjects.length} projects in {projectGroups.length} groups</Typography>
      </Box>

      {/* Row 1 — Top-level KPIs */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        {/* Risk grade — special card */}
        <Paper sx={{ flex: 1, p: 2.5, minWidth: 0, display: "flex", alignItems: "center", gap: 2.5 }}>
          <Box sx={{ width: 58, height: 58, borderRadius: "50%", bgcolor: alpha(d.gradeColor, 0.1), border: "3px solid", borderColor: alpha(d.gradeColor, 0.4), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Typography sx={{ fontWeight: 800, fontSize: "1.6rem", color: d.gradeColor, lineHeight: 1 }}>{d.grade}</Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: "0.72rem", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>Risk Grade</Typography>
            <Typography sx={{ fontWeight: 700, fontSize: "1.1rem", lineHeight: 1.2 }}>Score: {d.riskScore}/100</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.3 }}>
              <TrendingDownRounded sx={{ fontSize: 16, color: "#22c55e" }} />
              <Typography sx={{ fontSize: "0.72rem", color: "#22c55e", fontWeight: 600 }}>-8 pts from last month</Typography>
            </Box>
          </Box>
        </Paper>

        <ScoreCard icon={<ErrorRounded sx={{ color: COLORS.critical }} />} label="Total Vulnerabilities" value={d.totalVulns} subtext={`${d.vulns.critical} critical`} color={COLORS.critical} />
        <ScoreCard icon={<ShieldRounded sx={{ color: "#3b82f6" }} />} label="Projects Scanned" value={d.allProjects.length} subtext={`${d.statusCounts.passing} passing`} color="#3b82f6" />
        <ScoreCard icon={<AccountTreeRounded sx={{ color: "#6366f1" }} />} label="Total Dependencies" value={(d.totalDirect + d.totalIndirect).toLocaleString()} subtext={`${d.totalDirect} direct`} color="#6366f1" />
        <ScoreCard icon={<GavelRounded sx={{ color: "#0ea5e9" }} />} label="License Compliance" value={`${d.licensePct}%`} subtext={`${d.licenses.nonCompliant} non-compliant`} color="#0ea5e9" />
      </Box>

      {/* Row 2 — Charts */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        {/* Vulnerability trend */}
        <Paper sx={{ flex: 2, p: 2.5, minWidth: 0 }}>
          <Typography variant="h6" sx={{ fontSize: "0.9rem", mb: 2 }}>Vulnerability Trend</Typography>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="critGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={COLORS.critical} stopOpacity={0.15} /><stop offset="100%" stopColor={COLORS.critical} stopOpacity={0} /></linearGradient>
                <linearGradient id="highGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={COLORS.high} stopOpacity={0.15} /><stop offset="100%" stopColor={COLORS.high} stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={alpha("#94a3b8", 0.15)} />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={30} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: `1px solid ${alpha("#94a3b8", 0.2)}` }} />
              <Area type="monotone" dataKey="critical" stroke={COLORS.critical} fill="url(#critGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="high" stroke={COLORS.high} fill="url(#highGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="medium" stroke={COLORS.medium} fill="transparent" strokeWidth={1.5} strokeDasharray="4 3" />
              <Area type="monotone" dataKey="low" stroke={COLORS.low} fill="transparent" strokeWidth={1.5} strokeDasharray="4 3" />
            </AreaChart>
          </ResponsiveContainer>
        </Paper>

        {/* Severity breakdown pie */}
        <Paper sx={{ flex: 1, p: 2.5, minWidth: 0 }}>
          <Typography variant="h6" sx={{ fontSize: "0.9rem", mb: 1 }}>Severity Breakdown</Typography>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={d.sevPieData} dataKey="value" cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={3} strokeWidth={0}>
                {d.sevPieData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: `1px solid ${alpha("#94a3b8", 0.2)}` }} />
            </PieChart>
          </ResponsiveContainer>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "center" }}>
            {d.sevPieData.map((s) => (
              <Box key={s.name} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: s.color }} />
                <Typography sx={{ fontSize: "0.72rem", color: "#64748b" }}>{s.name} ({s.value})</Typography>
              </Box>
            ))}
          </Box>
        </Paper>

        {/* Project status pie */}
        <Paper sx={{ flex: 1, p: 2.5, minWidth: 0 }}>
          <Typography variant="h6" sx={{ fontSize: "0.9rem", mb: 1 }}>Project Status</Typography>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={d.statusPieData} dataKey="value" cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={3} strokeWidth={0}>
                {d.statusPieData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: `1px solid ${alpha("#94a3b8", 0.2)}` }} />
            </PieChart>
          </ResponsiveContainer>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "center" }}>
            {d.statusPieData.map((s) => (
              <Box key={s.name} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: s.color }} />
                <Typography sx={{ fontSize: "0.72rem", color: "#64748b" }}>{s.name} ({s.value})</Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      </Box>

      {/* Row 3 — Group breakdown + Top risky projects */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        {/* Group breakdown bar chart */}
        <Paper sx={{ flex: 1, p: 2.5, minWidth: 0 }}>
          <Typography variant="h6" sx={{ fontSize: "0.9rem", mb: 2 }}>Vulnerabilities by Group</Typography>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={d.groupBreakdown} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke={alpha("#94a3b8", 0.15)} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={30} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: `1px solid ${alpha("#94a3b8", 0.2)}` }} />
              <Bar dataKey="critical" name="Critical" fill={COLORS.critical} radius={[4, 4, 0, 0]} />
              <Bar dataKey="vulns" name="Total Vulns" fill={alpha("#3b82f6", 0.6)} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Paper>

        {/* License compliance */}
        <Paper sx={{ flex: 1, p: 2.5, minWidth: 0 }}>
          <Typography variant="h6" sx={{ fontSize: "0.9rem", mb: 2 }}>License Compliance</Typography>
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
              <Typography sx={{ fontSize: "0.8rem", fontWeight: 600 }}>Compliant</Typography>
              <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: "#22c55e" }}>{d.licenses.compliant.toLocaleString()}</Typography>
            </Box>
            <LinearProgress variant="determinate" value={d.licensePct} sx={{ height: 10, borderRadius: 5, bgcolor: alpha("#94a3b8", 0.1), "& .MuiLinearProgress-bar": { bgcolor: "#22c55e", borderRadius: 5 } }} />
          </Box>
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
              <Typography sx={{ fontSize: "0.8rem", fontWeight: 600 }}>Non-Compliant</Typography>
              <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: "#dc2626" }}>{d.licenses.nonCompliant}</Typography>
            </Box>
            <LinearProgress variant="determinate" value={d.totalLicenses > 0 ? (d.licenses.nonCompliant / d.totalLicenses) * 100 : 0} sx={{ height: 10, borderRadius: 5, bgcolor: alpha("#94a3b8", 0.1), "& .MuiLinearProgress-bar": { bgcolor: "#dc2626", borderRadius: 5 } }} />
          </Box>
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
              <Typography sx={{ fontSize: "0.8rem", fontWeight: 600 }}>Unknown</Typography>
              <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: "#94a3b8" }}>{d.licenses.unknown}</Typography>
            </Box>
            <LinearProgress variant="determinate" value={d.totalLicenses > 0 ? (d.licenses.unknown / d.totalLicenses) * 100 : 0} sx={{ height: 10, borderRadius: 5, bgcolor: alpha("#94a3b8", 0.1), "& .MuiLinearProgress-bar": { bgcolor: "#94a3b8", borderRadius: 5 } }} />
          </Box>
        </Paper>
      </Box>

      {/* Row 4 — Top risky projects table */}
      <Paper sx={{ p: 0, overflow: "hidden" }}>
        <Box sx={{ px: 3, py: 2, borderBottom: "1px solid", borderColor: alpha("#94a3b8", 0.12) }}>
          <Typography variant="h6" sx={{ fontSize: "0.9rem" }}>Highest Risk Projects</Typography>
        </Box>
        <TableContainer>
          <Table size="small" sx={{ "& .MuiTableCell-root": { fontSize: "0.82rem", py: 1.5 } }}>
            <TableHead>
              <TableRow sx={{ "& .MuiTableCell-head": { fontWeight: 700, color: "#64748b", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em", bgcolor: alpha("#f8fafc", 0.8) } }}>
                <TableCell>Project</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Critical</TableCell>
                <TableCell align="center">High</TableCell>
                <TableCell align="center">Medium</TableCell>
                <TableCell align="center">Low</TableCell>
                <TableCell align="center">Direct Deps</TableCell>
                <TableCell align="center">Indirect Deps</TableCell>
                <TableCell align="center">License Issues</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {d.riskySorted.map((p) => {
                const statusColor = COLORS[p.status];
                const statusIcon = p.status === "passing" ? <CheckCircleRounded sx={{ fontSize: 16, color: statusColor }} /> : p.status === "warning" ? <WarningAmberRounded sx={{ fontSize: 16, color: statusColor }} /> : <ErrorRounded sx={{ fontSize: 16, color: statusColor }} />;
                return (
                  <TableRow key={p.id} sx={{ "&:hover": { bgcolor: alpha("#3b82f6", 0.03) }, "& td": { borderColor: alpha("#94a3b8", 0.1) } }}>
                    <TableCell sx={{ fontWeight: 600, color: "#1e293b" }}>{p.name}</TableCell>
                    <TableCell align="center">
                      <Chip
                        icon={statusIcon}
                        label={p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                        size="small"
                        sx={{ height: 24, fontSize: "0.72rem", fontWeight: 600, bgcolor: alpha(statusColor, 0.1), color: statusColor, "& .MuiChip-icon": { ml: 0.5 } }}
                      />
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700, color: p.vulnerabilities.critical > 0 ? COLORS.critical : "#94a3b8" }}>{p.vulnerabilities.critical}</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700, color: p.vulnerabilities.high > 0 ? COLORS.high : "#94a3b8" }}>{p.vulnerabilities.high}</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700, color: p.vulnerabilities.medium > 0 ? COLORS.medium : "#94a3b8" }}>{p.vulnerabilities.medium}</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700, color: p.vulnerabilities.low > 0 ? COLORS.low : "#94a3b8" }}>{p.vulnerabilities.low}</TableCell>
                    <TableCell align="center">{p.directDeps}</TableCell>
                    <TableCell align="center">{p.indirectDeps.toLocaleString()}</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600, color: p.licenses.nonCompliant > 0 ? COLORS.critical : "#94a3b8" }}>{p.licenses.nonCompliant}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
