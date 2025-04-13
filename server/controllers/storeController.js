// controllers/storeController.js (for PostgreSQL)
const pool = require('../config/db');

// Helper function to get average rating for a store
const getAverageRating = async (storeId) => {
    const ratingResult = await pool.query(
        'SELECT AVG(rating_value) as "averageRating" FROM ratings WHERE store_id = $1',
        [storeId]
    );
    const avg = ratingResult.rows[0]?.averageRating;
    return avg ? parseFloat(avg) : null; // Parse numeric type from PG
};

// @desc    Create a new store (by Admin)
// @route   POST /api/stores
// @access  Private/Admin
const createStore = async (req, res, next) => {
    // Validation handled by middleware
    const { name, email, address, owner_id } = req.body;

    try {
        // Optional: Validate owner_id if provided
        if (owner_id) {
            // Ensure owner_id is an integer before querying
            if (isNaN(parseInt(owner_id))) {
                 return res.status(400).json({ message: 'Invalid owner_id format' });
            }
            const ownerResult = await pool.query(
                'SELECT user_id FROM users WHERE user_id = $1 AND role = $2',
                [owner_id, 'store_owner'] // Use the specific role value
            );
            if (ownerResult.rows.length === 0) {
                return res.status(400).json({ message: 'Invalid owner_id or user is not a store owner' });
            }
        }
        // Optional: Check if store email exists if provided
        if (email) {
            const emailExists = await pool.query('SELECT store_id FROM stores WHERE email = $1', [email]);
            if (emailExists.rows.length > 0) {
                return res.status(400).json({ message: 'Store email already in use' });
            }
        }

        const insertSql = `
            INSERT INTO stores (name, email, address, owner_id)
            VALUES ($1, $2, $3, $4)
            RETURNING store_id, name, email, address, owner_id
        `;
        const newStoreResult = await pool.query(insertSql, [
            name,
            email || null,
            address,
            owner_id || null
        ]);

        if (newStoreResult.rows.length > 0) {
            res.status(201).json(newStoreResult.rows[0]);
        } else {
            res.status(400).json({ message: 'Store creation failed' });
        }
    } catch (error) {
        console.error('Create Store Error (PG):', error);
         // Handle potential unique constraint violation for email
         if (error.code === '23505') { // PostgreSQL unique violation code
            return res.status(400).json({ message: 'Store email already exists.' });
         }
         // Handle foreign key violation if owner_id is invalid
         if (error.code === '23503') {
             return res.status(400).json({ message: 'Invalid owner_id provided.' });
         }
        next(error);
    }
};

// @desc    Get all stores (for Admin view)
// @route   GET /api/stores/admin
// @access  Private/Admin
const getAllStoresAdmin = async (req, res, next) => {
    // --- Filtering ---
    const { name, email, address } = req.query;
    let filterClauses = [];
    let queryParams = [];
    let paramIndex = 1;

    if (name) {
        filterClauses.push(`s.name ILIKE $${paramIndex++}`);
        queryParams.push(`%${name}%`);
    }
    if (email) {
        filterClauses.push(`s.email ILIKE $${paramIndex++}`);
        queryParams.push(`%${email}%`);
    }
    if (address) {
        filterClauses.push(`s.address ILIKE $${paramIndex++}`);
        queryParams.push(`%${address}%`);
    }
    const whereSql = filterClauses.length > 0 ? `WHERE ${filterClauses.join(' AND ')}` : '';

    // --- Sorting ---
    const { sortBy = 'store_id', order = 'asc' } = req.query;
    const allowedSortBy = ['store_id', 'name', 'email', 'address', 'created_at', 'averageRating', 'owner_name'];
    const sortOrder = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
    let sortColumn;

    // Handle aliased or calculated columns for sorting
    switch (sortBy) {
        case 'averageRating':
            sortColumn = '"averageRating"'; // Quote alias from query
            break;
        case 'owner_name':
            sortColumn = '"owner_name"'; // Quote alias from query
            break;
        default:
            // Whitelist standard columns and prefix with table alias
            sortColumn = allowedSortBy.includes(sortBy) ? `s."${sortBy}"` : 's.store_id';
            break;
    }
    const orderBySql = `ORDER BY ${sortColumn} ${sortOrder}`;

    try {
        // Query to get stores, owner name, and their average ratings
        const sql = `
            SELECT
                s.store_id, s.name, s.email, s.address, s.owner_id, s.created_at,
                u.name as "owner_name", -- Alias owner name
                AVG(r.rating_value) as "averageRating" -- Alias average rating
            FROM stores s
            LEFT JOIN users u ON s.owner_id = u.user_id
            LEFT JOIN ratings r ON s.store_id = r.store_id
            ${whereSql}
            GROUP BY s.store_id, u.name -- Group by store and owner name
            ${orderBySql}
        `;

        const storesResult = await pool.query(sql, queryParams);

        // Format average rating (PostgreSQL AVG returns numeric type)
        const formattedStores = storesResult.rows.map(store => ({
            ...store,
            averageRating: store.averageRating ? parseFloat(store.averageRating) : null
        }));

        res.json(formattedStores);
    } catch (error) {
        console.error('Get All Stores (Admin) Error (PG):', error);
        next(error);
    }
};


