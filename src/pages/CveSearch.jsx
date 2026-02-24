import { useState, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  InputAdornment,
  Alert,
  Divider,
  Tooltip,
  alpha,
} from "@mui/material";
import {
  BugReportRounded,
  SearchRounded,
  CheckCircleRounded,
  WarningAmberRounded,
  ErrorRounded,
  UpgradeRounded,
  OpenInNewRounded,
  InfoOutlined,
} from "@mui/icons-material";

// ── Search type detection ──
function parseQuery(raw) {
  const q = raw.trim();
  if (/^CVE-\d{4}-\d+$/i.test(q)) return { type: "cve", value: q.toUpperCase() };
  const atIdx = q.lastIndexOf("@");
  if (atIdx > 0) {
    return { type: "library-version", name: q.slice(0, atIdx).toLowerCase(), version: q.slice(atIdx + 1) };
  }
  return { type: "library", name: q.toLowerCase() };
}

// ── Mock CVE database ──
const cveDatabase = {
  "CVE-2021-23337": {
    id: "CVE-2021-23337",
    severity: "critical",
    score: 9.8,
    summary: "Lodash command injection via template function",
    published: "2021-02-15",
    affectedPackage: "lodash",
    affectedVersions: "< 4.17.21",
    fixVersion: "4.17.21",
    epss: 0.042,
    cisaKev: false,
    references: ["NVD", "GitHub Advisory"],
    hits: [
      { project: "cairo-frontend", group: "CAIRO", installedVersion: "4.17.20", isDirect: true, lastScanned: "Feb 9, 2026, 10:17 AM", status: "failing", fixAvailable: true },
      { project: "platform-ui", group: "PLATFORM", installedVersion: "4.17.19", isDirect: true, lastScanned: "Feb 9, 2026, 10:02 AM", status: "failing", fixAvailable: true },
      { project: "platform-auth-service", group: "PLATFORM", installedVersion: "4.17.20", isDirect: false, lastScanned: "Feb 9, 2026, 7:15 AM", status: "failing", fixAvailable: true },
    ],
  },
  "CVE-2023-45857": {
    id: "CVE-2023-45857",
    severity: "high",
    score: 7.5,
    summary: "Axios cross-site request forgery via XSRF-TOKEN cookie exposure",
    published: "2023-11-08",
    affectedPackage: "axios",
    affectedVersions: ">= 0.8.1, < 1.6.0",
    fixVersion: "1.6.0",
    epss: 0.018,
    cisaKev: false,
    references: ["NVD", "GitHub Advisory", "Snyk"],
    hits: [
      { project: "cairo-frontend", group: "CAIRO", installedVersion: "0.21.1", isDirect: true, lastScanned: "Feb 9, 2026, 10:17 AM", status: "failing", fixAvailable: true },
      { project: "deepview-api-gateway", group: "DEEPVIEW", installedVersion: "0.27.2", isDirect: false, lastScanned: "Feb 9, 2026, 8:00 AM", status: "failing", fixAvailable: true },
    ],
  },
  "CVE-2024-29041": {
    id: "CVE-2024-29041",
    severity: "high",
    score: 7.1,
    summary: "Express.js open redirect vulnerability in response.redirect()",
    published: "2024-03-25",
    affectedPackage: "express",
    affectedVersions: "< 4.19.2",
    fixVersion: "4.19.2",
    epss: 0.009,
    cisaKev: false,
    references: ["NVD", "GitHub Advisory"],
    hits: [
      { project: "cairo-frontend", group: "CAIRO", installedVersion: "4.17.1", isDirect: true, lastScanned: "Feb 9, 2026, 10:17 AM", status: "failing", fixAvailable: true },
      { project: "platform-auth-service", group: "PLATFORM", installedVersion: "4.18.2", isDirect: true, lastScanned: "Feb 9, 2026, 7:15 AM", status: "failing", fixAvailable: true },
      { project: "deepview-api-gateway", group: "DEEPVIEW", installedVersion: "4.19.0", isDirect: true, lastScanned: "Feb 9, 2026, 8:00 AM", status: "warning", fixAvailable: true },
    ],
  },
  "CVE-2022-46175": {
    id: "CVE-2022-46175",
    severity: "high",
    score: 7.1,
    summary: "JSON5 prototype pollution via parse function",
    published: "2022-12-24",
    affectedPackage: "json5",
    affectedVersions: "< 1.0.2 || >= 2.0.0 < 2.2.2",
    fixVersion: "1.0.2",
    epss: 0.005,
    cisaKev: false,
    references: ["NVD", "GitHub Advisory"],
    hits: [
      { project: "cairo-frontend", group: "CAIRO", installedVersion: "1.0.1", isDirect: false, lastScanned: "Feb 9, 2026, 10:17 AM", status: "failing", fixAvailable: true },
      { project: "platform-ui", group: "PLATFORM", installedVersion: "1.0.1", isDirect: false, lastScanned: "Feb 9, 2026, 10:02 AM", status: "warning", fixAvailable: true },
    ],
  },
  "CVE-2022-25883": {
    id: "CVE-2022-25883",
    severity: "low",
    score: 3.7,
    summary: "semver regular expression denial of service (ReDoS)",
    published: "2022-06-20",
    affectedPackage: "semver",
    affectedVersions: "< 7.5.4",
    fixVersion: "7.5.4",
    epss: 0.002,
    cisaKev: false,
    references: ["NVD"],
    hits: [
      { project: "cairo-frontend", group: "CAIRO", installedVersion: "7.5.3", isDirect: false, lastScanned: "Feb 9, 2026, 10:17 AM", status: "failing", fixAvailable: true },
    ],
  },
  "CVE-2023-44270": {
    id: "CVE-2023-44270",
    severity: "low",
    score: 3.1,
    summary: "PostCSS newline-based parsing vulnerability in external source maps",
    published: "2023-09-29",
    affectedPackage: "postcss",
    affectedVersions: "< 8.4.32",
    fixVersion: "8.4.32",
    epss: 0.001,
    cisaKev: false,
    references: ["NVD", "GitHub Advisory"],
    hits: [
      { project: "cairo-frontend", group: "CAIRO", installedVersion: "8.4.31", isDirect: false, lastScanned: "Feb 9, 2026, 10:17 AM", status: "failing", fixAvailable: true },
      { project: "deepview-worker", group: "DEEPVIEW", installedVersion: "8.4.29", isDirect: false, lastScanned: "Feb 8, 2026, 11:22 PM", status: "passing", fixAvailable: true },
    ],
  },
};

