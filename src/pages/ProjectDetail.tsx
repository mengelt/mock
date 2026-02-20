import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  InputBase,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
  alpha,
} from "@mui/material";
import {
  ArrowBackRounded,
  AccessTimeRounded,
  AccountTreeRounded,
  SearchRounded,
  CheckCircleRounded,
  ErrorRounded,
  UpgradeRounded,
  VerifiedRounded,
  WarningAmberRounded,
  HelpOutlineRounded,
} from "@mui/icons-material";
import SeverityChip from "../components/SeverityChip";
import { findProjectById, projectDependencies } from "../data/mockData";
import type { Severity, Dependency } from "../data/types";

const severityOrder: Record<Severity, number> = { critical: 0, high: 1, medium: 2, low: 3 };
const severityColor: Record<Severity, string> = { critical: "#dc2626", high: "#f59e0b", medium: "#6366f1", low: "#22c55e" };

type SortField = "name" | "severity" | "score" | "license";
type SortDir = "asc" | "desc";
type FilterMode = "all" | "vulnerable" | "outdated" | "license-issue";

function highestSeverity(dep: Dependency): Severity | null {
  if (dep.cves.length === 0) return null;
  return dep.cves.reduce((worst, cve) =>
    severityOrder[cve.severity] < severityOrder[worst] ? cve.severity : worst,
    dep.cves[0].severity,
  );
}

function SeverityBadge({ severity }: { severity: Severity }) {
  const color = severityColor[severity];
  return (
    <Chip
      label={severity.charAt(0).toUpperCase() + severity.slice(1)}
      size="small"
      sx={{ height: 22, fontSize: "0.7rem", fontWeight: 700, bgcolor: alpha(color, 0.1), color, border: `1px solid ${alpha(color, 0.25)}` }}
    />
  );
}

