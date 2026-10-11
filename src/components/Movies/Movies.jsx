import React, { useEffect, useState } from "react";
import { Box, Button, Skeleton } from "@mui/material";
import { SearchOffRounded, ErrorOutlineRounded } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";

import { useGetGenresQuery, useGetMoviesQuery } from "../../services/TMDB";
import { selectGenreOrCategory } from "../../features/currentGenreOrCategory";
import { categories } from "../Sidebar/Sidebar";
import {
  EmptyState,
  FeaturedMovie,
  MovieList,
  MovieListSkeleton,
  Pagination,
  SectionHeader,
} from "../index";

const Movies = () => {
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const { genreIdOrCategoryName, searchQuery } = useSelector(
    (state) => state.currentGenreOrCategory
  );
  const { data: genres } = useGetGenresQuery();
  const { data, error, isFetching } = useGetMoviesQuery({
    genreIdOrCategoryName,
    page,
    searchQuery,
  });

  // start from the first page whenever the selection changes
  useEffect(() => {
    setPage(1);
  }, [genreIdOrCategoryName, searchQuery]);

  const showFeatured = !searchQuery && page === 1;

  const title = (() => {
    if (searchQuery) return `Results for “${searchQuery}”`;
    if (typeof genreIdOrCategoryName === "number") {
      return genres?.genres?.find((g) => g.id === genreIdOrCategoryName)?.name || "Movies";
    }
    return categories.find((c) => c.value === genreIdOrCategoryName)?.label || "Popular";
  })();

  const eyebrow = searchQuery ? "Search" : typeof genreIdOrCategoryName === "number" ? "Genre" : "Browse";
  const subtitle = data?.total_results
    ? `${data.total_results.toLocaleString()} titles · Page ${page} of ${Math.min(data.total_pages, 500).toLocaleString()}`
    : undefined;

  if (isFetching) {
    return (
      <Box>
        {showFeatured && (
          <Skeleton variant="rounded" sx={{ height: { xs: 420, sm: 460, lg: 540 }, borderRadius: 5, mb: { xs: 5, md: 7 } }} />
        )}
        <Skeleton width={260} height={48} sx={{ mb: 3 }} />
        <MovieListSkeleton count={12} />
      </Box>
    );
  }

  if (error) {
    return (
      <EmptyState
        icon={ErrorOutlineRounded}
        title="Something went wrong"
        description="We couldn't load movies right now. Please check your connection and try again."
      />
    );
  }

  if (!data?.results?.length) {
    return (
      <EmptyState
        icon={SearchOffRounded}
        title="No movies found"
        description={`We couldn't find anything matching “${searchQuery}”. Try a different title.`}
        action={
          <Button variant="contained" onClick={() => dispatch(selectGenreOrCategory("popular"))}>
            Browse popular
          </Button>
        }
      />
    );
  }

  return (
    <Box>
      {showFeatured && <FeaturedMovie movie={data.results[0]} />}
      <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />
      <MovieList movies={data} startFrom={showFeatured ? 1 : 0} />
      <Pagination currentPage={page} setPage={setPage} totalPage={data.total_pages} />
    </Box>
  );
};

export default Movies;
