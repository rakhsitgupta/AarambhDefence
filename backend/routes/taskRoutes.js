const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { auth, isStudent } = require('../middleware/auth');

// Create a new task
router.post('/', auth, isStudent, async (req, res) => {
    try {
        const task = new Task({
            ...req.body,
            student: req.user._id
        });
        await task.save();
        res.status(201).json({
            success: true,
            message: "Task created successfully",
            task
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// Get all tasks for the logged-in student
router.get('/', auth, isStudent, async (req, res) => {
    try {
        const tasks = await Task.find({ student: req.user._id })
            .sort({ dueDate: 1 });
        res.status(200).json({
            success: true,
            tasks
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Update a task
router.put('/:id', auth, isStudent, async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, student: req.user._id },
            req.body,
            { new: true }
        );
        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Task updated successfully",
            task
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// Delete a task
router.delete('/:id', auth, isStudent, async (req, res) => {
    try {
        // Find and delete the task
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            student: req.user._id
        });
        
        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        // Send success response
        res.status(200).json({
            success: true,
            message: "Task deleted successfully",
            taskId: req.params.id
        });
    } catch (error) {
        console.error('Delete task error:', error);
        res.status(500).json({
            success: false,
            message: "Failed to delete task"
        });
    }
});

module.exports = router; 