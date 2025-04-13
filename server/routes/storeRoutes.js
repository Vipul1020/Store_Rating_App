    // routes/storeRoutes.js
    const express = require('express');
    const {
        createStore,
        getAllStoresAdmin,
        getAllStoresUser,
        getStoreOwnerRatings,
        getStoreOwnerAverageRating,
     } = require('../controllers/storeController');
    const { protect, isAdmin, isStoreOwner } = require('../middleware/authMiddleware');
    const { body } = require('express-validator');
    const handleValidationErrors = require('../middleware/validationMiddleware');

    const router = express.Router();

    // Validation for creating a store
    const createStoreValidation = [
        body('name', 'Store name is required').notEmpty().trim().escape(),
        body('email', 'Provide a valid store contact email').optional().isEmail().normalizeEmail(),
        body('address', 'Store address is required and cannot exceed 400 characters').notEmpty().isLength({ max: 400 }).trim().escape(),
        body('owner_id', 'Owner ID must be a valid integer').optional().isInt()
    ];

    // --- Routes ---

    // POST /api/stores - Admin creates a store
    router.post('/', protect, isAdmin, createStoreValidation, handleValidationErrors, createStore);

    // GET /api/stores/admin - Admin gets list of all stores
    router.get('/admin', protect, isAdmin, getAllStoresAdmin);

    // GET /api/stores - Logged-in user gets list of stores (user view)
    router.get('/', protect, getAllStoresUser); // Any logged-in user can view stores

    // GET /api/stores/my-store/ratings - Store owner gets ratings for their store
    router.get('/my-store/ratings', protect, isStoreOwner, getStoreOwnerRatings);

    // GET /api/stores/my-store/average-rating - Store owner gets average rating for their store
    router.get('/my-store/average-rating', protect, isStoreOwner, getStoreOwnerAverageRating);


    // --- TODO: Add routes for getStoreById, updateStore, deleteStore if needed ---
    // Example: router.get('/:id', protect, getStoreById); // Could be public or protected
    // Example: router.put('/:id', protect, isAdmin, updateStoreValidation, handleValidationErrors, updateStore);
    // Example: router.delete('/:id', protect, isAdmin, deleteStore);


    module.exports = router;
    