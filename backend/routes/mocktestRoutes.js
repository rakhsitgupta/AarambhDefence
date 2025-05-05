const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { isInstructor, isStudent, auth } = require('../middleware/auth');
const Mocktest = require('../models/Mocktest');
const User = require('../models/user');

// Get all mock tests (Public access)
router.get('/', async (req, res) => {
    try {
        const mocktests = await Mocktest.find().populate('instructor', 'name email');
        res.json({
            success: true,
            data: mocktests
        });
    } catch (error) {
        console.error('Error fetching mock tests:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch mocktests'
        });
    }
});

// Get mock tests created by instructor (Protected)
router.get('/instructor', auth, isInstructor, async (req, res) => {
    try {
        const mocktests = await Mocktest.find({ instructor: req.user._id })
            .populate('instructor', 'name email');
        
        res.json({
            success: true,
            data: mocktests
        });
    } catch (error) {
        console.error('Error fetching instructor mock tests:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch mocktests'
        });
    }
});

// Get a single mock test by ID (Public access)
router.get('/:id', async (req, res) => {
    try {
        const mocktest = await Mocktest.findById(req.params.id)
            .populate('instructor', 'name email');

        if (!mocktest) {
            return res.status(404).json({
                success: false,
                message: 'Mocktest not found'
            });
        }

        res.json({
            success: true,
            data: mocktest
        });
    } catch (error) {
        console.error('Error fetching mock test:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch mocktest'
        });
    }
});

// Delete mock test (Instructor only)
router.delete('/:id', auth, isInstructor, async (req, res) => {
    try {
        console.log('Attempting to delete mocktest:', req.params.id);
        console.log('User ID:', req.user._id);

        const mocktest = await Mocktest.findOne({
            _id: req.params.id,
            instructor: req.user._id
        });

        if (!mocktest) {
            console.log('Mocktest not found or unauthorized');
            return res.status(404).json({
                success: false,
                message: 'Mocktest not found or you do not have permission to delete it'
            });
        }

        // Delete associated files
        if (mocktest.pdfUrl) {
            const pdfPath = path.join(__dirname, '..', mocktest.pdfUrl);
            if (fs.existsSync(pdfPath)) {
                fs.unlinkSync(pdfPath);
            }
        }

        if (mocktest.thumbnail) {
            const thumbnailPath = path.join(__dirname, '..', mocktest.thumbnail);
            if (fs.existsSync(thumbnailPath)) {
                fs.unlinkSync(thumbnailPath);
            }
        }

        // Delete the mocktest
        await Mocktest.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Mocktest deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting mock test:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete mocktest'
        });
    }
});

// Create a new mock test (Instructor only)
router.post('/', auth, isInstructor, async (req, res) => {
    let pdfPath = null;
    let thumbnailPath = null;

    try {
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

        // Move PDF file to uploads directory
        await pdfFile.mv(pdfPath);

        if (req.files.thumbnail) {
            const thumbnail = req.files.thumbnail;
            if (!thumbnail.mimetype.includes('image')) {
                return res.status(400).json({
                    success: false,
                    message: 'Only image files are allowed for thumbnail'
                });
            }

            const thumbnailFileName = `thumbnail-${uniqueSuffix}${path.extname(thumbnail.name)}`;
            thumbnailPath = path.join(__dirname, '../uploads', thumbnailFileName);
            await thumbnail.mv(thumbnailPath);
        }

        // Create mocktest with instructor ID from authenticated user
        const mocktest = new Mocktest({
            title,
            description,
            price,
            pdfUrl: `/uploads/${pdfFileName}`,
            thumbnail: thumbnailPath ? `/uploads/${path.basename(thumbnailPath)}` : null,
            instructor: req.user._id // Use the authenticated user's ID
        });

        await mocktest.save();
        
        res.status(201).json({
            success: true,
            data: mocktest,
            message: 'Mocktest created successfully'
        });
    } catch (error) {
        console.error('Error creating mock test:', error);
        
        // Clean up uploaded files if there was an error
        if (pdfPath && fs.existsSync(pdfPath)) {
            fs.unlinkSync(pdfPath);
        }
        if (thumbnailPath && fs.existsSync(thumbnailPath)) {
            fs.unlinkSync(thumbnailPath);
        }

        res.status(500).json({
            success: false,
            message: error.message || 'Failed to create mocktest'
        });
    }
});

// Enroll in a mock test
router.post('/:id/enroll', auth, isStudent, async (req, res) => {
  try {
    const mockTest = await Mocktest.findById(req.params.id);
    if (!mockTest) {
      return res.status(404).json({
        success: false,
        message: 'Mock test not found'
      });
    }

    // Check if already enrolled
    if (mockTest.enrolledStudents.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this mock test'
      });
    }

    // Add student to enrolled students
    mockTest.enrolledStudents.push(req.user.id);
    await mockTest.save();

    // Add mock test to user's enrolled tests
    const user = await User.findById(req.user.id);
    user.enrolledMockTests.push(mockTest._id);
    await user.save();

    res.json({
      success: true,
      message: 'Successfully enrolled in mock test'
    });
  } catch (error) {
    console.error('Error enrolling in mock test:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to enroll in mock test'
    });
  }
});

// Get enrolled mock tests
router.get('/enrolled', auth, isStudent, async (req, res) => {
  try {
    const mockTests = await Mocktest.find({
      enrolledStudents: req.user.id
    }).populate('instructor', 'name email');

    res.json({
      success: true,
      data: mockTests
    });
  } catch (error) {
    console.error('Error fetching enrolled mock tests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch enrolled mock tests'
    });
  }
});

module.exports = router; 