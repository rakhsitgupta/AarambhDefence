const express = require("express");
const router = express.Router();
const { auth, isInstructor, isStudent } = require("../../middleware/auth");
const {
    createStudyMaterial,
    getAllStudyMaterials,
    enrollInStudyMaterial,
} = require("../controllers/studyMaterial.controller");
const { createOrder, verifyPayment } = require("../controllers/studyMaterialPayments");
const UserModel = require("../../models/user");
const StudyMaterial = require("../../models/StudyMaterial");
const multer = require("multer");
const upload = multer();

// Public routes
router.get("/", getAllStudyMaterials);

// Protected routes
router.post("/", auth, isInstructor, upload.fields([
    { name: 'pdfFile', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
]), createStudyMaterial);
router.post("/:studyMaterialId/enroll", auth, enrollInStudyMaterial);

// Payment routes
router.post("/create-order", auth, isStudent, createOrder);
router.post("/verify-payment", auth, isStudent, verifyPayment);

// Get enrolled study materials
router.get("/enrolled", auth, isStudent, async (req, res) => {
    try {
        console.log('Fetching enrolled materials for user:', req.user._id);
        
        // Get materials from user's enrolledStudyMaterials
        const user = await UserModel.findById(req.user._id).populate({
            path: 'enrolledStudyMaterials',
            populate: {
                path: 'createdBy',
                select: 'firstName lastName email'
            }
        });
            
        if (!user) {
            console.log('User not found:', req.user._id);
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        console.log('Found user with enrolled materials:', {
            userId: user._id,
            enrolledCount: user.enrolledStudyMaterials?.length
        });
        
        res.json({
            success: true,
            data: user.enrolledStudyMaterials
        });
    } catch (error) {
        console.error('Error fetching enrolled study materials:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch enrolled study materials'
        });
    }
});

module.exports = router; 