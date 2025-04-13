import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function UnauthorizedPage() {
  return (
    <Box sx={{ textAlign: 'center', mt: 8 }}>
      <Typography variant="h4" gutterBottom>403 - Unauthorized</Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Sorry, you do not have permission to access this page.
      </Typography>
      <Button variant="contained" component={RouterLink} to="/">
        Go to Homepage
      </Button>
    </Box>
  );
}
export default UnauthorizedPage;