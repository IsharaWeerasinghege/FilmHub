import React from "react";
import { CssBaseline } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import {Profile, Actors, Movies, MovieInformation, NavBar} from './';

import useStyles from './Styles';

const App = () => {

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline/>
      <NavBar />
      <main className={classes.content}>
      <div className={classes.toolbar } />
      <Routes>
        <Route path="/movie/:id" element={<MovieInformation />} />
        <Route path="/actors/:id" element={<Actors />} />
        <Route path="/" element={<Movies />} />
        <Route path="/profile/:id" element={<Profile />} />
      </Routes>
      </main>
    </div>
  );
}

export default App;
