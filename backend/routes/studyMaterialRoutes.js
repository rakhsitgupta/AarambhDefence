const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const { isInstructor, isStudent, auth } = require('../middleware/auth');
const StudyMaterial = require('../models/StudyMaterial');
const User = require('../models/user');
const crypto = require('crypto');
const { instance } = require('../config/rajorpay');

// Create a new study material (Instructor only)
router.post('/', auth, isInstructor, async (req, res) => {
    let pdfPath = null;
    let thumbnailPath = null;

    try {
        console.log('Request body:', req.body);
        console.log('Request files:', req.files);
        console.log('Authenticated user:', req.user);

        if (!req.user || !req.user._id) {
            console.error('User information missing in request:', req.user);
            return res.status(401).json({
                success: false,
                message: 'User authentication failed'
            });
        }

        const { title, description, price } = req.body;
        
        if (!title || !description || !price) {
            return res.status(400).json({
                success: false,
                message: 'Title, description, and price are required'
            });
        }

        if (!req.files || !req.files.pdfFile) {
            return res.status(400).json({
                success: false,
                message: 'PDF file is required'
            });
        }

        // Validate file types
        const pdfFile = req.files.pdfFile;
        console.log('PDF file details:', {
            name: pdfFile.name,
            mimetype: pdfFile.mimetype,
            size: pdfFile.size
        });

        if (!pdfFile.mimetype.includes('pdf')) {
            return res.status(400).json({
                success: false,
                message: 'Only PDF files are allowed'
            });
        }

        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const pdfFileName = `pdf-${uniqueSuffix}${path.extname(pdfFile.name)}`;
        pdfPath = path.join(__dirname, '../uploads', pdfFileName);

        console.log('Moving PDF file to:', pdfPath);
        await pdfFile.mv(pdfPath);

        if (req.files.thumbnail) {
            const thumbnail = req.files.thumbnail;
            console.log('Thumbnail file details:', {
                name: thumbnail.name,
                mimetype: thumbnail.mimetype,
                size: thumbnail.size
            });

            if (!thumbnail.mimetype.includes('image')) {
                return res.status(400).json({
                    success: false,
                    message: 'Only image files are allowed for thumbnail'
                });
            }

            const thumbnailFileName = `thumbnail-${uniqueSuffix}${path.extname(thumbnail.name)}`;
            thumbnailPath = path.join(__dirname, '../uploads', thumbnailFileName);
            console.log('Moving thumbnail to:', thumbnailPath);
            await thumbnail.mv(thumbnailPath);
        }

        // Create the study material with the instructor field
        const studyMaterial = new StudyMaterial({
            title,
            description,
            price,
            instructor: req.user._id,
            pdfUrl: `/api/v1/study-materials/pdf/${pdfFileName}`,
            thumbnailUrl: thumbnailPath ? `/uploads/${path.basename(thumbnailPath)}` : null
        });

        console.log('Creating study material with data:', {
            title,
            description,
            price,
            instructor: req.user._id,
            pdfUrl: `/api/v1/study-materials/pdf/${pdfFileName}`,
            thumbnailUrl: thumbnailPath ? `/uploads/${path.basename(thumbnailPath)}` : null
        });

        await studyMaterial.save();
        console.log('Study material created successfully:', studyMaterial);
        
        res.status(201).json({
            success: true,
            data: studyMaterial,
            message: 'Study material created successfully'
        });
    } catch (error) {
        console.error('Error creating study material:', error);
        console.error('Error stack:', error.stack);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            code: error.code,
            path: error.path
        });
        
        // Clean up uploaded files if there was an error
        if (pdfPath && fs.existsSync(pdfPath)) {
            console.log('Cleaning up PDF file:', pdfPath);
            fs.unlinkSync(pdfPath);
        }
        if (thumbnailPath && fs.existsSync(thumbnailPath)) {
            console.log('Cleaning up thumbnail file:', thumbnailPath);
            fs.unlinkSync(thumbnailPath);
        }

        res.status(500).json({
            success: false,
            message: error.message || 'Failed to create study material',
            error: process.env.NODE_ENV === 'development' ? {
                name: error.name,
                message: error.message,
                stack: error.stack
            } : undefined
        });
    }
});

