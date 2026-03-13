import { Box, Container } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar, { DRAWER_WIDTH } from "./Sidebar";
import TopBar from "./TopBar";

export default function AppShell() {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <TopBar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: "56px",
          py: 3,
          maxWidth: `calc(100% - ${DRAWER_WIDTH}px)`,
        }}
      >
        <Container maxWidth="lg">
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
}
