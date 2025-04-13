    // config/db.js
    const { Pool } = require('pg'); // Import the Pool class from the 'pg' library
    const dotenv = require('dotenv');

    // Load environment variables from .env file
    dotenv.config();

    // Create a new Pool instance for PostgreSQL connection pooling
    const pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: parseInt(process.env.DB_PORT || '5432', 10), // Ensure port is an integer
        // Optional: Add other pool configuration options if needed
        // max: 20, // example: max number of clients in the pool
        // idleTimeoutMillis: 30000, // example: how long a client is allowed to remain idle before being closed
        // connectionTimeoutMillis: 2000, // example: how long to wait for a connection attempt
    });

    // Event listener for errors on idle clients
    pool.on('error', (err, client) => {
        console.error('🔴 Unexpected error on idle PostgreSQL client', err);
        // You might want to decide whether to exit the process here
        // process.exit(-1);
    });

    // Function to test the connection by acquiring a client
    const testConnection = async () => {
        let client;
        try {
            // Get a client from the pool
            client = await pool.connect();
            console.log(`✅ PostgreSQL Database connected successfully to "${process.env.DB_NAME}"!`);
        } catch (err) {
            console.error('🔴 PostgreSQL Database Connection Failed:', err.stack || err);
            // Exit process with failure if initial connection fails
            process.exit(1);
        } finally {
            // Make sure to release the client connection back to the pool
            if (client) {
                client.release();
            }
        }
    };

    // Test connection on application startup
    testConnection();

    // Export the pool for use throughout the application
    // Controllers will use pool.query() which handles acquiring and releasing clients.
    module.exports = pool;
    