// ── Mock library database ──
const libraryDatabase = {
  lodash: [
    { project: "cairo-frontend", group: "CAIRO", installedVersion: "4.17.20", isDirect: true, lastScanned: "Feb 9, 2026, 10:17 AM", status: "failing", cves: ["CVE-2021-23337"] },
    { project: "deepview-api-gateway", group: "DEEPVIEW", installedVersion: "4.17.21", isDirect: false, lastScanned: "Feb 9, 2026, 8:00 AM", status: "passing", cves: [] },
    { project: "platform-ui", group: "PLATFORM", installedVersion: "4.17.19", isDirect: true, lastScanned: "Feb 9, 2026, 10:02 AM", status: "failing", cves: ["CVE-2021-23337"] },
    { project: "cairo-api", group: "CAIRO", installedVersion: "4.17.21", isDirect: false, lastScanned: "Feb 9, 2026, 9:45 AM", status: "passing", cves: [] },
    { project: "platform-auth-service", group: "PLATFORM", installedVersion: "4.17.20", isDirect: false, lastScanned: "Feb 9, 2026, 7:15 AM", status: "failing", cves: ["CVE-2021-23337"] },
  ],
  axios: [
    { project: "cairo-frontend", group: "CAIRO", installedVersion: "0.21.1", isDirect: true, lastScanned: "Feb 9, 2026, 10:17 AM", status: "failing", cves: ["CVE-2023-45857"] },
    { project: "deepview-worker", group: "DEEPVIEW", installedVersion: "1.7.2", isDirect: true, lastScanned: "Feb 8, 2026, 11:22 PM", status: "passing", cves: [] },
    { project: "platform-auth-service", group: "PLATFORM", installedVersion: "1.6.0", isDirect: true, lastScanned: "Feb 9, 2026, 7:15 AM", status: "warning", cves: [] },
    { project: "deepview-api-gateway", group: "DEEPVIEW", installedVersion: "0.27.2", isDirect: false, lastScanned: "Feb 9, 2026, 8:00 AM", status: "failing", cves: ["CVE-2023-45857"] },
  ],
  express: [
    { project: "cairo-frontend", group: "CAIRO", installedVersion: "4.17.1", isDirect: true, lastScanned: "Feb 9, 2026, 10:17 AM", status: "failing", cves: ["CVE-2024-29041"] },
    { project: "cairo-api", group: "CAIRO", installedVersion: "4.21.0", isDirect: true, lastScanned: "Feb 9, 2026, 9:45 AM", status: "passing", cves: [] },
    { project: "deepview-api-gateway", group: "DEEPVIEW", installedVersion: "4.19.0", isDirect: true, lastScanned: "Feb 9, 2026, 8:00 AM", status: "warning", cves: ["CVE-2024-29041"] },
    { project: "platform-auth-service", group: "PLATFORM", installedVersion: "4.18.2", isDirect: true, lastScanned: "Feb 9, 2026, 7:15 AM", status: "failing", cves: ["CVE-2024-29041"] },
    { project: "deepview-worker", group: "DEEPVIEW", installedVersion: "4.21.0", isDirect: false, lastScanned: "Feb 8, 2026, 11:22 PM", status: "passing", cves: [] },
  ],
  json5: [
    { project: "cairo-frontend", group: "CAIRO", installedVersion: "1.0.1", isDirect: false, lastScanned: "Feb 9, 2026, 10:17 AM", status: "failing", cves: ["CVE-2022-46175"] },
    { project: "platform-ui", group: "PLATFORM", installedVersion: "1.0.1", isDirect: false, lastScanned: "Feb 9, 2026, 10:02 AM", status: "warning", cves: ["CVE-2022-46175"] },
    { project: "cairo-api", group: "CAIRO", installedVersion: "2.2.3", isDirect: false, lastScanned: "Feb 9, 2026, 9:45 AM", status: "passing", cves: [] },
  ],
  semver: [
    { project: "cairo-frontend", group: "CAIRO", installedVersion: "7.5.3", isDirect: false, lastScanned: "Feb 9, 2026, 10:17 AM", status: "failing", cves: ["CVE-2022-25883"] },
    { project: "deepview-api-gateway", group: "DEEPVIEW", installedVersion: "7.6.3", isDirect: false, lastScanned: "Feb 9, 2026, 8:00 AM", status: "passing", cves: [] },
    { project: "platform-ui", group: "PLATFORM", installedVersion: "7.6.3", isDirect: false, lastScanned: "Feb 9, 2026, 10:02 AM", status: "passing", cves: [] },
  ],
  postcss: [
    { project: "cairo-frontend", group: "CAIRO", installedVersion: "8.4.31", isDirect: false, lastScanned: "Feb 9, 2026, 10:17 AM", status: "failing", cves: ["CVE-2023-44270"] },
    { project: "deepview-worker", group: "DEEPVIEW", installedVersion: "8.4.29", isDirect: false, lastScanned: "Feb 8, 2026, 11:22 PM", status: "passing", cves: ["CVE-2023-44270"] },
    { project: "platform-ui", group: "PLATFORM", installedVersion: "8.4.47", isDirect: false, lastScanned: "Feb 9, 2026, 10:02 AM", status: "passing", cves: [] },
  ],
};

