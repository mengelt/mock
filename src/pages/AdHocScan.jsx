import { useState, useRef } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  Chip,
  Divider,
  Tooltip,
  IconButton,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  alpha,
} from "@mui/material";
import {
  CloudUploadRounded,
  InsertDriveFileRounded,
  DeleteRounded,
  InfoOutlined,
  CheckCircleRounded,
  SendRounded,
  RadarRounded,
  ErrorRounded,
  ReplayRounded,
} from "@mui/icons-material";
import { useAppTheme } from "../theme/ThemeContext";

// ── Ecosystem options ──
const ecosystems = [
  { id: "npm", label: "NPM", icon: "JS", enabled: true, desc: "Node.js / JavaScript" },
  { id: "maven", label: "Maven", icon: "MVN", enabled: false, desc: "Java / Kotlin" },
  { id: "pypi", label: "PyPI", icon: "PY", enabled: false, desc: "Python" },
  { id: "nuget", label: "NuGet", icon: ".NET", enabled: false, desc: "C# / .NET" },
  { id: "go", label: "Go Modules", icon: "GO", enabled: false, desc: "Golang" },
  { id: "cargo", label: "Cargo", icon: "RS", enabled: false, desc: "Rust" },
  { id: "gems", label: "RubyGems", icon: "RB", enabled: false, desc: "Ruby" },
  { id: "composer", label: "Composer", icon: "PHP", enabled: false, desc: "PHP" },
];

// ── Required files per ecosystem ──
const ecosystemFiles = {
  npm: [
    { key: "manifest", label: "package.json", accept: ".json", required: true },
    { key: "lockfile", label: "package-lock.json", accept: ".json", required: true },
  ],
};

// ── Scan phases ──
const scanPhases = [
  { label: "Uploading files", pct: 10 },
  { label: "Generating SBOM", pct: 30 },
  { label: "Resolving dependency tree", pct: 50 },
  { label: "Checking vulnerabilities", pct: 70 },
  { label: "Evaluating licenses", pct: 85 },
  { label: "Finalizing results", pct: 95 },
  { label: "Scan complete", pct: 100 },
];

// ── Mock scan result ──
const mockScanResult = {
  project: "ad-hoc-scan",
  ecosystem: "NPM",
  scannedAt: null,
  duration: "3.2s",
  totalDeps: 847,
  directDeps: 62,
  transitiveDeps: 785,
  vulnerabilities: { critical: 2, high: 5, medium: 3, low: 7 },
  licenseIssues: 3,
  outdated: 41,
  status: "failing",
  topFindings: [
    { package: "lodash", version: "4.17.20", severity: "critical", cveId: "CVE-2021-23337", score: 9.8, summary: "Command injection via template()" },
    { package: "axios", version: "0.21.1", severity: "high", cveId: "CVE-2023-45857", score: 7.5, summary: "XSRF-TOKEN cookie exposure" },
    { package: "express", version: "4.17.1", severity: "high", cveId: "CVE-2024-29041", score: 7.1, summary: "Open redirect in res.redirect()" },
    { package: "json5", version: "1.0.1", severity: "high", cveId: "CVE-2022-46175", score: 7.1, summary: "Prototype pollution via parse()" },
    { package: "node-fetch", version: "2.6.7", severity: "high", cveId: "CVE-2022-0235", score: 7.5, summary: "Exposure of sensitive info to unauthorized actor" },
    { package: "minimatch", version: "3.0.4", severity: "high", cveId: "CVE-2022-3517", score: 7.5, summary: "ReDoS via braces in pattern" },
    { package: "semver", version: "7.5.3", severity: "low", cveId: "CVE-2022-25883", score: 3.7, summary: "ReDoS in semver range parsing" },
    { package: "postcss", version: "8.4.31", severity: "low", cveId: "CVE-2023-44270", score: 3.1, summary: "Newline-based parsing issue in source maps" },
    { package: "shell-quote", version: "1.7.3", severity: "critical", cveId: "CVE-2021-42740", score: 9.8, summary: "Command injection via unescaped shell metacharacters" },
    { package: "tough-cookie", version: "4.1.2", severity: "medium", cveId: "CVE-2023-26136", score: 6.5, summary: "Prototype pollution in cookie parsing" },
    { package: "word-wrap", version: "1.2.3", severity: "medium", cveId: "CVE-2023-26115", score: 5.3, summary: "ReDoS via crafted input" },
    { package: "xml2js", version: "0.4.23", severity: "medium", cveId: "CVE-2023-0842", score: 5.3, summary: "Prototype pollution via tag names" },
  ],
};

