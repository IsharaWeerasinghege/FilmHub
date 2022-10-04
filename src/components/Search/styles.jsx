import { makeStyles } from "@mui/styles";

export default makeStyles((theme) => ({
  searchContainer: {
    width: '80%',
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      justifyContent: "center",
      width: "80%",
    },
  },
  input: {
    color: theme.palette.mode === "light" && "black",
    filter: theme.palette.mode === "black" && "invert(1)",
    [theme.breakpoints.down("sm")]: {
      marginTop: "-10px",
      marginBottem: "10px",
    },
  },
}));
