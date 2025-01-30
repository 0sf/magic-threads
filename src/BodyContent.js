import React, { useState, useEffect } from "react";
import {
  Stack,
  Box,
  Button,
  Snackbar,
  Container,
  Typography,
  IconButton,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import MuiAlert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import insertTextAtCursor from "insert-text-at-cursor";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";

import LLMService from "./llm-service/LLMService";

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

  // Add new state for preview chunks
  const [previewChunks, setPreviewChunks] = useState([]);

  // Add these states
  const [charCount, setCharCount] = useState(0);
  const [tweetCount, setTweetCount] = useState(1);

  // Add loading state
  const [isProcessing, setIsProcessing] = useState(false);

  // Add history states
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Add new state for export snackbar
  const [exportSuccess, setExportSuccess] = useState(false);

  const [isPasting, setIsPasting] = useState(false);

  const TWEET_COLORS = [
    "rgba(255, 183, 183, 0.3)", // soft red
    "rgba(181, 234, 215, 0.3)", // soft mint
    "rgba(199, 206, 234, 0.3)", // soft blue
    "rgba(255, 218, 193, 0.3)", // soft orange
    "rgba(226, 191, 255, 0.3)", // soft purple
    "rgba(190, 233, 232, 0.3)", // soft teal
  ];

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
    setIsPasting(true);
    try {
      const text = await navigator.clipboard.readText();
      document.getElementById("textArea").value = text;
      handleTextAreaChange({ target: { value: text } });
    } catch (error) {
      console.error(error);
      // Show error snackbar
    } finally {
      setIsPasting(false);
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
      setPreviewChunks([]);
      setCharCount(0);
      setTweetCount(1);
      setHistory([]);
      setHistoryIndex(-1);
    } else {
      const textArea = document.getElementById("textArea");
      textArea.value = "";
      setBaseText(null);
      setTweets([]);
      setPreviewChunks([]);
      setCharCount(0);
      setTweetCount(1);
      setClear(true);
      localStorage.removeItem("twitterThreadDraft");
      setHistory([]);
      setHistoryIndex(-1);
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
  const handleClick = async () => {
    setIsProcessing(true);
    try {
      // Get the value of textarea
      var val = document.getElementById("textArea").value;

      if (val.length >= 1) {
        // Setting the basetext
        setBaseText(val);

        if (val.length > 280) {
          // Calculating number of tweets for the thread
          const NUMOF_TWEETS = Math.floor(val.length / TWEET_LENGTH);

          let s = 0,
            e = 280 - PREFIX;
          let tarray = [];

          for (let i = 0; i < NUMOF_TWEETS; i++) {
            tarray[i] = val.slice(s, e);
            if (tarray[i][e - 1] !== " ") {
              tarray[i] = tarray[i] + "-";
            }
            tarray[i] = tarray[i] + ` (${i}/${NUMOF_TWEETS})`;
            s = s + 280 - PREFIX;
            e = e + 280 - PREFIX;
          }

          tarray[NUMOF_TWEETS] =
            val.slice(NUMOF_TWEETS * TWEET_LENGTH, val.length - 1) +
            ` (${NUMOF_TWEETS}/${NUMOF_TWEETS})`;

          setTweets(tarray);
        } else {
          setTweets([val]);
        }
      } else {
        hadleOpen();
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // AI Thread
  const handleAIClick = async () => {
    const llmService = await LLMService();
    const short = await llmService.aiTweet(
      "I am going to the Department of Motor Vehicles later today because I need to renew my driver's license. By the way, did you hear that as soon as possible, the Federal Bureau of Investigation is going to release new information about the case? For your information, I think that is going to be a big deal. In my opinion, the government should be more transparent about these things. To be honest, I do not always trust what they say on television. Oh my God, I completely forgot to tell you! I will talk to you later because I have to meet up with my best friend forever for lunch. She works in Information Technology and always has the most interesting stories. Laughing out loud, last time she told me about a huge mistake someone made in an Artificial Intelligence project. I guess you only live once, right? Let me know if you want to catch up this evening. Otherwise, I will just see you at the usual place, to be determined. Talk to you soon!"
    );
    console.log(short);
  };

  // Add new function to calculate preview chunks
  const calculatePreviewChunks = (text) => {
    if (!text) return [];

    const chunks = [];
    let start = 0;
    const effectiveLength = TWEET_LENGTH - PREFIX;

    while (start < text.length) {
      let end = Math.min(start + effectiveLength, text.length);

      // Find a good breaking point
      if (end < text.length) {
        let breakPoint = end;
        while (
          breakPoint > start &&
          ![" ", ".", "!", "?", "\n"].includes(text[breakPoint - 1])
        ) {
          breakPoint--;
        }
        if (breakPoint > start) {
          end = breakPoint;
        }
      }

      chunks.push({
        text: text.substring(start, end),
        color: TWEET_COLORS[chunks.length % TWEET_COLORS.length],
      });

      start = end;
    }

    return chunks;
  };

  // Modify the existing onChange handler
  const handleTextAreaChange = (e) => {
    const newText = e.target.value;

    // Only add to history if the text actually changed
    if (newText !== (history[historyIndex] || "")) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newText);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }

    setBaseText(newText);
    setCharCount(newText.length);
    setTweetCount(Math.ceil(newText.length / (TWEET_LENGTH - PREFIX)));
    setPreviewChunks(calculatePreviewChunks(newText));
    localStorage.setItem("twitterThreadDraft", newText);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const previousText = history[newIndex];

      setHistoryIndex(newIndex);
      const textArea = document.getElementById("textArea");
      textArea.value = previousText;

      setBaseText(previousText);
      setCharCount(previousText.length);
      setTweetCount(Math.ceil(previousText.length / (TWEET_LENGTH - PREFIX)));
      setPreviewChunks(calculatePreviewChunks(previousText));
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const nextText = history[newIndex];

      setHistoryIndex(newIndex);
      const textArea = document.getElementById("textArea");
      textArea.value = nextText;

      setBaseText(nextText);
      setCharCount(nextText.length);
      setTweetCount(Math.ceil(nextText.length / (TWEET_LENGTH - PREFIX)));
      setPreviewChunks(calculatePreviewChunks(nextText));
    }
  };

  // Add keyboard shortcuts
  useEffect(() => {
    const handleKeyboard = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "z":
            e.preventDefault();
            if (e.shiftKey) {
              redo();
            } else {
              undo();
            }
            break;
          case "m":
            e.preventDefault();
            handleClick();
            break;
          case "v":
            e.preventDefault();
            pasteClipBoard();
            break;
          case "l":
            e.preventDefault();
            clearAll(false);
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  }, [history, historyIndex]);

  // Add auto-save functionality
  useEffect(() => {
    const savedText = localStorage.getItem("twitterThreadDraft");
    if (savedText) {
      document.getElementById("textArea").value = savedText;
      handleTextAreaChange({ target: { value: savedText } });
    }
  }, []);

  const exportThread = (format) => {
    try {
      if (tweets.length === 0) return;

      const text = tweets
        .map((tweet, index) => `Tweet ${index + 1}/${tweets.length}:\n${tweet}`)
        .join("\n\n---\n\n");

      const blob = new Blob([text], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "twitter-thread.txt";
      a.click();
      URL.revokeObjectURL(url);
      setExportSuccess(true);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  return (
    <Container maxWidth="md" component="main">
      <Stack spacing={4}>
        <Box className="textarea-wrapper">
          <div className="highlights">
            {previewChunks.map((chunk, index) => (
              <span
                key={index}
                className="highlight-chunk"
                style={{ backgroundColor: chunk.color }}
              >
                {chunk.text}
              </span>
            ))}
          </div>
          <textarea
            id="textArea"
            rows="15"
            placeholder="Type your long message here..."
            onPaste={(e) => handleTextAreaChange(e)}
            onChange={(e) => handleTextAreaChange(e)}
            spellCheck="false"
          ></textarea>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            color: charCount > TWEET_LENGTH ? "error.main" : "text.secondary",
            px: 1,
          }}
        >
          <Typography variant="caption">{charCount} characters</Typography>
          <Typography variant="caption">
            {tweetCount} tweet{tweetCount > 1 ? "s" : ""}
          </Typography>
        </Box>

        <Stack spacing={3}>
          {/* Emoji Selector */}
          <Box
            sx={{
              backgroundColor: "background.paper",
              borderRadius: 1,
              p: 2,
              boxShadow: 1,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ mb: 1, color: "text.secondary" }}
            >
              Quick Emojis
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {emojies.map((value) => (
                <Chip
                  key={value}
                  label={value}
                  onClick={() => insertAt(value)}
                  sx={{
                    "&:hover": {
                      backgroundColor: "#e3f2fd",
                      transform: "scale(1.05)",
                      transition: "all 0.2s",
                    },
                    cursor: "pointer",
                  }}
                />
              ))}
            </Stack>
          </Box>

          {/* Main Action Buttons */}
          <Box
            sx={{
              backgroundColor: "background.paper",
              borderRadius: 1,
              p: 2,
              boxShadow: 1,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Stack direction="row" spacing={1} flex={1}>
                <LoadingButton
                  loading={isProcessing}
                  variant="contained"
                  onClick={() => handleClick()}
                  title="Ctrl/Cmd + M"
                  sx={{
                    textTransform: "none",
                    minWidth: "120px",
                    backgroundColor: "primary.main",
                    "&:hover": {
                      backgroundColor: "primary.dark",
                    },
                  }}
                  startIcon={
                    <span role="img" aria-label="magic">
                      ✨
                    </span>
                  }
                >
                  Magic Thread
                </LoadingButton>
                <LoadingButton
                  loading={isProcessing}
                  variant="contained"
                  onClick={() => handleAIClick()}
                  sx={{
                    textTransform: "none",
                    minWidth: "120px",
                    backgroundColor: "secondary.main",
                    "&:hover": {
                      backgroundColor: "secondary.dark",
                    },
                  }}
                  startIcon={
                    <span role="img" aria-label="ai">
                      🤖
                    </span>
                  }
                >
                  AI Thread
                </LoadingButton>
                <Button
                  variant="outlined"
                  onClick={createThread}
                  sx={{
                    textTransform: "none",
                    minWidth: "100px",
                    borderColor: "primary.main",
                    color: "primary.main",
                    "&:hover": {
                      borderColor: "primary.dark",
                      backgroundColor: "primary.50",
                    },
                  }}
                  startIcon={
                    <span role="img" aria-label="thread">
                      🧵
                    </span>
                  }
                >
                  Thread
                </Button>
              </Stack>

              <Stack direction="row" spacing={1}>
                <LoadingButton
                  loading={isPasting}
                  variant="outlined"
                  onClick={pasteClipBoard}
                  title="Ctrl/Cmd + V"
                  sx={{
                    textTransform: "none",
                    minWidth: "100px",
                    borderColor: "grey.400",
                    color: "text.primary",
                    "&:hover": {
                      backgroundColor: "grey.50",
                    },
                  }}
                  startIcon={
                    <span role="img" aria-label="paste">
                      📋
                    </span>
                  }
                >
                  Paste
                </LoadingButton>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => clearAll(false)}
                  sx={{
                    textTransform: "none",
                    minWidth: "100px",
                  }}
                  startIcon={
                    <span role="img" aria-label="clear">
                      🗑️
                    </span>
                  }
                >
                  Clear
                </Button>
              </Stack>

              <Stack direction="row" spacing={1}>
                <IconButton
                  onClick={undo}
                  disabled={historyIndex <= 0}
                  title="Undo (Ctrl/Cmd + Z)"
                  sx={{
                    "&:not(:disabled):hover": {
                      backgroundColor: "grey.100",
                    },
                  }}
                >
                  <UndoIcon />
                </IconButton>
                <IconButton
                  onClick={redo}
                  disabled={historyIndex >= history.length - 1}
                  title="Redo (Ctrl/Cmd + Shift + Z)"
                  sx={{
                    "&:not(:disabled):hover": {
                      backgroundColor: "grey.100",
                    },
                  }}
                >
                  <RedoIcon />
                </IconButton>
              </Stack>
            </Stack>

            {/* Export Button - Only show when there are tweets */}
            {tweets.length > 0 && (
              <Button
                variant="outlined"
                onClick={() => exportThread("txt")}
                sx={{
                  textTransform: "none",
                  mt: 2,
                  borderColor: "success.main",
                  color: "success.main",
                  "&:hover": {
                    borderColor: "success.dark",
                    backgroundColor: "success.50",
                  },
                }}
                startIcon={
                  <span role="img" aria-label="export">
                    📤
                  </span>
                }
              >
                Export Thread
              </Button>
            )}
          </Box>

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

          <Snackbar
            open={exportSuccess}
            autoHideDuration={2000}
            onClose={() => setExportSuccess(false)}
          >
            <Alert severity="success">Thread exported successfully!</Alert>
          </Snackbar>
        </Stack>
      </Stack>
    </Container>
  );
};

export default BodyContent;
