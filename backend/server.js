// Load environment variables first
require('dotenv').config();

const express = require('express')
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const helmet = require('helmet');
const { corsMiddleware, errorHandler, validateRequestBody } = require('./middleware/errorHandler');
const deleteHandler = require('./middleware/deleteHandler');

// connection to DB and cloudinary
const { connectDB } = require('./src/config/database');
const { cloudinaryConnect } = require('./src/config/cloudinary');

// routes
const userRoutes = require('./routes/user');
const profileRoutes = require('./routes/profile');
const paymentRoutes = require('./routes/payments');
const courseRoutes = require('./routes/course');
const taskRoutes = require('./routes/taskRoutes');
const mocktestRoutes = require('./routes/mocktestRoutes');
const studyMaterialRoutes = require('./routes/studyMaterialRoutes');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Create tmp directory if it doesn't exist
const tmpDir = path.join(__dirname, 'tmp');
if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
}

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "blob:"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'self'", "http://localhost:5000"],
            frameAncestors: ["'self'", "http://localhost:5173"]
        }
    },
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "same-origin" },
    crossOriginEmbedderPolicy: false
}));

// Add middlewares for handling requests
app.use(corsMiddleware);
app.use(validateRequestBody);
app.use(deleteHandler);

app.use(express.json({ limit: '10mb' })); // Limit JSON payload size
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Limit URL-encoded payload size
app.use(cookieParser());

// File upload configuration
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: tmpDir,
    createParentPath: true,
    limits: { 
        fileSize: 10 * 1024 * 1024, // 10MB limit
        files: 2 // Maximum 2 files
    },
    abortOnLimit: true // Abort if limit is exceeded
}));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
    setHeaders: (res, path) => {
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    }
}));

// Rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Add error handling middleware
app.use(errorHandler);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

const PORT = process.env.PORT || 5001;

// connections
connectDB();
cloudinaryConnect();

// mount routes
app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/payment', paymentRoutes);
app.use('/api/v1/course', courseRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/mocktests', mocktestRoutes);
app.use('/api/v1/study-materials', studyMaterialRoutes);

// Default Route
app.get('/', (req, res) => {
    res.send(`<div>
    This is Default Route  
    <p>Everything is OK</p>
    </div>`);
});

app.listen(PORT, () => {
    console.log(`Server Started on PORT ${PORT}`);
});