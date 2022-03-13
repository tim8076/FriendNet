const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors/index');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

const uploadImage = async (req, res) => {
  const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
    use_filename: true,
    folder: 'friend-net'
  });
  fs.unlinkSync(req.files.image.tempFilePath);
  res.status(StatusCodes.OK).json({
    success: true,
    image: {
      src: result.secure_url,
    }
  });
};

module.exports = { uploadImage };