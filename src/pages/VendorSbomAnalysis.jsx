import { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Divider,
  Tooltip,
  Collapse,
  IconButton,
  alpha,
} from "@mui/material";
import {
  FactCheckRounded,
  CloudUploadRounded,
  InfoOutlined,
  InsertDriveFileRounded,
  DeleteRounded,
  CheckCircleRounded,
  ErrorRounded,
  WarningAmberRounded,
  UpgradeRounded,
  SecurityRounded,
  BugReportRounded,
  GavelRounded,
  AccountTreeRounded,
  ExpandMoreRounded,
  ExpandLessRounded,
  DownloadRounded,
  ReplayRounded,
} from "@mui/icons-material";
import { useAppTheme } from "../theme/ThemeContext";

// ── Analysis phases shown in progress ──
const phases = [
  { key: "parse", label: "Parsing SBOM", pct: 15 },
  { key: "identify", label: "Identifying components", pct: 35 },
  { key: "vuln", label: "Checking vulnerabilities", pct: 60 },
  { key: "license", label: "Evaluating licenses", pct: 80 },
  { key: "risk", label: "Calculating risk score", pct: 95 },
  { key: "done", label: "Analysis complete", pct: 100 },
];

// ── Mock results ──
const mockResult = {
  fileName: null, // set dynamically
  format: "CycloneDX",
  specVersion: "1.5",
  vendor: "Acme Corp",
  product: "Acme Payments Gateway",
  productVersion: "3.8.1",
  generatedAt: "Feb 8, 2026, 2:14 PM",
  analyzedAt: null, // set dynamically
  totalComponents: 342,
  directDeps: 48,
  transitiveDeps: 294,
  riskScore: 72,
  grade: "C",
  gradeColor: "#f59e0b",
  summary: {
    critical: 4,
    high: 9,
    medium: 12,
    low: 18,
    licenseNonCompliant: 5,
    licenseUnknown: 8,
    outdated: 67,
  },
  vulnerabilities: [
    { package: "log4j-core", version: "2.14.1", cveId: "CVE-2021-44228", severity: "critical", score: 10.0, summary: "Log4Shell — remote code execution via JNDI lookup", fixVersion: "2.17.1", epss: 0.975, cisaKev: true },
    { package: "log4j-core", version: "2.14.1", cveId: "CVE-2021-45046", severity: "critical", score: 9.0, summary: "Log4j incomplete fix for CVE-2021-44228 in certain non-default configurations", fixVersion: "2.17.1", epss: 0.412, cisaKev: true },
    { package: "spring-web", version: "5.3.18", cveId: "CVE-2022-22965", severity: "critical", score: 9.8, summary: "Spring4Shell — RCE via data binding on JDK 9+", fixVersion: "5.3.20", epss: 0.891, cisaKev: true },
    { package: "commons-text", version: "1.9", cveId: "CVE-2022-42889", severity: "critical", score: 9.8, summary: "Apache Commons Text — arbitrary code execution via StringSubstitutor", fixVersion: "1.10.0", epss: 0.321, cisaKev: false },
    { package: "jackson-databind", version: "2.13.2", cveId: "CVE-2022-42003", severity: "high", score: 7.5, summary: "Deeply nested JSON leads to resource exhaustion", fixVersion: "2.13.4.2", epss: 0.034, cisaKev: false },
    { package: "jackson-databind", version: "2.13.2", cveId: "CVE-2022-42004", severity: "high", score: 7.5, summary: "Unchecked deserialization via BeanDeserializer", fixVersion: "2.13.4", epss: 0.028, cisaKev: false },
    { package: "netty-handler", version: "4.1.77", cveId: "CVE-2023-34462", severity: "high", score: 7.5, summary: "SniHandler infinite-length client hello DoS", fixVersion: "4.1.94", epss: 0.015, cisaKev: false },
    { package: "snakeyaml", version: "1.30", cveId: "CVE-2022-1471", severity: "high", score: 8.3, summary: "Unsafe deserialization in SnakeYAML Constructor", fixVersion: "2.0", epss: 0.089, cisaKev: false },
    { package: "guava", version: "30.1.1-jre", cveId: "CVE-2023-2976", severity: "high", score: 7.1, summary: "Guava temp directory creation uses insecure permissions", fixVersion: "32.0.0", epss: 0.011, cisaKev: false },
    { package: "protobuf-java", version: "3.19.4", cveId: "CVE-2022-3509", severity: "high", score: 7.5, summary: "Protobuf text format parsing timeout", fixVersion: "3.21.7", epss: 0.007, cisaKev: false },
    { package: "tomcat-embed-core", version: "9.0.62", cveId: "CVE-2023-28709", severity: "high", score: 7.5, summary: "Apache Tomcat denial of service via incomplete cleanup", fixVersion: "9.0.74", epss: 0.019, cisaKev: false },
    { package: "gson", version: "2.8.9", cveId: "CVE-2022-25647", severity: "high", score: 7.5, summary: "Gson deserialization of untrusted data", fixVersion: "2.8.9", epss: 0.005, cisaKev: false },
    { package: "h2", version: "2.1.210", cveId: "CVE-2022-45868", severity: "high", score: 7.8, summary: "H2 Console remote code execution via JDBC URL", fixVersion: "2.2.220", epss: 0.062, cisaKev: false },
    { package: "spring-security-core", version: "5.7.1", cveId: "CVE-2022-31692", severity: "medium", score: 5.3, summary: "Authorization bypass via forward or include dispatch", fixVersion: "5.7.5", epss: 0.004, cisaKev: false },
    { package: "postgresql", version: "42.3.3", cveId: "CVE-2022-41946", severity: "medium", score: 5.5, summary: "PGJDBC local info disclosure via temp file creation", fixVersion: "42.5.1", epss: 0.003, cisaKev: false },
    { package: "bouncy-castle", version: "1.70", cveId: "CVE-2023-33201", severity: "medium", score: 5.3, summary: "Bouncy Castle LDAP injection via X.500 name processing", fixVersion: "1.74", epss: 0.002, cisaKev: false },
  ],
  licenseIssues: [
    { package: "mongo-java-driver", version: "3.12.11", license: "SSPL-1.0", reason: "Server Side Public License — viral copyleft terms", risk: "high" },
    { package: "itext-pdf", version: "5.5.13.3", license: "AGPL-3.0", reason: "Affero GPL — requires source disclosure for network use", risk: "high" },
    { package: "json-lib", version: "2.4", license: "Unknown", reason: "No machine-readable license found in SBOM or registry", risk: "medium" },
    { package: "xml-security-impl", version: "1.0", license: "CDDL-1.0", reason: "CDDL has patent retaliation clause incompatible with internal policy", risk: "medium" },
    { package: "javax.mail", version: "1.6.2", license: "CDDL-1.1 + GPL-2.0-with-classpath-exception", reason: "Dual-licensed — requires review for distribution compliance", risk: "low" },
    { package: "asm", version: "9.3", license: "Unknown", reason: "License field missing from SBOM component entry", risk: "medium" },
    { package: "javassist", version: "3.28.0-GA", license: "MPL-1.1 / LGPL-2.1 / Apache-2.0", reason: "Tri-licensed — acceptable but needs usage-mode assessment", risk: "low" },
    { package: "caffeine", version: "3.0.6", license: "Unknown", reason: "License field empty — resolved manually as Apache-2.0", risk: "low" },
  ],
  outdatedHighlights: [
    { package: "log4j-core", installed: "2.14.1", latest: "2.23.0", behind: "Major" },
    { package: "spring-web", installed: "5.3.18", latest: "6.1.4", behind: "Major" },
    { package: "jackson-databind", installed: "2.13.2", latest: "2.16.1", behind: "Minor" },
    { package: "netty-handler", installed: "4.1.77", latest: "4.1.107", behind: "Patch" },
    { package: "snakeyaml", installed: "1.30", latest: "2.2", behind: "Major" },
    { package: "guava", installed: "30.1.1-jre", latest: "33.0.0-jre", behind: "Major" },
    { package: "tomcat-embed-core", installed: "9.0.62", latest: "10.1.19", behind: "Major" },
    { package: "h2", installed: "2.1.210", latest: "2.2.224", behind: "Minor" },
    { package: "postgresql", installed: "42.3.3", latest: "42.7.2", behind: "Minor" },
    { package: "protobuf-java", installed: "3.19.4", latest: "4.26.0", behind: "Major" },
  ],
};

