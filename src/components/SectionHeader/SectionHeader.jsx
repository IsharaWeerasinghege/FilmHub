import React from "react";
import { Box, Typography } from "@mui/material";

const SectionHeader = ({ eyebrow, title, subtitle, action }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: { xs: "flex-start", sm: "flex-end" },
      justifyContent: "space-between",
      flexDirection: { xs: "column", sm: "row" },
      gap: 2,
      mb: 3,
    }}
  >
    <Box>
      {eyebrow && (
        <Typography variant="overline" color="primary" sx={{ display: "block", lineHeight: 1.6 }}>
          {eyebrow}
        </Typography>
      )}
      <Typography
        variant="h4"
        component="h2"
        sx={{ fontSize: { xs: "1.6rem", md: "2rem" }, display: "flex", alignItems: "center", gap: 1.5 }}
      >
        <Box
          component="span"
          sx={{
            width: 6,
            height: "1.1em",
            borderRadius: 3,
            background: (theme) => theme.custom.gradient,
            flexShrink: 0,
          }}
        />
        {title}
      </Typography>
      {subtitle && (
        <Typography color="text.secondary" sx={{ mt: 0.75, ml: 2.25 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
    {action}
  </Box>
);

export default SectionHeader;
