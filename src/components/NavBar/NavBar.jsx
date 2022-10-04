import React, {useContext, useEffect, useState} from "react";
import {AppBar, Avatar, Button, Drawer, IconButton, Toolbar, useMediaQuery,} from "@mui/material";
import {AccountCircle, Brightness4, Brightness7, Menu,} from "@mui/icons-material";
import {Sidebar} from "..";
import {Link} from "react-router-dom";
import {createSessionId, fetchToken, moviesApi} from "../../utils";
import useStyles from "./styles";
import {useTheme} from "@mui/material/styles";
import {useDispatch, useSelector} from "react-redux";
import {setUser} from "../../features/auth";
import {ColorModeContext} from '../../utils/ToggleColorMode';

const NavBar = () => {
    const {isAuthenticated, user} = useSelector((state) => state.user);
    const [mobileOpen, setmobileOpen] = useState(false);
    const classes = useStyles();
    const isMobile = useMediaQuery("(max-width: 600px)");
    const theme = useTheme();
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

    return (
        <>
            <AppBar position="fixed">
                <Toolbar className={classes.Toolbar}>
                    {isMobile && (
                        <IconButton
                            color="inherit"
                            edge="start"
                            style={{outline: "none"}}
                            onClick={() => setmobileOpen((prevMobileOpen) => !prevMobileOpen)}
                            className={classes.menuButton}
                        >
                            <Menu/>
                        </IconButton>
                    )}

                    <IconButton color="inherit" sx={{ml: 1}} onClick={colorMode.toggleColorMode}>
                        {theme.palette.mode === "dark" ? <Brightness7/> : <Brightness4/>}
                    </IconButton>
                    <div>
                        {!isAuthenticated ? (
                            <Button
                                color="inherit"
                                onClick={() => {
                                    fetchToken();
                                }}
                            >
                                Login &nbsp; <AccountCircle/>
                            </Button>
                        ) : (
                            <Button
                                color="inherit"
                                component={Link}
                                to={`/profile/${user.id}`}
                                className={classes.linkButton}
                            >
                                {!isMobile && <>My Movies &nbsp; </>}
                                <Avatar
                                    style={{width: 30, height: 30}}
                                    alt="profile"
                                    src={`https://www.themoviedb.org/t/p/w64_and_h64_face${user?.avatar?.tmdb?.avatar?.avatar_path}`}
                                />
                            </Button>
                        )}
                    </div>
                </Toolbar>
            </AppBar>
            <div>
                <nav className={classes.drawer}>
                    {isMobile ? (
                        <Drawer
                            variant="temporary"
                            anchor="right"
                            open={mobileOpen}
                            onClose={() => setmobileOpen((prevMobileOpen) => !prevMobileOpen)}
                            classes={{paper: classes.drawerPapper}}
                            ModalProps={{keepMounted: true}}
                        >
                            <Sidebar setmobileOpen={setmobileOpen}></Sidebar>
                        </Drawer>
                    ) : (
                        <Drawer
                            classes={{paper: classes.drawerPapper}}
                            variant="permanent"
                            open
                        >
                            <Sidebar setmobileOpen={setmobileOpen}/>
                        </Drawer>
                    )}
                </nav>
            </div>
        </>
    );
};

export default NavBar;