const severityColor = { critical: "#dc2626", high: "#f59e0b", medium: "#6366f1", low: "#22c55e" };
const riskColor = { high: "#dc2626", medium: "#f59e0b", low: "#22c55e" };
const behindColor = { Major: "#dc2626", Minor: "#f59e0b", Patch: "#94a3b8" };

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

function CollapsibleSection({ title, count, countColor, defaultOpen, children }) {
  const [open, setOpen] = useState(defaultOpen ?? true);
  return (
    <Paper sx={{ mb: 3, overflow: "hidden" }}>
      <Box
        onClick={() => setOpen((o) => !o)}
        sx={{
          px: 3,
          py: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          "&:hover": { bgcolor: alpha("#3b82f6", 0.02) },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography variant="h6" sx={{ fontSize: "0.9rem" }}>{title}</Typography>
          {count != null && (
            <Chip
              label={count}
              size="small"
              sx={{ height: 22, fontSize: "0.72rem", fontWeight: 700, bgcolor: alpha(countColor || "#3b82f6", 0.08), color: countColor || "#3b82f6" }}
            />
          )}
        </Box>
        {open ? <ExpandLessRounded sx={{ color: "#94a3b8" }} /> : <ExpandMoreRounded sx={{ color: "#94a3b8" }} />}
      </Box>
      <Collapse in={open}>
        <Divider sx={{ borderColor: alpha("#94a3b8", 0.12) }} />
        {children}
      </Collapse>
    </Paper>
  );
}

// ── Upload state ──
function UploadZone({ onFileAccepted, preset }) {
  const fileRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState(null);

  const accept = (f) => {
    setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) accept(f);
  };

  const handleChange = (e) => {
    const f = e.target.files?.[0];
    if (f) accept(f);
  };

  const handleRemove = () => {
    setFile(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <Paper sx={{ p: 3, mb: 3, maxWidth: 780 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
        <Box sx={{ width: 38, height: 38, borderRadius: 2, bgcolor: alpha(preset.primary, 0.1), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <FactCheckRounded sx={{ color: preset.primary, fontSize: 20 }} />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontSize: "1rem" }}>Upload Vendor SBOM</Typography>
          <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>Upload a CycloneDX or SPDX file to analyze a third-party vendor&apos;s software bill of materials</Typography>
        </Box>
      </Box>

      <Alert
        icon={<InfoOutlined sx={{ fontSize: 20 }} />}
        severity="info"
        sx={{
          mb: 2.5,
          bgcolor: alpha("#3b82f6", 0.05),
          border: "1px solid",
          borderColor: alpha("#3b82f6", 0.15),
          color: "#1e293b",
          "& .MuiAlert-icon": { color: "#3b82f6" },
          borderRadius: 2,
        }}
      >
        <Typography sx={{ fontSize: "0.82rem", lineHeight: 1.6 }}>
          Accepted formats: <strong>CycloneDX</strong> (.json, .xml) and <strong>SPDX</strong> (.json, .spdx, .rdf).
          The file will be analyzed for known vulnerabilities, license compliance issues, and outdated components.
        </Typography>
      </Alert>

      {/* Drop zone */}
      <input
        ref={fileRef}
        type="file"
        accept=".json,.xml,.spdx,.rdf"
        onChange={handleChange}
        style={{ display: "none" }}
      />

      {!file ? (
        <Box
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          sx={{
            border: "2px dashed",
            borderColor: dragOver ? preset.primary : alpha("#94a3b8", 0.25),
            borderRadius: 2,
            py: 5,
            px: 3,
            textAlign: "center",
            cursor: "pointer",
            bgcolor: dragOver ? alpha(preset.primary, 0.04) : "transparent",
            transition: "all 0.15s",
            "&:hover": {
              borderColor: alpha(preset.primary, 0.5),
              bgcolor: alpha(preset.primary, 0.03),
            },
          }}
        >
          <CloudUploadRounded sx={{ fontSize: 40, color: dragOver ? preset.primary : "#94a3b8", mb: 1.5 }} />
          <Typography sx={{ fontWeight: 600, fontSize: "0.9rem", color: "#475569", mb: 0.5 }}>
            Drag and drop your SBOM file here
          </Typography>
          <Typography sx={{ fontSize: "0.8rem", color: "#94a3b8" }}>
            or click to browse &mdash; .json, .xml, .spdx, .rdf
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            p: 2,
            border: "1px solid",
            borderColor: alpha("#22c55e", 0.3),
            borderRadius: 2,
            bgcolor: alpha("#22c55e", 0.04),
          }}
        >
          <InsertDriveFileRounded sx={{ fontSize: 28, color: "#22c55e" }} />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontWeight: 600, fontSize: "0.88rem", color: "#1e293b" }} noWrap>{file.name}</Typography>
            <Typography sx={{ fontSize: "0.75rem", color: "#94a3b8" }}>
              {(file.size / 1024).toFixed(1)} KB
            </Typography>
          </Box>
          <Tooltip title="Remove file" arrow>
            <IconButton size="small" onClick={handleRemove} sx={{ color: "#94a3b8", "&:hover": { color: "#dc2626" } }}>
              <DeleteRounded sx={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      {/* Action */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2.5, pt: 2, borderTop: "1px solid", borderColor: alpha("#94a3b8", 0.12) }}>
        <Button
          variant="contained"
          disabled={!file}
          onClick={() => onFileAccepted(file)}
          startIcon={<FactCheckRounded />}
          sx={{ px: 3, boxShadow: "none", "&:hover": { boxShadow: "none" } }}
        >
          Analyze SBOM
        </Button>
      </Box>
    </Paper>
  );
}

// ── Progress state ──
function AnalysisProgress({ phase, progress }) {
  return (
    <Paper sx={{ p: 4, maxWidth: 780, textAlign: "center" }}>
      <FactCheckRounded sx={{ fontSize: 44, color: "#3b82f6", mb: 2 }} />
      <Typography sx={{ fontWeight: 700, fontSize: "1.1rem", mb: 0.5 }}>
        Analyzing Vendor SBOM
      </Typography>
      <Typography sx={{ fontSize: "0.85rem", color: "#64748b", mb: 3 }}>
        {phase}
      </Typography>
      <Box sx={{ maxWidth: 400, mx: "auto" }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 8,
            borderRadius: 4,
            bgcolor: alpha("#94a3b8", 0.1),
            "& .MuiLinearProgress-bar": { borderRadius: 4 },
          }}
        />
        <Typography sx={{ fontSize: "0.78rem", fontWeight: 700, color: "#3b82f6", mt: 1 }}>
          {progress}%
        </Typography>
      </Box>
    </Paper>
  );
}

// ── Results state ──
function AnalysisResults({ result, onReset }) {
  const totalVulns = result.summary.critical + result.summary.high + result.summary.medium + result.summary.low;

  return (
    <Box>
      {/* Report header */}
      <Paper sx={{ p: 0, mb: 3, overflow: "hidden" }}>
        <Box sx={{ px: 3, py: 2.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
                <Typography sx={{ fontWeight: 700, fontSize: "1.25rem" }}>{result.product}</Typography>
                <Chip label={`v${result.productVersion}`} size="small" sx={{ height: 24, fontSize: "0.75rem", bgcolor: alpha("#94a3b8", 0.1), color: "#64748b" }} />
                <Chip label={result.format} size="small" sx={{ height: 24, fontSize: "0.68rem", fontWeight: 700, bgcolor: alpha("#3b82f6", 0.08), color: "#3b82f6" }} />
                <Chip label={`Spec ${result.specVersion}`} size="small" sx={{ height: 24, fontSize: "0.68rem", fontWeight: 600, bgcolor: alpha("#94a3b8", 0.08), color: "#94a3b8" }} />
              </Box>
              <Typography sx={{ fontSize: "0.82rem", color: "#64748b" }}>
                Vendor: <strong>{result.vendor}</strong> &middot; File: {result.fileName} &middot; Analyzed {result.analyzedAt}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Tooltip title="Analyze another file" arrow>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<ReplayRounded sx={{ fontSize: "18px !important" }} />}
                  onClick={onReset}
                  sx={{ color: "#64748b", borderColor: alpha("#94a3b8", 0.3), fontWeight: 600, "&:hover": { borderColor: "#94a3b8" } }}
                >
                  New Analysis
                </Button>
              </Tooltip>
            </Box>
          </Box>
        </Box>

        {/* Risk grade + summary strip */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            px: 3,
            py: 2,
            bgcolor: alpha("#f8fafc", 0.6),
            borderTop: "1px solid",
            borderColor: alpha("#94a3b8", 0.12),
          }}
        >
          {/* Grade circle */}
          <Box sx={{ width: 54, height: 54, borderRadius: "50%", bgcolor: alpha(result.gradeColor, 0.1), border: "3px solid", borderColor: alpha(result.gradeColor, 0.4), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Typography sx={{ fontWeight: 800, fontSize: "1.4rem", color: result.gradeColor, lineHeight: 1 }}>{result.grade}</Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: "0.65rem", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>Risk Score</Typography>
            <Typography sx={{ fontWeight: 700, fontSize: "1rem", lineHeight: 1.2 }}>{result.riskScore}/100</Typography>
          </Box>

          <Box sx={{ height: 40, borderLeft: "1px solid", borderColor: alpha("#94a3b8", 0.15) }} />

          {/* Severity counts */}
          {["critical", "high", "medium", "low"].map((sev) => (
            <Box key={sev} sx={{ textAlign: "center", minWidth: 50 }}>
              <Typography sx={{ fontWeight: 700, fontSize: "1.1rem", color: result.summary[sev] > 0 ? severityColor[sev] : "#94a3b8" }}>{result.summary[sev]}</Typography>
              <Typography sx={{ fontSize: "0.6rem", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>{sev}</Typography>
            </Box>
          ))}

          <Box sx={{ height: 40, borderLeft: "1px solid", borderColor: alpha("#94a3b8", 0.15) }} />

          {[
            { label: "Components", value: result.totalComponents, color: "#3b82f6" },
            { label: "License Issues", value: result.summary.licenseNonCompliant + result.summary.licenseUnknown, color: result.summary.licenseNonCompliant > 0 ? "#dc2626" : "#94a3b8" },
            { label: "Outdated", value: result.summary.outdated, color: "#f59e0b" },
          ].map((s) => (
            <Box key={s.label} sx={{ textAlign: "center", minWidth: 65 }}>
              <Typography sx={{ fontWeight: 700, fontSize: "1.1rem", color: s.color }}>{s.value}</Typography>
              <Typography sx={{ fontSize: "0.6rem", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</Typography>
            </Box>
          ))}
        </Box>
      </Paper>

      {/* KPI cards */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <MetricCard icon={<BugReportRounded sx={{ color: "#dc2626" }} />} label="Vulnerabilities" value={totalVulns} sub={`${result.summary.critical} critical, ${result.summary.high} high`} color="#dc2626" />
        <MetricCard icon={<GavelRounded sx={{ color: "#6366f1" }} />} label="License Issues" value={result.summary.licenseNonCompliant + result.summary.licenseUnknown} sub={`${result.summary.licenseNonCompliant} non-compliant, ${result.summary.licenseUnknown} unknown`} color="#6366f1" />
        <MetricCard icon={<AccountTreeRounded sx={{ color: "#3b82f6" }} />} label="Components" value={result.totalComponents} sub={`${result.directDeps} direct, ${result.transitiveDeps} transitive`} color="#3b82f6" />
        <MetricCard icon={<UpgradeRounded sx={{ color: "#f59e0b" }} />} label="Outdated" value={result.summary.outdated} sub={`of ${result.totalComponents} components`} color="#f59e0b" />
      </Box>

      {/* ── Vulnerabilities table ── */}
      <CollapsibleSection title="Vulnerabilities" count={`${totalVulns} found`} countColor="#dc2626" defaultOpen>
        <TableContainer sx={{ "& .MuiTableCell-root": { fontSize: "0.82rem", py: 1.5 } }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ "& .MuiTableCell-head": { fontWeight: 700, color: "#64748b", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em", bgcolor: alpha("#f8fafc", 0.8) } }}>
                <TableCell>Package</TableCell>
                <TableCell>Version</TableCell>
                <TableCell>CVE</TableCell>
                <TableCell>Severity</TableCell>
                <TableCell>CVSS</TableCell>
                <TableCell sx={{ maxWidth: 260 }}>Summary</TableCell>
                <TableCell>Fix</TableCell>
                <TableCell align="center">EPSS</TableCell>
                <TableCell align="center">KEV</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {result.vulnerabilities.map((v) => {
                const sevColor = severityColor[v.severity];
                return (
                  <TableRow
                    key={v.cveId}
                    sx={{
                      bgcolor: v.severity === "critical" ? alpha("#dc2626", 0.03) : "transparent",
                      "&:hover": { bgcolor: alpha("#3b82f6", 0.03) },
                      "& td": { borderColor: alpha("#94a3b8", 0.1) },
                    }}
                  >
                    <TableCell sx={{ fontWeight: 600, color: "#1e293b", fontFamily: "monospace", fontSize: "0.78rem !important" }}>{v.package}</TableCell>
                    <TableCell sx={{ fontFamily: "monospace", fontSize: "0.78rem !important" }}>{v.version}</TableCell>
                    <TableCell sx={{ fontFamily: "monospace", fontSize: "0.75rem !important", fontWeight: 600 }}>{v.cveId}</TableCell>
                    <TableCell>
                      <Chip
                        label={v.severity.charAt(0).toUpperCase() + v.severity.slice(1)}
                        size="small"
                        sx={{ height: 22, fontSize: "0.7rem", fontWeight: 700, bgcolor: alpha(sevColor, 0.1), color: sevColor, border: `1px solid ${alpha(sevColor, 0.25)}` }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 700, fontSize: "0.82rem", color: sevColor }}>{v.score.toFixed(1)}</Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 260 }}>
                      <Typography sx={{ fontSize: "0.78rem", color: "#475569", lineHeight: 1.4 }} noWrap>{v.summary}</Typography>
                    </TableCell>
                    <TableCell>
                      <Tooltip title={`Upgrade to ${v.fixVersion}`} arrow>
                        <Chip
                          icon={<UpgradeRounded sx={{ fontSize: "14px !important" }} />}
                          label={v.fixVersion}
                          size="small"
                          sx={{ height: 22, fontSize: "0.7rem", fontWeight: 600, bgcolor: alpha("#22c55e", 0.08), color: "#16a34a", "& .MuiChip-icon": { color: "#16a34a" } }}
                        />
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center">
                      <Typography sx={{ fontSize: "0.78rem", fontWeight: 600, color: v.epss > 0.5 ? "#dc2626" : v.epss > 0.1 ? "#f59e0b" : "#94a3b8" }}>
                        {(v.epss * 100).toFixed(1)}%
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {v.cisaKev ? (
                        <Tooltip title="In CISA Known Exploited Vulnerabilities catalog" arrow>
                          <ErrorRounded sx={{ fontSize: 18, color: "#dc2626" }} />
                        </Tooltip>
                      ) : (
                        <Typography sx={{ color: "#94a3b8", fontSize: "0.78rem" }}>—</Typography>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </CollapsibleSection>

      {/* ── License Issues table ── */}
      <CollapsibleSection title="License Issues" count={`${result.licenseIssues.length} issues`} countColor="#6366f1" defaultOpen>
        <TableContainer sx={{ "& .MuiTableCell-root": { fontSize: "0.82rem", py: 1.5 } }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ "& .MuiTableCell-head": { fontWeight: 700, color: "#64748b", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em", bgcolor: alpha("#f8fafc", 0.8) } }}>
                <TableCell>Package</TableCell>
                <TableCell>Version</TableCell>
                <TableCell>License</TableCell>
                <TableCell>Risk</TableCell>
                <TableCell>Reason</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {result.licenseIssues.map((li) => (
                <TableRow
                  key={`${li.package}-${li.license}`}
                  sx={{ "&:hover": { bgcolor: alpha("#3b82f6", 0.03) }, "& td": { borderColor: alpha("#94a3b8", 0.1) } }}
                >
                  <TableCell sx={{ fontWeight: 600, color: "#1e293b", fontFamily: "monospace", fontSize: "0.78rem !important" }}>{li.package}</TableCell>
                  <TableCell sx={{ fontFamily: "monospace", fontSize: "0.78rem !important" }}>{li.version}</TableCell>
                  <TableCell>
                    <Chip
                      label={li.license}
                      size="small"
                      sx={{
                        height: 24,
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        fontFamily: "monospace",
                        bgcolor: li.license === "Unknown" ? alpha("#94a3b8", 0.08) : alpha("#f59e0b", 0.08),
                        color: li.license === "Unknown" ? "#94a3b8" : "#92400e",
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={li.risk.charAt(0).toUpperCase() + li.risk.slice(1)}
                      size="small"
                      sx={{ height: 22, fontSize: "0.68rem", fontWeight: 700, bgcolor: alpha(riskColor[li.risk], 0.1), color: riskColor[li.risk] }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: "#475569", fontSize: "0.8rem !important", maxWidth: 360 }}>
                    <Typography sx={{ fontSize: "0.8rem", lineHeight: 1.4 }} noWrap>{li.reason}</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CollapsibleSection>

      {/* ── Outdated Components table ── */}
      <CollapsibleSection title="Most Outdated Components" count={`${result.summary.outdated} total`} countColor="#f59e0b" defaultOpen={false}>
        <TableContainer sx={{ "& .MuiTableCell-root": { fontSize: "0.82rem", py: 1.5 } }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ "& .MuiTableCell-head": { fontWeight: 700, color: "#64748b", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em", bgcolor: alpha("#f8fafc", 0.8) } }}>
                <TableCell>Package</TableCell>
                <TableCell>Installed</TableCell>
                <TableCell>Latest</TableCell>
                <TableCell>Behind</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {result.outdatedHighlights.map((o) => (
                <TableRow
                  key={o.package}
                  sx={{ "&:hover": { bgcolor: alpha("#3b82f6", 0.03) }, "& td": { borderColor: alpha("#94a3b8", 0.1) } }}
                >
                  <TableCell sx={{ fontWeight: 600, color: "#1e293b", fontFamily: "monospace", fontSize: "0.78rem !important" }}>{o.package}</TableCell>
                  <TableCell sx={{ fontFamily: "monospace", fontSize: "0.78rem !important", color: "#f59e0b", fontWeight: 600 }}>{o.installed}</TableCell>
                  <TableCell sx={{ fontFamily: "monospace", fontSize: "0.78rem !important", color: "#16a34a", fontWeight: 600 }}>{o.latest}</TableCell>
                  <TableCell>
                    <Chip
                      label={o.behind}
                      size="small"
                      sx={{ height: 22, fontSize: "0.68rem", fontWeight: 700, bgcolor: alpha(behindColor[o.behind], 0.1), color: behindColor[o.behind] }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ px: 3, py: 1.5, bgcolor: alpha("#f8fafc", 0.5), borderTop: "1px solid", borderColor: alpha("#94a3b8", 0.08) }}>
          <Typography sx={{ fontSize: "0.75rem", color: "#94a3b8" }}>
            Showing top {result.outdatedHighlights.length} of {result.summary.outdated} outdated components
          </Typography>
        </Box>
      </CollapsibleSection>
    </Box>
  );
}

// ── Main page ──
export default function VendorSbomAnalysis() {
  const { preset } = useAppTheme();
  const [state, setState] = useState("upload"); // upload | analyzing | results
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);

  const handleFileAccepted = (file) => {
    setState("analyzing");
    setPhaseIdx(0);
    setProgress(0);

    // Walk through phases
    let idx = 0;
    const advance = () => {
      if (idx < phases.length - 1) {
        idx++;
        setPhaseIdx(idx);
        setProgress(phases[idx].pct);
        setTimeout(advance, 600 + Math.random() * 500);
      } else {
        // Done — show results
        const now = new Date();
        const formatted = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
          ", " + now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
        setResult({ ...mockResult, fileName: file.name, analyzedAt: formatted });
        setState("results");
      }
    };
    setTimeout(advance, 700);
  };

  const handleReset = () => {
    setState("upload");
    setResult(null);
    setPhaseIdx(0);
    setProgress(0);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontSize: "1.65rem", mb: 0.3 }}>
          Vendor SBOM Analysis
        </Typography>
        <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>
          Upload and analyze a third-party vendor&apos;s software bill of materials for security and compliance risks
        </Typography>
      </Box>

      {state === "upload" && <UploadZone onFileAccepted={handleFileAccepted} preset={preset} />}
      {state === "analyzing" && <AnalysisProgress phase={phases[phaseIdx].label} progress={progress} />}
      {state === "results" && result && <AnalysisResults result={result} onReset={handleReset} />}
    </Box>
  );
}