function getSearchResults(raw) {
  const parsed = parseQuery(raw);

  if (parsed.type === "cve") {
    const cve = cveDatabase[parsed.value];
    if (cve) return { kind: "cve", cve, hits: cve.hits };
    return { kind: "cve", cve: null, hits: [] };
  }

  const libName = parsed.name;
  let entries = null;
  for (const [key, results] of Object.entries(libraryDatabase)) {
    if (libName === key || key.includes(libName) || libName.includes(key)) {
      entries = { name: key, results };
      break;
    }
  }

  if (!entries) {
    // Generic fallback
    entries = {
      name: libName,
      results: [
        { project: "cairo-frontend", group: "CAIRO", installedVersion: "1.2.3", isDirect: false, lastScanned: "Feb 9, 2026, 10:17 AM", status: "warning", cves: [] },
        { project: "platform-ui", group: "PLATFORM", installedVersion: "1.2.3", isDirect: true, lastScanned: "Feb 9, 2026, 10:02 AM", status: "passing", cves: [] },
      ],
    };
  }

  if (parsed.type === "library-version") {
    const filtered = entries.results.filter((r) => r.installedVersion === parsed.version);
    return { kind: "library-version", libraryName: entries.name, version: parsed.version, hits: filtered, totalUnfiltered: entries.results.length };
  }

  return { kind: "library", libraryName: entries.name, hits: entries.results };
}