const severityColor = { critical: "#dc2626", high: "#f59e0b", medium: "#6366f1", low: "#22c55e" };
const statusColor = { passing: "#22c55e", warning: "#f59e0b", failing: "#dc2626" };

// ── File upload slot ──
function FileSlot({ fileDef, file, onSelect, onRemove }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) onSelect(f);
  };

  return (
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography sx={{ fontSize: "0.78rem", fontWeight: 600, color: "#475569", mb: 0.75 }}>
        {fileDef.label}
        {fileDef.required && <Box component="span" sx={{ color: "#dc2626", ml: 0.3 }}>*</Box>}
      </Typography>

      <input
        ref={inputRef}
        type="file"
        accept={fileDef.accept}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onSelect(f); }}
        style={{ display: "none" }}
      />

      {!file ? (
        <Box
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          sx={{
            border: "2px dashed",
            borderColor: dragOver ? "#3b82f6" : alpha("#94a3b8", 0.25),
            borderRadius: 2,
            py: 3,
            px: 2,
            textAlign: "center",
            cursor: "pointer",
            bgcolor: dragOver ? alpha("#3b82f6", 0.04) : "transparent",
            transition: "all 0.15s",
            "&:hover": { borderColor: alpha("#3b82f6", 0.4), bgcolor: alpha("#3b82f6", 0.02) },
          }}
        >
          <CloudUploadRounded sx={{ fontSize: 28, color: dragOver ? "#3b82f6" : "#94a3b8", mb: 0.5 }} />
          <Typography sx={{ fontSize: "0.78rem", color: "#64748b", fontWeight: 500 }}>
            Drop <code style={{ fontSize: "0.75rem" }}>{fileDef.label}</code> here or click to browse
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            p: 1.5,
            border: "1px solid",
            borderColor: alpha("#22c55e", 0.3),
            borderRadius: 2,
            bgcolor: alpha("#22c55e", 0.04),
          }}
        >
          <InsertDriveFileRounded sx={{ fontSize: 22, color: "#22c55e" }} />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontWeight: 600, fontSize: "0.82rem", color: "#1e293b" }} noWrap>{file.name}</Typography>
            <Typography sx={{ fontSize: "0.7rem", color: "#94a3b8" }}>{(file.size / 1024).toFixed(1)} KB</Typography>
          </Box>
          <CheckCircleRounded sx={{ fontSize: 18, color: "#22c55e", flexShrink: 0 }} />
          <Tooltip title="Remove file" arrow>
            <IconButton size="small" onClick={onRemove} sx={{ color: "#94a3b8", "&:hover": { color: "#dc2626" } }}>
              <DeleteRounded sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Box>
  );
}

