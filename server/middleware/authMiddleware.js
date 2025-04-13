    // middleware/authMiddleware.js
    const jwt = require('jsonwebtoken');
    const pool = require('../config/db'); // Import the database pool

    /**
     * Middleware to protect routes that require authentication.
     * Verifies the JWT token from the Authorization header.
     * Attaches user information (excluding password) to req.user if valid.
     */
    const protect = async (req, res, next) => {
        let token;
        console.log("--- Entering protect middleware ---"); // Log entry
    
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            try {
                let rawToken = req.headers.authorization.split(' ')[1];
                token = rawToken ? rawToken.trim() : '';
                console.log("Token extracted:", token); // Log extracted token
                console.log("Secret being used:", process.env.JWT_SECRET); // Log secret
    
                if (!token) {
                    console.log("Error: No token found after extraction/trimming.");
                    return res.status(401).json({ message: 'Not authorized, no token provided' });
                }
    
                // Verify token using the secret key
                console.log("Attempting jwt.verify...");
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                console.log("jwt.verify SUCCESS! Decoded payload:", decoded); // Log if verify succeeds
    
                // Check if decoded payload has the user ID
                if (!decoded || typeof decoded.id === 'undefined') {
                     console.error("Error: Decoded token missing 'id' field.");
                     return res.status(401).json({ message: 'Not authorized, invalid token payload' });
                }
                 console.log(`Decoded user ID: ${decoded.id} (Type: ${typeof decoded.id})`);
    
    
                // Fetch user details from DB using the id from the token payload
                console.log(`Attempting DB query for user ID: ${decoded.id}`);
                const userResult = await pool.query(
                    'SELECT user_id, name, email, role, address FROM users WHERE user_id = $1',
                    [decoded.id]
                );
                console.log("DB query result rows:", userResult.rows); // Log DB result
    
                // Check if user still exists
                if (userResult.rows.length === 0) {
                    console.log(`User ID ${decoded.id} not found in DB.`);
                    return res.status(401).json({ message: 'Not authorized, user not found' });
                }
    
                // Attach user object to the request
                req.user = userResult.rows[0];
                console.log("User attached to req.user. Proceeding...");
                next(); // Proceed to the next middleware or route handler
    
            } catch (error) {
                // Log the specific error caught during verification or DB query
                console.error("🔴 ERROR caught in 'protect' middleware:", error.name, error.message);
                // console.error(error.stack); // Optionally log stack trace for more detail
    
                // Send specific responses based on JWT errors
                if (error.name === 'JsonWebTokenError') {
                     res.status(401).json({ message: 'Not authorized, invalid token signature or format' });
                } else if (error.name === 'TokenExpiredError') {
                     res.status(401).json({ message: 'Not authorized, token expired' });
                } else {
                     // Send generic message for other errors (like DB errors or the weird syntax error)
                     res.status(401).json({ message: 'Not authorized, token processing failed' });
                     // Optionally send the specific internal error message in dev mode
                     // res.status(500).json({ message: 'Token processing failed', error: error.message });
                }
            }
        } else {
            // No Bearer token found in the header
            console.log("Error: No 'Authorization: Bearer' header found.");
            res.status(401).json({ message: 'Not authorized, no token provided' });
        }
    };
    /**
     * Middleware to restrict access to Admin users only.
     * Must be used AFTER the 'protect' middleware.
     */
    const isAdmin = (req, res, next) => {
        // Check if user is attached by 'protect' middleware and has 'admin' role
        if (req.user && req.user.role === 'admin') {
            next(); // User is admin, proceed
        } else {
            res.status(403).json({ message: 'Forbidden: Access restricted to administrators' });
        }
    };

     /**
     * Middleware to restrict access to Store Owner users only.
     * Must be used AFTER the 'protect' middleware.
     */
    const isStoreOwner = (req, res, next) => {
        // Check if user is attached by 'protect' middleware and has 'store_owner' role
        if (req.user && req.user.role === 'store_owner') {
            next(); // User is store owner, proceed
        } else {
            res.status(403).json({ message: 'Forbidden: Access restricted to store owners' });
        }
    };

    // Export the middleware functions
    module.exports = { protect, isAdmin, isStoreOwner };
    