import React, { useState } from "react";
import { Grid } from "@material-ui/core";

import "./Editable.css";

const Editable = ({ text, type, taIDE, placeholder, children, ...props }) => {
  const [isEditing, setEditing] = useState(false);
  const handleKeyDown = (event, type) => {};

  return (
    <section {...props}>
      {isEditing ? (
        <div
          onBlur={() => setEditing(false)}
          onKeyDown={(e) => handleKeyDown(e, type)}
        >
          {children}
        </div>
      ) : (
        <div onClick={() => setEditing(true)}>
          <Grid container justify="center" direction="column">
            <Grid item xs={10} sm={12} md={12} lg={12}>
              <textarea
                id={taIDE}
                placeholder={placeholder}
                maxLength="280"
                rows="7"
                cols="70"
                defaultValue={text}
              ></textarea>
            </Grid>
          </Grid>
        </div>
      )}
    </section>
  );
};

export default Editable;
