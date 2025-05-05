const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    accountType: {
        type: String,
        enum: ["Admin", "Student", "Instructor"],
        required: true,
    },
    additionalDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    }],
    enrolledCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    }],
    enrolledMockTests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "MockTest",
    }],
    enrolledStudyMaterials: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "StudyMaterial",
    }],
    image: {
        type: String,
    },
    token: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema); 