export default function AdHocScan() {
  const { preset } = useAppTheme();

  // State machine: select → upload → scanning → results
  const [ecosystem, setEcosystem] = useState(null);
  const [files, setFiles] = useState({});          // keyed by fileDef.key
  const [state, setState] = useState("select");    // select | upload | scanning | results
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  const selectedEco = ecosystems.find((e) => e.id === ecosystem);
  const requiredFiles = ecosystem ? ecosystemFiles[ecosystem] ?? [] : [];
  const allFilesReady = requiredFiles.length > 0 && requiredFiles.every((fd) => files[fd.key]);

  const handleEcosystemSelect = (id) => {
    const eco = ecosystems.find((e) => e.id === id);
    if (!eco?.enabled) return;
    setEcosystem(id);
    setFiles({});
    setState("upload");
    setSubmitError(null);
  };

  const handleFileSelect = (key, file) => {
    setFiles((prev) => ({ ...prev, [key]: file }));
    setSubmitError(null);
  };

  const handleFileRemove = (key) => {
    setFiles((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleSubmit = async () => {
    setState("scanning");
    setPhaseIdx(0);
    setProgress(0);
    setSubmitError(null);

    // Try to POST to the real backend
    try {
      const formData = new FormData();
      formData.append("ecosystem", ecosystem);
      for (const fd of requiredFiles) {
        if (files[fd.key]) formData.append(fd.key, files[fd.key]);
      }

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const resp = await fetch("/api/v1/scan/adhoc", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (resp.ok) {
        // If the backend actually responds, we could use its data.
        // For now we fall through to the mock flow.
      }
    } catch {
      // Backend not available — expected during mockup. Continue with simulated scan.
    }

    // Simulated phase progression
    let idx = 0;
    const advance = () => {
      if (idx < scanPhases.length - 1) {
        idx++;
        setPhaseIdx(idx);
        setProgress(scanPhases[idx].pct);
        setTimeout(advance, 500 + Math.random() * 500);
      } else {
        const now = new Date();
        const formatted = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
          ", " + now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
        setResult({ ...mockScanResult, scannedAt: formatted });
        setState("results");
      }
    };
    setTimeout(advance, 600);
  };

  const handleReset = () => {
    setEcosystem(null);
    setFiles({});
    setState("select");
    setResult(null);
    setPhaseIdx(0);
    setProgress(0);
    setSubmitError(null);
  };

  const handleChangeFiles = () => {
    setFiles({});
    setState("upload");
    setResult(null);
    setSubmitError(null);
  };

  // ── Stepper labels ──
  const steps = ["Select Ecosystem", "Upload Files", "Scan"];
  const activeStep = state === "select" ? 0 : state === "upload" ? 1 : 2;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontSize: "1.65rem", mb: 0.3 }}>
          Ad-Hoc Scan
        </Typography>
        <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>
          Upload your project&apos;s manifest and lockfile for an on-demand vulnerability scan
        </Typography>
      </Box>

      {/* Stepper */}
      {state !== "results" && (
        <Paper sx={{ px: 4, py: 2.5, mb: 3, maxWidth: 780 }}>
          <Stepper activeStep={activeStep} alternativeLabel sx={{ "& .MuiStepLabel-label": { fontSize: "0.82rem", fontWeight: 600 } }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>
      )}

      {/* ── Step 1: Ecosystem selection ── */}
      {state === "select" && (
        <Paper sx={{ p: 3, maxWidth: 780 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
            <Box sx={{ width: 38, height: 38, borderRadius: 2, bgcolor: alpha(preset.primary, 0.1), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <RadarRounded sx={{ color: preset.primary, fontSize: 20 }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontSize: "1rem" }}>Select Package Ecosystem</Typography>
              <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>Choose the package manager your project uses</Typography>
            </Box>
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1.5 }}>
            {ecosystems.map((eco) => {
              const isActive = ecosystem === eco.id;
              return (
                <Box
                  key={eco.id}
                  onClick={() => handleEcosystemSelect(eco.id)}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: "2px solid",
                    borderColor: isActive ? preset.primary : eco.enabled ? alpha("#94a3b8", 0.15) : alpha("#94a3b8", 0.1),
                    bgcolor: isActive ? alpha(preset.primary, 0.04) : "transparent",
                    cursor: eco.enabled ? "pointer" : "default",
                    opacity: eco.enabled ? 1 : 0.45,
                    transition: "all 0.15s",
                    textAlign: "center",
                    "&:hover": eco.enabled ? {
                      borderColor: isActive ? preset.primary : alpha("#94a3b8", 0.35),
                      bgcolor: alpha(preset.primary, 0.03),
                    } : {},
                    position: "relative",
                  }}
                >
                  <Chip
                    label={eco.icon}
                    size="small"
                    sx={{
                      height: 28,
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      fontFamily: "monospace",
                      bgcolor: isActive ? alpha(preset.primary, 0.12) : alpha("#94a3b8", 0.08),
                      color: isActive ? preset.primary : "#475569",
                      mb: 1,
                      minWidth: 40,
                    }}
                  />
                  <Typography sx={{ fontWeight: 600, fontSize: "0.85rem", color: eco.enabled ? "#1e293b" : "#94a3b8" }}>
                    {eco.label}
                  </Typography>
                  <Typography sx={{ fontSize: "0.7rem", color: "#94a3b8", mt: 0.2 }}>
                    {eco.desc}
                  </Typography>
                  {!eco.enabled && (
                    <Chip
                      label="Coming soon"
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 6,
                        right: 6,
                        height: 18,
                        fontSize: "0.58rem",
                        fontWeight: 700,
                        bgcolor: alpha("#94a3b8", 0.1),
                        color: "#94a3b8",
                      }}
                    />
                  )}
                </Box>
              );
            })}
          </Box>
        </Paper>
      )}

      {/* ── Step 2: File upload ── */}
      {state === "upload" && (
        <Paper sx={{ p: 3, maxWidth: 780 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
            <Box sx={{ width: 38, height: 38, borderRadius: 2, bgcolor: alpha(preset.primary, 0.1), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <CloudUploadRounded sx={{ color: preset.primary, fontSize: 20 }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontSize: "1rem" }}>Upload Project Files</Typography>
              <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
                Provide your manifest and lockfile for <strong>{selectedEco?.label}</strong> analysis
              </Typography>
            </Box>
            <Chip
              label={selectedEco?.label}
              size="small"
              sx={{ height: 26, fontSize: "0.75rem", fontWeight: 700, bgcolor: alpha(preset.primary, 0.1), color: preset.primary, fontFamily: "monospace" }}
            />
          </Box>

          <Alert
            icon={<InfoOutlined sx={{ fontSize: 20 }} />}
            severity="info"
            sx={{
              mb: 3,
              bgcolor: alpha("#3b82f6", 0.05),
              border: "1px solid",
              borderColor: alpha("#3b82f6", 0.15),
              color: "#1e293b",
              "& .MuiAlert-icon": { color: "#3b82f6" },
              borderRadius: 2,
            }}
          >
            <Typography sx={{ fontSize: "0.82rem", lineHeight: 1.6 }}>
              Both <strong>package.json</strong> and <strong>package-lock.json</strong> are required.
              The manifest defines your direct dependencies while the lockfile captures the full resolved dependency tree.
              These files are submitted to DeepView for SBOM generation and vulnerability analysis.
            </Typography>
          </Alert>

          {/* File slots */}
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            {requiredFiles.map((fd) => (
              <FileSlot
                key={fd.key}
                fileDef={fd}
                file={files[fd.key] ?? null}
                onSelect={(f) => handleFileSelect(fd.key, f)}
                onRemove={() => handleFileRemove(fd.key)}
              />
            ))}
          </Box>

          {submitError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {submitError}
            </Alert>
          )}

          {/* Actions */}
          <Box sx={{ display: "flex", justifyContent: "space-between", pt: 2, borderTop: "1px solid", borderColor: alpha("#94a3b8", 0.12) }}>
            <Button
              onClick={() => { setState("select"); setFiles({}); }}
              sx={{ color: "#64748b", fontWeight: 600 }}
            >
              Back
            </Button>
            <Tooltip title={allFilesReady ? "" : "Upload both files to continue"} arrow>
              <span>
                <Button
                  variant="contained"
                  disabled={!allFilesReady}
                  onClick={handleSubmit}
                  startIcon={<SendRounded />}
                  sx={{ px: 3, boxShadow: "none", "&:hover": { boxShadow: "none" } }}
                >
                  Submit Scan
                </Button>
              </span>
            </Tooltip>
          </Box>
        </Paper>
      )}

      {/* ── Step 3a: Scanning progress ── */}
      {state === "scanning" && (
        <Paper sx={{ p: 4, maxWidth: 780, textAlign: "center" }}>
          <RadarRounded sx={{ fontSize: 44, color: "#3b82f6", mb: 2 }} />
          <Typography sx={{ fontWeight: 700, fontSize: "1.1rem", mb: 0.5 }}>
            Scanning Dependencies
          </Typography>
          <Typography sx={{ fontSize: "0.85rem", color: "#64748b", mb: 3 }}>
            {scanPhases[phaseIdx].label}
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
      )}

      {/* ── Step 3b: Results ── */}
      {state === "results" && result && (
        <Box>
          {/* Results header */}
          <Paper sx={{ p: 0, mb: 3, overflow: "hidden" }}>
            <Box sx={{ px: 3, py: 2.5, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: "1.25rem" }}>Ad-Hoc Scan Results</Typography>
                  <Chip label={result.ecosystem} size="small" sx={{ height: 24, fontSize: "0.72rem", fontWeight: 700, bgcolor: alpha("#3b82f6", 0.08), color: "#3b82f6", fontFamily: "monospace" }} />
                  <Chip
                    label={result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                    size="small"
                    sx={{ height: 24, fontSize: "0.72rem", fontWeight: 700, bgcolor: alpha(statusColor[result.status], 0.1), color: statusColor[result.status], border: `1px solid ${alpha(statusColor[result.status], 0.25)}` }}
                  />
                </Box>
                <Typography sx={{ fontSize: "0.82rem", color: "#64748b" }}>
                  Scanned {result.scannedAt} &middot; {result.duration} &middot; {Object.values(files).map((f) => f.name).join(", ")}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<ReplayRounded sx={{ fontSize: "18px !important" }} />}
                  onClick={handleReset}
                  sx={{ color: "#64748b", borderColor: alpha("#94a3b8", 0.3), fontWeight: 600, "&:hover": { borderColor: "#94a3b8" } }}
                >
                  New Scan
                </Button>
              </Box>
            </Box>

            {/* Summary strip */}
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
              {["critical", "high", "medium", "low"].map((sev) => (
                <Box key={sev} sx={{ textAlign: "center", minWidth: 50 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: "1.1rem", color: result.vulnerabilities[sev] > 0 ? severityColor[sev] : "#94a3b8" }}>
                    {result.vulnerabilities[sev]}
                  </Typography>
                  <Typography sx={{ fontSize: "0.6rem", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {sev}
                  </Typography>
                </Box>
              ))}

              <Box sx={{ height: 40, borderLeft: "1px solid", borderColor: alpha("#94a3b8", 0.15) }} />

              {[
                { label: "Total Deps", value: result.totalDeps.toLocaleString(), color: "#3b82f6" },
                { label: "Direct", value: result.directDeps, color: "#3b82f6" },
                { label: "Transitive", value: result.transitiveDeps, color: "#94a3b8" },
                { label: "License Issues", value: result.licenseIssues, color: result.licenseIssues > 0 ? "#dc2626" : "#94a3b8" },
                { label: "Outdated", value: result.outdated, color: "#f59e0b" },
              ].map((s) => (
                <Box key={s.label} sx={{ textAlign: "center", minWidth: 55 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: "1.1rem", color: s.color }}>{s.value}</Typography>
                  <Typography sx={{ fontSize: "0.6rem", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</Typography>
                </Box>
              ))}
            </Box>
          </Paper>

          {/* Findings table */}
          <Paper sx={{ p: 0, overflow: "hidden" }}>
            <Box sx={{ px: 3, py: 2, borderBottom: "1px solid", borderColor: alpha("#94a3b8", 0.12), display: "flex", alignItems: "center", gap: 1.5 }}>
              <Typography variant="h6" sx={{ fontSize: "0.9rem" }}>Vulnerability Findings</Typography>
              <Chip
                label={`${result.topFindings.length} found`}
                size="small"
                sx={{ height: 22, fontSize: "0.72rem", fontWeight: 700, bgcolor: alpha("#dc2626", 0.08), color: "#dc2626" }}
              />
            </Box>
            <Box component="table" sx={{
              width: "100%",
              borderCollapse: "separate",
              borderSpacing: 0,
              "& th, & td": { px: 2, py: 1.5, fontSize: "0.82rem", borderBottom: "1px solid", borderColor: alpha("#94a3b8", 0.1), textAlign: "left" },
              "& th": { fontWeight: 700, fontSize: "0.72rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", bgcolor: alpha("#f8fafc", 0.8) },
              "& tbody tr:last-child td": { borderBottom: "none" },
              "& tbody tr:hover": { bgcolor: alpha("#3b82f6", 0.03) },
            }}>
              <Box component="thead">
                <Box component="tr">
                  <Box component="th">Package</Box>
                  <Box component="th">Version</Box>
                  <Box component="th">CVE</Box>
                  <Box component="th">Severity</Box>
                  <Box component="th">CVSS</Box>
                  <Box component="th">Summary</Box>
                </Box>
              </Box>
              <Box component="tbody">
                {result.topFindings.map((f) => {
                  const sevColor = severityColor[f.severity];
                  return (
                    <Box
                      component="tr"
                      key={f.cveId}
                      sx={{ bgcolor: f.severity === "critical" ? alpha("#dc2626", 0.03) : "transparent" }}
                    >
                      <Box component="td" sx={{ fontWeight: 600, color: "#1e293b", fontFamily: "monospace", fontSize: "0.78rem !important" }}>{f.package}</Box>
                      <Box component="td" sx={{ fontFamily: "monospace", fontSize: "0.78rem !important" }}>{f.version}</Box>
                      <Box component="td" sx={{ fontFamily: "monospace", fontSize: "0.75rem !important", fontWeight: 600 }}>{f.cveId}</Box>
                      <Box component="td">
                        <Chip
                          label={f.severity.charAt(0).toUpperCase() + f.severity.slice(1)}
                          size="small"
                          sx={{ height: 22, fontSize: "0.7rem", fontWeight: 700, bgcolor: alpha(sevColor, 0.1), color: sevColor, border: `1px solid ${alpha(sevColor, 0.25)}` }}
                        />
                      </Box>
                      <Box component="td">
                        <Typography sx={{ fontWeight: 700, fontSize: "0.82rem", color: sevColor }}>{f.score.toFixed(1)}</Typography>
                      </Box>
                      <Box component="td" sx={{ color: "#475569", fontSize: "0.78rem !important", maxWidth: 260 }}>
                        <Typography sx={{ fontSize: "0.78rem", lineHeight: 1.4 }} noWrap>{f.summary}</Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Paper>
        </Box>
      )}
    </Box>
  );
}
