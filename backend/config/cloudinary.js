import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

const uploadOnCloudinary = async (file) => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    try {
        const result = await cloudinary.uploader.upload(file);
        fs.unlinkSync(file); // Remove the file after upload
        return result.secure_url; // Return the secure URL of the uploaded file
    } catch (error) {
        fs.unlinkSync(file); // Remove the file after upload
        return resizeBy.status(500).json({
            success: false,
            message: 'Cloudinary upload failed',
            error: error.message
        });
    }
};

export default uploadOnCloudinary;
