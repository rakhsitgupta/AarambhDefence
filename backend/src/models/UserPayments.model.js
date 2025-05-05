const mongoose = require("mongoose");

const userPaymentsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    studyMaterialId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "StudyMaterial",
        required: true,
    },
    razorpayOrderId: {
        type: String,
        required: true,
    },
    razorpayPaymentId: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        default: "INR",
    },
    status: {
        type: String,
        enum: ["pending", "successful", "failed"],
        default: "pending",
    },
    paymentDate: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true });

module.exports = mongoose.model("UserPayments", userPaymentsSchema); 