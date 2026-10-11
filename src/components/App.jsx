import React, { useEffect } from "react";
import { Box, CssBaseline } from "@mui/material";
import { Route, Routes, useLocation } from "react-router-dom";
import { Profile, Actors, Movies, MovieInformation, NavBar } from './';
import useAlan from "./Alan";
import { TOPBAR_HEIGHT } from "../utils/theme";

const App = () => {
  const { pathname } = useLocation();

  useAlan();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />
      <NavBar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          pt: `${TOPBAR_HEIGHT + 24}px`,
          pb: 8,
          px: { xs: 2, sm: 3, md: 4, lg: 5 },
        }}
      >
        <Box sx={{ maxWidth: 1640, mx: "auto" }}>
          <Routes>
            <Route path="/movie/:id" element={<MovieInformation />} />
            <Route path="/actors/:id" element={<Actors />} />
            <Route path="/" element={<Movies />} />
            <Route path="/approved" element={<Movies />} />
            <Route path="/profile/:id" element={<Profile />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
};

export default App;
