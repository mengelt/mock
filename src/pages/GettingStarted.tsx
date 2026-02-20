import {
  Box,
  Typography,
  Paper,
  Alert,
  Chip,
  alpha,
} from "@mui/material";
import {
  RocketLaunchRounded,
  ContentCopyRounded,
  CheckCircleRounded,
} from "@mui/icons-material";
import { useState } from "react";
import { useAppTheme } from "../theme/ThemeContext";

interface CiPlatform {
  id: string;
  name: string;
  filename: string;
  description: string;
}

const platforms: CiPlatform[] = [
  { id: "gitlab", name: "GitLab CI", filename: ".gitlab-ci.yml", description: "Add the following stage to your GitLab CI pipeline" },
  { id: "jenkins", name: "Jenkins", filename: "Jenkinsfile", description: "Add the following stage to your Jenkins pipeline" },
  { id: "github", name: "GitHub Actions", filename: ".github/workflows/deepview.yml", description: "Add the following step to your GitHub Actions workflow" },
  { id: "azure", name: "Azure DevOps", filename: "azure-pipelines.yml", description: "Add the following task to your Azure pipeline" },
];

const curlTemplate = `curl -X POST https://deepview.example.com/api/v1/scan \\
  -H "x-api-key: <YOUR_DEEPVIEW_API_KEY>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "branch": "<BRANCH_NAME>",
    "client-ref": "<OPTIONAL_BUILD_REF>",
    "sbom": "<BASE64_ENCODED_SBOM>"
  }'`;

function getPipelineSnippet(platformId: string): string {
  switch (platformId) {
    case "gitlab":
      return `# .gitlab-ci.yml
deepview-scan:
  stage: test
  image: curlimages/curl:latest
  script:
    - |
      curl -X POST https://deepview.example.com/api/v1/scan \\
        -H "x-api-key: $DEEPVIEW_API_KEY" \\
        -H "Content-Type: application/json" \\
        -d "{
          \\"branch\\": \\"$CI_COMMIT_REF_NAME\\",
          \\"client-ref\\": \\"$CI_PIPELINE_ID\\",
          \\"sbom\\": \\"$(cat sbom.json | base64 -w 0)\\"
        }"
  only:
    - main
    - develop`;
    case "jenkins":
      return `// Jenkinsfile
pipeline {
  agent any
  stages {
    stage('DeepView Scan') {
      steps {
        withCredentials([string(credentialsId: 'deepview-api-key', variable: 'DEEPVIEW_API_KEY')]) {
          sh """
            curl -X POST https://deepview.example.com/api/v1/scan \\
              -H "x-api-key: \$DEEPVIEW_API_KEY" \\
              -H "Content-Type: application/json" \\
              -d '{
                "branch": "\${env.BRANCH_NAME}",
                "client-ref": "\${env.BUILD_NUMBER}",
                "sbom": "'\$(cat sbom.json | base64 -w 0)'"
              }'
          """
        }
      }
    }
  }
}`;
    case "github":
      return `# .github/workflows/deepview.yml
name: DeepView Scan
on:
  push:
    branches: [main, develop]

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Submit SBOM to DeepView
        run: |
          curl -X POST https://deepview.example.com/api/v1/scan \\
            -H "x-api-key: \${{ secrets.DEEPVIEW_API_KEY }}" \\
            -H "Content-Type: application/json" \\
            -d "{
              \\"branch\\": \\"\${{ github.ref_name }}\\",
              \\"client-ref\\": \\"\${{ github.run_id }}\\",
              \\"sbom\\": \\"$(cat sbom.json | base64 -w 0)\\"
            }"`;
    case "azure":
      return `# azure-pipelines.yml
trigger:
  branches:
    include:
      - main
      - develop

pool:
  vmImage: 'ubuntu-latest'

steps:
  - task: Bash@3
    displayName: 'DeepView Scan'
    inputs:
      targetType: 'inline'
      script: |
        curl -X POST https://deepview.example.com/api/v1/scan \\
          -H "x-api-key: $(DEEPVIEW_API_KEY)" \\
          -H "Content-Type: application/json" \\
          -d "{
            \\"branch\\": \\"$(Build.SourceBranchName)\\",
            \\"client-ref\\": \\"$(Build.BuildId)\\",
            \\"sbom\\": \\"$(cat sbom.json | base64 -w 0)\\"
          }"
    env:
      DEEPVIEW_API_KEY: $(DEEPVIEW_API_KEY)`;
    default:
      return "";
  }
}

