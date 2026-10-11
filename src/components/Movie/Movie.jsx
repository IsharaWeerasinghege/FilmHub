import React from "react";
import { Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Star, LocalMoviesOutlined, PlayArrowRounded } from "@mui/icons-material";
import { Link } from "react-router-dom";

export const ratingColor = (rating) => {
  if (rating >= 7) return "#22c55e";
  if (rating >= 5) return "#f59e0b";
  return "#ef4444";
};

const Movie = ({ movie, i = 0 }) => {
  const year = movie.release_date?.slice(0, 4);
  const rating = movie.vote_average ? Number(movie.vote_average).toFixed(1) : null;

  return (
    <Box
      component={Link}
      to={`/movie/${movie.id}`}
      sx={{
        display: "block",
        minWidth: 0,
        textDecoration: "none",
        color: "text.primary",
        opacity: 0,
        animation: "fadeUp .5s cubic-bezier(.2,.7,.2,1) forwards",
        animationDelay: `${Math.min(i, 20) * 35}ms`,
        "&:hover .poster": {
          transform: "translateY(-6px)",
          boxShadow: (theme) => `0 20px 40px -12px ${alpha(theme.palette.common.black, 0.6)}`,
        },
        "&:hover .poster img": { transform: "scale(1.07)" },
        "&:hover .overlay": { opacity: 1 },
        "&:hover .title": { color: "primary.main" },
        "&:focus-visible": { outline: "none" },
        "&:focus-visible .poster": {
          outline: (theme) => `2px solid ${theme.palette.primary.main}`,
          outlineOffset: 3,
        },
      }}
    >
      <Box
        className="poster"
        sx={{
          position: "relative",
          aspectRatio: "2 / 3",
          borderRadius: 3,
          overflow: "hidden",
          bgcolor: "action.hover",
          transition: "transform .35s cubic-bezier(.2,.7,.2,1), box-shadow .35s",
        }}
      >
        {movie.poster_path ? (
          <Box
            component="img"
            loading="lazy"
            alt={movie.title}
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            sx={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .6s cubic-bezier(.2,.7,.2,1)" }}
          />
        ) : (
          <Box sx={{ height: "100%", display: "grid", placeItems: "center", color: "text.secondary" }}>
            <LocalMoviesOutlined sx={{ fontSize: 48, opacity: 0.4 }} />
          </Box>
        )}

        {rating && (
          <Box
            sx={{
              position: "absolute",
              top: 10,
              left: 10,
              display: "flex",
              alignItems: "center",
              gap: 0.4,
              px: 1,
              py: 0.4,
              borderRadius: 2,
              fontSize: "0.78rem",
              fontWeight: 700,
              color: "#fff",
              bgcolor: "rgba(10,10,14,0.65)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <Star sx={{ fontSize: 14, color: ratingColor(movie.vote_average) }} />
            {rating}
          </Box>
        )}

        <Box
          className="overlay"
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            p: 1.75,
            opacity: 0,
            transition: "opacity .3s",
            color: "#fff",
            background: "linear-gradient(0deg, rgba(8,8,12,.95) 0%, rgba(8,8,12,.55) 50%, rgba(8,8,12,0) 100%)",
          }}
        >
          {movie.overview && (
            <Typography
              variant="caption"
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 4,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                lineHeight: 1.45,
                opacity: 0.85,
                mb: 1.25,
              }}
            >
              {movie.overview}
            </Typography>
          )}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, fontSize: "0.8rem", fontWeight: 700 }}>
            <PlayArrowRounded sx={{ fontSize: 20 }} /> View details
          </Box>
        </Box>
      </Box>

      <Typography className="title" noWrap sx={{ mt: 1.5, fontWeight: 600, fontSize: "0.95rem", transition: "color .2s" }}>
        {movie.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
        {year || "—"}
      </Typography>
    </Box>
  );
};

export default Movie;
