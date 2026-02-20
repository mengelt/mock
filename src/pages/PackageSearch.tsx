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
  alpha,
} from "@mui/material";
import {
  SearchRounded,
  InventoryRounded,
  CheckCircleRounded,
  WarningAmberRounded,
  ErrorRounded,
} from "@mui/icons-material";

interface SearchResult {
  project: string;
  group: string;
  installedVersion: string;
  latestVersion: string;
  isDirect: boolean;
  lastScanned: string;
  status: "passing" | "warning" | "failing";
  cveCount: number;
}

const fakeResults: Record<string, SearchResult[]> = {
  lodash: [
    { project: "cairo-frontend", group: "CAIRO", installedVersion: "4.17.20", latestVersion: "4.17.21", isDirect: true, lastScanned: "Feb 9, 2026, 10:17 AM", status: "failing", cveCount: 1 },
    { project: "deepview-api-gateway", group: "DEEPVIEW", installedVersion: "4.17.21", latestVersion: "4.17.21", isDirect: false, lastScanned: "Feb 9, 2026, 8:00 AM", status: "passing", cveCount: 0 },
    { project: "platform-ui", group: "PLATFORM", installedVersion: "4.17.19", latestVersion: "4.17.21", isDirect: true, lastScanned: "Feb 9, 2026, 10:02 AM", status: "failing", cveCount: 2 },
    { project: "cairo-api", group: "CAIRO", installedVersion: "4.17.21", latestVersion: "4.17.21", isDirect: false, lastScanned: "Feb 9, 2026, 9:45 AM", status: "passing", cveCount: 0 },
  ],
  axios: [
    { project: "cairo-frontend", group: "CAIRO", installedVersion: "0.21.1", latestVersion: "1.7.2", isDirect: true, lastScanned: "Feb 9, 2026, 10:17 AM", status: "failing", cveCount: 1 },
    { project: "deepview-worker", group: "DEEPVIEW", installedVersion: "1.7.2", latestVersion: "1.7.2", isDirect: true, lastScanned: "Feb 8, 2026, 11:22 PM", status: "passing", cveCount: 0 },
    { project: "platform-auth-service", group: "PLATFORM", installedVersion: "1.6.0", latestVersion: "1.7.2", isDirect: true, lastScanned: "Feb 9, 2026, 7:15 AM", status: "warning", cveCount: 0 },
  ],
  express: [
    { project: "cairo-frontend", group: "CAIRO", installedVersion: "4.17.1", latestVersion: "4.21.0", isDirect: true, lastScanned: "Feb 9, 2026, 10:17 AM", status: "failing", cveCount: 1 },
    { project: "cairo-api", group: "CAIRO", installedVersion: "4.21.0", latestVersion: "4.21.0", isDirect: true, lastScanned: "Feb 9, 2026, 9:45 AM", status: "passing", cveCount: 0 },
    { project: "deepview-api-gateway", group: "DEEPVIEW", installedVersion: "4.19.2", latestVersion: "4.21.0", isDirect: true, lastScanned: "Feb 9, 2026, 8:00 AM", status: "warning", cveCount: 0 },
    { project: "platform-auth-service", group: "PLATFORM", installedVersion: "4.18.2", latestVersion: "4.21.0", isDirect: true, lastScanned: "Feb 9, 2026, 7:15 AM", status: "failing", cveCount: 2 },
    { project: "deepview-worker", group: "DEEPVIEW", installedVersion: "4.21.0", latestVersion: "4.21.0", isDirect: false, lastScanned: "Feb 8, 2026, 11:22 PM", status: "passing", cveCount: 0 },
  ],
  react: [
    { project: "cairo-frontend", group: "CAIRO", installedVersion: "18.3.1", latestVersion: "18.3.1", isDirect: true, lastScanned: "Feb 9, 2026, 10:17 AM", status: "passing", cveCount: 0 },
    { project: "platform-ui", group: "PLATFORM", installedVersion: "18.3.1", latestVersion: "18.3.1", isDirect: true, lastScanned: "Feb 9, 2026, 10:02 AM", status: "passing", cveCount: 0 },
  ],
};

