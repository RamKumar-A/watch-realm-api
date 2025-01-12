const multer = require('multer');
const sharp = require('sharp');
const AppError = require('../utils/appError');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const cloudinary = require('cloudinary').v2;

// const multerStorage = multer.diskStorage({
//   filename: function (req, file, callback) {
//     // console.log(file);
//     callback(null, file.originalname);
//   },
// });
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserImage = upload.single('photo');

exports.resizeUserImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  // SIMPLE WAY TO CONVERT BUFFER TO IMAGE OR IMAGESTRING
  const base64Image = `data:${
    req.file.mimetype
  };base64,${req.file.buffer.toString('base64')}`;

  const photo = await cloudinary.uploader.upload(base64Image, {
    folder: 'watch-realm-user-images',
    transformation: [
      { quality: 'auto', fetch_format: 'auto' },
      { width: 400, height: 400, crop: 'fill', gravity: 'face' },
    ],
    resource_type: 'auto',
  });
  req.body.photo = photo.secure_url;
  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.deleteMe = async (req, res, next) => {
  await User.findByIdAndDelete(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

exports.updateMe = async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route not for updating password. Please use /updatePassword',
        400
      )
    );
  }
  const filteredBody = filterObj(req.body, 'name', 'email', 'photo');
  if (req.file) filteredBody.photo = req.body.photo;
  // console.log(req.file);

  const user = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  await user.save();
  res.status(200).json({
    status: 'success',
    data: {
      data: user,
    },
  });
};

exports.getAllUsers = async (req, res) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    data: {
      data: users,
    },
  });
};

exports.getUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  res.status(200).json({
    status: 'success',
    data: {
      data: user,
    },
  });
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use signup instead.',
  });
};

exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null,
  });
};
