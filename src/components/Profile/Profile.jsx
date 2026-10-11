import {BookmarkBorderRounded, FavoriteBorderRounded, LockOutlined, LogoutRounded} from "@mui/icons-material";
import {Avatar, Box, Button, Typography} from "@mui/material";
import {alpha} from "@mui/material/styles";
import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {useGetListQuery} from "../../services/TMDB";
import {EmptyState, RatedCards} from "../index";
import {fetchToken} from "../../utils";

const Stat = ({icon: Icon, label, value}) => (
    <Box
        sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            px: 2.5,
            py: 1.5,
            borderRadius: 3,
            bgcolor: (t) => alpha(t.palette.text.primary, 0.04),
            border: 1,
            borderColor: "divider",
        }}
    >
        <Icon color="primary"/>
        <Box>
            <Typography sx={{fontFamily: '"Outfit", sans-serif', fontWeight: 800, fontSize: "1.4rem", lineHeight: 1}}>
                {value}
            </Typography>
            <Typography variant="caption" color="text.secondary">{label}</Typography>
        </Box>
    </Box>
);

const Profile = () => {
    const {user, isAuthenticated} = useSelector((state) => state.user);
    const sessionId = localStorage.getItem('session_id');
    const {data: favoriteMovies, refetch: refetchFavoriteMovies} = useGetListQuery({
        listName: 'favorite/movies',
        accountId: user.id,
        sessionId,
        page: 1
    }, {skip: !user.id})
    const {data: watchListMovies, refetch: refetchWatchlistMovies} = useGetListQuery({
        listName: 'watchlist/movies',
        accountId: user.id,
        sessionId,
        page: 1
    }, {skip: !user.id})

    useEffect(() => {
        if (!user.id) return;
        refetchFavoriteMovies();
        refetchWatchlistMovies();
    }, [user.id, refetchFavoriteMovies, refetchWatchlistMovies])

    const logout = () => {
        localStorage.clear();
        window.location.href = "/";
    };

    if (!isAuthenticated) {
        return (
            <EmptyState
                icon={LockOutlined}
                title="Sign in to see your movies"
                description="Connect your TMDB account to keep track of favorites and build your watchlist."
                action={<Button variant="contained" onClick={() => fetchToken()}>Sign in with TMDB</Button>}
            />
        );
    }

    const avatarPath = user?.avatar?.tmdb?.avatar_path;
    const displayName = user?.name || user?.username;
    const favCount = favoriteMovies?.total_results ?? 0;
    const watchCount = watchListMovies?.total_results ?? 0;

    return (
        <Box>
            <Box
                sx={{
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: {xs: 4, md: 5},
                    p: {xs: 3, md: 5},
                    mb: {xs: 5, md: 7},
                    border: 1,
                    borderColor: "divider",
                    bgcolor: "background.paper",
                    display: "flex",
                    flexDirection: {xs: "column", md: "row"},
                    alignItems: {xs: "flex-start", md: "center"},
                    gap: 3,
                    animation: "fadeIn .5s ease",
                    "&::before": {
                        content: '""',
                        position: "absolute",
                        inset: 0,
                        background: (t) => `radial-gradient(600px 220px at 0% 0%, ${alpha(t.palette.primary.main, 0.18)}, transparent 70%)`,
                        pointerEvents: "none",
                    },
                }}
            >
                <Avatar
                    src={avatarPath ? `https://image.tmdb.org/t/p/w185${avatarPath}` : undefined}
                    alt={displayName}
                    sx={{
                        width: 96,
                        height: 96,
                        fontSize: 40,
                        fontWeight: 800,
                        background: (t) => t.custom.gradient,
                        boxShadow: (t) => `0 0 0 4px ${t.palette.background.paper}, 0 0 0 6px ${alpha(t.palette.primary.main, 0.5)}`,
                    }}
                >
                    {displayName?.charAt(0).toUpperCase()}
                </Avatar>

                <Box sx={{flex: 1, position: "relative"}}>
                    <Typography variant="overline" color="primary">My Library</Typography>
                    <Typography variant="h3" component="h1" sx={{fontSize: {xs: "2rem", md: "2.6rem"}}}>
                        {displayName}
                    </Typography>
                    {user?.name && user?.username && (
                        <Typography color="text.secondary">@{user.username}</Typography>
                    )}
                </Box>

                <Box sx={{display: "flex", flexWrap: "wrap", gap: 1.5, position: "relative"}}>
                    <Stat icon={FavoriteBorderRounded} label="Favorites" value={favCount}/>
                    <Stat icon={BookmarkBorderRounded} label="Watchlist" value={watchCount}/>
                    <Button
                        color="inherit"
                        onClick={logout}
                        startIcon={<LogoutRounded/>}
                        sx={{border: 1, borderColor: "divider", alignSelf: "center"}}
                    >
                        Log out
                    </Button>
                </Box>
            </Box>

            {!favoriteMovies?.results?.length && !watchListMovies?.results?.length
                ? (
                    <EmptyState
                        title="Your library is empty"
                        description="Favorite or watchlist some movies and they'll show up here."
                    />
                ) : (
                    <Box>
                        <RatedCards
                            eyebrow="Loved"
                            title="Favorite movies"
                            data={favoriteMovies}
                            emptyText="No favorites yet — tap the heart on any movie."
                        />
                        <RatedCards
                            eyebrow="Up next"
                            title="Watchlist"
                            data={watchListMovies}
                            emptyText="Your watchlist is empty — bookmark movies to watch later."
                        />
                    </Box>
                )}
        </Box>
    );
};

export default Profile;
