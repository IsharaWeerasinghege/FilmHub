import React, {useEffect, useState} from "react";
import {
    ArrowBackRounded,
    BookmarkAddedRounded,
    BookmarkAddOutlined,
    CalendarMonthOutlined,
    CloseRounded,
    ErrorOutlineRounded,
    Favorite,
    FavoriteBorderOutlined,
    LanguageRounded,
    OpenInNewRounded,
    PersonOutlineRounded,
    PlayArrowRounded,
    ScheduleOutlined,
    Star,
} from "@mui/icons-material";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useGetListQuery, useGetMovieQuery, useGetRecommendationsQuery,} from "../../services/TMDB";
import {Box, Button, Chip, Dialog, IconButton, Skeleton, Tooltip, Typography,} from "@mui/material";
import {alpha} from "@mui/material/styles";
import genresIcons from "../../assets/genres";
import {selectGenreOrCategory} from "../../features/currentGenreOrCategory";
import {useDispatch, useSelector} from "react-redux";
import {EmptyState, MovieList, MovieListSkeleton, SectionHeader} from "../index";
import {userSelector} from "../../features/auth";
import {fetchToken} from "../../utils";
import axios from "axios";

const glassSx = {
    color: "#fff",
    bgcolor: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.16)",
    "&:hover": {bgcolor: "rgba(255,255,255,0.18)"},
};

const formatRuntime = (minutes) => {
    if (!minutes) return null;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h ? `${h}h ${m}m` : `${m}m`;
};

const MetaItem = ({icon: Icon, children}) => (
    <Box sx={{display: "flex", alignItems: "center", gap: 0.75, color: "rgba(255,255,255,.8)", fontWeight: 500}}>
        <Icon sx={{fontSize: 18, opacity: 0.8}}/>
        {children}
    </Box>
);

const RatingRing = ({value}) => {
    const pct = Math.round((value || 0) * 10);
    const color = pct >= 70 ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#ef4444";

    return (
        <Box
            sx={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
                background: `conic-gradient(${color} ${pct * 3.6}deg, rgba(255,255,255,.12) 0deg)`,
            }}
        >
            <Box
                sx={{
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    bgcolor: "#0d0d12",
                    display: "grid",
                    placeItems: "center",
                    fontWeight: 800,
                    fontFamily: '"Outfit", sans-serif',
                    fontSize: "1.05rem",
                    color: "#fff",
                }}
            >
                {pct}
                <Box component="sup" sx={{fontSize: "0.5em", ml: "1px", mt: "-0.6em"}}>%</Box>
            </Box>
        </Box>
    );
};

