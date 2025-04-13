// controllers/userController.js (for PostgreSQL)
const pool = require('../config/db');
const bcrypt = require('bcrypt');

// @desc    Create a new user (by Admin)
// @route   POST /api/users
// @access  Private/Admin
const createUser = async (req, res, next) => {
    // Validation handled by middleware
    const { name, email, password, address, role } = req.body;

    // Role validation already done by express-validator's isIn()

    try {
        // Check if user exists
        const userExistsResult = await pool.query('SELECT email FROM users WHERE email = $1', [email]);
        if (userExistsResult.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_SALT_ROUNDS));
        const password_hash = await bcrypt.hash(password, salt);

        // Insert user
        const insertSql = `
            INSERT INTO users (name, email, password_hash, address, role)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING user_id, name, email, role, address
        `;
        const newUserResult = await pool.query(insertSql, [
            name,
            email,
            password_hash,
            address || null,
            role // Role validated by middleware
        ]);

        if (newUserResult.rows.length > 0) {
            res.status(201).json(newUserResult.rows[0]); // Return created user info
        } else {
            res.status(400).json({ message: 'User creation failed' });
        }
    } catch (error) {
        console.error('Create User Error (PG):', error);
         // Handle potential unique constraint violation for email
         if (error.code === '23505') { // PostgreSQL unique violation code
            return res.status(400).json({ message: 'User already exists with this email.' });
         }
         // Handle invalid enum input if using custom type and validation missed it
         if (error.code === '22P02') { // invalid text representation for enum
             return res.status(400).json({ message: 'Invalid role specified.' });
         }
        next(error);
    }
};

// @desc    Get all users (Admin) with filtering and sorting
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
    // --- Filtering ---
    const { name, email, address, role } = req.query;
    let filterClauses = [];
    let queryParams = [];
    let paramIndex = 1; // Start index for query parameters

    if (name) {
        filterClauses.push(`name ILIKE $${paramIndex++}`); // ILIKE for case-insensitive search
        queryParams.push(`%${name}%`);
    }
    if (email) {
        filterClauses.push(`email ILIKE $${paramIndex++}`);
        queryParams.push(`%${email}%`);
    }
    if (address) {
        filterClauses.push(`address ILIKE $${paramIndex++}`);
        queryParams.push(`%${address}%`);
    }
    // Ensure role is valid before adding to query to prevent SQL injection if not using enum type strictly
    if (role && ['admin', 'normal', 'store_owner'].includes(role)) {
        filterClauses.push(`role = $${paramIndex++}`);
        queryParams.push(role);
    }

    const whereSql = filterClauses.length > 0 ? `WHERE ${filterClauses.join(' AND ')}` : '';

    // --- Sorting ---
    const { sortBy = 'user_id', order = 'asc' } = req.query;
    // Whitelist columns allowed for sorting to prevent SQL injection
    const allowedSortBy = ['user_id', 'name', 'email', 'role', 'created_at'];
    const sortColumn = allowedSortBy.includes(sortBy) ? sortBy : 'user_id';
    const sortOrder = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
    const orderBySql = `ORDER BY "${sortColumn}" ${sortOrder}`; // Quote column name just in case

    try {
        const sql = `
            SELECT user_id, name, email, address, role, created_at
            FROM users
            ${whereSql}
            ${orderBySql}
        `;
        const usersResult = await pool.query(sql, queryParams);
        res.json(usersResult.rows);
    } catch (error) {
        console.error('Get All Users Error (PG):', error);
        next(error);
    }
};

// @desc    Get single user by ID (Admin)
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = async (req, res, next) => {
    const userId = req.params.id;

    // Validate ID format
     if (isNaN(parseInt(userId))) {
        return res.status(400).json({ message: 'Invalid user ID format' });
    }

    try {
        // Base user query
        const userSql = `
            SELECT user_id, name, email, address, role, created_at
            FROM users
            WHERE user_id = $1
        `;
        const userResult = await pool.query(userSql, [userId]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = userResult.rows[0];

        // If user is a Store Owner, try to get their average store rating
        if (user.role === 'store_owner') {
            // Find the store owned by this user
            const storeSql = 'SELECT store_id FROM stores WHERE owner_id = $1 LIMIT 1';
            const storeResult = await pool.query(storeSql, [userId]);

            if (storeResult.rows.length > 0) {
                const storeId = storeResult.rows[0].store_id;
                // Calculate average rating for that store
                const ratingSql = 'SELECT AVG(rating_value) as "averageRating" FROM ratings WHERE store_id = $1';
                const ratingResult = await pool.query(ratingSql, [storeId]);

                // Add rating to user object, handle null if no ratings
                // AVG returns 'numeric' type in PG, needs parsing. Result might be null.
                const avgRating = ratingResult.rows[0]?.averageRating;
                user.storeAverageRating = avgRating ? parseFloat(avgRating) : null;
            } else {
                 user.storeAverageRating = null; // Owner might not have a store assigned yet
            }
        }

        res.json(user);
    } catch (error) {
        console.error('Get User By ID Error (PG):', error);
        next(error);
    }
};

// --- TODO: Add updateUser and deleteUser controllers if needed, adapting SQL ---

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
};
