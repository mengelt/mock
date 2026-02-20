import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Button,
  Paper,
  Alert,
  alpha,
} from "@mui/material";
import {
  RocketLaunchRounded,
  InfoOutlined,
  CheckCircleOutlineRounded,
} from "@mui/icons-material";

const ecosystems = [
  { value: "npm", label: "NPM" },
  { value: "maven", label: "Maven (coming soon)", disabled: true },
  { value: "pypi", label: "PyPI (coming soon)", disabled: true },
  { value: "nuget", label: "NuGet (coming soon)", disabled: true },
];

const initialState = {
  esatsId: "",
  projectSlug: "",
  ecosystem: "npm",
  gitlabProjectId: "",
  repoVisibility: "private",
  gitlabAccessToken: "",
  description: "",
};

export default function CreateApiToken() {
  const [form, setForm] = useState(initialState);

  const update = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleClear = () => setForm(initialState);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Future: POST to API
  };

  return (
    <Box>
      {/* Page header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontSize: "1.65rem", mb: 0.3 }}>
          Create API Token
        </Typography>
        <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>
          Register a new project and generate an API token for CI/CD scanning
        </Typography>
      </Box>

      <Paper sx={{ maxWidth: 720, p: 0, overflow: "hidden" }}>
        {/* Card header */}
        <Box
          sx={{
            px: 3.5,
            py: 2.5,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            borderBottom: "1px solid",
            borderColor: alpha("#94a3b8", 0.15),
          }}
        >
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 2,
              bgcolor: alpha("#3b82f6", 0.1),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <RocketLaunchRounded sx={{ color: "#3b82f6", fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontSize: "1rem" }}>
              Register New Project
            </Typography>
            <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
              Create an API token to enable automated scanning for your project
            </Typography>
          </Box>
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ px: 3.5, py: 3 }}>
          {/* Guidelines */}
          <Alert
            icon={<InfoOutlined sx={{ fontSize: 20 }} />}
            severity="info"
            sx={{
              mb: 3.5,
              bgcolor: alpha("#3b82f6", 0.06),
              border: "1px solid",
              borderColor: alpha("#3b82f6", 0.15),
              color: "#1e293b",
              "& .MuiAlert-icon": { color: "#3b82f6" },
              borderRadius: 2,
            }}
          >
            <Typography sx={{ fontWeight: 600, fontSize: "0.82rem", mb: 0.5 }}>
              Important Guidelines
            </Typography>
            {[
              "Use a unique Project Slug per ESATS ID (e.g., ui, api, worker)",
              "The API key is used by CI/CD to trigger scans for this project",
              "API tokens are shown once and cannot be recovered later",
            ].map((text) => (
              <Box key={text} sx={{ display: "flex", alignItems: "flex-start", gap: 0.75, mb: 0.3 }}>
                <CheckCircleOutlineRounded sx={{ fontSize: 15, color: "#22c55e", mt: "2px", flexShrink: 0 }} />
                <Typography sx={{ fontSize: "0.78rem", color: "#475569" }}>{text}</Typography>
              </Box>
            ))}
          </Alert>

          {/* ESATS ID */}
          <TextField
            label="ESATS ID"
            required
            fullWidth
            size="small"
            value={form.esatsId}
            onChange={update("esatsId")}
            helperText="Enter the current ESATS identifier for the application"
            sx={{ mb: 2.5 }}
          />

          {/* Project Slug */}
          <TextField
            label="Project Slug"
            required
            fullWidth
            size="small"
            value={form.projectSlug}
            onChange={update("projectSlug")}
            helperText="Unique within this ESATS ID (e.g., ui, backend, auth-service)"
            sx={{ mb: 2.5 }}
          />

          {/* Ecosystem / Type */}
          <TextField
            label="Ecosystem / Type"
            required
            fullWidth
            size="small"
            select
            value={form.ecosystem}
            onChange={update("ecosystem")}
            helperText="Only NPM is supported at this time"
            sx={{ mb: 2.5 }}
          >
            {ecosystems.map((opt) => (
              <MenuItem key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>

          {/* GitLab Project ID */}
          <TextField
            label="GitLab Project ID"
            required
            fullWidth
            size="small"
            value={form.gitlabProjectId}
            onChange={update("gitlabProjectId")}
            helperText="Numeric GitLab Project ID used to retrieve repository information"
            sx={{ mb: 2.5 }}
          />

          {/* Repository Visibility */}
          <FormControl sx={{ mb: 2.5 }}>
            <FormLabel
              sx={{
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "#1e293b",
                mb: 0.5,
                "&.Mui-focused": { color: "#1e293b" },
              }}
            >
              Repository Visibility
            </FormLabel>
            <RadioGroup
              row
              value={form.repoVisibility}
              onChange={update("repoVisibility")}
            >
              <FormControlLabel
                value="public"
                control={<Radio size="small" />}
                label={<Typography sx={{ fontSize: "0.85rem" }}>Public</Typography>}
              />
              <FormControlLabel
                value="private"
                control={<Radio size="small" />}
                label={<Typography sx={{ fontSize: "0.85rem" }}>Private</Typography>}
              />
            </RadioGroup>
          </FormControl>

          {/* GitLab Project Access Token — only for private */}
          {form.repoVisibility === "private" && (
            <TextField
              label="GitLab Project Access Token"
              required
              fullWidth
              size="small"
              type="password"
              value={form.gitlabAccessToken}
              onChange={update("gitlabAccessToken")}
              helperText="Required for private repositories. Used for DeepView to access repo metadata"
              sx={{ mb: 2.5 }}
            />
          )}

          {/* Description */}
          <TextField
            label="Description (optional)"
            fullWidth
            size="small"
            multiline
            minRows={3}
            value={form.description}
            onChange={update("description")}
            helperText="Add any helpful context (team name, tool purpose, scan notes)"
            sx={{ mb: 3 }}
          />

          {/* Actions */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 1.5,
              pt: 2,
              borderTop: "1px solid",
              borderColor: alpha("#94a3b8", 0.15),
            }}
          >
            <Button
              variant="outlined"
              onClick={handleClear}
              sx={{
                color: "#64748b",
                borderColor: alpha("#94a3b8", 0.3),
                "&:hover": { borderColor: "#94a3b8", bgcolor: alpha("#94a3b8", 0.06) },
              }}
            >
              Clear
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                px: 3,
                boxShadow: "none",
                "&:hover": { boxShadow: "none" },
              }}
            >
              Create API Token
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