// Get all study materials (Public access)
router.get('/', async (req, res) => {
    try {
        const studyMaterials = await StudyMaterial.find()
            .populate('instructor', 'name email');
        res.json({
            success: true,
            data: studyMaterials
        });
    } catch (error) {
        console.error('Error fetching study materials:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch study materials'
        });
    }
});

// Get study materials created by instructor (Protected)
router.get('/instructor', auth, isInstructor, async (req, res) => {
    try {
        console.log('Instructor ID:', req.user._id); // Debug log
        
        const studyMaterials = await StudyMaterial.find({ 
            instructor: req.user._id 
        }).populate('instructor', 'name email');
        
        console.log('Found study materials:', studyMaterials); // Debug log
        
        if (!studyMaterials || studyMaterials.length === 0) {
            return res.json({
                success: true,
                data: [],
                message: 'No study materials found'
            });
        }
        
        res.json({
            success: true,
            data: studyMaterials,
            message: 'Study materials fetched successfully'
        });
    } catch (error) {
        console.error('Error fetching instructor study materials:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch study materials'
        });
    }
});

// Get study materials enrolled by student
router.get('/enrolled', auth, isStudent, async (req, res) => {
    try {
        console.log('Fetching enrolled materials for user:', req.user._id);
        
        // First, get materials from user's enrolledStudyMaterials
        const user = await User.findById(req.user._id);
            
        if (!user) {
            console.log('User not found:', req.user._id);
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        console.log('User document:', {
            _id: user._id,
            enrolledStudyMaterials: user.enrolledStudyMaterials,
            enrolledStudyMaterialsCount: user.enrolledStudyMaterials?.length
        });

        // Then, get materials where user is in enrolledStudents
        const materials = await StudyMaterial.find({
            enrolledStudents: req.user._id
        });

        console.log('Materials with user in enrolledStudents:', {
            count: materials.length,
            materials: materials.map(m => ({
                _id: m._id,
                title: m.title,
                enrolledStudents: m.enrolledStudents
            }))
        });

        // Get all study materials to check if user is enrolled in any
        const allMaterials = await StudyMaterial.find({});
        console.log('All study materials:', {
            count: allMaterials.length,
            materials: allMaterials.map(m => ({
                _id: m._id,
                title: m.title,
                enrolledStudents: m.enrolledStudents
            }))
        });

        // Get final list of enrolled materials
        const enrolledMaterials = await StudyMaterial.find({
            $or: [
                { _id: { $in: user.enrolledStudyMaterials } },
                { enrolledStudents: req.user._id }
            ]
        }).populate('instructor', 'name email');

        console.log('Final enrolled materials:', {
            count: enrolledMaterials.length,
            materials: enrolledMaterials.map(m => ({
                _id: m._id,
                title: m.title,
                enrolledStudents: m.enrolledStudents
            }))
        });
        
        res.json({
            success: true,
            data: enrolledMaterials
        });
    } catch (error) {
        console.error('Error fetching enrolled study materials:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch enrolled study materials'
        });
    }
});

// Enroll in a study material
router.post('/:id/enroll', auth, isStudent, async (req, res) => {
    try {
        const studyMaterial = await StudyMaterial.findById(req.params.id);
        if (!studyMaterial) {
            return res.status(404).json({
                success: false,
                message: 'Study material not found'
            });
        }

        // Check if already enrolled
        if (studyMaterial.enrolledStudents.includes(req.user.id)) {
            return res.status(400).json({
                success: false,
                message: 'Already enrolled in this study material'
            });
        }

        // Add student to enrolled students
        studyMaterial.enrolledStudents.push(req.user.id);
        await studyMaterial.save();

        // Add study material to user's enrolled materials
        const user = await User.findById(req.user.id);
        user.enrolledStudyMaterials.push(studyMaterial._id);
        await user.save();

        res.json({
            success: true,
            message: 'Successfully enrolled in study material'
        });
    } catch (error) {
        console.error('Error enrolling in study material:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to enroll in study material'
        });
    }
});

