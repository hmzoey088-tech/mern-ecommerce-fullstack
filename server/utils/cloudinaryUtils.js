import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (filePath) => cloudinary.uploader.upload(filePath, { folder: 'nexashop' });
export const deleteImage = async (publicId) => cloudinary.uploader.destroy(publicId);