const severityColor = { critical: "#dc2626", high: "#f59e0b", medium: "#6366f1", low: "#22c55e" };

const statusConfig = {
  passing: { label: "Passing", color: "#22c55e", icon: <CheckCircleRounded sx={{ fontSize: 16 }} /> },
  warning: { label: "Warning", color: "#f59e0b", icon: <WarningAmberRounded sx={{ fontSize: 16 }} /> },
  failing: { label: "Failing", color: "#dc2626", icon: <ErrorRounded sx={{ fontSize: 16 }} /> },
};

function CveDetailCard({ cve }) {
  const sevColor = severityColor[cve.severity];
  return (
    <Paper sx={{ p: 0, mb: 3, overflow: "hidden" }}>
      <Box sx={{ px: 3, py: 2.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
          <Typography sx={{ fontWeight: 700, fontSize: "1.15rem", fontFamily: "monospace" }}>{cve.id}</Typography>
          <Chip
            label={cve.severity.charAt(0).toUpperCase() + cve.severity.slice(1)}
            size="small"
            sx={{ height: 24, fontSize: "0.72rem", fontWeight: 700, bgcolor: alpha(sevColor, 0.1), color: sevColor, border: `1px solid ${alpha(sevColor, 0.25)}` }}
          />
          <Chip
            label={`CVSS ${cve.score.toFixed(1)}`}
            size="small"
            sx={{ height: 24, fontSize: "0.72rem", fontWeight: 700, bgcolor: alpha(sevColor, 0.08), color: sevColor }}
          />
          {cve.cisaKev && (
            <Chip
              label="CISA KEV"
              size="small"
              sx={{ height: 24, fontSize: "0.68rem", fontWeight: 700, bgcolor: alpha("#dc2626", 0.1), color: "#dc2626", border: `1px solid ${alpha("#dc2626", 0.25)}` }}
            />
          )}
        </Box>
        <Typography sx={{ fontSize: "0.88rem", color: "#475569", mt: 1, lineHeight: 1.5 }}>
          {cve.summary}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 3,
          px: 3,
          py: 2,
          bgcolor: alpha("#f8fafc", 0.6),
          borderTop: "1px solid",
          borderColor: alpha("#94a3b8", 0.12),
          flexWrap: "wrap",
        }}
      >
        {[
          { label: "Package", value: cve.affectedPackage },
          { label: "Affected Versions", value: cve.affectedVersions },
          { label: "Fix Version", value: cve.fixVersion, color: "#16a34a" },
          { label: "Published", value: cve.published },
          { label: "EPSS", value: `${(cve.epss * 100).toFixed(1)}%` },
          { label: "Sources", value: cve.references.join(", ") },
        ].map((item) => (
          <Box key={item.label} sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: "0.65rem", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {item.label}
            </Typography>
            <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, color: item.color || "#1e293b", fontFamily: item.label === "Package" || item.label === "Fix Version" ? "monospace" : "inherit" }}>
              {item.value}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}

function CveHitsTable({ hits, showPackageInfo }) {
  return (
    <TableContainer component={Paper} sx={{ "& .MuiTableCell-root": { fontSize: "0.82rem", py: 1.5 } }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ "& .MuiTableCell-head": { fontWeight: 700, color: "#64748b", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em", bgcolor: alpha("#f8fafc", 0.8) } }}>
            <TableCell>Project</TableCell>
            <TableCell>Group</TableCell>
            <TableCell>Installed Version</TableCell>
            <TableCell>Type</TableCell>
            {showPackageInfo && <TableCell>CVEs</TableCell>}
            <TableCell>Scan Status</TableCell>
            {!showPackageInfo && <TableCell>Fix Available</TableCell>}
            <TableCell>Last Scanned</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {hits.map((hit) => {
            const sc = statusConfig[hit.status];
            return (
              <TableRow
                key={`${hit.project}-${hit.installedVersion}`}
                sx={{
                  "&:hover": { bgcolor: alpha("#3b82f6", 0.03) },
                  "& td": { borderColor: alpha("#94a3b8", 0.1) },
                }}
              >
                <TableCell sx={{ fontWeight: 600, color: "#1e293b" }}>{hit.project}</TableCell>
                <TableCell>
                  <Chip label={hit.group} size="small" sx={{ height: 22, fontSize: "0.68rem", fontWeight: 700, bgcolor: alpha("#3b82f6", 0.08), color: "#3b82f6" }} />
                </TableCell>
                <TableCell sx={{ fontFamily: "monospace", fontSize: "0.78rem !important", fontWeight: 600 }}>
                  {hit.installedVersion}
                </TableCell>
                <TableCell>
                  <Chip
                    label={hit.isDirect ? "Direct" : "Transitive"}
                    size="small"
                    sx={{
                      height: 22,
                      fontSize: "0.68rem",
                      fontWeight: 600,
                      bgcolor: hit.isDirect ? alpha("#3b82f6", 0.08) : alpha("#94a3b8", 0.08),
                      color: hit.isDirect ? "#3b82f6" : "#94a3b8",
                    }}
                  />
                </TableCell>
                {showPackageInfo && (
                  <TableCell>
                    {hit.cves && hit.cves.length > 0 ? (
                      <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                        {hit.cves.map((cveId) => (
                          <Chip
                            key={cveId}
                            label={cveId}
                            size="small"
                            sx={{ height: 22, fontSize: "0.65rem", fontWeight: 600, bgcolor: alpha("#dc2626", 0.08), color: "#dc2626", fontFamily: "monospace" }}
                          />
                        ))}
                      </Box>
                    ) : (
                      <CheckCircleRounded sx={{ fontSize: 18, color: "#22c55e" }} />
                    )}
                  </TableCell>
                )}
                <TableCell>
                  <Chip
                    icon={sc.icon}
                    label={sc.label}
                    size="small"
                    sx={{ height: 24, fontSize: "0.72rem", fontWeight: 600, bgcolor: alpha(sc.color, 0.1), color: sc.color, "& .MuiChip-icon": { ml: 0.5 } }}
                  />
                </TableCell>
                {!showPackageInfo && (
                  <TableCell>
                    {hit.fixAvailable ? (
                      <Tooltip title="Patch available" arrow>
                        <Chip
                          icon={<UpgradeRounded sx={{ fontSize: "14px !important" }} />}
                          label="Yes"
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
                    )}
                  </TableCell>
                )}
                <TableCell sx={{ color: "#94a3b8", fontSize: "0.78rem !important", whiteSpace: "nowrap" }}>
                  {hit.lastScanned}
                </TableCell>
              </TableRow>
            );
          })}
          {hits.length === 0 && (
            <TableRow>
              <TableCell colSpan={showPackageInfo ? 7 : 7} sx={{ py: 6, textAlign: "center" }}>
                <Typography sx={{ color: "#94a3b8", fontSize: "0.9rem" }}>No matching results found</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default function CveSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchedTerm, setSearchedTerm] = useState("");

  const handleSearch = useCallback(() => {
    if (!query.trim()) return;
    setLoading(true);
    setResults(null);
    setSearchedTerm(query.trim());
    setTimeout(() => {
      setResults(getSearchResults(query));
      setLoading(false);
    }, 900 + Math.random() * 700);
  }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontSize: "1.65rem", mb: 0.3 }}>
          CVE Search
        </Typography>
        <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>
          Search by CVE ID, library name, or library@version to find affected projects across your scans
        </Typography>
      </Box>

      {/* Search bar */}
      <Paper sx={{ p: 3, mb: 3, maxWidth: 780 }}>
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="CVE-2021-23337, axios, or express@4.17.1"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRounded sx={{ color: "#94a3b8", fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={!query.trim() || loading}
            sx={{ px: 3, minWidth: 100, boxShadow: "none", "&:hover": { boxShadow: "none" } }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : "Search"}
          </Button>
        </Box>

        {/* Input hints */}
        <Box sx={{ display: "flex", gap: 1.5, mt: 2, flexWrap: "wrap" }}>
          {[
            { label: "CVE-2021-23337", desc: "CVE ID" },
            { label: "axios", desc: "Library name" },
            { label: "express@4.17.1", desc: "Library + version" },
          ].map((hint) => (
            <Chip
              key={hint.label}
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  <Typography component="span" sx={{ fontFamily: "monospace", fontSize: "0.75rem", fontWeight: 600 }}>{hint.label}</Typography>
                  <Typography component="span" sx={{ fontSize: "0.68rem", color: "#94a3b8" }}>{hint.desc}</Typography>
                </Box>
              }
              size="small"
              onClick={() => { setQuery(hint.label); }}
              sx={{
                height: 28,
                bgcolor: alpha("#94a3b8", 0.06),
                border: "1px dashed",
                borderColor: alpha("#94a3b8", 0.2),
                cursor: "pointer",
                "&:hover": { bgcolor: alpha("#94a3b8", 0.1) },
              }}
            />
          ))}
        </Box>
      </Paper>

      {/* Empty state */}
      {results === null && !loading && (
        <Paper sx={{ py: 8, textAlign: "center" }}>
          <BugReportRounded sx={{ fontSize: 48, color: alpha("#94a3b8", 0.3), mb: 2 }} />
          <Typography sx={{ fontSize: "1rem", fontWeight: 600, color: "#64748b", mb: 0.5 }}>
            Search CVEs and libraries
          </Typography>
          <Typography sx={{ fontSize: "0.85rem", color: "#94a3b8", maxWidth: 420, mx: "auto", lineHeight: 1.6 }}>
            Enter a CVE ID to see which projects are affected, or search by library name to find all projects using it. Use <code>name@version</code> to filter to a specific version.
          </Typography>
        </Paper>
      )}

      {/* Loading state */}
      {loading && (
        <Paper sx={{ py: 6, textAlign: "center" }}>
          <CircularProgress size={32} sx={{ mb: 2 }} />
          <Typography sx={{ fontSize: "0.85rem", color: "#64748b" }}>
            Searching scans for &ldquo;{searchedTerm}&rdquo;...
          </Typography>
        </Paper>
      )}

      {/* ── CVE Results ── */}
      {results?.kind === "cve" && !loading && (
        <>
          {results.cve ? (
            <>
              <CveDetailCard cve={results.cve} />

              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <Typography sx={{ fontWeight: 600, fontSize: "0.95rem" }}>
                  Affected Projects
                </Typography>
                <Chip
                  label={`${results.hits.length} ${results.hits.length === 1 ? "project" : "projects"}`}
                  size="small"
                  sx={{ height: 24, fontSize: "0.72rem", fontWeight: 700, bgcolor: alpha("#dc2626", 0.08), color: "#dc2626" }}
                />
              </Box>

              <CveHitsTable hits={results.hits} showPackageInfo={false} />
            </>
          ) : (
            <Paper sx={{ py: 6, textAlign: "center" }}>
              <CheckCircleRounded sx={{ fontSize: 48, color: alpha("#22c55e", 0.4), mb: 2 }} />
              <Typography sx={{ fontSize: "1rem", fontWeight: 600, color: "#64748b", mb: 0.5 }}>
                No results for {searchedTerm}
              </Typography>
              <Typography sx={{ fontSize: "0.85rem", color: "#94a3b8" }}>
                This CVE was not found in any of your scanned projects
              </Typography>
            </Paper>
          )}
        </>
      )}

      {/* ── Library Results ── */}
      {results?.kind === "library" && !loading && (
        <>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Typography sx={{ fontWeight: 600, fontSize: "0.95rem" }}>
              All versions of <Box component="span" sx={{ fontFamily: "monospace", bgcolor: alpha("#94a3b8", 0.1), px: 0.8, py: 0.2, borderRadius: 1 }}>{results.libraryName}</Box>
            </Typography>
            <Chip
              label={`${results.hits.length} ${results.hits.length === 1 ? "project" : "projects"}`}
              size="small"
              sx={{ height: 24, fontSize: "0.72rem", fontWeight: 700, bgcolor: alpha("#3b82f6", 0.08), color: "#3b82f6" }}
            />
            {results.hits.filter((h) => h.cves.length > 0).length > 0 && (
              <Chip
                label={`${results.hits.filter((h) => h.cves.length > 0).length} vulnerable`}
                size="small"
                sx={{ height: 24, fontSize: "0.72rem", fontWeight: 700, bgcolor: alpha("#dc2626", 0.08), color: "#dc2626" }}
              />
            )}
          </Box>

          <CveHitsTable hits={results.hits} showPackageInfo />
        </>
      )}

      {/* ── Library@Version Results ── */}
      {results?.kind === "library-version" && !loading && (
        <>
          <Alert
            icon={<InfoOutlined sx={{ fontSize: 20 }} />}
            severity="info"
            sx={{
              mb: 2,
              bgcolor: alpha("#3b82f6", 0.05),
              border: "1px solid",
              borderColor: alpha("#3b82f6", 0.15),
              color: "#1e293b",
              "& .MuiAlert-icon": { color: "#3b82f6" },
              borderRadius: 2,
            }}
          >
            <Typography sx={{ fontSize: "0.82rem" }}>
              Showing only projects with <strong>{results.libraryName}@{results.version}</strong> installed.
              {results.totalUnfiltered > results.hits.length && (
                <> {results.totalUnfiltered} projects use this library across all versions.</>
              )}
            </Typography>
          </Alert>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Typography sx={{ fontWeight: 600, fontSize: "0.95rem" }}>
              Exact match for{" "}
              <Box component="span" sx={{ fontFamily: "monospace", bgcolor: alpha("#94a3b8", 0.1), px: 0.8, py: 0.2, borderRadius: 1 }}>
                {results.libraryName}@{results.version}
              </Box>
            </Typography>
            <Chip
              label={`${results.hits.length} ${results.hits.length === 1 ? "match" : "matches"}`}
              size="small"
              sx={{ height: 24, fontSize: "0.72rem", fontWeight: 700, bgcolor: alpha("#6366f1", 0.08), color: "#6366f1" }}
            />
          </Box>

          <CveHitsTable hits={results.hits} showPackageInfo />
        </>
      )}
    </Box>
  );
}
