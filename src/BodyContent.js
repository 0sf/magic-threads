import React, { useState } from "react";
import { Grid, Button, Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import Chip from "@material-ui/core/Chip";
import insertTextAtCursor from "insert-text-at-cursor";

import "./BodyContent.css";
import CardMain from "./Card";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const BodyContent = () => {
  // List of emojies
  const emojies = [
    "🧵",
    "👇🏽",
    "❌",
    "✨ ",
    "🔥",
    "⭕️",
    "🛑",
    "✅",
    "📌",
    "🔗",
  ];

  // Tweet Options
  const [tweets, setTweets] = useState([]);
  const [baseText, setBaseText] = useState(null);

  // Snackbar
  const [open, setOpen] = useState(false);
  const [clear, setClear] = useState(false);

  // CONSTANTS
  const TWEET_LENGTH = 280;
  const PREFIX = 7;

  const hadleOpen = () => {
    setOpen(true);
  };

  const handleClose = (e, reson) => {
    if (reson === "clickaway") {
      return;
    }
    setOpen(false);
    setClear(false);
  };

  // PASTE
  const pasteClipBoard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      document.getElementById("textArea").value = text;
    } catch (error) {
      console.log(error);
    }
  };

  // CREATE EMPTY THREAD
  const createThread = () => {
    var val = document.getElementById("textArea").value;
    setBaseText(val);
    setTweets([...tweets, baseText]);
  };

  // CLEAR
  const clearAll = ({ notAll }) => {
    if (notAll) {
      setBaseText(null);
      setTweets([]);
    } else {
      document.getElementById("textArea").value = null;
      setBaseText(null);
      setTweets([]);
      setClear(true);
    }
  };

  // InsertAt -- Emojies
  const insertAt = (value) => {
    var areaId = document.activeElement;
    console.log(areaId);
    const el = document.getElementById("textArea");
    insertTextAtCursor(el, value);
  };

  // Magic Thread
  const handleClick = () => {
    // Clear everything for second click on "Magic"
    clearAll({ notAll: true });

    // Get the value of textarea
    var val = document.getElementById("textArea").value;

    if (val.length >= 1) {
      // Setting the basetext
      setBaseText(val);

      if (baseText.length > 280) {
        // Calculating number of tweets for the thread
        const NUMOF_TWEETS = Math.floor(baseText.length / TWEET_LENGTH);

        let s = 0,
          e = 280 - PREFIX;
        let tarray = [];

        for (let i = 0; i < NUMOF_TWEETS; i++) {
          tarray[i] = baseText.slice(s, e);
          if (tarray[i][e - 1] !== " ") {
            tarray[i] = tarray[i] + "-";
          }
          tarray[i] = tarray[i] + ` (${i}/${NUMOF_TWEETS})`;
          s = s + 280 - PREFIX;
          e = e + 280 - PREFIX;
        }

        tarray[NUMOF_TWEETS] =
          baseText.slice(NUMOF_TWEETS * TWEET_LENGTH, baseText.length - 1) +
          ` (${NUMOF_TWEETS}/${NUMOF_TWEETS})`;

        setTweets(tarray);
      } else {
        // Tweet size is less than 280 characters
        //setTweets([...tweets, baseText]);
        setTweets([baseText]);
      }
    } else {
      // Trigger snackbar for empty input
      hadleOpen();
    }
  };

  return (
    <main>
      <Grid container justify="center" direction="column">
        <Grid item xs={10} sm={12} md={12} lg={12}>
          <textarea
            id="textArea"
            rows="20"
            cols="70"
            placeholder="Type your long message here."
            onPaste={(e) => setBaseText(e.target.value)}
            onChange={(e) => setBaseText(e.target.value)}
          ></textarea>
        </Grid>

        <Grid container justify="center" alignItems="center">
          {emojies.map((value) => (
            <Grid key={value} item>
              <Chip label={value} onClick={() => insertAt(value)} />
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={0} justify="center" alignItems="center">
          <Grid item xs={12} sm={12} md={12} lg={3} className="button-cont">
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={() => handleClick()}
            >
              Magic
            </Button>
            <Button size="small" variant="contained" onClick={createThread}>
              Thread
            </Button>
            <Button size="small" variant="contained" onClick={pasteClipBoard}>
              Paste
            </Button>
            <Button
              size="small"
              variant="contained"
              color="secondary"
              onClick={() => clearAll(false)}
            >
              Clear
            </Button>
          </Grid>
        </Grid>

        <Grid container justify="center" direction="column">
          {tweets.map((tweet) => {
            return (
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                key={tweets.indexOf(tweet)}
              >
                <CardMain
                  text={tweet}
                  key={tweet}
                  id={tweets.indexOf(tweet)}
                  taID={"ta" + tweets.indexOf(tweet).toString()}
                />
              </Grid>
            );
          })}
        </Grid>

        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="warning">
            Input cannot be empty!
          </Alert>
        </Snackbar>
        <Snackbar open={clear} autoHideDuration={3000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success">
            Cleared
          </Alert>
        </Snackbar>
      </Grid>
    </main>
  );
};

export default BodyContent;
