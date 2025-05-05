const mongoose = require("mongoose");

const studyMaterialSchema = new mongoose.Schema({
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
    category: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    pdfUrl: {
        type: String,
        required: true,
    },
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

module.exports = mongoose.model("StudyMaterial", studyMaterialSchema); 