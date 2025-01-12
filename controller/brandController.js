const sharp = require('sharp');
const Brand = require('../models/brandModel');
const catchAsync = require('../utils/catchAsync');
const multer = require('multer');
const { Readable } = require('stream');
const AppError = require('../utils/appError');
const cloudinary = require('cloudinary').v2;

const multerStorage = multer.memoryStorage();

const upload = multer({
  storage: multerStorage,
});

exports.uploadBrandLogo = upload.single('brandLogo');

// const bufferToStream = (buffer) => {
//   const readable = new Readable();
//   readable.push(buffer);
//   readable.push(null);
//   return readable;
// };

exports.resizeBrandLogo = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  // console.log(req.file);
  const base64Image = `data:${
    req.file.mimetype
  };base64,${req.file.buffer.toString('base64')}`;
  const logo = await cloudinary.uploader.upload(base64Image, {
    folder: 'brand-logos',
    format: 'png',
  });
  req.body.brandLogo = logo.secure_url;

  // CONVERTING BUFFER USING SHARP

  // const resizedBuffer = await sharp(req.file.buffer).toFormat('png').toBuffer();
  // 1) Handle Cover Image Upload with Transformation
  // const uploadStream = cloudinary.uploader.upload_stream(
  //   {
  //     folder: 'brand-logos',
  //     format: 'png',
  //   },
  //   (error, result) => {
  //     if (error) {
  //       return next(new AppError(error, 400));
  //     }

  //     // Save Cloudinary URL to request object for further use
  //     req.body.brandLogo = result.secure_url;

  //     next(); // Proceed to the next middleware
  //   }
  // );
  // bufferToStream(resizedBuffer).pipe(uploadStream);

  next();
});

exports.getAllBrands = catchAsync(async (req, res) => {
  const brands = await Brand.find();
  res.status(200).json({
    status: 'success',
    data: brands,
  });
});

exports.getBrand = catchAsync(async (req, res) => {
  const brand = await Brand.findById(req.params.id);
  res.status(200).json({
    status: 'success',
    data: brand,
  });
});

exports.updateBrand = catchAsync(async (req, res) => {
  const updatedBrand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: updatedBrand,
  });
});

exports.createBrand = catchAsync(async (req, res) => {
  // const newBrand = new Brand(req.body);
  // newBrand.save();
  const newBrand = await Brand.create(req.body);
  res.status(201).json({
    status: 'success',
    data: newBrand,
  });
});

exports.deleteBrand = catchAsync(async (req, res) => {
  await Brand.findByIdAndDelete(req.params.id, req.body);
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
