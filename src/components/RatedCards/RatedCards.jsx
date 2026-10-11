import React from 'react';
import {Box, Chip, Typography} from "@mui/material";
import {MovieList, SectionHeader} from "../index";

const RatedCards = ({title, eyebrow, data, emptyText}) => (
    <Box sx={{mb: {xs: 6, md: 8}}}>
        <SectionHeader
            eyebrow={eyebrow}
            title={title}
            action={<Chip label={`${data?.total_results ?? data?.results?.length ?? 0} titles`} variant="outlined"/>}
        />
        {data?.results?.length ? (
            <MovieList movies={data}/>
        ) : (
            <Typography color="text.secondary" sx={{py: 4}}>
                {emptyText}
            </Typography>
        )}
    </Box>
);

export default RatedCards;
