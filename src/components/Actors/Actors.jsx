import React, { useState } from "react";
import { Box, Button, Chip, Skeleton, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowBackRounded,
  CakeOutlined,
  ErrorOutlineRounded,
  OpenInNewRounded,
  PlaceOutlined,
  PersonRounded,
} from "@mui/icons-material";
import {
  useGetActorQuery,
  useGetMoviesByActorIdQuery,
} from "../../services/TMDB";
import { EmptyState, MovieList, MovieListSkeleton, Pagination, SectionHeader } from "../index";

const getAge = (birthday, deathday) => {
  if (!birthday) return null;
  const end = deathday ? new Date(deathday) : new Date();
  const start = new Date(birthday);
  let age = end.getFullYear() - start.getFullYear();
  const m = end.getMonth() - start.getMonth();
  if (m < 0 || (m === 0 && end.getDate() < start.getDate())) age -= 1;
  return age;
};

const Actors = () => {
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState(false);
  const { id } = useParams();
  const { data, isFetching, error } = useGetActorQuery(id);
  const { data: movies, isFetching: moviesFetching } = useGetMoviesByActorIdQuery({ id, page });
  const navigate = useNavigate();

  if (isFetching) {
    return (
      <Box>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "300px 1fr" }, gap: 5, mb: 7 }}>
          <Skeleton variant="rounded" sx={{ aspectRatio: "2 / 3", height: "auto", borderRadius: 4 }} />
          <Box>
            <Skeleton width="60%" height={72} />
            <Skeleton width="40%" />
            <Skeleton height={140} sx={{ mt: 2 }} />
          </Box>
        </Box>
        <MovieListSkeleton count={6} />
      </Box>
    );
  }

  if (error || !data) {
    return (
      <EmptyState
        icon={ErrorOutlineRounded}
        title="Couldn't load this person"
        description="Something went wrong while fetching their profile."
        action={
          <Button variant="contained" startIcon={<ArrowBackRounded />} onClick={() => navigate(-1)}>
            Go back
          </Button>
        }
      />
    );
  }

  const age = getAge(data.birthday, data.deathday);
  const bio = data.biography || "Sorry, no biography yet...";
  const isLongBio = bio.length > 600;

  return (
    <Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "300px 1fr", lg: "340px 1fr" },
          gap: { xs: 4, md: 6 },
          alignItems: "start",
          mb: { xs: 5, md: 8 },
          animation: "fadeIn .5s ease",
        }}
      >
        <Box
          sx={{
            width: { xs: "65%", sm: 280, md: "100%" },
            mx: { xs: "auto", md: 0 },
            aspectRatio: "2 / 3",
            borderRadius: 4,
            overflow: "hidden",
            bgcolor: "action.hover",
            display: "grid",
            placeItems: "center",
            boxShadow: "0 30px 60px -25px rgba(0,0,0,.55)",
          }}
        >
          {data.profile_path ? (
            <Box
              component="img"
              src={`https://image.tmdb.org/t/p/w780${data.profile_path}`}
              alt={data.name}
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <PersonRounded sx={{ fontSize: 96, opacity: 0.3 }} />
          )}
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Button onClick={() => navigate(-1)} startIcon={<ArrowBackRounded />} size="small" color="inherit" sx={{ mb: 2, border: 1, borderColor: "divider" }}>
            Back
          </Button>
          {data.known_for_department && (
            <Typography variant="overline" color="primary" component="div">
              {data.known_for_department}
            </Typography>
          )}
          <Typography variant="h2" component="h1" sx={{ fontSize: { xs: "2.2rem", md: "3.25rem" }, lineHeight: 1.05, mb: 2.5 }}>
            {data.name}
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
            {data.birthday && (
              <Chip
                icon={<CakeOutlined />}
                variant="outlined"
                label={`${new Date(data.birthday).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}${age !== null ? ` · ${age} yrs` : ""}`}
              />
            )}
            {data.place_of_birth && <Chip icon={<PlaceOutlined />} variant="outlined" label={data.place_of_birth} />}
          </Box>

          <Typography
            color="text.secondary"
            sx={{
              lineHeight: 1.8,
              whiteSpace: "pre-line",
              ...(!expanded && isLongBio && {
                display: "-webkit-box",
                WebkitLineClamp: 7,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }),
            }}
          >
            {bio}
          </Typography>
          {isLongBio && (
            <Button onClick={() => setExpanded((v) => !v)} sx={{ mt: 1, px: 0, minWidth: 0 }}>
              {expanded ? "Show less" : "Read more"}
            </Button>
          )}

          {data.imdb_id && (
            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                target="_blank"
                rel="noopener noreferrer"
                href={`https://www.imdb.com/name/${data.imdb_id}`}
                endIcon={<OpenInNewRounded fontSize="small" />}
              >
                View on IMDb
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      <SectionHeader eyebrow="Filmography" title="Known for" />
      {moviesFetching ? (
        <MovieListSkeleton count={12} />
      ) : movies?.results?.length ? (
        <MovieList movies={movies} />
      ) : (
        <EmptyState title="No movies found" />
      )}
      <Pagination currentPage={page} setPage={setPage} totalPage={movies?.total_pages} />
    </Box>
  );
};

export default Actors;
