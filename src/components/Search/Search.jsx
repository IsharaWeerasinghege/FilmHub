import React, { useEffect, useState } from "react";
import { IconButton, InputAdornment, InputBase } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { CloseRounded, Search as SearchIcon } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { searchMovie } from "../../features/currentGenreOrCategory";

const Search = () => {
  const { searchQuery } = useSelector((state) => state.currentGenreOrCategory);
  const [query, setQuery] = useState(searchQuery);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // keep the field in sync when the search is changed elsewhere (genre click, voice command)
  useEffect(() => {
    setQuery(searchQuery);
  }, [searchQuery]);

  const submit = (value) => {
    dispatch(searchMovie(value.trim()));
    if (location.pathname !== "/") navigate("/");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") submit(query);
    if (event.key === "Escape") event.currentTarget.blur();
  };

  const clear = () => {
    setQuery("");
    if (searchQuery) submit("");
  };

  return (
    <InputBase
      fullWidth
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="Search movies…"
      inputProps={{ "aria-label": "Search movies" }}
      startAdornment={
        <InputAdornment position="start" sx={{ color: "text.secondary", ml: 0.5 }}>
          <SearchIcon fontSize="small" />
        </InputAdornment>
      }
      endAdornment={
        query && (
          <InputAdornment position="end">
            <IconButton size="small" onClick={clear} aria-label="Clear search">
              <CloseRounded fontSize="small" />
            </IconButton>
          </InputAdornment>
        )
      }
      sx={{
        height: 44,
        px: 1.5,
        borderRadius: 999,
        fontSize: "0.95rem",
        bgcolor: (theme) => alpha(theme.palette.text.primary, 0.05),
        border: 1,
        borderColor: "divider",
        transition: "all .2s",
        "&:hover": { bgcolor: (theme) => alpha(theme.palette.text.primary, 0.08) },
        "&.Mui-focused": {
          borderColor: "primary.main",
          bgcolor: "background.paper",
          boxShadow: (theme) => `0 0 0 4px ${alpha(theme.palette.primary.main, 0.15)}`,
        },
      }}
    />
  );
};

export default Search;
