import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Rating, Button, Alert } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function RatingModal({ open, onClose, storeName, storeId, currentRating, onSubmit }) {
  const [rating, setRating] = useState(currentRating || 0);
  const [error, setError] = useState('');

   useEffect(() => {
    // Reset rating when modal opens with a new store or current rating changes
    setRating(currentRating || 0);
    setError(''); // Clear previous errors
  }, [open, currentRating]);


  const handleSubmit = () => {
      if (rating === 0) {
          setError('Please select a rating.');
          return;
      }
      setError('');
      onSubmit(storeId, rating); // Call the submit handler passed from parent
  };

  const handleRatingChange = (event, newValue) => {
      setRating(newValue);
      if (newValue > 0) {
          setError(''); // Clear error once a rating is selected
      }
  };


  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="rating-modal-title"
      aria-describedby="rating-modal-description"
    >
      <Box sx={style}>
        <Typography id="rating-modal-title" variant="h6" component="h2">
          Rate: {storeName}
        </Typography>
         {error && <Alert severity="warning" sx={{ mt: 1, mb: 1 }}>{error}</Alert>}
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <Rating
                name="store-rating"
                value={rating}
                onChange={handleRatingChange}
                size="large"
            />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
             <Button onClick={onClose} variant="outlined">Cancel</Button>
             <Button onClick={handleSubmit} variant="contained" disabled={rating === 0}>
                Submit Rating
             </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default RatingModal;