function CodeBlock({ code, label }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Box sx={{ position: "relative", mt: label ? 1.5 : 0 }}>
      {label && (
        <Typography sx={{ fontSize: "0.75rem", fontWeight: 600, color: "#94a3b8", mb: 0.5 }}>
          {label}
        </Typography>
      )}
      <Box
        sx={{
          bgcolor: "#1e293b",
          borderRadius: 2,
          p: 2.5,
          pr: 6,
          overflow: "auto",
          "&::-webkit-scrollbar": { height: 6 },
          "&::-webkit-scrollbar-thumb": { bgcolor: alpha("#94a3b8", 0.3), borderRadius: 3 },
        }}
      >
        <Typography
          component="pre"
          sx={{
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontSize: "0.78rem",
            color: "#e2e8f0",
            lineHeight: 1.7,
            margin: 0,
            whiteSpace: "pre",
          }}
        >
          {code}
        </Typography>
      </Box>
      <Box
        onClick={handleCopy}
        sx={{
          position: "absolute",
          top: label ? 32 : 8,
          right: 8,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          px: 1,
          py: 0.5,
          borderRadius: 1,
          bgcolor: alpha("#fff", 0.08),
          "&:hover": { bgcolor: alpha("#fff", 0.15) },
          transition: "background 0.15s",
        }}
      >
        {copied ? (
          <CheckCircleRounded sx={{ fontSize: 14, color: "#22c55e" }} />
        ) : (
          <ContentCopyRounded sx={{ fontSize: 14, color: "#94a3b8" }} />
        )}
        <Typography sx={{ fontSize: "0.68rem", color: copied ? "#22c55e" : "#94a3b8", fontWeight: 600 }}>
          {copied ? "Copied" : "Copy"}
        </Typography>
      </Box>
    </Box>
  );
}

