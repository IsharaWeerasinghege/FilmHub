import React, {useEffect} from "react";
import {
    Box,
    CircularProgress,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListSubheader,
} from "@mui/material";
import {Link} from "react-router-dom";
import {useTheme} from "@mui/styles";
import {useGetGenresQuery} from "../../services/TMDB";
import {selectGenreOrCategory} from "../../features/currentGenreOrCategory";
import {useDispatch, useSelector} from "react-redux";

import useStyles from "./style";
import genresIcons from "../../assets/genres";
import {Search} from "../index";

import blueLogo from '../../assets/icon/filmhub-blue.png';
import redLogo from '../../assets/icon/filmhub-red.png';

const Sidebar = ({setmobileOpen}) => {
    const {genreIdOrCategoryName} = useSelector(
        (state) => state.currentGenreOrCategory
    );
    const theme = useTheme();
    const classes = useStyles();
    const {data, isFetching} = useGetGenresQuery();
    const dispatch = useDispatch();

    useEffect(() => {
        setmobileOpen(false);
    }, [genreIdOrCategoryName])

    const categories = [
        {label: "Popular", value: "popular"},
        {label: "Top Rated", value: "top_rated"},
        {label: "UpComing", value: "upcoming"},
    ];

    return (
        <>
            <Link to="/" className={classes.imageLink}>
                <img
                    className={classes.image}
                    src={theme.palette.mode === "light" ? blueLogo : redLogo}
                    alt="Filmpire Logo"
                />
            </Link>
            <Divider/>
            <List>
                <Box display="flex" justifyContent="center">
                    <Search/>
                </Box>
            </List>
            <Divider/>
            <List>
                <ListSubheader>Categories</ListSubheader>
                {categories.map(({label, value}) => (
                    <Link key={value} className={classes.links} to="/">
                        <ListItem
                            onClick={() => dispatch(selectGenreOrCategory(value))}
                        >
                            <ListItemIcon>
                                <img
                                    src={genresIcons[value.toLowerCase()]}
                                    className={classes.genreImages}
                                    height={30}
                                    alt={label}
                                />
                            </ListItemIcon>
                            <ListItemText primary={label}/>
                        </ListItem>
                    </Link>
                ))}
            </List>

            <Divider/>
            <List>
                <ListSubheader>Genres</ListSubheader>
                {isFetching ? (
                    <Box display="flex" justifyContent="center">
                        <CircularProgress/>
                    </Box>
                ) : (
                    data.genres.map(({name, id}) => (
                        <Link key={name} className={classes.links} to="/">
                            <ListItem
                                onClick={() => dispatch(selectGenreOrCategory(id))}
                            >
                                <ListItemIcon>
                                    <img
                                        src={genresIcons[name.toLowerCase()]}
                                        className={classes.genreImages}
                                        height={30}
                                        alt={name}
                                    />
                                </ListItemIcon>
                                <ListItemText primary={name}/>
                            </ListItem>
                        </Link>
                    ))
                )}
            </List>
        </>
    );
};

export default Sidebar;
