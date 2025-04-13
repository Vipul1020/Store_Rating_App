// controllers/dashboardController.js (for PostgreSQL)
const pool = require('../config/db'); // Uses the pg Pool

// @desc    Get dashboard statistics (Admin)
// @route   GET /api/dashboard/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res, next) => {
    try {
        // Use Promise.all to run count queries concurrently for efficiency
        const [
            userCountResult,
            storeCountResult,
            ratingCountResult
        ] = await Promise.all([
            pool.query('SELECT COUNT(*) AS "totalUsers" FROM users'),
            pool.query('SELECT COUNT(*) AS "totalStores" FROM stores'),
            pool.query('SELECT COUNT(*) AS "totalRatings" FROM ratings')
        ]);

        // Extract counts from results (pg returns count as string, parse it)
        const stats = {
            totalUsers: parseInt(userCountResult.rows[0]?.totalUsers || '0', 10),
            totalStores: parseInt(storeCountResult.rows[0]?.totalStores || '0', 10),
            totalRatings: parseInt(ratingCountResult.rows[0]?.totalRatings || '0', 10),
        };

        res.json(stats);
    } catch (error) {
        console.error('Get Admin Stats Error (PG):', error);
        next(error);
    }
};

// --- TODO: Add dashboard controllers for Store Owner if needed ---

module.exports = {
    getAdminStats,
};
