import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledFooter = styled('footer')(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  padding: theme.spacing(2),
  marginTop: 'auto',
  color: theme.palette.primary.contrastText,
}));

const Footer = () => {
  return (
    <StyledFooter>
      <Container maxWidth="lg">
        <Box py={2}>
          <Typography variant="body2" align="center">
            © {new Date().getFullYear()}
          </Typography>
        </Box>
      </Container>
    </StyledFooter>
  );
};

export default Footer;
