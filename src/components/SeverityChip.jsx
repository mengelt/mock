import { Box, Typography, alpha } from "@mui/material";

const config = {
  critical: { color: "#dc2626", label: "C" },
  high: { color: "#f59e0b", label: "H" },
  medium: { color: "#6366f1", label: "M" },
  low: { color: "#22c55e", label: "L" },
};

export default function SeverityChip({ severity, count }) {
  const { color, label } = config[severity];
  const isEmpty = count === 0;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 56 }}>
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          bgcolor: isEmpty ? alpha("#94a3b8", 0.08) : alpha(color, 0.1),
          border: "2px solid",
          borderColor: isEmpty ? alpha("#94a3b8", 0.15) : alpha(color, 0.35),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 0.5,
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "1rem",
            color: isEmpty ? "#94a3b8" : color,
            lineHeight: 1,
          }}
        >
          {count}
        </Typography>
      </Box>
      <Typography
        sx={{
          fontSize: "0.65rem",
          fontWeight: 600,
          color: isEmpty ? "#94a3b8" : "#64748b",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {severity}
      </Typography>
    </Box>
  );
}
