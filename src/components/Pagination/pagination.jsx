import React from "react";
import { Box, Pagination as MuiPagination, useMediaQuery } from "@mui/material";

// TMDB never serves pages beyond 500
const MAX_PAGES = 500;

const Pagination = ({ currentPage, setPage, totalPage }) => {
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

    if (!totalPage || totalPage <= 1) return null;

    const handleChange = (_, page) => {
        setPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6, mb: 2 }}>
            <MuiPagination
                count={Math.min(totalPage, MAX_PAGES)}
                page={currentPage}
                onChange={handleChange}
                shape="rounded"
                size={isMobile ? "medium" : "large"}
                siblingCount={isMobile ? 0 : 1}
            />
        </Box>
    );
};

export default Pagination;
