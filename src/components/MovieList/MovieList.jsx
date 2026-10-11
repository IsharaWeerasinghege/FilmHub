import React from "react";
import { Box, Skeleton } from "@mui/material";

import Movie from "../Movie/Movie";

const gridSx = {
  display: "grid",
  gridTemplateColumns: {
    xs: "repeat(2, minmax(0, 1fr))",
    sm: "repeat(auto-fill, minmax(170px, 1fr))",
    xl: "repeat(auto-fill, minmax(190px, 1fr))",
  },
  columnGap: { xs: 2, md: 3 },
  rowGap: { xs: 3, md: 4 },
};

const MovieList = ({ movies, numberOfMovies, startFrom = 0 }) => (
  <Box sx={gridSx}>
    {movies?.results?.slice(startFrom, numberOfMovies).map((movie, i) => (
      <Movie key={movie.id} movie={movie} i={i} />
    ))}
  </Box>
);

export const MovieListSkeleton = ({ count = 12 }) => (
  <Box sx={gridSx}>
    {Array.from({ length: count }).map((_, i) => (
      <Box key={i}>
        <Skeleton variant="rounded" sx={{ aspectRatio: "2 / 3", height: "auto", borderRadius: 3 }} />
        <Skeleton width="80%" sx={{ mt: 1.5 }} />
        <Skeleton width="30%" />
      </Box>
    ))}
  </Box>
);

export default MovieList;
