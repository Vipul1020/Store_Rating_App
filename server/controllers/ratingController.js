// controllers/ratingController.js (for PostgreSQL)
const pool = require('../config/db'); // Uses the pg Pool

// @desc    Add or update a rating for a store
// @route   POST /api/ratings/:storeId
// @access  Private (Logged in users)
const addOrUpdateRating = async (req, res, next) => {
    const userId = req.user?.user_id; // Get user ID from protect middleware
    const storeIdParam = req.params.storeId;
    const { rating_value } = req.body; // Expecting rating_value in the body

    if (!userId) {
        return res.status(401).json({ message: 'Not authorized' });
    }

    // Validate rating value (basic check, DB constraint handles 1-5)
    if (typeof rating_value !== 'number' || !Number.isInteger(rating_value) || rating_value < 1 || rating_value > 5) {
        return res.status(400).json({ message: 'Rating value must be an integer between 1 and 5.' });
    }

    // Validate storeId parameter
    if (!storeIdParam || isNaN(parseInt(storeIdParam))) {
        return res.status(400).json({ message: 'Invalid store ID provided in URL.' });
    }
    const parsedStoreId = parseInt(storeIdParam);

    try {
        // Optional but good: Check if the store actually exists before trying to rate it
        const storeExists = await pool.query('SELECT store_id FROM stores WHERE store_id = $1', [parsedStoreId]);
        if (storeExists.rows.length === 0) {
            return res.status(404).json({ message: 'Store not found.' });
        }

        // Use INSERT ... ON CONFLICT DO UPDATE for PostgreSQL "upsert" behavior
        // This relies on the UNIQUE constraint named 'user_store_unique_rating'
        // or specifying the columns (user_id, store_id)
        const sql = `
            INSERT INTO ratings (user_id, store_id, rating_value, created_at, updated_at)
            VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            ON CONFLICT (user_id, store_id) -- Specify columns causing potential conflict
            DO UPDATE SET
                rating_value = EXCLUDED.rating_value, -- Use EXCLUDED to get the value proposed for insertion
                updated_at = CURRENT_TIMESTAMP
            RETURNING rating_id, user_id, store_id, rating_value, updated_at; -- Return the final row data
        `;

        // Execute the query with parameters in matching order $1, $2, $3
        const result = await pool.query(sql, [userId, parsedStoreId, rating_value]);

        // Check if a row was returned (meaning insert or update happened)
        if (result.rows.length > 0) {
            // Determine if it was an insert or update by comparing created_at and updated_at (optional)
            // For simplicity, just return success
            res.status(200).json({ // 200 OK is suitable for successful upsert
                message: 'Rating submitted or updated successfully',
                rating: result.rows[0] // Return the resulting rating data
            });
        } else {
            // This case is less likely with RETURNING if the operation succeeded,
            // but could indicate an issue.
            res.status(400).json({ message: 'Failed to submit or update rating.' });
        }

    } catch (error) {
        console.error('Add/Update Rating Error (PG):', error);
        // Handle specific PostgreSQL error codes
        if (error.code === '23503') { // Foreign key violation (user or store doesn't exist)
            return res.status(404).json({ message: 'User or Store not found.' });
        }
        if (error.code === '23514') { // Check constraint violation (rating_value out of range)
            return res.status(400).json({ message: 'Rating value must be between 1 and 5.' });
        }
         if (error.code === '22P02') { // Invalid text representation (e.g., non-integer storeId if validation missed it)
             return res.status(400).json({ message: 'Invalid input format.' });
         }
        next(error); // Pass other errors to the global handler
    }
};

module.exports = {
    addOrUpdateRating,
};
