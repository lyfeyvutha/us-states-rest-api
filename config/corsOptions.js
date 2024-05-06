const allowedOrigins = require('./allowedOrigins');

const corsOptions = {
    // Checking if the request origin is allowed
    origin: (origin, callback) => {
        // If allowedOrigins includes '*', allows all origins
        // Otherwise, only allows origins listed in allowedOrigins
        if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
            callback(null, true); // Origin is allowed
        } else {
            callback(new Error('Not allowed by CORS')); // Origin is not allowed
        }
    },
    // Setting the success status to 200
    optionsSuccessStatus: 200
};

module.exports = corsOptions;
