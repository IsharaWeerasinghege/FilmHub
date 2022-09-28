import React from "react";
import { CssBaseline } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import {Profile, Actors, Movies, MovieInformation, NavBar} from './';
import './App';


const App = () => {

  return (
    <div className="App">
      <CssBaseline/>
      <NavBar/>
      <main>
      <h1>Welcome to React Router!</h1>
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
