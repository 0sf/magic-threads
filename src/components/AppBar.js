import React from "react";
import { Link } from "react-router-dom";
import logo from "../images/logo-mt.png";
import "./AppBar.css";

import { styled } from "@mui/material/styles";
import { AppBar, Typography, Toolbar, Button } from "@mui/material";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  '& .logo': {
    marginRight: theme.spacing(2),
  },
  '& .title': {
    flexGrow: 1,
  },
  '& .coffee-button': {
    height: "40px",
    width: "170px",
  }
}));

const AppBarComponent = () => {
  return (
    <AppBar position="fixed">
      <StyledToolbar>
        <img src={logo} alt="logo" className="logo" />
        <Typography align="left" variant="h6" className="title">
          MagicThreads
        </Typography>
        <a
          href="https://www.buymeacoffee.com/sankalpa"
          target="_blank"
          rel="noreferrer"
        >
          <img
            src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
            alt="Buy Me A Coffee"
            className="coffee-button"
          />
        </a>
        <Button color="inherit" to="/about" component={Link}>
          About
        </Button>
      </StyledToolbar>
    </AppBar>
  );
};

export default AppBarComponent;
