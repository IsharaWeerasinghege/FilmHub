import React from 'react';
import {Link} from 'react-router-dom';
import {Box, Button, Chip, Typography} from "@mui/material";
import {InfoOutlined, LocalFireDepartmentRounded, Star} from "@mui/icons-material";

const FeaturedMovie = ({movie}) => {
    if (!movie) return null;

    const year = movie.release_date?.slice(0, 4);

    return (
        <Box
            component={Link}
            to={`/movie/${movie.id}`}
            sx={{
                position: 'relative',
                display: 'block',
                height: {xs: 420, sm: 460, lg: 540},
                borderRadius: {xs: 4, md: 5},
                overflow: 'hidden',
                mb: {xs: 5, md: 7},
                textDecoration: 'none',
                color: '#fff',
                bgcolor: '#000',
                animation: 'fadeIn .6s ease',
                boxShadow: '0 30px 60px -30px rgba(0,0,0,.6)',
                '&:hover .backdrop': {transform: 'scale(1.04)'},
            }}
        >
            {movie.backdrop_path && (
                <Box
                    className="backdrop"
                    component="img"
                    src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                    alt={movie.title}
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center top',
                        transition: 'transform 1.4s cubic-bezier(.2,.7,.2,1)',
                    }}
                />
            )}
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    background: {
                        xs: 'linear-gradient(0deg, rgba(8,8,12,.98) 0%, rgba(8,8,12,.7) 45%, rgba(8,8,12,.1) 100%)',
                        md: 'linear-gradient(90deg, rgba(8,8,12,.95) 0%, rgba(8,8,12,.7) 35%, rgba(8,8,12,0) 70%), linear-gradient(0deg, rgba(8,8,12,.85) 0%, rgba(8,8,12,0) 45%)',
                    },
                }}
            />

            <Box
                sx={{
                    position: 'relative',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    p: {xs: 3, sm: 4, md: 6},
                    maxWidth: {md: '60%', lg: '50%'},
                }}
            >
                <Chip
                    icon={<LocalFireDepartmentRounded sx={{color: '#fff !important'}}/>}
                    label="Featured today"
                    size="small"
                    sx={{
                        alignSelf: 'flex-start',
                        mb: 2,
                        color: '#fff',
                        bgcolor: 'rgba(255,255,255,0.12)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.15)',
                    }}
                />
                <Typography
                    variant="h2"
                    component="h1"
                    sx={{fontSize: {xs: '2rem', sm: '2.75rem', lg: '3.5rem'}, lineHeight: 1.05, mb: 1.5}}
                >
                    {movie.title}
                </Typography>

                <Box sx={{display: 'flex', alignItems: 'center', gap: 2, mb: 2, color: 'rgba(255,255,255,.8)', fontWeight: 600, fontSize: '0.95rem'}}>
                    {movie.vote_average > 0 && (
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
                            <Star sx={{fontSize: 18, color: '#fbbf24'}}/>
                            {Number(movie.vote_average).toFixed(1)}
                        </Box>
                    )}
                    {year && <span>{year}</span>}
                    {movie.original_language && (
                        <Box component="span" sx={{px: 0.75, border: '1px solid rgba(255,255,255,.35)', borderRadius: 1, fontSize: '0.72rem', textTransform: 'uppercase'}}>
                            {movie.original_language}
                        </Box>
                    )}
                </Box>

                <Typography
                    sx={{
                        color: 'rgba(255,255,255,.75)',
                        display: '-webkit-box',
                        WebkitLineClamp: {xs: 3, md: 3},
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        mb: 3,
                        lineHeight: 1.65,
                    }}
                >
                    {movie.overview}
                </Typography>

                <Button component="span" variant="contained" size="large" startIcon={<InfoOutlined/>} sx={{alignSelf: 'flex-start'}}>
                    View details
                </Button>
            </Box>
        </Box>
    );
}

export default FeaturedMovie;
