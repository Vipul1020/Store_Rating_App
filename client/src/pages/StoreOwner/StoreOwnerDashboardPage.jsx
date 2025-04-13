import React, { useState, useEffect } from 'react';
import { Typography, Box, CircularProgress, Alert, Rating } from '@mui/material';
import api from '../../services/api';

function StoreOwnerDashboardPage() {
  const [avgRatingData, setAvgRatingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAvgRating = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get('/stores/my-store/average-rating');
        setAvgRatingData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch average rating.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAvgRating();
  }, []);


  return (
    <Box>
      <Typography variant="h4">Store Owner Dashboard</Typography>
      {loading && <CircularProgress sx={{ mt: 2 }}/>}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

      {avgRatingData && (
        <Box sx={{ mt: 3 }}>
           <Typography variant="h6">Your Store's Average Rating:</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                 <Rating
                    name="owner-avg-rating"
                    value={avgRatingData.averageRating || 0}
                    precision={0.1}
                    readOnly
                    size="large"
                    sx={{ mr: 1 }}
                 />
                 <Typography variant="h5">
                    ({avgRatingData.averageRating?.toFixed(1) ?? 'N/A'})
                 </Typography>
            </Box>
        </Box>
      )}

       <Typography sx={{ mt: 4 }}>
        (Link to view list of raters would go here - Not implemented due to time constraints)
      </Typography>
    </Box>
  );
}
export default StoreOwnerDashboardPage;