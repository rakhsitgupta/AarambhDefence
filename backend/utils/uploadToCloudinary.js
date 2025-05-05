const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: process.env.FOLDER_NAME || 'Aarambh',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif']
    }
});

// Create multer upload instance
const upload = multer({ storage: storage });

// Function to upload image to cloudinary
const uploadImageToCloudinary = async (file, folder) => {
    try {
        const result = await cloudinary.uploader.upload(file, {
            folder: folder || process.env.FOLDER_NAME || 'Aarambh'
        });
        return result;
    } catch (error) {
        console.error('Error uploading to cloudinary:', error);
        throw error;
    }
};

module.exports = {
    upload,
    uploadImageToCloudinary
}; 