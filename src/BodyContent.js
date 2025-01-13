import React, { useState } from "react";
import { Stack, Box, Button, Snackbar, Container, Typography } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
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
    <Container maxWidth="md" component="main">
      <Stack spacing={4}>
        <Box>
          <textarea
            id="textArea"
            rows="15"
            placeholder="Type your long message here..."
            onPaste={(e) => setBaseText(e.target.value)}
            onChange={(e) => setBaseText(e.target.value)}
          ></textarea>
        </Box>

        <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
          {emojies.map((value) => (
            <Chip 
              key={value} 
              label={value} 
              onClick={() => insertAt(value)}
              sx={{
                '&:hover': {
                  backgroundColor: '#e3f2fd',
                  cursor: 'pointer'
                }
              }}
            />
          ))}
        </Stack>

        <Stack 
          direction="row" 
          spacing={2} 
          justifyContent="center"
        >
          <Button 
            variant="contained" 
            onClick={() => handleClick()}
            sx={{ 
              textTransform: 'none',
              minWidth: '100px'
            }}
          >
            Magic
          </Button>
          <Button 
            variant="outlined" 
            onClick={createThread}
            sx={{ 
              textTransform: 'none',
              minWidth: '100px'
            }}
          >
            Thread
          </Button>
          <Button 
            variant="outlined" 
            onClick={pasteClipBoard}
            sx={{ 
              textTransform: 'none',
              minWidth: '100px'
            }}
          >
            Paste
          </Button>
          <Button 
            variant="outlined" 
            color="error" 
            onClick={() => clearAll(false)}
            sx={{ 
              textTransform: 'none',
              minWidth: '100px'
            }}
          >
            Clear
          </Button>
        </Stack>

        <Stack spacing={2}>
          {tweets.map((tweet) => (
            <CardMain
              key={tweets.indexOf(tweet)}
              text={tweet}
              id={tweets.indexOf(tweet)}
              taID={"ta" + tweets.indexOf(tweet).toString()}
            />
          ))}
        </Stack>

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
      </Stack>
    </Container>
  );
};

export default BodyContent;
