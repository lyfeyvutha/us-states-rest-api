// Load environment variables
require('dotenv').config();

// Import required modules
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const mongoose = require('mongoose');

// Import database connection function
const connectDB = require('./config/dbConn');

// Import CORS options
const corsOptions = require('./config/corsOptions');

// Define the port
const PORT = process.env.PORT || 3500;

// Connect to MongoDB
connectDB();

// Custom middleware for logging
app.use(logger);

// Set CORS settings allowing outside site access
app.use(cors(corsOptions));

// Built-in middleware for parsing JSON data
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '/public')));

// Prevent caching of pages affecting response status codes
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
});

// Use routes from external route files
app.use('/states', require('./routes/states'));
app.use('/', require('./routes/root'));

// Serve 404 page for all other requests
app.all('*', (req, res) => {
    console.log("Not found from server.js file.");
    res.status(404);
    if (req.accepts('text/html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('application/json')) {
        res.json({ "error": "404 Not Found"});
    } else {
        res.type('txt').send('404 Not Found');
    }
});

// Error handling middleware
app.use(errorHandler);

// Listen for MongoDB connection event before starting the server
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    // Start the server
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
