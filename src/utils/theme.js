import { alpha, createTheme } from "@mui/material/styles";

export const SIDEBAR_WIDTH = 264;
export const TOPBAR_HEIGHT = 72;

const brand = {
  primary: "#ff3d5a",
  secondary: "#ff8a3d",
  gradient: "linear-gradient(135deg, #ff3d5a 0%, #ff8a3d 100%)",
};

const palettes = {
  dark: {
    background: { default: "#09090d", paper: "#121219" },
    surface: "#16161f",
    text: { primary: "#f5f5f7", secondary: "#9b9bab" },
    divider: "rgba(255,255,255,0.07)",
  },
  light: {
    background: { default: "#f5f5f8", paper: "#ffffff" },
    surface: "#ffffff",
    text: { primary: "#111118", secondary: "#5d5d6e" },
    divider: "rgba(17,17,24,0.08)",
  },
};

export const getTheme = (mode) => {
  const p = palettes[mode];

  return createTheme({
    palette: {
      mode,
      primary: { main: brand.primary, contrastText: "#fff" },
      secondary: { main: brand.secondary },
      background: p.background,
      text: p.text,
      divider: p.divider,
    },
    custom: {
      gradient: brand.gradient,
      surface: p.surface,
      glass: alpha(p.background.default, 0.72),
    },
    shape: { borderRadius: 5 },
    typography: {
      fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
      h1: { fontFamily: '"Outfit", sans-serif', fontWeight: 800, letterSpacing: "-0.03em" },
      h2: { fontFamily: '"Outfit", sans-serif', fontWeight: 800, letterSpacing: "-0.02em" },
      h3: { fontFamily: '"Outfit", sans-serif', fontWeight: 700, letterSpacing: "-0.02em" },
      h4: { fontFamily: '"Outfit", sans-serif', fontWeight: 700, letterSpacing: "-0.01em" },
      h5: { fontFamily: '"Outfit", sans-serif', fontWeight: 700 },
      h6: { fontFamily: '"Outfit", sans-serif', fontWeight: 600 },
      button: { textTransform: "none", fontWeight: 600, letterSpacing: 0 },
      overline: { fontWeight: 700, letterSpacing: "0.12em" },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: p.background.default,
            backgroundImage:
              mode === "dark"
                ? "radial-gradient(1200px 600px at 100% -10%, rgba(255,61,90,0.10), transparent 60%), radial-gradient(900px 500px at -10% 110%, rgba(255,138,61,0.06), transparent 60%)"
                : "radial-gradient(1200px 600px at 100% -10%, rgba(255,61,90,0.07), transparent 60%)",
            backgroundAttachment: "fixed",
            WebkitFontSmoothing: "antialiased",
          },
          "::selection": { background: alpha(brand.primary, 0.35) },
          "::-webkit-scrollbar": { width: 10, height: 10 },
          "::-webkit-scrollbar-track": { background: "transparent" },
          "::-webkit-scrollbar-thumb": {
            background: mode === "dark" ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.15)",
            borderRadius: 10,
            border: `2px solid ${p.background.default}`,
          },
          "@keyframes fadeUp": {
            from: { opacity: 0, transform: "translateY(16px)" },
            to: { opacity: 1, transform: "translateY(0)" },
          },
          "@keyframes fadeIn": {
            from: { opacity: 0 },
            to: { opacity: 1 },
          },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: { borderRadius: 999, paddingInline: 20 },
          sizeLarge: { paddingBlock: 11, paddingInline: 26, fontSize: "0.95rem" },
          containedPrimary: {
            background: brand.gradient,
            boxShadow: `0 8px 24px -8px ${alpha(brand.primary, 0.6)}`,
            "&:hover": {
              background: brand.gradient,
              filter: "brightness(1.08)",
              boxShadow: `0 10px 28px -6px ${alpha(brand.primary, 0.7)}`,
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: { root: { fontWeight: 600, borderRadius: 999 } },
      },
      MuiPaper: {
        styleOverrides: { root: { backgroundImage: "none" } },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: { borderRadius: 8, fontWeight: 500, fontSize: "0.75rem" },
        },
      },
      MuiPaginationItem: {
        styleOverrides: {
          root: {
            fontWeight: 600,
            borderRadius: 10,
            "&.Mui-selected": {
              background: brand.gradient,
              color: "#fff",
              "&:hover": { background: brand.gradient },
            },
          },
        },
      },
    },
  });
};
