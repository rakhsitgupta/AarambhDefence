const cors = require('cors');

// CORS middleware
const corsMiddleware = cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 600
});

// Error handling middleware
const errorHandler = (err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({
            success: false,
            message: 'Invalid JSON payload'
        });
    }
    next(err);
};

// Request body validation middleware
const validateRequestBody = (req, res, next) => {
    if (req.method === 'DELETE' && !req.body) {
        req.body = {};
    }
    next();
};

module.exports = {
    corsMiddleware,
    errorHandler,
    validateRequestBody
}; 