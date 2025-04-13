import React from 'react';
import { Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function HomePage() {
    const { isAuthenticated } = useAuth();
  return (
    <Box sx={{ textAlign: 'center', mt: 8 }}>
      <Typography variant="h3" gutterBottom>
        Welcome to Store Ratings!
      </Typography>
      <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
        Find and rate your favorite local stores.
      </Typography>
      {isAuthenticated ? (
         <Button variant="contained" size="large" component={RouterLink} to="/stores">
             View Stores
         </Button>
      ) : (
         <Box>
            <Button variant="contained" size="large" component={RouterLink} to="/login" sx={{ mr: 2 }}>
                Login
            </Button>
            <Button variant="outlined" size="large" component={RouterLink} to="/signup">
                Sign Up
            </Button>
         </Box>
      )}
    </Box>
  );
}
export default HomePage;