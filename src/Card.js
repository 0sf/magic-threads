import React, { useState } from "react";
import Editable from "./Editable";
import { Grid, Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import IconButton from "@material-ui/core/IconButton";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import copy from "copy-to-clipboard";
import "./Card.css";

function CardMain({ text, taID }) {
  const [copySuccess, setCopySuccess] = useState(false);

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const handleClose = (e, reson) => {
    if (reson === "clickaway") {
      return;
    }
    setCopySuccess(false);
  };

  const copyToClip = () => {
    //console.log(val);
    let val = document.getElementById(taID + "e").value;
    if (val != null) {
      copy(val);
      setCopySuccess(true);
    } else {
      console.log("Value can not be null");
    }
  };

  return (
    <div className="outer-card">
      <Editable
        taIDE={taID + "e"}
        text={text}
        type="textarea"
        placeholder="Type your message here..."
      >
        <Grid container justify="center" direction="column">
          <Grid item xs={10} sm={12} md={12} lg={12}>
            <textarea
              id={taID}
              maxLength="280"
              rows="7"
              cols="70"
              defaultValue={text}
            ></textarea>
          </Grid>
        </Grid>
      </Editable>

      <IconButton
        aria-label="copy to clipboard"
        component="span"
        onClick={() => copyToClip()}
      >
        <FileCopyIcon />
      </IconButton>

      <Snackbar
        open={copySuccess}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success">
          Copied to Clipboard!
        </Alert>
      </Snackbar>
    </div>
  );
}

export default CardMain;