// @desc    Get all stores (for Normal User view)
// @route   GET /api/stores
// @access  Private
const getAllStoresUser = async (req, res, next) => {
    const userId = req.user?.user_id; // Get logged-in user's ID

    if (!userId) {
         return res.status(401).json({ message: 'Not authorized' });
    }

    // --- Searching ---
    const { search } = req.query;
    let filterClauses = [];
    let queryParams = [userId]; // Start params with userId for user rating subquery
    let paramIndex = 2; // Start next param index at $2

    if (search) {
        // Simple search on name and address (case-insensitive)
        filterClauses.push(`(s.name ILIKE $${paramIndex} OR s.address ILIKE $${paramIndex + 1})`);
        const searchTerm = `%${search}%`;
        queryParams.push(searchTerm, searchTerm);
        paramIndex += 2;
    }
    const whereSql = filterClauses.length > 0 ? `WHERE ${filterClauses.join(' AND ')}` : '';


    // --- Sorting ---
    const { sortBy = 'name', order = 'asc' } = req.query;
    const allowedSortBy = ['name', 'address', 'averageRating'];
    const sortOrder = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
    let sortColumn;

    switch (sortBy) {
        case 'averageRating':
            sortColumn = '"averageRating"'; // Use alias
            break;
        default:
             sortColumn = allowedSortBy.includes(sortBy) ? `s."${sortBy}"` : 's.name';
             break;
    }
     const orderBySql = `ORDER BY ${sortColumn} ${sortOrder}`;


    try {
        // Query to get stores, average ratings, and the current user's rating
        const sql = `
            SELECT
                s.store_id,
                s.name,
                s.address,
                AVG(r.rating_value) AS "averageRating",
                -- Subquery to get the specific user's rating for this store
                (SELECT rating_value FROM ratings WHERE store_id = s.store_id AND user_id = $1) AS "userSubmittedRating"
            FROM stores s
            LEFT JOIN ratings r ON s.store_id = r.store_id
            ${whereSql}
            GROUP BY s.store_id -- Group by store to calculate AVG
            ${orderBySql}
        `;

        const storesResult = await pool.query(sql, queryParams);

        // Format average rating
        const formattedStores = storesResult.rows.map(store => ({
            ...store,
            averageRating: store.averageRating ? parseFloat(store.averageRating) : null,
            // userSubmittedRating is already correct type (INT or NULL)
        }));

        res.json(formattedStores);
    } catch (error) {
        console.error('Get All Stores (User) Error (PG):', error);
        next(error);
    }
};

// @desc    Get ratings for the store owned by the logged-in user
// @route   GET /api/stores/my-store/ratings
// @access  Private/StoreOwner
const getStoreOwnerRatings = async (req, res, next) => {
    const ownerId = req.user?.user_id;
     if (!ownerId) {
         return res.status(401).json({ message: 'Not authorized' });
    }

    try {
        // 1. Find the store owned by this user
        const storeResult = await pool.query('SELECT store_id FROM stores WHERE owner_id = $1', [ownerId]);
        if (storeResult.rows.length === 0) {
            return res.status(404).json({ message: 'No store found for this owner.' });
        }
        const storeId = storeResult.rows[0].store_id;

        // 2. Get users and their ratings for this store
        const sql = `
            SELECT u.user_id, u.name, u.email, r.rating_value, r.updated_at as "rating_timestamp"
            FROM ratings r
            JOIN users u ON r.user_id = u.user_id
            WHERE r.store_id = $1
            ORDER BY r.updated_at DESC
        `;
        const ratingsResult = await pool.query(sql, [storeId]);

        res.json(ratingsResult.rows);

    } catch (error) {
        console.error('Get Store Owner Ratings Error (PG):', error);
        next(error);
    }
};

 // @desc    Get average rating for the store owned by the logged-in user
// @route   GET /api/stores/my-store/average-rating
// @access  Private/StoreOwner
const getStoreOwnerAverageRating = async (req, res, next) => {
    const ownerId = req.user?.user_id;
     if (!ownerId) {
         return res.status(401).json({ message: 'Not authorized' });
    }

    try {
        // 1. Find the store owned by this user
        const storeResult = await pool.query('SELECT store_id FROM stores WHERE owner_id = $1', [ownerId]);
        if (storeResult.rows.length === 0) {
            return res.status(404).json({ message: 'No store found for this owner.' });
        }
        const storeId = storeResult.rows[0].store_id;

        // 2. Calculate average rating using helper function
        const averageRating = await getAverageRating(storeId); // Already handles parsing

        res.json({ store_id: storeId, averageRating: averageRating });

    } catch (error) {
        console.error('Get Store Owner Average Rating Error (PG):', error);
        next(error);
    }
};


// --- TODO: Add getStoreById, updateStore, deleteStore controllers if needed, adapting SQL ---

module.exports = {
    createStore,
    getAllStoresAdmin,
    getAllStoresUser,
    getStoreOwnerRatings,
    getStoreOwnerAverageRating,
};
