import { uploadImageToCloudinary } from "../utils/imageUploader.js"
import Mentorship from "../models/Mentorship.js"
import { sendEmail } from "../utils/mailSender.js"

export const createMentorshipRequest = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            phoneNumber,
            examPreparingFor,
            currentQualification,
            message,
        } = req.body

        // Upload payment screenshot to cloudinary
        const paymentScreenshot = await uploadImageToCloudinary(
            req.files.paymentScreenshot,
            process.env.FOLDER_NAME
        )

        // Create mentorship request in database
        const mentorshipRequest = await Mentorship.create({
            firstName,
            lastName,
            email,
            phoneNumber,
            examPreparingFor,
            currentQualification,
            message,
            paymentScreenshot: paymentScreenshot.secure_url,
        })

        // Send confirmation email to user
        await sendEmail(
            email,
            "Mentorship Request Confirmation",
            `Dear ${firstName} ${lastName},\n\nThank you for submitting your mentorship request for ${examPreparingFor} preparation. We have received your payment of ₹1000 and will review your application shortly.\n\nBest regards,\nAarambh Defence Team`
        )

        // Send notification email to admin
        await sendEmail(
            process.env.ADMIN_EMAIL,
            "New Mentorship Request",
            `A new mentorship request has been received:\n\nName: ${firstName} ${lastName}\nEmail: ${email}\nPhone: ${phoneNumber}\nExam: ${examPreparingFor}\nQualification: ${currentQualification}\nMessage: ${message}`
        )

        return res.status(200).json({
            success: true,
            message: "Mentorship request submitted successfully",
            data: mentorshipRequest,
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "Failed to submit mentorship request",
            error: error.message,
        })
    }
} 