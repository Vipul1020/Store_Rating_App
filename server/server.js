// server.js - Main Application Entry Point

// --- Core Modules ---
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// --- Load Environment Variables ---
// Loads variables from .env file into process.env
// Ensure this runs before any code that relies on process.env
dotenv.config();

// --- Database Connection ---
// Import the pool. This also implicitly runs the connection test in db.js on startup.
const pool = require('./config/db');

// --- Route Imports ---
// Import the routers defined in the 'routes' directory
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const storeRoutes = require('./routes/storeRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// --- Initialize Express App ---
const app = express();

// --- Global Middleware ---

// 1. CORS (Cross-Origin Resource Sharing)
// Allows requests from different origins (e.g., your React frontend)
// Configure allowed origins specifically for production environments
app.use(cors()); // For development, allows all origins

// 2. Body Parsers
// Parses incoming request bodies:
app.use(express.json()); // Parses JSON payloads (Content-Type: application/json)
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded payloads (Content-Type: application/x-www-form-urlencoded)

// --- API Route Mounting ---
// Mount the imported routers onto specific base paths
app.use('/api/auth', authRoutes);           // Authentication routes (login, register, change password)
app.use('/api/users', userRoutes);         // User management routes (Admin)
app.use('/api/stores', storeRoutes);       // Store related routes (Admin, User, Store Owner)
app.use('/api/ratings', ratingRoutes);     // Rating submission routes (User)
app.use('/api/dashboard', dashboardRoutes); // Dashboard data routes (Admin, potentially Store Owner later)

// --- Root Route / Health Check ---
// A simple route to check if the API is running
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Store Rating API is running successfully!',
        timestamp: new Date().toISOString() // Optional: provide timestamp
    });
});

// --- 404 Not Found Handler ---
// This middleware runs if no other route matches the requested URL
// It should be placed AFTER all your valid API routes
app.use((req, res, next) => {
    res.status(404).json({ message: `Resource not found at ${req.originalUrl}` });
});

// --- Global Error Handler ---
// Catches errors passed by `next(error)` from controllers or other middleware
// Must have 4 arguments (err, req, res, next) to be recognized as an error handler
// This should be the VERY LAST piece of middleware defined
app.use((err, req, res, next) => {
    // Log the error internally (consider using a dedicated logger in production)
    console.error("🔴 Global Error Handler Caught:", err.stack || err);

    // Determine the status code - use error's status or default to 500
    const statusCode = err.status || 500;

    // Send a generic error response back to the client
    // Avoid sending detailed stack traces in production environments
    res.status(statusCode).json({
        message: err.message || 'An unexpected server error occurred.',
        // Optionally include stack trace in development only
        // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// --- Server Startup ---
// Define the port, using environment variable or a default
const PORT = process.env.PORT || 5003;

// Start listening for incoming connections
app.listen(PORT, () => {
    console.log(`✅ Server is running in '${process.env.NODE_ENV || 'development'}' mode on http://localhost:${PORT}`);
});
