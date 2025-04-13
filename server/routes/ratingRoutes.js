    // routes/ratingRoutes.js
    const express = require('express');
    const { addOrUpdateRating } = require('../controllers/ratingController');
    const { protect } = require('../middleware/authMiddleware'); // Only logged-in users can rate
    const { body, param } = require('express-validator');
    const handleValidationErrors = require('../middleware/validationMiddleware');

    const router = express.Router();

    // Validation for submitting/updating a rating
    const ratingValidation = [
        param('storeId', 'Store ID must be a valid integer').isInt(), // Validate storeId from URL param
        body('rating_value', 'Rating value must be an integer between 1 and 5').isInt({ min: 1, max: 5 })
    ];

    // --- Routes ---

    // POST /api/ratings/:storeId - Add or update a rating for a specific store
    // Using POST for simplicity, handles both create and update via controller logic
    router.post(
        '/:storeId',
        protect, // User must be logged in
        ratingValidation, // Validate input
        handleValidationErrors, // Handle validation errors
        addOrUpdateRating // Call controller
    );

    module.exports = router;
    