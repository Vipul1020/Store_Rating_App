// controllers/authController.js (for PostgreSQL)
const pool = require('../config/db'); // Uses the pg Pool
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

/**
 * Generates a JWT token for a given user ID and role.
 * @param {number} id - The user's ID.
 * @param {string} role - The user's role (needs to match the custom type or VARCHAR).
 * @returns {string} The generated JWT token.
 */
const generateToken = (id, role) => {
    // Ensure role matches the type used in your DB (e.g., 'admin', 'normal', 'store_owner')
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new normal user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
    // Validation handled by middleware
    const { name, email, password, address } = req.body;

    try {
        // Check if user exists
        const userExistsResult = await pool.query('SELECT email FROM users WHERE email = $1', [email]);
        if (userExistsResult.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_SALT_ROUNDS));
        const password_hash = await bcrypt.hash(password, salt);

        // Insert user with 'normal' role
        // Use RETURNING to get the inserted user's ID and other details back
        const insertSql = `
            INSERT INTO users (name, email, password_hash, address, role)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING user_id, name, email, role, address
        `;
        const newUserResult = await pool.query(insertSql, [
            name,
            email,
            password_hash,
            address || null, // Handle optional address
            'normal' // Default role for registration
        ]);

        if (newUserResult.rows.length > 0) {
            const newUser = newUserResult.rows[0];
            // Respond with user info and token
            res.status(201).json({
                user_id: newUser.user_id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                address: newUser.address,
                token: generateToken(newUser.user_id, newUser.role),
            });
        } else {
             res.status(400).json({ message: 'User registration failed, please try again' });
        }
    } catch (error) {
        console.error('Registration Error (PG):', error);
         // Handle potential unique constraint violation for email
         if (error.code === '23505') { // PostgreSQL unique violation code
            return res.status(400).json({ message: 'User already exists with this email.' });
         }
        next(error);
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
    // Validation handled by middleware
    const { email, password } = req.body;

    try {
        // Find user by email
        const userResult = await pool.query(
            'SELECT user_id, name, email, password_hash, role, address FROM users WHERE email = $1',
            [email]
        );

        if (userResult.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' }); // User not found
        }

        const user = userResult.rows[0];

        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (isMatch) {
            // Respond with user info and token
            res.json({
                user_id: user.user_id,
                name: user.name,
                email: user.email,
                role: user.role,
                address: user.address,
                token: generateToken(user.user_id, user.role),
            });
        } else {
            // Password incorrect
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login Error (PG):', error);
        next(error);
    }
};

// @desc    Change user password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res, next) => {
    // Validation handled by middleware
    const { newPassword } = req.body;
    // User info attached by 'protect' middleware
    const userId = req.user.user_id;

    if (!userId) {
        // Should not happen if 'protect' middleware is working
        return res.status(401).json({ message: 'Not authorized' });
    }

    try {
        // Hash the new password
        const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_SALT_ROUNDS));
        const newPasswordHash = await bcrypt.hash(newPassword, salt);

        // Update the password in the database
        const updateResult = await pool.query(
            'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2',
            [newPasswordHash, userId]
        );

        // Check if any row was actually updated
        if (updateResult.rowCount > 0) {
            res.json({ message: 'Password updated successfully' });
        } else {
            // User might have been deleted since token was issued
            res.status(404).json({ message: 'User not found or password could not be updated' });
        }

    } catch (error) {
        console.error('Change Password Error (PG):', error);
        next(error);
    }
};


module.exports = {
    registerUser,
    loginUser,
    changePassword,
};
