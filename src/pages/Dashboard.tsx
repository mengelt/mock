import { useMemo, useState } from "react";
import {
  Box,
  Typography,
  InputBase,
  TablePagination,
  alpha,
} from "@mui/material";
import { SearchRounded } from "@mui/icons-material";
import SummaryCards from "../components/SummaryCards";
import ProjectGroup from "../components/ProjectGroup";
import { projectGroups } from "../data/mockData";
import type { ProjectGroup as ProjectGroupType } from "../data/types";

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Flatten all projects, filter by search, then re-group for display
  const { filtered, totalCount } = useMemo(() => {
    const q = search.toLowerCase();
    const groups: ProjectGroupType[] = [];

    for (const g of projectGroups) {
      const matching = q
        ? g.projects.filter((p) => p.name.toLowerCase().includes(q))
        : g.projects;
      if (matching.length > 0) {
        groups.push({ name: g.name, projects: matching });
      }
    }

    const total = groups.reduce((sum, g) => sum + g.projects.length, 0);
    return { filtered: groups, totalCount: total };
  }, [search]);

  // Paginate across flattened project list, then re-group for rendering
  const pagedGroups = useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;

    let idx = 0;
    const groups: ProjectGroupType[] = [];

    for (const g of filtered) {
      const slice: typeof g.projects = [];
      for (const p of g.projects) {
        if (idx >= start && idx < end) slice.push(p);
        idx++;
      }
      if (slice.length > 0) groups.push({ name: g.name, projects: slice });
    }

    return groups;
  }, [filtered, page, rowsPerPage]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(0);
  };

  return (
    <Box>
      {/* Page header */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontSize: "1.65rem", mb: 0.3 }}>
            Applications
          </Typography>
          <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>
            Monitor your software supply chain across all applications
          </Typography>
        </Box>
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
          }}
        >
          <SearchRounded sx={{ color: "#94a3b8", fontSize: 20 }} />
          <InputBase
            placeholder="Search projects..."
            value={search}
            onChange={handleSearch}
            sx={{ fontSize: "0.85rem", width: 220 }}
          />
        </Box>
      </Box>

      {/* Summary stats */}
      <SummaryCards />

      {/* Project groups (paged) */}
      {pagedGroups.length > 0 ? (
        pagedGroups.map((group) => (
          <ProjectGroup key={group.name} group={group} />
        ))
      ) : (
        <Box sx={{ py: 6, textAlign: "center" }}>
          <Typography sx={{ color: "#94a3b8", fontSize: "0.9rem" }}>
            No projects matching "{search}"
          </Typography>
        </Box>
      )}

      {/* Pagination */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mt: 1,
        }}
      >
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[10, 25, 50]}
          labelRowsPerPage="Projects per page:"
          sx={{
            "& .MuiTablePagination-toolbar": { minHeight: 44 },
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
              fontSize: "0.82rem",
              color: "#64748b",
            },
          }}
        />
      </Box>
    </Box>
  );
}