// Update study material (Instructor only)
router.put('/:id', auth, isInstructor, async (req, res) => {
    try {
        const studyMaterial = await StudyMaterial.findOneAndUpdate(
            { _id: req.params.id, instructor: req.user._id },
            req.body,
            { new: true }
        );
        if (!studyMaterial) {
            return res.status(404).json({
                success: false,
                message: 'Study material not found'
            });
        }
        res.json({
            success: true,
            data: studyMaterial,
            message: 'Updated successfully'
        });
    } catch (error) {
        console.error('Error updating study material:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// Delete study material (Instructor only)
router.delete('/:id', auth, isInstructor, async (req, res) => {
    try {
        const studyMaterial = await StudyMaterial.findOne({
            _id: req.params.id,
            instructor: req.user._id
        });

        if (!studyMaterial) {
            return res.status(404).json({
                success: false,
                message: 'Study material not found'
            });
        }

        // Delete associated files
        if (studyMaterial.pdfUrl) {
            const pdfPath = path.join(__dirname, '..', studyMaterial.pdfUrl);
            if (fs.existsSync(pdfPath)) {
                fs.unlinkSync(pdfPath);
            }
        }

        if (studyMaterial.thumbnail) {
            const thumbnailPath = path.join(__dirname, '..', studyMaterial.thumbnail);
            if (fs.existsSync(thumbnailPath)) {
                fs.unlinkSync(thumbnailPath);
            }
        }

        await StudyMaterial.findByIdAndDelete(req.params.id);
        
        res.json({
            success: true,
            message: 'Study material deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting study material:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete study material'
        });
    }
});

// Get a single study material by ID (Public access)
router.get('/:id', async (req, res) => {
    try {
        const studyMaterial = await StudyMaterial.findById(req.params.id)
            .populate('instructor', 'name email');

        if (!studyMaterial) {
            return res.status(404).json({
                success: false,
                message: 'Study material not found'
            });
        }

        res.json({
            success: true,
            data: studyMaterial
        });
    } catch (error) {
        console.error('Error fetching study material:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch study material'
        });
    }
});

// Serve PDF file
router.get('/pdf/:filename', (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path.join(__dirname, '../uploads', filename);
        
        console.log('Attempting to serve PDF:', filePath); // Debug log
        
        if (fs.existsSync(filePath)) {
            // Set CORS headers
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
            
            // Set PDF headers
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
            res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
            
            // Send the file
            res.sendFile(filePath);
        } else {
            console.error('PDF file not found:', filePath); // Debug log
            res.status(404).json({
                success: false,
                message: 'PDF file not found'
            });
        }
    } catch (error) {
        console.error('Error serving PDF:', error); // Debug log
        res.status(500).json({
            success: false,
            message: 'Error serving PDF file'
        });
    }
});

// Create Razorpay order for study material payment
router.post('/create-order', auth, isStudent, async (req, res) => {
    try {
        const { materialId } = req.body;

        if (!materialId) {
            return res.status(400).json({
                success: false,
                message: 'Study material ID is required'
            });
        }

        // Find the study material
        const studyMaterial = await StudyMaterial.findById(materialId);
        if (!studyMaterial) {
            return res.status(404).json({
                success: false,
                message: 'Study material not found'
            });
        }

        // Check if user is already enrolled in the study material
        const isEnrolledInMaterial = studyMaterial.enrolledStudents.includes(req.user._id);
        
        // Check if user has the material in their enrolledStudyMaterials
        const user = await User.findById(req.user._id);
        const isInUserEnrolled = user.enrolledStudyMaterials?.includes(materialId);

        console.log('Enrollment status:', {
            materialId,
            userId: req.user._id,
            isEnrolledInMaterial,
            isInUserEnrolled,
            enrolledStudents: studyMaterial.enrolledStudents,
            userEnrolledMaterials: user.enrolledStudyMaterials
        });

        // If user is enrolled in one place but not the other, synchronize the data
        if (isEnrolledInMaterial !== isInUserEnrolled) {
            if (isEnrolledInMaterial && !isInUserEnrolled) {
                // Add to user's enrolledStudyMaterials
                if (!user.enrolledStudyMaterials) {
                    user.enrolledStudyMaterials = [];
                }
                user.enrolledStudyMaterials.push(materialId);
                await user.save();
                console.log('Added material to user\'s enrolledStudyMaterials');
            } else if (!isEnrolledInMaterial && isInUserEnrolled) {
                // Add to study material's enrolledStudents
                studyMaterial.enrolledStudents.push(req.user._id);
                await studyMaterial.save();
                console.log('Added user to study material\'s enrolledStudents');
            }
            return res.status(200).json({
                success: true,
                message: 'You are already enrolled in this study material',
                data: { isEnrolled: true }
            });
        }

        // If user is enrolled in both places, return success
        if (isEnrolledInMaterial && isInUserEnrolled) {
            return res.status(200).json({
                success: true,
                message: 'You are already enrolled in this study material',
                data: { isEnrolled: true }
            });
        }

        // Create Razorpay order with shorter receipt
        const options = {
            amount: studyMaterial.price * 100, // Convert to paise
            currency: 'INR',
            receipt: `sm_${materialId.slice(-6)}_${Date.now().toString().slice(-6)}`,
            notes: {
                materialId: materialId.toString(),
                userId: req.user._id.toString()
            }
        };

        const order = await instance.orders.create(options);

        res.status(200).json({
            success: true,
            data: {
                orderId: order.id,
                amount: order.amount,
                currency: order.currency
            }
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create order'
        });
    }
});

// Verify payment and enroll student
router.post('/verify-payment', auth, isStudent, async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, materialId } = req.body;
        console.log('Payment verification request:', { razorpay_order_id, materialId, userId: req.user._id });

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !materialId) {
            return res.status(400).json({
                success: false,
                message: 'All payment verification fields are required'
            });
        }

        // Verify payment signature
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_SECRET)
            .update(body)
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: 'Invalid payment signature'
            });
        }

        // Find the study material
        const studyMaterial = await StudyMaterial.findById(materialId);
        if (!studyMaterial) {
            console.log('Study material not found:', materialId);
            return res.status(404).json({
                success: false,
                message: 'Study material not found'
            });
        }

        // Check if user is already enrolled
        if (studyMaterial.enrolledStudents.includes(req.user._id)) {
            console.log('User already enrolled:', req.user._id);
            return res.status(400).json({
                success: false,
                message: 'You are already enrolled in this study material'
            });
        }

        // Start a session for transaction
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Add student to enrolled students
            studyMaterial.enrolledStudents.push(req.user._id);
            await studyMaterial.save({ session });
            console.log('Added student to study material:', { materialId, userId: req.user._id });

            // Add study material to user's enrolled materials
            const user = await User.findById(req.user._id).session(session);
            if (!user.enrolledStudyMaterials) {
                user.enrolledStudyMaterials = [];
            }
            user.enrolledStudyMaterials.push(studyMaterial._id);
            await user.save({ session });
            console.log('Added study material to user:', { userId: req.user._id, materialId: studyMaterial._id });

            // Commit the transaction
            await session.commitTransaction();
            console.log('Transaction committed successfully');

            res.status(200).json({
                success: true,
                message: 'Payment verified and enrollment successful'
            });
        } catch (error) {
            // If an error occurred, abort the transaction
            await session.abortTransaction();
            console.error('Error in transaction:', error);
            throw error;
        } finally {
            session.endSession();
        }
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to verify payment'
        });
    }
});

module.exports = router; 