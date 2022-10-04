import React from "react";
import useStyles from "./styles";
import {Button, Typography} from "@mui/material";

const Pagination = ({currentPage, setPage, totalPage}) => {
    const classes = useStyles();

    const handlePrev = () => {
        if (currentPage !== 1) {
            setPage((prevPage) => prevPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage !== totalPage) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    if (totalPage === 0) return null;

    return (
        <div className={classes.container}>
            <Button
                size="small"
                onClick={handlePrev}
                className={classes.button}
                variant="contained"
                color="primary"
                type="button"
            >
                Prev
            </Button>
            <Typography varient="h5" className={classes.pageNumber}>
                {currentPage}
            </Typography>
            <Button
                size="small"
                onClick={handleNext}
                className={classes.button}
                variant="contained"
                color="primary"
                type="button"
            >
                Next
            </Button>
        </div>
    );
};

export default Pagination;
