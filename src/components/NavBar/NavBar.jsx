import React, {useContext, useEffect, useState} from "react";
import {AppBar, Avatar, Box, Button, Drawer, IconButton, Toolbar, Tooltip, useMediaQuery,} from "@mui/material";
import {DarkModeOutlined, LightModeOutlined, LoginRounded, MenuRounded,} from "@mui/icons-material";
import {Search, Sidebar} from "..";
import {Link} from "react-router-dom";
import {createSessionId, fetchToken, moviesApi} from "../../utils";
import {useTheme} from "@mui/material/styles";
import {useDispatch, useSelector} from "react-redux";
import {setUser} from "../../features/auth";
import {ColorModeContext} from '../../utils/ToggleColorMode';
import {SIDEBAR_WIDTH, TOPBAR_HEIGHT} from "../../utils/theme";

const NavBar = () => {
    const {isAuthenticated, user} = useSelector((state) => state.user);
    const [mobileOpen, setmobileOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const dispatch = useDispatch();
    const colorMode = useContext(ColorModeContext);

    const token = localStorage.getItem("request_token");
    const sessionIdFromLocalStorange = localStorage.getItem("session_id");

    useEffect(() => {
        const logInUser = async () => {
            if (token) {
                if (sessionIdFromLocalStorange) {
                    const {data: user_data} = await moviesApi.get(
                        `/account?session_id=${sessionIdFromLocalStorange}`
                    );
                    dispatch(setUser(user_data));
                } else {
                    const sessionId = await createSessionId();

                    const {data: user_data} = await moviesApi.get(
                        `/account?session_id=${sessionId}`
                    );

                    dispatch(setUser(user_data));
                }
            }
        };

        logInUser(user);
    }, [token]);

    const avatarPath = user?.avatar?.tmdb?.avatar_path;
    const initial = (user?.name || user?.username || "?").charAt(0).toUpperCase();

    const drawerPaperSx = {
        width: SIDEBAR_WIDTH,
        bgcolor: "background.paper",
        borderRight: 1,
        borderColor: "divider",
    };

    return (
        <>
            <AppBar
                position="fixed"
                elevation={0}
                color="inherit"
                sx={{
                    width: {md: `calc(100% - ${SIDEBAR_WIDTH}px)`},
                    ml: {md: `${SIDEBAR_WIDTH}px`},
                    bgcolor: (t) => t.custom.glass,
                    backdropFilter: "saturate(180%) blur(18px)",
                    borderBottom: 1,
                    borderColor: "divider",
                }}
            >
                <Toolbar sx={{height: TOPBAR_HEIGHT, gap: {xs: 1, sm: 2}, px: {xs: 2, sm: 3, md: 4}}}>
                    {isMobile && (
                        <IconButton
                            edge="start"
                            aria-label="Open menu"
                            onClick={() => setmobileOpen((prevMobileOpen) => !prevMobileOpen)}
                        >
                            <MenuRounded/>
                        </IconButton>
                    )}

                    <Box sx={{flex: 1, maxWidth: 560}}>
                        <Search/>
                    </Box>

                    <Box sx={{flex: {xs: 0, md: 1}}}/>

                    <Tooltip title={theme.palette.mode === "dark" ? "Light mode" : "Dark mode"}>
                        <IconButton
                            onClick={colorMode.toggleColorMode}
                            aria-label="Toggle color mode"
                            sx={{border: 1, borderColor: "divider"}}
                        >
                            {theme.palette.mode === "dark" ? <LightModeOutlined fontSize="small"/> :
                                <DarkModeOutlined fontSize="small"/>}
                        </IconButton>
                    </Tooltip>

                    {!isAuthenticated ? (
                        <Button
                            variant="contained"
                            onClick={() => fetchToken()}
                            startIcon={!isMobile && <LoginRounded/>}
                            sx={{flexShrink: 0}}
                        >
                            Sign in
                        </Button>
                    ) : (
                        <Button
                            color="inherit"
                            component={Link}
                            to={`/profile/${user.id}`}
                            sx={{
                                flexShrink: 0,
                                pl: {xs: 0.5, sm: 2},
                                pr: 0.5,
                                py: 0.5,
                                gap: 1.25,
                                border: 1,
                                borderColor: "divider",
                            }}
                        >
                            {!isMobile && "My Movies"}
                            <Avatar
                                alt={user?.username}
                                src={avatarPath ? `https://image.tmdb.org/t/p/w64_and_h64_face${avatarPath}` : undefined}
                                sx={{width: 32, height: 32, fontSize: 14, fontWeight: 700, background: (t) => t.custom.gradient}}
                            >
                                {initial}
                            </Avatar>
                        </Button>
                    )}
                </Toolbar>
            </AppBar>

            <Box component="nav" sx={{width: {md: SIDEBAR_WIDTH}, flexShrink: {md: 0}}}>
                {isMobile ? (
                    <Drawer
                        variant="temporary"
                        anchor="left"
                        open={mobileOpen}
                        onClose={() => setmobileOpen(false)}
                        PaperProps={{sx: drawerPaperSx}}
                        ModalProps={{keepMounted: true}}
                    >
                        <Sidebar setmobileOpen={setmobileOpen}/>
                    </Drawer>
                ) : (
                    <Drawer variant="permanent" open PaperProps={{sx: drawerPaperSx}}>
                        <Sidebar setmobileOpen={setmobileOpen}/>
                    </Drawer>
                )}
            </Box>
        </>
    );
};

export default NavBar;
