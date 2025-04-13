    // routes/userRoutes.js
    const express = require('express');
    const { createUser, getAllUsers, getUserById } = require('../controllers/userController');
    const { protect, isAdmin } = require('../middleware/authMiddleware');
    const { body } = require('express-validator');
    const handleValidationErrors = require('../middleware/validationMiddleware');

    const router = express.Router();

    // Validation rules for creating a user (Admin)
    const createUserValidation = [
        body('name', 'Name must be between 7 and 30 characters').isLength({ min: 7, max: 30 }).trim().escape(),
        body('email', 'Please include a valid email').isEmail().normalizeEmail(),
        body('password', 'Password must be 8-16 characters, include one uppercase and one special character')
            .isLength({ min: 8, max: 16 })
            .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~])/)
            .withMessage('Password must contain at least one uppercase letter and one special character'),
        body('address', 'Address cannot exceed 400 characters').isLength({ max: 400 }).optional().trim().escape(),
        body('role', 'Role must be admin, normal, or store_owner').isIn(['admin', 'normal', 'store_owner'])
    ];

    // --- Routes ---
    // All user routes require admin privileges, applied at the router level or individually

    // POST /api/users - Create a new user (Admin only)
    router.post(
        '/',
        protect, // Ensure user is logged in
        isAdmin, // Ensure user is an admin
        createUserValidation, // Apply validation rules
        handleValidationErrors, // Handle potential validation errors
        createUser // Call the controller function
    );

    // GET /api/users - Get all users with filtering/sorting (Admin only)
    router.get('/', protect, isAdmin, getAllUsers);

    // GET /api/users/:id - Get a single user by ID (Admin only)
    router.get('/:id', protect, isAdmin, getUserById);

    // --- TODO: Add routes for updateUser and deleteUser if needed ---
    // Example: router.put('/:id', protect, isAdmin, updateUserValidation, handleValidationErrors, updateUser);
    // Example: router.delete('/:id', protect, isAdmin, deleteUser);

    module.exports = router;
    