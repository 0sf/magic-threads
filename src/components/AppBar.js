import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Typography, Toolbar, Button } from "@material-ui/core";
import logo from "../images/logo-mt.png";
import { Link } from "react-router-dom";
import "./AppBar.css";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const AppBarComponent = () => {
  const classes = useStyles();
  return (
    <AppBar position="fixed">
      <Toolbar>
        <img src={logo} alt="logo" className="logo" />
        <Typography align="left" variant="h6" className={classes.title}>
          MagicThreads
        </Typography>
        <Button color="inherit" to="/about" component={Link}>
          About
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default AppBarComponent;