// For any query not in the fake map, generate some results
function getResults(query: string): SearchResult[] {
  const q = query.toLowerCase().trim();
  for (const [key, results] of Object.entries(fakeResults)) {
    if (q.includes(key) || key.includes(q)) return results;
  }
  // Fallback: return generic results for any non-empty query
  return [
    { project: "cairo-frontend", group: "CAIRO", installedVersion: "1.2.3", latestVersion: "2.0.0", isDirect: false, lastScanned: "Feb 9, 2026, 10:17 AM", status: "warning", cveCount: 0 },
    { project: "platform-ui", group: "PLATFORM", installedVersion: "2.0.0", latestVersion: "2.0.0", isDirect: true, lastScanned: "Feb 9, 2026, 10:02 AM", status: "passing", cveCount: 0 },
  ];
}

const statusConfig = {
  passing: { label: "Passing", color: "#22c55e", icon: <CheckCircleRounded sx={{ fontSize: 16 }} /> },
  warning: { label: "Warning", color: "#f59e0b", icon: <WarningAmberRounded sx={{ fontSize: 16 }} /> },
  failing: { label: "Failing", color: "#dc2626", icon: <ErrorRounded sx={{ fontSize: 16 }} /> },
};

export default function PackageSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchedTerm, setSearchedTerm] = useState("");

  const handleSearch = useCallback(() => {
    if (!query.trim()) return;
    setLoading(true);
    setResults(null);
    setSearchedTerm(query.trim());
    // Fake async delay
    setTimeout(() => {
      setResults(getResults(query));
      setLoading(false);
    }, 800 + Math.random() * 600);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const outdatedCount = results?.filter((r) => r.installedVersion !== r.latestVersion).length ?? 0;
  const vulnCount = results?.filter((r) => r.cveCount > 0).length ?? 0;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontSize: "1.65rem", mb: 0.3 }}>
          Package Search
        </Typography>
        <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>
          Search for a package to see which projects are using it and their current version status
        </Typography>
      </Box>

      {/* Search bar */}
      <Paper sx={{ p: 3, mb: 3, maxWidth: 720 }}>
        <Box sx={{ display: "flex", gap: 1.5 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Enter a package name (e.g., lodash, axios, express, react)"
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
            sx={{
              px: 3,
              minWidth: 100,
              boxShadow: "none",
              "&:hover": { boxShadow: "none" },
            }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : "Search"}
          </Button>
        </Box>
      </Paper>

      {/* Empty state */}
      {results === null && !loading && (
        <Paper sx={{ py: 8, textAlign: "center" }}>
          <InventoryRounded sx={{ fontSize: 48, color: alpha("#94a3b8", 0.3), mb: 2 }} />
          <Typography sx={{ fontSize: "1rem", fontWeight: 600, color: "#64748b", mb: 0.5 }}>
            Search for a package
          </Typography>
          <Typography sx={{ fontSize: "0.85rem", color: "#94a3b8" }}>
            Enter a package name above to find which projects depend on it
          </Typography>
        </Paper>
      )}

      {/* Loading state */}
      {loading && (
        <Paper sx={{ py: 6, textAlign: "center" }}>
          <CircularProgress size={32} sx={{ mb: 2 }} />
          <Typography sx={{ fontSize: "0.85rem", color: "#64748b" }}>
            Searching scans for "{searchedTerm}"...
          </Typography>
        </Paper>
      )}

      {/* Results */}
      {results !== null && !loading && (
        <>
          {/* Summary chips */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Typography sx={{ fontWeight: 600, fontSize: "0.95rem" }}>
              Results for <Box component="span" sx={{ fontFamily: "monospace", bgcolor: alpha("#94a3b8", 0.1), px: 0.8, py: 0.2, borderRadius: 1 }}>{searchedTerm}</Box>
            </Typography>
            <Chip
              label={`${results.length} ${results.length === 1 ? "project" : "projects"}`}
              size="small"
              sx={{ height: 24, fontSize: "0.72rem", fontWeight: 700, bgcolor: alpha("#3b82f6", 0.08), color: "#3b82f6" }}
            />
            {outdatedCount > 0 && (
              <Chip
                label={`${outdatedCount} outdated`}
                size="small"
                sx={{ height: 24, fontSize: "0.72rem", fontWeight: 700, bgcolor: alpha("#f59e0b", 0.08), color: "#f59e0b" }}
              />
            )}
            {vulnCount > 0 && (
              <Chip
                label={`${vulnCount} vulnerable`}
                size="small"
                sx={{ height: 24, fontSize: "0.72rem", fontWeight: 700, bgcolor: alpha("#dc2626", 0.08), color: "#dc2626" }}
              />
            )}
          </Box>

          <TableContainer component={Paper} sx={{ "& .MuiTableCell-root": { fontSize: "0.82rem", py: 1.5 } }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ "& .MuiTableCell-head": { fontWeight: 700, color: "#64748b", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em", bgcolor: alpha("#f8fafc", 0.8) } }}>
                  <TableCell>Project</TableCell>
                  <TableCell>Group</TableCell>
                  <TableCell>Installed Version</TableCell>
                  <TableCell>Latest Version</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>CVEs</TableCell>
                  <TableCell>Scan Status</TableCell>
                  <TableCell>Last Scanned</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {results.map((r) => {
                  const isOutdated = r.installedVersion !== r.latestVersion;
                  const sc = statusConfig[r.status];
                  return (
                    <TableRow
                      key={r.project}
                      sx={{
                        "&:hover": { bgcolor: alpha("#3b82f6", 0.03) },
                        "& td": { borderColor: alpha("#94a3b8", 0.1) },
                      }}
                    >
                      <TableCell sx={{ fontWeight: 600, color: "#1e293b" }}>{r.project}</TableCell>
                      <TableCell>
                        <Chip
                          label={r.group}
                          size="small"
                          sx={{ height: 22, fontSize: "0.68rem", fontWeight: 700, bgcolor: alpha("#3b82f6", 0.08), color: "#3b82f6" }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontFamily: "monospace", fontSize: "0.78rem !important", fontWeight: isOutdated ? 700 : 400, color: isOutdated ? "#f59e0b" : "#1e293b" }}>
                        {r.installedVersion}
                      </TableCell>
                      <TableCell sx={{ fontFamily: "monospace", fontSize: "0.78rem !important", color: "#94a3b8" }}>
                        {r.latestVersion}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={r.isDirect ? "Direct" : "Transitive"}
                          size="small"
                          sx={{
                            height: 22,
                            fontSize: "0.68rem",
                            fontWeight: 600,
                            bgcolor: r.isDirect ? alpha("#3b82f6", 0.08) : alpha("#94a3b8", 0.08),
                            color: r.isDirect ? "#3b82f6" : "#94a3b8",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {r.cveCount > 0 ? (
                          <Chip
                            label={r.cveCount}
                            size="small"
                            sx={{ height: 22, fontSize: "0.72rem", fontWeight: 700, bgcolor: alpha("#dc2626", 0.08), color: "#dc2626", minWidth: 32 }}
                          />
                        ) : (
                          <CheckCircleRounded sx={{ fontSize: 18, color: "#22c55e" }} />
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={sc.icon}
                          label={sc.label}
                          size="small"
                          sx={{ height: 24, fontSize: "0.72rem", fontWeight: 600, bgcolor: alpha(sc.color, 0.1), color: sc.color, "& .MuiChip-icon": { ml: 0.5 } }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: "#94a3b8", fontSize: "0.78rem !important", whiteSpace: "nowrap" }}>
                        {r.lastScanned}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
}
