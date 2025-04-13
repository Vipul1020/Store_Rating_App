import React from 'react';
import { Typography, Box } from '@mui/material';

function AdminDashboardPage() {
  // TODO: Fetch admin stats from /api/dashboard/admin/stats
  return (
    <Box>
      <Typography variant="h4">Admin Dashboard</Typography>
      <Typography sx={{ mt: 2 }}>
        (Admin stats and links to user/store management would go here - Not implemented due to time constraints)
      </Typography>
      {/* Display stats here */}
    </Box>
  );
}
export default AdminDashboardPage;