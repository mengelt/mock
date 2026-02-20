import { Box, Typography, Chip, alpha } from "@mui/material";
import { FolderRounded } from "@mui/icons-material";
import ProjectCard from "./ProjectCard";

export default function ProjectGroup({ group }) {
  const totalVulns = group.projects.reduce(
    (sum, p) =>
      sum + p.vulnerabilities.critical + p.vulnerabilities.high + p.vulnerabilities.medium + p.vulnerabilities.low,
    0
  );
  const hasCritical = group.projects.some((p) => p.vulnerabilities.critical > 0);

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
        <FolderRounded sx={{ color: "#3b82f6", fontSize: 20 }} />
        <Typography variant="subtitle1" sx={{ fontSize: "0.9rem" }}>
          {group.name}
        </Typography>
        <Chip
          label={`${group.projects.length} ${group.projects.length === 1 ? "project" : "projects"}`}
          size="small"
          sx={{
            height: 22,
            fontSize: "0.7rem",
            bgcolor: alpha("#3b82f6", 0.08),
            color: "#3b82f6",
            fontWeight: 600,
          }}
        />
        {hasCritical && (
          <Chip
            label="Critical"
            size="small"
            sx={{
              height: 22,
              fontSize: "0.7rem",
              bgcolor: alpha("#dc2626", 0.08),
              color: "#dc2626",
              fontWeight: 700,
            }}
          />
        )}
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {group.projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </Box>
    </Box>
  );
}
