import React from "react";
import { Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { MovieFilterOutlined } from "@mui/icons-material";

const EmptyState = ({ icon: Icon = MovieFilterOutlined, title, description, action }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      py: { xs: 8, md: 12 },
      px: 3,
      borderRadius: 4,
      border: 1,
      borderStyle: "dashed",
      borderColor: "divider",
      animation: "fadeIn .4s ease",
    }}
  >
    <Box
      sx={{
        width: 72,
        height: 72,
        borderRadius: "50%",
        display: "grid",
        placeItems: "center",
        mb: 2.5,
        color: "primary.main",
        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
      }}
    >
      <Icon sx={{ fontSize: 34 }} />
    </Box>
    <Typography variant="h5" gutterBottom>
      {title}
    </Typography>
    {description && (
      <Typography color="text.secondary" sx={{ maxWidth: 440 }}>
        {description}
      </Typography>
    )}
    {action && <Box sx={{ mt: 3 }}>{action}</Box>}
  </Box>
);

export default EmptyState;