export default function GettingStarted() {
  const { preset } = useAppTheme();
  const [activePlatform, setActivePlatform] = useState("gitlab");

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontSize: "1.65rem", mb: 0.3 }}>
          Getting Started
        </Typography>
        <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>
          Integrate DeepView into your CI/CD pipeline to automatically scan your SBOMs
        </Typography>
      </Box>

      {/* Quick overview */}
      <Alert
        icon={<RocketLaunchRounded sx={{ color: preset.primary }} />}
        sx={{
          mb: 3,
          bgcolor: alpha(preset.primary, 0.05),
          border: "1px solid",
          borderColor: alpha(preset.primary, 0.15),
          "& .MuiAlert-message": { width: "100%" },
        }}
      >
        <Typography sx={{ fontWeight: 700, fontSize: "0.88rem", mb: 0.5 }}>
          How it works
        </Typography>
        <Typography sx={{ fontSize: "0.82rem", color: "#475569", lineHeight: 1.7 }}>
          DeepView analyzes your software bill of materials (SBOM) for known vulnerabilities, malware, and license compliance issues.
          To get started, generate an SBOM from your project (e.g. using <code>cyclonedx</code> or <code>syft</code>), then submit it to the DeepView API from your CI/CD pipeline.
          You'll need an API key — create one from the <strong>Create API Token</strong> page.
        </Typography>
      </Alert>

      {/* API Reference */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography sx={{ fontWeight: 700, fontSize: "1.05rem", mb: 0.5 }}>
          API Endpoint
        </Typography>
        <Typography sx={{ fontSize: "0.82rem", color: "#64748b", mb: 2 }}>
          Submit an SBOM for analysis by making a POST request with the following headers and payload.
        </Typography>

        <CodeBlock code={curlTemplate} label="curl example" />

        {/* Header reference table */}
        <Typography sx={{ fontWeight: 700, fontSize: "0.88rem", mt: 3, mb: 1.5 }}>
          Request Headers
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {[
            { name: "x-api-key", required: true, description: "Your DeepView API key. Generate one from the Create API Token page." },
            { name: "Content-Type", required: true, description: "Must be application/json." },
          ].map((header) => (
            <Box
              key={header.name}
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 2,
                px: 2,
                py: 1.2,
                bgcolor: alpha("#f8fafc", 0.8),
                borderRadius: 1.5,
                border: "1px solid",
                borderColor: alpha("#94a3b8", 0.1),
              }}
            >
              <Typography
                sx={{
                  fontFamily: "monospace",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: "#1e293b",
                  minWidth: 140,
                  pt: 0.1,
                }}
              >
                {header.name}
              </Typography>
              <Chip
                label={header.required ? "Required" : "Optional"}
                size="small"
                sx={{
                  height: 20,
                  fontSize: "0.62rem",
                  fontWeight: 700,
                  bgcolor: header.required ? alpha("#dc2626", 0.08) : alpha("#94a3b8", 0.08),
                  color: header.required ? "#dc2626" : "#64748b",
                  flexShrink: 0,
                }}
              />
              <Typography sx={{ fontSize: "0.8rem", color: "#64748b" }}>{header.description}</Typography>
            </Box>
          ))}
        </Box>

        <Typography sx={{ fontWeight: 700, fontSize: "0.88rem", mt: 3, mb: 1.5 }}>
          Request Body Fields
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {[
            { name: "branch", required: true, description: "The source branch for this scan (e.g. main, develop, feature/auth)." },
            { name: "client-ref", required: false, description: "Optional reference value for your tracking purposes. Commonly used for pipeline build numbers, commit SHAs, or PR identifiers." },
            { name: "sbom", required: true, description: "Base64-encoded CycloneDX or SPDX SBOM in JSON format." },
          ].map((field) => (
            <Box
              key={field.name}
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 2,
                px: 2,
                py: 1.2,
                bgcolor: alpha("#f8fafc", 0.8),
                borderRadius: 1.5,
                border: "1px solid",
                borderColor: alpha("#94a3b8", 0.1),
              }}
            >
              <Typography
                sx={{
                  fontFamily: "monospace",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: "#1e293b",
                  minWidth: 140,
                  pt: 0.1,
                }}
              >
                {field.name}
              </Typography>
              <Chip
                label={field.required ? "Required" : "Optional"}
                size="small"
                sx={{
                  height: 20,
                  fontSize: "0.62rem",
                  fontWeight: 700,
                  bgcolor: field.required ? alpha("#dc2626", 0.08) : alpha("#94a3b8", 0.08),
                  color: field.required ? "#dc2626" : "#64748b",
                  flexShrink: 0,
                }}
              />
              <Typography sx={{ fontSize: "0.8rem", color: "#64748b" }}>{field.description}</Typography>
            </Box>
          ))}
        </Box>
      </Paper>

      {/* Pipeline integration examples */}
      <Paper sx={{ p: 3 }}>
        <Typography sx={{ fontWeight: 700, fontSize: "1.05rem", mb: 0.5 }}>
          Pipeline Integration Examples
        </Typography>
        <Typography sx={{ fontSize: "0.82rem", color: "#64748b", mb: 2 }}>
          Select your CI/CD platform for a ready-to-use configuration snippet.
        </Typography>

        {/* Platform tabs */}
        <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
          {platforms.map((p) => (
            <Chip
              key={p.id}
              label={p.name}
              onClick={() => setActivePlatform(p.id)}
              sx={{
                height: 32,
                fontSize: "0.8rem",
                fontWeight: activePlatform === p.id ? 700 : 500,
                bgcolor: activePlatform === p.id ? alpha(preset.primary, 0.12) : alpha("#94a3b8", 0.08),
                color: activePlatform === p.id ? preset.primary : "#475569",
                border: "1px solid",
                borderColor: activePlatform === p.id ? alpha(preset.primary, 0.3) : "transparent",
                cursor: "pointer",
                "&:hover": {
                  bgcolor: activePlatform === p.id ? alpha(preset.primary, 0.15) : alpha("#94a3b8", 0.12),
                },
              }}
            />
          ))}
        </Box>

        {/* Active platform snippet */}
        {platforms
          .filter((p) => p.id === activePlatform)
          .map((p) => (
            <Box key={p.id}>
              <Typography sx={{ fontSize: "0.82rem", color: "#64748b", mb: 0.5 }}>
                {p.description} (<code style={{ fontSize: "0.78rem" }}>{p.filename}</code>):
              </Typography>
              <CodeBlock code={getPipelineSnippet(p.id)} />
            </Box>
          ))}

        {/* Environment variables note */}
        <Alert severity="info" sx={{ mt: 2.5, "& .MuiAlert-message": { fontSize: "0.82rem" } }}>
          <strong>Important:</strong> Store your <code>DEEPVIEW_API_KEY</code> as a secret/protected variable in your CI/CD platform.
          Never commit API keys directly to your repository.
        </Alert>
      </Paper>
    </Box>
  );
}