export default function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const result = findProjectById(projectId ?? "");
  const deps = projectDependencies[projectId ?? ""] ?? [];

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterMode>("all");
  const [sortField, setSortField] = useState<SortField>("severity");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const filtered = useMemo(() => {
    let list = deps;

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (d) => d.name.toLowerCase().includes(q) || d.cves.some((c) => c.id.toLowerCase().includes(q)),
      );
    }

    if (filter === "vulnerable") list = list.filter((d) => d.cves.length > 0);
    else if (filter === "outdated") list = list.filter((d) => d.installedVersion !== d.latestVersion);
    else if (filter === "license-issue") list = list.filter((d) => !d.licenseCompliant);

    list = [...list].sort((a, b) => {
      let cmp = 0;
      if (sortField === "name") cmp = a.name.localeCompare(b.name);
      else if (sortField === "severity") {
        const sa = highestSeverity(a);
        const sb = highestSeverity(b);
        const ia = sa != null ? severityOrder[sa] : 99;
        const ib = sb != null ? severityOrder[sb] : 99;
        cmp = ia - ib;
      } else if (sortField === "score") {
        const ma = a.cves.length > 0 ? Math.max(...a.cves.map((c) => c.score)) : -1;
        const mb = b.cves.length > 0 ? Math.max(...b.cves.map((c) => c.score)) : -1;
        cmp = mb - ma;
      } else if (sortField === "license") {
        cmp = Number(a.licenseCompliant) - Number(b.licenseCompliant);
      }
      return sortDir === "desc" ? -cmp : cmp;
    });

    return list;
  }, [deps, search, filter, sortField, sortDir]);

  if (!result) {
    return (
      <Box sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h5" sx={{ mb: 1 }}>Project not found</Typography>
        <Button onClick={() => navigate("/app")} startIcon={<ArrowBackRounded />}>Back to Projects</Button>
      </Box>
    );
  }

  const { project, group } = result;
  const vulnDeps = deps.filter((d) => d.cves.length > 0).length;
  const outdatedDeps = deps.filter((d) => d.installedVersion !== d.latestVersion).length;
  const licenseIssues = deps.filter((d) => !d.licenseCompliant).length;

  return (
    <Box>
      {/* Back + breadcrumb */}
      <Button
        startIcon={<ArrowBackRounded />}
        onClick={() => navigate("/app")}
        sx={{ mb: 1.5, ml: -1, color: "#64748b", fontWeight: 500, fontSize: "0.82rem" }}
      >
        Back to Projects
      </Button>

      {/* Project header */}
      <Paper sx={{ p: 0, mb: 3, overflow: "hidden" }}>
        <Box sx={{ px: 3, py: 2.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
            <Typography variant="h4" sx={{ fontSize: "1.5rem" }}>{project.name}</Typography>
            <Chip label={`v${project.version}`} size="small" sx={{ height: 24, fontSize: "0.75rem", bgcolor: alpha("#94a3b8", 0.1), color: "#64748b" }} />
            <Chip label={group} size="small" sx={{ height: 24, fontSize: "0.7rem", fontWeight: 700, bgcolor: alpha("#3b82f6", 0.08), color: "#3b82f6" }} />
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#94a3b8" }}>
            <AccessTimeRounded sx={{ fontSize: 14 }} />
            <Typography sx={{ fontSize: "0.78rem" }}>
              Scanned {project.lastScanned} &middot; {project.scanDuration} &middot; {project.fileSize}
            </Typography>
          </Box>
        </Box>

        {/* Metrics strip */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            px: 3,
            py: 2,
            bgcolor: alpha("#f8fafc", 0.6),
            borderTop: "1px solid",
            borderColor: alpha("#94a3b8", 0.12),
            gap: 3,
          }}
        >
          {(["critical", "high", "medium", "low"] as Severity[]).map((s) => (
            <SeverityChip key={s} severity={s} count={project.vulnerabilities[s]} />
          ))}

          <Box sx={{ mx: 1, height: 40, borderLeft: "1px solid", borderColor: alpha("#94a3b8", 0.15) }} />

          <Box sx={{ textAlign: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, justifyContent: "center", mb: 0.3 }}>
              <AccountTreeRounded sx={{ fontSize: 15, color: "#94a3b8" }} />
              <Typography sx={{ fontWeight: 700, fontSize: "1.1rem" }}>{project.directDeps}</Typography>
            </Box>
            <Typography sx={{ fontSize: "0.65rem", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Direct</Typography>
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, justifyContent: "center", mb: 0.3 }}>
              <AccountTreeRounded sx={{ fontSize: 15, color: "#94a3b8", opacity: 0.6 }} />
              <Typography sx={{ fontWeight: 700, fontSize: "1.1rem" }}>{project.indirectDeps.toLocaleString()}</Typography>
            </Box>
            <Typography sx={{ fontSize: "0.65rem", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Indirect</Typography>
          </Box>

          <Box sx={{ ml: "auto", display: "flex", gap: 2 }}>
            {[
              { label: "Vulnerable", value: vulnDeps, color: "#dc2626" },
              { label: "Outdated", value: outdatedDeps, color: "#f59e0b" },
              { label: "License Issues", value: licenseIssues, color: licenseIssues > 0 ? "#dc2626" : "#22c55e" },
            ].map((s) => (
              <Box key={s.label} sx={{ textAlign: "center", minWidth: 70 }}>
                <Typography sx={{ fontWeight: 700, fontSize: "1.1rem", color: s.value > 0 ? s.color : "#1e293b" }}>{s.value}</Typography>
                <Typography sx={{ fontSize: "0.65rem", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Paper>

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
            placeholder="Search packages or CVEs..."
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
          <ToggleButton value="all">All ({deps.length})</ToggleButton>
          <ToggleButton value="vulnerable">Vulnerable ({vulnDeps})</ToggleButton>
          <ToggleButton value="outdated">Outdated ({outdatedDeps})</ToggleButton>
          <ToggleButton value="license-issue">License Issues ({licenseIssues})</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} sx={{ "& .MuiTableCell-root": { fontSize: "0.82rem", py: 1.5 } }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ "& .MuiTableCell-head": { fontWeight: 700, color: "#64748b", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em", bgcolor: alpha("#f8fafc", 0.8) } }}>
              <TableCell sx={{ width: 220 }}>
                <TableSortLabel active={sortField === "name"} direction={sortField === "name" ? sortDir : "asc"} onClick={() => handleSort("name")}>
                  Package
                </TableSortLabel>
              </TableCell>
              <TableCell>Installed</TableCell>
              <TableCell>Latest</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>
                <TableSortLabel active={sortField === "severity"} direction={sortField === "severity" ? sortDir : "asc"} onClick={() => handleSort("severity")}>
                  Severity
                </TableSortLabel>
              </TableCell>
              <TableCell>CVE</TableCell>
              <TableCell>
                <TableSortLabel active={sortField === "score"} direction={sortField === "score" ? sortDir : "asc"} onClick={() => handleSort("score")}>
                  CVSS
                </TableSortLabel>
              </TableCell>
              <TableCell>Fix Available</TableCell>
              <TableCell>
                <TableSortLabel active={sortField === "license"} direction={sortField === "license" ? sortDir : "asc"} onClick={() => handleSort("license")}>
                  License
                </TableSortLabel>
              </TableCell>
              <TableCell>Compliance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((dep) => {
              const hasCves = dep.cves.length > 0;
              const isOutdated = dep.installedVersion !== dep.latestVersion;
              const worstSev = highestSeverity(dep);
              // Render one row per CVE; if none, render one row for the package
              const rows = hasCves ? dep.cves : [null];

              return rows.map((cve, idx) => (
                <TableRow
                  key={`${dep.name}-${cve?.id ?? "clean"}-${idx}`}
                  sx={{
                    bgcolor: cve && severityOrder[cve.severity] <= 1 ? alpha(severityColor[cve.severity], 0.03) : "transparent",
                    "&:hover": { bgcolor: alpha("#3b82f6", 0.03) },
                    "& td": { borderColor: alpha("#94a3b8", 0.1) },
                  }}
                >
                  {/* Package — only on first row of group */}
                  {idx === 0 ? (
                    <TableCell rowSpan={rows.length} sx={{ fontWeight: 600, color: "#1e293b", verticalAlign: "top", borderRight: "1px solid", borderRightColor: alpha("#94a3b8", 0.08) }}>
                      {dep.name}
                    </TableCell>
                  ) : null}

                  {idx === 0 ? (
                    <TableCell rowSpan={rows.length} sx={{ verticalAlign: "top", fontFamily: "monospace", fontSize: "0.78rem !important" }}>
                      {dep.installedVersion}
                    </TableCell>
                  ) : null}

                  {idx === 0 ? (
                    <TableCell rowSpan={rows.length} sx={{ verticalAlign: "top" }}>
                      {isOutdated ? (
                        <Tooltip title="Update available" arrow>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <UpgradeRounded sx={{ fontSize: 16, color: "#f59e0b" }} />
                            <Typography sx={{ fontFamily: "monospace", fontSize: "0.78rem", color: "#f59e0b", fontWeight: 600 }}>{dep.latestVersion}</Typography>
                          </Box>
                        </Tooltip>
                      ) : (
                        <Typography sx={{ fontFamily: "monospace", fontSize: "0.78rem", color: "#94a3b8" }}>{dep.latestVersion}</Typography>
                      )}
                    </TableCell>
                  ) : null}

                  {idx === 0 ? (
                    <TableCell rowSpan={rows.length} sx={{ verticalAlign: "top" }}>
                      <Chip
                        label={dep.isDirect ? "Direct" : "Transitive"}
                        size="small"
                        sx={{
                          height: 22,
                          fontSize: "0.68rem",
                          fontWeight: 600,
                          bgcolor: dep.isDirect ? alpha("#3b82f6", 0.08) : alpha("#94a3b8", 0.08),
                          color: dep.isDirect ? "#3b82f6" : "#94a3b8",
                        }}
                      />
                    </TableCell>
                  ) : null}

                  {/* CVE-specific cells */}
                  <TableCell>
                    {cve ? <SeverityBadge severity={cve.severity} /> : (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <CheckCircleRounded sx={{ fontSize: 16, color: "#22c55e" }} />
                        <Typography sx={{ fontSize: "0.78rem", color: "#94a3b8" }}>Clean</Typography>
                      </Box>
                    )}
                  </TableCell>
                  <TableCell sx={{ fontFamily: "monospace", fontSize: "0.75rem !important", color: cve ? "#1e293b" : "#94a3b8" }}>
                    {cve?.id ?? "—"}
                  </TableCell>
                  <TableCell>
                    {cve ? (
                      <Typography sx={{ fontWeight: 700, fontSize: "0.82rem", color: severityColor[cve.severity] }}>
                        {cve.score.toFixed(1)}
                      </Typography>
                    ) : (
                      <Typography sx={{ color: "#94a3b8", fontSize: "0.82rem" }}>—</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {cve ? (
                      cve.fixVersion ? (
                        <Tooltip title={`Upgrade to ${cve.fixVersion}`} arrow>
                          <Chip
                            icon={<UpgradeRounded sx={{ fontSize: "14px !important" }} />}
                            label={cve.fixVersion}
                            size="small"
                            sx={{ height: 22, fontSize: "0.7rem", fontWeight: 600, bgcolor: alpha("#22c55e", 0.08), color: "#16a34a", "& .MuiChip-icon": { color: "#16a34a" } }}
                          />
                        </Tooltip>
                      ) : (
                        <Chip
                          label="No fix"
                          size="small"
                          sx={{ height: 22, fontSize: "0.7rem", fontWeight: 600, bgcolor: alpha("#94a3b8", 0.08), color: "#94a3b8" }}
                        />
                      )
                    ) : (
                      <Typography sx={{ color: "#94a3b8", fontSize: "0.82rem" }}>—</Typography>
                    )}
                  </TableCell>

                  {/* License — only first row */}
                  {idx === 0 ? (
                    <TableCell rowSpan={rows.length} sx={{ verticalAlign: "top", fontFamily: "monospace", fontSize: "0.75rem !important" }}>
                      {dep.license}
                    </TableCell>
                  ) : null}

                  {idx === 0 ? (
                    <TableCell rowSpan={rows.length} sx={{ verticalAlign: "top" }}>
                      {dep.licenseCompliant ? (
                        <Tooltip title="License approved" arrow>
                          <VerifiedRounded sx={{ fontSize: 20, color: "#22c55e" }} />
                        </Tooltip>
                      ) : (
                        <Tooltip title="License not approved" arrow>
                          <WarningAmberRounded sx={{ fontSize: 20, color: "#dc2626" }} />
                        </Tooltip>
                      )}
                    </TableCell>
                  ) : null}
                </TableRow>
              ));
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