const MovieInformation = () => {
    const {user, isAuthenticated} = useSelector(userSelector);
    const {id} = useParams();
    const navigate = useNavigate();
    const {data, isFetching, error} = useGetMovieQuery(id);
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);

    const sessionId = localStorage.getItem('session_id');
    const {data: favoriteMovies} = useGetListQuery({
        listName: 'favorite/movies',
        accountId: user.id,
        sessionId,
        page: 1
    }, {skip: !user.id})
    const {data: watchListMovies} = useGetListQuery({
        listName: 'watchlist/movies',
        accountId: user.id,
        sessionId,
        page: 1
    }, {skip: !user.id})
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
        if (!isAuthenticated) return fetchToken();

        await axios.post(`https://api.themoviedb.org/3/account/${user.id}/favorite?api_key=${process.env.REACT_APP_TMDB_KEY}&session_id=${sessionId}`, {
            media_type: 'movie',
            media_id: id,
            favorite: !isMovieFavorited,
        })

        setIsMovieFavorited((prev) => !prev)
    };

    const addToWatchlist = async () => {
        if (!isAuthenticated) return fetchToken();

        await axios.post(`https://api.themoviedb.org/3/account/${user.id}/watchlist?api_key=${process.env.REACT_APP_TMDB_KEY}&session_id=${sessionId}`, {
            media_type: 'movie',
            media_id: id,
            watchlist: !isMovieWatchlisted,
        })

        setIsMovieWatchlisted((prev) => !prev)
    };

    if (isFetching) {
        return (
            <Box>
                <Skeleton variant="rounded" sx={{height: {xs: 640, md: 560}, borderRadius: 5, mb: 6}}/>
                <Skeleton width={220} height={48} sx={{mb: 2}}/>
                <Box sx={{display: "flex", gap: 2}}>
                    {Array.from({length: 6}).map((_, i) => (
                        <Skeleton key={i} variant="rounded" width={140} height={200} sx={{borderRadius: 3, flexShrink: 0}}/>
                    ))}
                </Box>
            </Box>
        );
    }

    if (error || !data) {
        return (
            <EmptyState
                icon={ErrorOutlineRounded}
                title="Something has gone wrong"
                description="We couldn't load this movie. It may have been removed or the connection failed."
                action={<Button variant="contained" component={Link} to="/">Back to home</Button>}
            />
        );
    }

    const year = data.release_date?.split("-")[0];
    const trailer =
        data.videos?.results?.find((v) => v.site === "YouTube" && v.type === "Trailer") ||
        data.videos?.results?.find((v) => v.site === "YouTube");
    const cast = data.credits?.cast?.filter((c) => c.profile_path).slice(0, 12) || [];
    const director = data.credits?.crew?.find((c) => c.job === "Director");

    return (
        <Box>
            {/* Hero */}
            <Box
                sx={{
                    position: "relative",
                    borderRadius: {xs: 4, md: 5},
                    overflow: "hidden",
                    bgcolor: "#08080c",
                    color: "#fff",
                    mb: {xs: 5, md: 7},
                    animation: "fadeIn .5s ease",
                    boxShadow: "0 30px 60px -30px rgba(0,0,0,.6)",
                }}
            >
                {data.backdrop_path && (
                    <Box
                        component="img"
                        src={`https://image.tmdb.org/t/p/original${data.backdrop_path}`}
                        alt=""
                        sx={{position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.45}}
                    />
                )}
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        background:
                            "linear-gradient(90deg, rgba(8,8,12,.97) 0%, rgba(8,8,12,.85) 40%, rgba(8,8,12,.4) 100%), linear-gradient(0deg, rgba(8,8,12,1) 0%, rgba(8,8,12,0) 40%)",
                    }}
                />

                <Box
                    sx={{
                        position: "relative",
                        display: "grid",
                        gridTemplateColumns: {xs: "1fr", md: "280px 1fr", lg: "320px 1fr"},
                        gap: {xs: 4, md: 6},
                        alignItems: "center",
                        p: {xs: 3, sm: 4, md: 6},
                    }}
                >
                    <Box
                        component="img"
                        src={data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : undefined}
                        alt={data.title}
                        sx={{
                            width: {xs: "60%", sm: 260, md: "100%"},
                            mx: {xs: "auto", md: 0},
                            aspectRatio: "2 / 3",
                            objectFit: "cover",
                            borderRadius: 4,
                            bgcolor: "rgba(255,255,255,.05)",
                            boxShadow: "0 30px 60px -15px rgba(0,0,0,.8), 0 0 0 1px rgba(255,255,255,.08)",
                        }}
                    />

                    <Box sx={{minWidth: 0}}>
                        <Button
                            onClick={() => navigate(-1)}
                            startIcon={<ArrowBackRounded/>}
                            size="small"
                            sx={{...glassSx, mb: 3}}
                        >
                            Back
                        </Button>

                        <Typography variant="h2" component="h1" sx={{fontSize: {xs: "2rem", sm: "2.6rem", lg: "3.25rem"}, lineHeight: 1.05}}>
                            {data.title}
                            {year && (
                                <Box component="span" sx={{fontWeight: 400, opacity: 0.55, ml: 1.5}}>
                                    {year}
                                </Box>
                            )}
                        </Typography>

                        {data.tagline && (
                            <Typography sx={{mt: 1.5, fontStyle: "italic", color: "rgba(255,255,255,.65)", fontSize: "1.05rem"}}>
                                “{data.tagline}”
                            </Typography>
                        )}

                        <Box sx={{display: "flex", flexWrap: "wrap", alignItems: "center", gap: {xs: 2, sm: 3}, mt: 3}}>
                            <Box sx={{display: "flex", alignItems: "center", gap: 1.5}}>
                                <RatingRing value={data.vote_average}/>
                                <Box>
                                    <Box sx={{display: "flex", alignItems: "center", gap: 0.5, fontWeight: 700}}>
                                        <Star sx={{fontSize: 18, color: "#fbbf24"}}/>
                                        {Number(data.vote_average || 0).toFixed(1)}
                                        <Box component="span" sx={{opacity: 0.5, fontWeight: 500}}>/ 10</Box>
                                    </Box>
                                    <Typography variant="caption" sx={{color: "rgba(255,255,255,.6)"}}>
                                        {data.vote_count?.toLocaleString()} votes
                                    </Typography>
                                </Box>
                            </Box>
                            {data.runtime > 0 && <MetaItem icon={ScheduleOutlined}>{formatRuntime(data.runtime)}</MetaItem>}
                            {data.release_date && (
                                <MetaItem icon={CalendarMonthOutlined}>
                                    {new Date(data.release_date).toLocaleDateString(undefined, {year: "numeric", month: "short", day: "numeric"})}
                                </MetaItem>
                            )}
                            {data.spoken_languages?.length > 0 && (
                                <MetaItem icon={LanguageRounded}>{data.spoken_languages[0].english_name || data.spoken_languages[0].name}</MetaItem>
                            )}
                        </Box>

                        {data.genres?.length > 0 && (
                            <Box sx={{display: "flex", flexWrap: "wrap", gap: 1, mt: 3}}>
                                {data.genres.map((genre) => (
                                    <Chip
                                        key={genre.id}
                                        component={Link}
                                        to="/"
                                        clickable
                                        onClick={() => dispatch(selectGenreOrCategory(genre.id))}
                                        label={genre.name}
                                        avatar={
                                            genresIcons[genre.name.toLowerCase()] && (
                                                <Box
                                                    component="img"
                                                    src={genresIcons[genre.name.toLowerCase()]}
                                                    alt=""
                                                    sx={{filter: "invert(1)", bgcolor: "transparent !important"}}
                                                />
                                            )
                                        }
                                        sx={glassSx}
                                    />
                                ))}
                            </Box>
                        )}

                        {data.overview && (
                            <Typography sx={{mt: 3, color: "rgba(255,255,255,.82)", lineHeight: 1.75, maxWidth: 760}}>
                                {data.overview}
                            </Typography>
                        )}

                        {director && (
                            <Typography variant="body2" sx={{mt: 2, color: "rgba(255,255,255,.6)"}}>
                                Directed by{" "}
                                <Box component="span" sx={{color: "#fff", fontWeight: 600}}>{director.name}</Box>
                            </Typography>
                        )}

                        <Box sx={{display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1.5, mt: 4}}>
                            <Button
                                variant="contained"
                                size="large"
                                startIcon={<PlayArrowRounded/>}
                                onClick={() => setOpen(true)}
                                disabled={!trailer}
                                sx={{"&.Mui-disabled": {color: "rgba(255,255,255,.4)", background: "rgba(255,255,255,.08)"}}}
                            >
                                {trailer ? "Watch trailer" : "No trailer"}
                            </Button>

                            <Tooltip title={isMovieFavorited ? "Remove from favorites" : "Add to favorites"}>
                                <IconButton
                                    onClick={addToFavorites}
                                    aria-label="Toggle favorite"
                                    sx={{...glassSx, width: 48, height: 48, color: isMovieFavorited ? "primary.main" : "#fff"}}
                                >
                                    {isMovieFavorited ? <Favorite/> : <FavoriteBorderOutlined/>}
                                </IconButton>
                            </Tooltip>

                            <Tooltip title={isMovieWatchlisted ? "Remove from watchlist" : "Add to watchlist"}>
                                <IconButton
                                    onClick={addToWatchlist}
                                    aria-label="Toggle watchlist"
                                    sx={{...glassSx, width: 48, height: 48, color: isMovieWatchlisted ? "secondary.main" : "#fff"}}
                                >
                                    {isMovieWatchlisted ? <BookmarkAddedRounded/> : <BookmarkAddOutlined/>}
                                </IconButton>
                            </Tooltip>

                            {data.imdb_id && (
                                <Button
                                    href={`https://www.imdb.com/title/${data.imdb_id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    endIcon={<OpenInNewRounded fontSize="small"/>}
                                    sx={{...glassSx, height: 48}}
                                >
                                    IMDb
                                </Button>
                            )}
                            {data.homepage && (
                                <Button
                                    href={data.homepage}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    endIcon={<OpenInNewRounded fontSize="small"/>}
                                    sx={{...glassSx, height: 48}}
                                >
                                    Website
                                </Button>
                            )}
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* Cast */}
            {cast.length > 0 && (
                <Box sx={{mb: {xs: 5, md: 7}}}>
                    <SectionHeader eyebrow="Cast" title="Top billed cast"/>
                    <Box
                        sx={{
                            display: "grid",
                            gridAutoFlow: "column",
                            gridAutoColumns: {xs: "128px", md: "150px"},
                            gap: 2,
                            overflowX: "auto",
                            pb: 2,
                            scrollSnapType: "x mandatory",
                        }}
                    >
                        {cast.map((character) => (
                            <Box
                                key={character.credit_id || character.id}
                                component={Link}
                                to={`/actors/${character.id}`}
                                sx={{
                                    textDecoration: "none",
                                    color: "text.primary",
                                    scrollSnapAlign: "start",
                                    borderRadius: 3,
                                    overflow: "hidden",
                                    bgcolor: (t) => t.custom.surface,
                                    border: 1,
                                    borderColor: "divider",
                                    transition: "transform .25s, border-color .25s",
                                    "&:hover": {transform: "translateY(-4px)", borderColor: (t) => alpha(t.palette.primary.main, 0.5)},
                                    "&:hover img": {transform: "scale(1.06)"},
                                }}
                            >
                                <Box sx={{aspectRatio: "3 / 4", overflow: "hidden"}}>
                                    <Box
                                        component="img"
                                        loading="lazy"
                                        src={`https://image.tmdb.org/t/p/w300${character.profile_path}`}
                                        alt={character.name}
                                        sx={{width: "100%", height: "100%", objectFit: "cover", transition: "transform .5s"}}
                                    />
                                </Box>
                                <Box sx={{p: 1.25}}>
                                    <Typography noWrap sx={{fontWeight: 700, fontSize: "0.88rem"}}>{character.name}</Typography>
                                    <Typography noWrap variant="caption" color="text.secondary" component="div">
                                        {character.character || <PersonOutlineRounded fontSize="inherit"/>}
                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Box>
            )}

            {/* Recommendations */}
            <Box>
                <SectionHeader eyebrow="Recommended" title="You might also like"/>
                {recommendationFetching ? (
                    <MovieListSkeleton count={6}/>
                ) : recommendation?.results?.length ? (
                    <MovieList movies={recommendation} numberOfMovies={12}/>
                ) : (
                    <EmptyState title="Nothing to recommend yet" description="We don't have recommendations for this title."/>
                )}
            </Box>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="lg"
                fullWidth
                PaperProps={{sx: {bgcolor: "#000", borderRadius: 4, overflow: "hidden", m: 2, width: "calc(100% - 32px)"}}}
                BackdropProps={{sx: {bgcolor: "rgba(0,0,0,.85)", backdropFilter: "blur(6px)"}}}
            >
                <IconButton
                    onClick={() => setOpen(false)}
                    aria-label="Close trailer"
                    sx={{position: "absolute", top: 10, right: 10, zIndex: 1, ...glassSx}}
                >
                    <CloseRounded/>
                </IconButton>
                {trailer && (
                    <Box
                        component="iframe"
                        title="Trailer"
                        src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`}
                        allow="autoplay; encrypted-media; fullscreen"
                        allowFullScreen
                        sx={{width: "100%", aspectRatio: "16 / 9", border: 0, display: "block"}}
                    />
                )}
            </Dialog>
        </Box>
    );
};

export default MovieInformation;
