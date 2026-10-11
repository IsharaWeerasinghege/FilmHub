import React, {useEffect} from "react";
import {Box, List, ListItemButton, ListItemIcon, ListItemText, Skeleton, Typography,} from "@mui/material";
import {alpha, useTheme} from "@mui/material/styles";
import {MovieFilterRounded} from "@mui/icons-material";
import {Link} from "react-router-dom";
import {useGetGenresQuery} from "../../services/TMDB";
import {selectGenreOrCategory} from "../../features/currentGenreOrCategory";
import {useDispatch, useSelector} from "react-redux";

import genresIcons from "../../assets/genres";
import {TOPBAR_HEIGHT} from "../../utils/theme";

export const categories = [
    {label: "Popular", value: "popular"},
    {label: "Top Rated", value: "top_rated"},
    {label: "Upcoming", value: "upcoming"},
];

const SectionLabel = ({children}) => (
    <Typography
        variant="overline"
        color="text.secondary"
        sx={{display: "block", px: 2, pt: 2.5, pb: 1, fontSize: "0.68rem", opacity: 0.8}}
    >
        {children}
    </Typography>
);

const NavItem = ({label, icon, active, onClick}) => {
    const theme = useTheme();

    return (
        <ListItemButton
            component={Link}
            to="/"
            onClick={onClick}
            selected={active}
            sx={{
                borderRadius: 2.5,
                mb: 0.25,
                py: 0.9,
                position: "relative",
                color: active ? "text.primary" : "text.secondary",
                transition: "all .2s",
                "&:hover": {color: "text.primary", bgcolor: alpha(theme.palette.text.primary, 0.05)},
                "&.Mui-selected, &.Mui-selected:hover": {
                    bgcolor: alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.14 : 0.1),
                },
                "&.Mui-selected::before": {
                    content: '""',
                    position: "absolute",
                    left: -12,
                    top: 8,
                    bottom: 8,
                    width: 4,
                    borderRadius: "0 4px 4px 0",
                    background: theme.custom.gradient,
                },
            }}
        >
            <ListItemIcon sx={{minWidth: 36}}>
                <Box
                    component="img"
                    src={icon}
                    alt=""
                    sx={{
                        width: 20,
                        height: 20,
                        opacity: active ? 1 : 0.6,
                        filter: theme.palette.mode === "dark" ? "invert(1)" : "none",
                    }}
                />
            </ListItemIcon>
            <ListItemText
                primary={label}
                primaryTypographyProps={{fontSize: "0.9rem", fontWeight: active ? 700 : 500}}
            />
        </ListItemButton>
    );
};

const Sidebar = ({setmobileOpen}) => {
    const {genreIdOrCategoryName, searchQuery} = useSelector(
        (state) => state.currentGenreOrCategory
    );
    const {data, isFetching} = useGetGenresQuery();
    const dispatch = useDispatch();

    useEffect(() => {
        setmobileOpen(false);
    }, [genreIdOrCategoryName])

    const isActive = (value) => {
        if (searchQuery) return false;
        if (!genreIdOrCategoryName) return value === "popular";
        return genreIdOrCategoryName === value;
    };

    const select = (value) => {
        dispatch(selectGenreOrCategory(value));
        setmobileOpen(false);
    };

    return (
        <Box sx={{display: "flex", flexDirection: "column", height: "100%"}}>
            <Box
                component={Link}
                to="/"
                onClick={() => select("popular")}
                sx={{
                    height: TOPBAR_HEIGHT,
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.25,
                    px: 3,
                    textDecoration: "none",
                    color: "text.primary",
                    borderBottom: 1,
                    borderColor: "divider",
                }}
            >
                <Box
                    sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 2.5,
                        display: "grid",
                        placeItems: "center",
                        color: "#fff",
                        background: (t) => t.custom.gradient,
                        boxShadow: (t) => `0 6px 18px -6px ${alpha(t.palette.primary.main, 0.7)}`,
                    }}
                >
                    <MovieFilterRounded fontSize="small"/>
                </Box>
                <Typography sx={{fontFamily: '"Outfit", sans-serif', fontWeight: 800, fontSize: "1.4rem", letterSpacing: "-0.02em"}}>
                    Film
                    <Box
                        component="span"
                        sx={{background: (t) => t.custom.gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"}}
                    >
                        Hub
                    </Box>
                </Typography>
            </Box>

            <Box sx={{flex: 1, overflowY: "auto", px: 1.5, pb: 3}}>
                <SectionLabel>Discover</SectionLabel>
                <List disablePadding>
                    {categories.map(({label, value}) => (
                        <NavItem
                            key={value}
                            label={label}
                            icon={genresIcons[value]}
                            active={isActive(value)}
                            onClick={() => select(value)}
                        />
                    ))}
                </List>

                <SectionLabel>Genres</SectionLabel>
                <List disablePadding>
                    {isFetching || !data
                        ? Array.from({length: 10}).map((_, i) => (
                            <Skeleton key={i} variant="rounded" height={38} sx={{mb: 0.75, mx: 1, borderRadius: 2}}/>
                        ))
                        : data.genres.map(({name, id}) => (
                            <NavItem
                                key={id}
                                label={name}
                                icon={genresIcons[name.toLowerCase()]}
                                active={isActive(id)}
                                onClick={() => select(id)}
                            />
                        ))}
                </List>
            </Box>
        </Box>
    );
};

export default Sidebar;
