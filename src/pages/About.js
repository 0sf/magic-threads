import React from "react";
import { Button, Container, Typography, Box, Paper } from "@mui/material";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ 
          color: '#1976d2',
          fontWeight: 500,
          textAlign: 'center',
          mb: 4
        }}>
          Twitter Thread Creator
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ color: '#2c3e50' }}>
            What is this?
          </Typography>
          <Typography variant="body1" paragraph>
            This is a useful tool designed to help you create Twitter threads effortlessly. 
            It automatically splits your long-form content into tweet-sized chunks (280 characters) 
            while maintaining readability and adding proper thread numbering.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ color: '#2c3e50' }}>
            Key Features
          </Typography>
          <Typography component="ul" sx={{ pl: 2 }}>
            <li>Automatic thread splitting with proper numbering</li>
            <li>Quick emoji insertion with preset emoji buttons</li>
            <li>Copy-to-clipboard functionality for each tweet</li>
            <li>Character count limitation (280 characters per tweet)</li>
            <li>Easy editing of individual tweets</li>
            <li>Paste functionality for quick content import</li>
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ color: '#2c3e50' }}>
            How to Use
          </Typography>
          <Typography component="ol" sx={{ pl: 2 }}>
            <li>Paste or type your content in the main text area</li>
            <li>Click "Magic" to automatically split into threads</li>
            <li>Use emoji buttons to add emphasis to your tweets</li>
            <li>Edit individual tweets if needed</li>
            <li>Copy each tweet using the copy button</li>
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button 
            variant="contained" 
            component={Link} 
            to="/"
            sx={{
              textTransform: 'none',
              minWidth: '120px'
            }}
          >
            Try It Now
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default About;
