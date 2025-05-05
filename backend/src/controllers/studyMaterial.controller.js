const StudyMaterial = require("../models/StudyMaterial.model");
const UserModel = require("../models/User.model");
const { uploadImageToCloudinary } = require("../../utils/uploadToCloudinary");

exports.createStudyMaterial = async (req, res) => {
    try {
        const { title, description, price, category, content } = req.body;
        
        // Validate required fields
        if (!title || !description || !price || !category || !content) {
            return res.status(400).json({
                success: false,
                message: "All fields are required: title, description, price, category, content"
            });
        }

        // Handle PDF file upload
        let pdfUrl = "";
        if (req.files && req.files.pdfFile) {
            const pdfFile = req.files.pdfFile[0];
            const uploadResult = await uploadImageToCloudinary(pdfFile, "study-materials");
            pdfUrl = uploadResult.secure_url;
        } else {
            return res.status(400).json({
                success: false,
                message: "PDF file is required"
            });
        }

        // Handle thumbnail upload if provided
        let thumbnailUrl = "";
        if (req.files && req.files.thumbnail) {
            const thumbnailFile = req.files.thumbnail[0];
            const uploadResult = await uploadImageToCloudinary(thumbnailFile, "study-materials/thumbnails");
            thumbnailUrl = uploadResult.secure_url;
        }

        const studyMaterial = await StudyMaterial.create({
            title,
            description,
            price,
            category,
            content,
            pdfUrl,
            thumbnail: thumbnailUrl,
            createdBy: req.user._id,
        });

        // Add to user's created study materials
        const user = await UserModel.findById(req.user._id);
        if (!user.createdStudyMaterials) {
            user.createdStudyMaterials = [];
        }
        user.createdStudyMaterials.push(studyMaterial._id);
        await user.save();

        res.status(201).json({
            success: true,
            data: studyMaterial,
        });
    } catch (error) {
        console.error("Error creating study material:", error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.getAllStudyMaterials = async (req, res) => {
    try {
        const studyMaterials = await StudyMaterial.find()
            .populate("createdBy", "firstName lastName email")
            .populate("enrolledStudents", "firstName lastName email");
        res.status(200).json({
            success: true,
            data: studyMaterials,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.enrollInStudyMaterial = async (req, res) => {
    try {
        const { studyMaterialId } = req.params;
        const studyMaterial = await StudyMaterial.findById(studyMaterialId);
        
        if (!studyMaterial) {
            return res.status(404).json({
                success: false,
                message: "Study material not found",
            });
        }

        if (studyMaterial.enrolledStudents.includes(req.user._id)) {
            return res.status(400).json({
                success: false,
                message: "Already enrolled in this study material",
            });
        }

        // Add to study material's enrolled students
        studyMaterial.enrolledStudents.push(req.user._id);
        await studyMaterial.save();

        // Add to user's enrolled study materials
        const user = await UserModel.findById(req.user._id);
        user.enrolledStudyMaterials.push(studyMaterialId);
        await user.save();

        res.status(200).json({
            success: true,
            message: "Successfully enrolled in study material",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}; 