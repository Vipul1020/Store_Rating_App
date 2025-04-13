import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import {
  Box, Typography, CircularProgress, Alert, Card, CardContent, CardActions,
  Button, Rating, TextField, InputAdornment, IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RatingModal from '../../components/Store/RatingModal'; 

function StoresListPage() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null); 

  const fetchStores = useCallback(async (currentSearchTerm) => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (currentSearchTerm) {
        params.search = currentSearchTerm;
      }
      // Add params for sorting if implementing UI later
      const response = await api.get('/stores', { params });
      setStores(response.data);
    } catch (err) {
      setError('Failed to fetch stores. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array means this function definition doesn't change

  useEffect(() => {
    fetchStores(searchTerm);
  }, [fetchStores, searchTerm]); // Refetch when searchTerm changes

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    // Optional: Add debounce here if needed
  };

  const handleOpenRatingModal = (store) => {
    setSelectedStore(store);
    setRatingModalOpen(true);
  };

  const handleCloseRatingModal = () => {
    setRatingModalOpen(false);
    setSelectedStore(null);
  };

  const handleRatingSubmit = async (storeId, ratingValue) => {
      try {
          await api.post(`/ratings/${storeId}`, { rating_value: ratingValue });
          handleCloseRatingModal();
          // Refetch stores to show updated rating
          fetchStores(searchTerm);
      } catch (err) {
          console.error("Failed to submit rating:", err);
          // Handle error display in modal or here
          setError(err.response?.data?.message || 'Failed to submit rating.');
      }
  };


  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Stores</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

       <TextField
        label="Search Stores (Name/Address)"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={handleSearchChange}
        sx={{ mb: 3 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {stores.length === 0 && !loading && <Typography>No stores found.</Typography>}

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {stores.map((store) => (
          <Card key={store.store_id} sx={{ minWidth: 275, maxWidth: 345, flexGrow: 1 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                {store.name}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                {store.address}
              </Typography>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                Avg Rating:
                <Rating
                    name={`avg-rating-${store.store_id}`}
                    value={store.averageRating || 0}
                    precision={0.1}
                    readOnly
                    sx={{ ml: 1 }}
                 />
                 ({store.averageRating?.toFixed(1) ?? 'N/A'})
              </Typography>
               <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                Your Rating:
                <Rating
                    name={`user-rating-${store.store_id}`}
                    value={store.userSubmittedRating || 0}
                    readOnly
                    sx={{ ml: 1 }}
                 />
                  ({store.userSubmittedRating ?? 'Not Rated'})
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                onClick={() => handleOpenRatingModal(store)}
              >
                {store.userSubmittedRating ? 'Update Rating' : 'Rate Store'}
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>

       {selectedStore && (
        <RatingModal
          open={ratingModalOpen}
          onClose={handleCloseRatingModal}
          storeName={selectedStore.name}
          storeId={selectedStore.store_id}
          currentRating={selectedStore.userSubmittedRating}
          onSubmit={handleRatingSubmit}
        />
      )}
    </Box>
  );
}

export default StoresListPage;