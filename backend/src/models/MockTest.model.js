const mongoose = require("mongoose");

const mockTestSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    duration: {
        type: Number, // in minutes
        required: true,
    },
    totalQuestions: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
    }],
    enrolledStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model("MockTest", mockTestSchema); 