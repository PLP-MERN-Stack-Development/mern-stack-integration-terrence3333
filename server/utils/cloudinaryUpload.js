const cloudinary = require('cloudinary').v2;
const fs = require('fs');

const uploadToCloudinary = async (filePath, folder = 'mern-blog') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
    });
    fs.unlinkSync(filePath); // delete local file after upload
    return result.secure_url;
  } catch (error) {
    fs.unlinkSync(filePath);
    throw new Error('Cloudinary upload failed');
  }
};

module.exports = uploadToCloudinary;
