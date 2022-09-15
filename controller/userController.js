const multer = require("multer");
const sharp = require("sharp");
const User = require("../model/userModel");

// const multerStorage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "public/img/users");
//   },
//   filename: function (req, file, cb) {
//     const text = file.mimetype.split("/")[1];
//     cb(null, `user-${req.user.id}.${text}`);
//   },
// });

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    const multerError = new Error("This is not file img");
    cb(multerError, false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
exports.uploadAvatar = upload.single("image");

exports.resizeUserImage = async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.user.id}.jpg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpg")
    .toFile(`public/img/users/${req.file.filename}`);
  // console.log(req.file);
  next();
};

exports.getAllUser = async (req, res, next) => {
  const user = await User.find();
  res.status(200).json({
    status: "success",
    data: user,
  });
};
