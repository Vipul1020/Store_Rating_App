    // routes/authRoutes.js
    const express = require('express');
    const { registerUser, loginUser, changePassword } = require('../controllers/authController');
    const { body } = require('express-validator');
    const { protect } = require('../middleware/authMiddleware'); // Import protect middleware
    const handleValidationErrors = require('../middleware/validationMiddleware'); // Import validation error handler

    const router = express.Router();

    // --- Validation Rules ---
    const registerValidation = [
        body('name', 'Name must be between 7 and 30 characters').isLength({ min: 7, max: 30 }).trim().escape(),
        body('email', 'Please include a valid email').isEmail().normalizeEmail(),
        body('password', 'Password must be 8-16 characters, include one uppercase and one special character')
            .isLength({ min: 8, max: 16 })
            .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~])/) // Expanded special chars
            .withMessage('Password must contain at least one uppercase letter and one special character'), // Custom message
        body('address', 'Address cannot exceed 400 characters').isLength({ max: 400 }).optional().trim().escape()
    ];

    const loginValidation = [
        body('email', 'Please include a valid email').isEmail().normalizeEmail(),
        body('password', 'Password is required').notEmpty() // Use notEmpty instead of exists
    ];

    const changePasswordValidation = [
         body('newPassword', 'New password must be 8-16 characters, include one uppercase and one special character')
             .isLength({ min: 8, max: 16 })
             .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~])/)
             .withMessage('New password must contain at least one uppercase letter and one special character'),
     ];

    // --- Routes ---
    // Register: Apply validation rules, handle errors, then call controller
    router.post('/register', registerValidation, handleValidationErrors, registerUser);

    // Login: Apply validation rules, handle errors, then call controller
    router.post('/login', loginValidation, handleValidationErrors, loginUser);

    // Change Password: Apply 'protect' middleware first, then validation, handle errors, then controller
    router.put('/change-password', protect, changePasswordValidation, handleValidationErrors, changePassword);

    module.exports = router;
    