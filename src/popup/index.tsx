// src/popup/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, CssBaseline, Box, Typography } from '@mui/material';
import theme from '../editor/theme';

const Popup = () => {
  return (
    <Box sx={{ p: 2, width: 300 }}>
      <Typography variant="h6" gutterBottom>
        Quote Image Generator
      </Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        Select text on any webpage and click the camera icon or use the context menu to create a quote image.
      </Typography>
    </Box>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Popup />
    </ThemeProvider>
  </React.StrictMode>
);