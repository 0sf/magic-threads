import React, { useState, useEffect } from "react";
import { Stack, Box, Button, Snackbar, Container, Typography, IconButton} from "@mui/material";
import { LoadingButton } from '@mui/lab';
import MuiAlert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import insertTextAtCursor from "insert-text-at-cursor";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";

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
    'rgba(255, 183, 183, 0.3)', // soft red
    'rgba(181, 234, 215, 0.3)', // soft mint
    'rgba(199, 206, 234, 0.3)', // soft blue
    'rgba(255, 218, 193, 0.3)', // soft orange
    'rgba(226, 191, 255, 0.3)', // soft purple
    'rgba(190, 233, 232, 0.3)', // soft teal
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
      textArea.value = '';
      setBaseText(null);
      setTweets([]);
      setPreviewChunks([]);
      setCharCount(0);
      setTweetCount(1);
      setClear(true);
      localStorage.removeItem('twitterThreadDraft');
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
        while (breakPoint > start && 
               ![' ', '.', '!', '?', '\n'].includes(text[breakPoint - 1])) {
          breakPoint--;
        }
        if (breakPoint > start) {
          end = breakPoint;
        }
      }
      
      chunks.push({
        text: text.substring(start, end),
        color: TWEET_COLORS[chunks.length % TWEET_COLORS.length]
      });
      
      start = end;
    }
    
    return chunks;
  };

  // Modify the existing onChange handler
  const handleTextAreaChange = (e) => {
    const newText = e.target.value;
    
    // Only add to history if the text actually changed
    if (newText !== (history[historyIndex] || '')) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newText);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
    
    setBaseText(newText);
    setCharCount(newText.length);
    setTweetCount(Math.ceil(newText.length / (TWEET_LENGTH - PREFIX)));
    setPreviewChunks(calculatePreviewChunks(newText));
    localStorage.setItem('twitterThreadDraft', newText);
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
        switch(e.key) {
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              redo();
            } else {
              undo();
            }
            break;
          case 'm':
            e.preventDefault();
            handleClick();
            break;
          case 'v':
            e.preventDefault();
            pasteClipBoard();
            break;
          case 'l':
            e.preventDefault();
            clearAll(false);
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [history, historyIndex]);

  // Add auto-save functionality
  useEffect(() => {
    const savedText = localStorage.getItem('twitterThreadDraft');
    if (savedText) {
      document.getElementById("textArea").value = savedText;
      handleTextAreaChange({ target: { value: savedText } });
    }
  }, []);

  const exportThread = (format) => {
    try {
      if (tweets.length === 0) return;
      
      const text = tweets.map((tweet, index) => 
        `Tweet ${index + 1}/${tweets.length}:\n${tweet}`
      ).join('\n\n---\n\n');

      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'twitter-thread.txt';
      a.click();
      URL.revokeObjectURL(url);
      setExportSuccess(true);
    } catch (error) {
      console.error('Export failed:', error);
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

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          color: charCount > TWEET_LENGTH ? 'error.main' : 'text.secondary',
          px: 1 
        }}>
          <Typography variant="caption">
            {charCount} characters
          </Typography>
          <Typography variant="caption">
            {tweetCount} tweet{tweetCount > 1 ? 's' : ''}
          </Typography>
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
          <LoadingButton 
            loading={isProcessing}
            variant="contained" 
            onClick={() => handleClick()}
            title="Ctrl/Cmd + M"
            sx={{ 
              textTransform: 'none',
              minWidth: '100px'
            }}
          >
            Magic
          </LoadingButton>
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
          <LoadingButton 
            loading={isPasting}
            variant="outlined" 
            onClick={pasteClipBoard}
            title="Ctrl/Cmd + V"
            sx={{ textTransform: 'none', minWidth: '100px' }}
          >
            Paste
          </LoadingButton>
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

        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="outlined"
            onClick={() => exportThread('txt')}
            disabled={tweets.length === 0}
            sx={{ textTransform: 'none' }}
          >
            Export Thread
          </Button>
        </Stack>

        <Snackbar 
          open={exportSuccess} 
          autoHideDuration={2000} 
          onClose={() => setExportSuccess(false)}
        >
          <Alert severity="success">
            Thread exported successfully!
          </Alert>
        </Snackbar>

        <Stack direction="row" spacing={1}>
          <IconButton 
            onClick={undo} 
            disabled={historyIndex <= 0}
            title="Undo (Ctrl/Cmd + Z)"
          >
            <UndoIcon />
          </IconButton>
          <IconButton 
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            title="Redo (Ctrl/Cmd + Shift + Z)"
          >
            <RedoIcon />
          </IconButton>
        </Stack>
      </Stack>
    </Container>
  );
};

export default BodyContent;
