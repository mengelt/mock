import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Typography, Button, alpha, keyframes } from "@mui/material";
import { SecurityRounded, LoginRounded } from "@mui/icons-material";
import { useAppTheme } from "../theme/ThemeContext";

const pulse = keyframes`
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const dotPulse = keyframes`
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; }
  40% { transform: scale(1); opacity: 1; }
`;

export default function SplashScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { preset } = useAppTheme();

  const signedOut = !!location.state?.signedOut;

  const [status, setStatus] = useState(signedOut ? "" : "Connecting...");
  const [loading, setLoading] = useState(!signedOut);

  // Normal boot: auto-redirect after 3.5s
  useEffect(() => {
    if (!loading) return;

    const t1 = setTimeout(() => setStatus("Verifying session..."), 1200);
    const t2 = setTimeout(() => setStatus("Loading workspace..."), 2400);
    const t3 = setTimeout(() => navigate("/app", { replace: true }), 3500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [loading, navigate]);

  // "Sign In" clicked from signed-out state
  const handleSignIn = () => {
    // Clear the signedOut state from history so back button doesn't re-show the message
    window.history.replaceState({}, "");
    setStatus("Connecting...");
    setLoading(true);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: preset.sidebar,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${alpha(preset.primary, 0.08)} 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          animation: `${fadeIn} 0.6s ease-out`,
        }}
      >
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: 3,
            bgcolor: preset.primary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 3,
            boxShadow: `0 0 40px ${alpha(preset.primary, 0.3)}`,
          }}
        >
          <SecurityRounded sx={{ color: "#fff", fontSize: 38 }} />
        </Box>

        <Typography
          sx={{
            color: "#fff",
            fontWeight: 700,
            fontSize: "2rem",
            letterSpacing: "-0.02em",
            lineHeight: 1,
            mb: 1,
          }}
        >
          DeepView
        </Typography>

        <Typography
          sx={{
            color: alpha("#fff", 0.45),
            fontWeight: 500,
            fontSize: "0.9rem",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          Software Composition Analysis
        </Typography>
      </Box>

      <Box
        sx={{
          mt: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          animation: `${fadeIn} 0.6s ease-out 0.3s both`,
        }}
      >
        {loading ? (
          <>
            <Box sx={{ display: "flex", gap: 1 }}>
              {[0, 1, 2].map((i) => (
                <Box
                  key={i}
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: preset.primary,
                    animation: `${dotPulse} 1.4s ease-in-out ${i * 0.16}s infinite`,
                  }}
                />
              ))}
            </Box>

            <Typography
              sx={{
                color: alpha("#fff", 0.35),
                fontSize: "0.78rem",
                fontWeight: 500,
                letterSpacing: "0.02em",
                animation: `${pulse} 2s ease-in-out infinite`,
              }}
            >
              {status}
            </Typography>
          </>
        ) : (
          <>
            <Typography
              sx={{
                color: alpha("#fff", 0.6),
                fontSize: "0.9rem",
                fontWeight: 500,
                mb: 1,
              }}
            >
              You have been signed out
            </Typography>

            <Button
              variant="contained"
              startIcon={<LoginRounded />}
              onClick={handleSignIn}
              sx={{
                bgcolor: preset.primary,
                color: "#fff",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.88rem",
                px: 4,
                py: 1.2,
                borderRadius: 2,
                boxShadow: `0 0 20px ${alpha(preset.primary, 0.3)}`,
                "&:hover": {
                  bgcolor: preset.primary,
                  boxShadow: `0 0 30px ${alpha(preset.primary, 0.5)}`,
                },
              }}
            >
              Sign In
            </Button>
          </>
        )}
      </Box>

      <Typography
        sx={{
          position: "absolute",
          bottom: 24,
          color: alpha("#fff", 0.15),
          fontSize: "0.7rem",
          fontWeight: 500,
          letterSpacing: "0.04em",
        }}
      >
        v1.0.0
      </Typography>
    </Box>
  );
}
