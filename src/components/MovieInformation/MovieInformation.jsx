import React, {useEffect, useState} from "react";
import {
    ArrowBack,
    Favorite,
    FavoriteBorderOutlined,
    Language,
    Movie,
    PlusOne,
    Remove,
    Theaters,
} from "@mui/icons-material";
import {Link, useParams} from "react-router-dom";
import {useGetListQuery, useGetMovieQuery, useGetRecommendationsQuery,} from "../../services/TMDB";
import {Box, Button, ButtonGroup, CircularProgress, Grid, Modal, Rating, Typography,} from "@mui/material";
import useStyles from "./styles";
import genresIcons from "../../assets/genres";
import {selectGenreOrCategory} from "../../features/currentGenreOrCategory";
import {useDispatch, useSelector} from "react-redux";
import {MovieList} from "../index";
import {userSelector} from "../../features/auth";
import axios from "axios";

const MovieInformation = () => {
    const {user} = useSelector(userSelector);
    const {id} = useParams();
    const {data, isFetching, error} = useGetMovieQuery(id);
    const classes = useStyles();
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);

    const {data: favoriteMovies} = useGetListQuery({
        listName: 'favorite/movies',
        accountId: user.id,
        sessionId: localStorage.getItem('session_id'),
        page: 1
    })
    const {data: watchListMovies} = useGetListQuery({
        listName: 'watchlist/movies',
        accountId: user.id,
        sessionId: localStorage.getItem('session_id'),
        page: 1
    })
    const {
        data: recommendation,
        isFetching: recommendationFetching,
    } = useGetRecommendationsQuery({list: "/recommendations", movie_id: id});

    const [isMovieFavorited, setIsMovieFavorited] = useState(false)
    const [isMovieWatchlisted, setIsMovieWatchlisted] = useState(false)

    useEffect(() => {
        setIsMovieFavorited(!!favoriteMovies?.results?.find((movie) => movie?.id === data?.id))
    }, [favoriteMovies, data])

    useEffect(() => {
        setIsMovieWatchlisted(!!watchListMovies?.results?.find((movie) => movie?.id === data?.id))
    }, [watchListMovies, data])

    const addToFavorites = async () => {
        await axios.post(`https://api.themoviedb.org/3/account/${user.id}/favorite?api_key=${process.env.REACT_APP_TMDB_KEY}&session_id=${localStorage.getItem("session_id")}`, {
            media_type: 'movie',
            media_id: id,
            favorite: !isMovieFavorited,
        })

        setIsMovieFavorited((prev) => !prev)
        console.log({isMovieFavorited})
    };

    const addToWatchlist = async () => {
        await axios.post(`https://api.themoviedb.org/3/account/${user.id}/watchlist?api_key=${process.env.REACT_APP_TMDB_KEY}&session_id=${localStorage.getItem("session_id")}`, {
            media_type: 'movie',
            media_id: id,
            watchlist: !isMovieWatchlisted,
        })

        setIsMovieWatchlisted((prev) => !prev)
    };


    if (isFetching) {
        return (
            <Box display="flex" justifyContent="center" alignItem="center">
                <CircularProgress size="4rem"/>
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItem="center">
                <Link to="/">Something has go wrong - Go back</Link>
            </Box>
        );
    }

    return (
        <Grid container className={classes.containerSpaceAround}>
            <Grid item sm={12} md={6} lg={4} align="center">
                <img
                    className={classes.poster}
                    src={`https://image.tmdb.org/t/p/w500/${data?.poster_path}`}
                    alt={data?.title}
                />
            </Grid>
            <Grid item container direction="column" lg={7}>
                <Typography variant="h3" align="center" gutterBottom>
                    {data?.title} ({data.release_date.split("-")[0]})
                </Typography>
                <Typography variant="h5" align="center" gutterBottom>
                    {data?.tagline}
                </Typography>
                <Grid item className={classes.containerSpaceAround}>
                    <Box display="flex" align="center">
                        <Rating readOnly value={data.vote_average / 2}/>
                        <Typography
                            variant="subtitle1"
                            gutterBottom
                            style={{marginLeft: "10px"}}
                        >
                            {data?.vote_average} / 10
                        </Typography>
                    </Box>
                    <Typography variant="h6" align="center" gutterBottom>
                        {data?.runtime}min
                        {data?.spoken_languages.length > 0
                            ? `/ ${data?.spoken_languages[0].name}`
                            : ""}
                    </Typography>
                </Grid>
                <Grid item className={classes.genresContainer}>
                    {data?.genres?.map((genre) => (
                        <Link
                            key={genre.name}
                            className={classes.links}
                            to="/"
                            onClick={() => dispatch(selectGenreOrCategory(genre.id))}
                            style={{textDecoration: "none"}}
                        >
                            <img
                                src={genresIcons[genre.name.toLowerCase()]}
                                className={classes.genreImage}
                                height={30}
                                alt={genre?.name}
                            />
                            <Typography color="textPrimary" variant="subtitle1">
                                {genre?.name}
                            </Typography>
                        </Link>
                    ))}
                </Grid>
                <Typography variant="h5" gutterBottom style={{marginTop: "50px"}}>
                    Overview
                </Typography>
                <Typography style={{marginBottom: "2rem"}}>
                    {data?.overview}
                </Typography>
                <Typography variant="h5">Top Cast</Typography>
                <Grid itme container spacing={2}>
                    {data &&
                        data.credits?.cast
                            ?.map(
                                (character, i) =>
                                    character.profile_path && (
                                        <Grid
                                            key={i}
                                            item
                                            xs={4}
                                            md={2}
                                            component={Link}
                                            to={`/actors/${character.id}`}
                                            style={{textDecoration: "none"}}
                                        >
                                            <img
                                                className={classes.castImg}
                                                src={`https://image.tmdb.org/t/p/w500/${character.profile_path}`}
                                                alt={character.name}
                                            />
                                            <Typography color="textPrimary">
                                                {character?.name}
                                            </Typography>
                                        </Grid>
                                    )
                            )
                            .slice(0, 6)}
                </Grid>
                <Grid item container style={{marginTop: "2rem"}}>
                    <div className={classes.buttonsContainer}>
                        <Grid item xs={12} sm={6} className={classes.buttonsContainer}>
                            <ButtonGroup size="small" variant="outlined">
                                <Button
                                    target="_blank"
                                    rel="onopener noreferrer"
                                    href={data?.homepage}
                                    endIcon={<Language/>}
                                >
                                    Website
                                </Button>
                                <Button
                                    target="_blank"
                                    rel="onopener noreferrer"
                                    href={`https://www.imdb.com/title/${data?.imdb_id}`}
                                    endIcon={<Movie/>}
                                >
                                    IMDB
                                </Button>
                                <Button
                                    onClick={() => setOpen(true)}
                                    href="#"
                                    endIcon={<Theaters/>}
                                >
                                    Trailer
                                </Button>
                            </ButtonGroup>
                        </Grid>
                        <Grid item xs={12} sm={6} className={classes.buttonsContainer}>
                            <ButtonGroup size="small" variant="outlined">
                                <Button
                                    onClick={addToFavorites}
                                    endIcon={
                                        isMovieFavorited ? <Favorite/> : <FavoriteBorderOutlined/>
                                    }
                                >
                                    {isMovieFavorited ? "UnFavorite" : "Favorite"}
                                </Button>
                                <Button
                                    onClick={addToWatchlist}
                                    endIcon={isMovieWatchlisted ? <Remove/> : <PlusOne/>}
                                >
                                    Watchlist
                                </Button>
                            </ButtonGroup>
                        </Grid>
                        <Grid item xs={12} sm={6} className={classes.buttonsContainer}>
                            <ButtonGroup size="small" variant="outlined">
                                <Button
                                    endIcon={<ArrowBack/>}
                                    sx={{borderColor: "primary.main"}}
                                >
                                    <Typography
                                        component={Link}
                                        to="/"
                                        color="inherit"
                                        variant="subtitle2"
                                        style={{textDecoration: "none"}}
                                    >
                                        Back
                                    </Typography>
                                </Button>
                            </ButtonGroup>
                        </Grid>
                    </div>
                </Grid>
            </Grid>
            <Box marginTop="5rem" width="100%">
                <Typography variant="h3" gutterBottom align="center">
                    You might also like
                </Typography>
                {recommendation ? (
                    <MovieList movies={recommendation} numberOfMovies={12}/>
                ) : (
                    <Box>sorry, nothing was found </Box>
                )}
            </Box>

            <Modal
                closeAfterTransition
                className={classes.modal}
                open={open}
                onClose={() => setOpen(false)}
            >
                {data?.videos?.results?.length > 0 && (
                    <iframe
                        className={classes.video}
                        title="Trailer"
                        src={`https://www.youtube.com/embed/${data.videos.results[0].key}`}
                        allow="autoplay"
                    />
                )}
            </Modal>
        </Grid>
    );
};

export default MovieInformation;
