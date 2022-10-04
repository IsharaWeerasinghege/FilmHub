import {ExitToApp} from "@mui/icons-material";
import {Box, Button, Typography} from "@mui/material";
import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {useGetListQuery} from "../../services/TMDB";
import {RatedCards} from "../index";

const Profile = () => {
    const {user} = useSelector((state) => state.user);
    const {data: favoriteMovies, refetch: refetchFavoriteMovies} = useGetListQuery({
        listName: 'favorite/movies',
        accountId: user.id,
        sessionId: localStorage.getItem('session_id'),
        page: 1
    })
    const {data: watchListMovies, refetch: refetchWatchlistMovies} = useGetListQuery({
        listName: 'watchlist/movies',
        accountId: user.id,
        sessionId: localStorage.getItem('session_id'),
        page: 1
    })

    useEffect(() => {
        refetchFavoriteMovies();
        refetchWatchlistMovies();
    }, [])


    const logout = () => {
        localStorage.clear();
        window.location.href = "/";
    };

    return (
        <Box>
            <Box display="flex" justifyContent="space-between">
                <Typography variant="h4" gutterBottom>
                    My Profile
                </Typography>

                <Button color="inherit" onClick={logout}>
                    Logout &nbsp; <ExitToApp/>
                </Button>
            </Box>

            {!favoriteMovies?.results?.length && !watchListMovies?.results?.length
                ? (
                    <Typography variant="h5">
                        Add favorite or watchlist some movies to watch them here
                    </Typography>
                ) : (
                    <Box>
                        <RatedCards title="Favorite Movies" data={favoriteMovies}/>
                        <RatedCards title="Watchlist" data={watchListMovies}/>
                    </Box>
                )}
        </Box>
    );
};

export default Profile;
