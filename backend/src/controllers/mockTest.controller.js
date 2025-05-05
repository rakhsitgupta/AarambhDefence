const MockTest = require("../models/MockTest.model");
const UserModel = require("../models/User.model");

exports.createMockTest = async (req, res) => {
    try {
        const { title, description, price, duration, totalQuestions, category } = req.body;
        const mockTest = await MockTest.create({
            title,
            description,
            price,
            duration,
            totalQuestions,
            category,
            createdBy: req.user.id,
        });
        res.status(201).json({
            success: true,
            data: mockTest,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.getAllMockTests = async (req, res) => {
    try {
        const mockTests = await MockTest.find().populate("createdBy", "firstName lastName");
        res.status(200).json({
            success: true,
            data: mockTests,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.enrollInMockTest = async (req, res) => {
    try {
        const { mockTestId } = req.params;
        const mockTest = await MockTest.findById(mockTestId);
        
        if (!mockTest) {
            return res.status(404).json({
                success: false,
                message: "Mock test not found",
            });
        }

        if (mockTest.enrolledStudents.includes(req.user.id)) {
            return res.status(400).json({
                success: false,
                message: "Already enrolled in this mock test",
            });
        }

        mockTest.enrolledStudents.push(req.user.id);
        await mockTest.save();

        const user = await UserModel.findById(req.user.id);
        user.enrolledMockTests.push(mockTestId);
        await user.save();

        res.status(200).json({
            success: true,
            message: "Successfully enrolled in mock test",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}; 