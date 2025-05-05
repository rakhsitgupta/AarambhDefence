// AUTH , IS STUDENT , IS INSTRUCTOR , IS ADMIN

const jwt = require("jsonwebtoken");
require('dotenv').config();


// ================ AUTH ================
// user Authentication by checking token validating
exports.auth = (req, res, next) => {
    try {
        // extract token from Authorization header
        const authHeader = req.header('Authorization');
        
        // If no auth header, return unauthorized
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: "Please login to access this resource"
            });
        }

        const token = authHeader.replace('Bearer ', '').trim();

        // if token is missing
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Please login to access this resource"
            });
        }

        // verify token
        try {
            if (!process.env.JWT_SECRET) {
                throw new Error('JWT_SECRET is not configured');
            }
            
            // Verify the token
            const verified = jwt.verify(token, process.env.JWT_SECRET);
            
            // Check if token is expired
            if (verified.exp < Date.now() / 1000) {
                return res.status(401).json({
                    success: false,
                    message: "Session expired. Please login again"
                });
            }
            
            // Ensure user ID is present
            if (!verified._id) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid token"
                });
            }
            
            // Attach user information to request
            req.user = verified;
            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};





// ================ IS STUDENT ================
exports.isStudent = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Please login to access this resource'
            });
        }

        if (req.user.accountType !== 'Student') {
            return res.status(401).json({
                success: false,
                message: 'This Page is protected only for student'
            });
        }
        next();
    }
    catch (error) {
        console.log('Error while checking user validity with student accountType:', error);
        return res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error while checking user validity with student accountType'
        });
    }
}


// ================ IS INSTRUCTOR ================
exports.isInstructor = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Please login to access this resource'
            });
        }

        if (req.user.accountType !== 'Instructor') {
            return res.status(401).json({
                success: false,
                message: 'This Page is protected only for Instructor'
            });
        }
        next();
    }
    catch (error) {
        console.log('Error while checking user validity with instructor accountType:', error);
        return res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error while checking user validity with instructor accountType'
        });
    }
}


// ================ IS ADMIN ================
exports.isAdmin = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Please login to access this resource'
            });
        }

        if (req.user.accountType !== 'Admin') {
            return res.status(401).json({
                success: false,
                message: 'This Page is protected only for Admin'
            });
        }
        next();
    }
    catch (error) {
        console.log('Error while checking user validity with Admin accountType:', error);
        return res.status(500).json({
            success: false,
            error: error.message,
            message: 'Error while checking user validity with Admin accountType'
        });
    }
}


