import React from "react";
import { Grid } from "@mui/material";

import useStyles from "./style";
import Movie from "../Movie/Movie";

const MovieList = (movies) => {
  const classes = useStyles();
  return (
    <Grid container className={classes.movieContainer}>
      {movies.movies.results.map((movie, i) => (
        <Movie key={`movieId${i}`} movie={movie} i={i} />
      ))}
    </Grid>
  );
};

export default MovieList;
