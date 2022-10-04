import { makeStyles } from "@mui/styles";

const drawerWidth = "240px";

export default makeStyles((theme) => ({
  Toolbar: {
    height: "70px",
    display: "flex",
    justifyContent: "space-between",
    marginLeft: "240px",
    [theme.breakpoints.down("sm")]: {
      marginLeft: 0,
      flexWrap: "wrap",
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: "0",
    },
  },
  drawerPapper: {
    width: drawerWidth,
  },
  linkButton: {
    "&:hover": {
      color: "white !important",
      textDecoration: "none",
    },
  },
}));
