    // routes/dashboardRoutes.js
    const express = require('express');
    const { getAdminStats } = require('../controllers/dashboardController');
    const { protect, isAdmin } = require('../middleware/authMiddleware');

    const router = express.Router();

    // --- Routes ---

    // GET /api/dashboard/admin/stats - Admin gets dashboard statistics
    router.get('/admin/stats', protect, isAdmin, getAdminStats);

    // --- TODO: Add dashboard routes for Store Owner if needed ---
    // Example: router.get('/owner/stats', protect, isStoreOwner, getStoreOwnerStats);


    module.exports = router;
    