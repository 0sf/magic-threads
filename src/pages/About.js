import React from "react";
import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div>
      <h1>About Page!</h1>
      <Button component={Link} to="/">
        Back
      </Button>
    </div>
  );
};

export default About;
