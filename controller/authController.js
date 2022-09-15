const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Email = require("../utils/email");
const User = require("../model/userModel");

const signToken = (id) => { 
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

const createSendToken = (user, res) => {
  const token = signToken(user._id);
  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  });
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    req.flash("error", "Vui lòng nhập tất cả các trường");
    req.flash("email", email);
    return res.redirect("/login");
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password, user.password))) {
    req.flash("error", "Email hoặc mật khẩu không chính xác");
    return res.redirect("/login");
  }
  createSendToken(user, res);
  req.user = user;
  return res.redirect("/");
};

// const createSendTokenAPI = (user, statusCode, res) => {
//   const token = signToken(user._id);
//   res.cookie("jwt", token, {
//     expires: new Date(
//       Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
//     ),
//     httpOnly: true,
//   });
//   res.status(statusCode).json({
//     status: "sucess",
//     token,
//   });
// };

// exports.createUser = async (req, res, next) => {
//   const newUser = await User.create(req.body);
//   createSendTokenAPI(newUser, 201, res);
// };

// exports.getAllUser = async (req, res, next) => {
//   const user = await User.find();
//   res.status(200).json({
//     status: "success",
//     result: user.length,
//     data: user,
//   });
// };

exports.register = async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;
  if (!name || !email || !password || !passwordConfirm) {
    req.flash("error", "Vui lòng nhập tất cả các trường");
    req.flash("name", name);
    req.flash("email", email);
    return res.redirect("/register");
  }
  if (password !== passwordConfirm) {
    req.flash("error", "Mật khẩu không trùng khớp");
    req.flash("name", name);
    req.flash("email", email);
    return res.redirect("/register");
  }
  const user = await User.findOne({ email });
  if (user) {
    req.flash("error", "Email này đã tồn tại");
    req.flash("name", name);
    return res.redirect("/register");
  }
  const newUser = await User.create(req.body);

  if (!newUser) {
    req.flash("error", "Oops! Đã có lỗi xảy ra. Vui lòng thử lại");
  }
  createSendToken(newUser, res);
  return res.redirect("/login");
};

exports.protect = async (req, res, next) => {
  if (req.cookies.jwt || req.isAuthenticated()) {
    let oauthId, decode, localUser, oauthUser;
    const token = req.cookies.jwt;
    if (req.isAuthenticated() === false && token === undefined) {
      return res.redirect("/login");
    }

    if (req.cookies.jwt) {
      decode = jwt.verify(token, process.env.JWT_SECRET);
      localUser = await User.findById(decode.id);
    } else {
      oauthId = req.session.passport.user;
      oauthUser = await User.findById(oauthId);
    }

    if (!localUser && !oauthUser) {
      return res.redirect("/login");
    }

    if (localUser) {
      req.user = localUser;
      res.locals.user = localUser;
    } else if (oauthUser) {
      req.user = oauthUser;
      res.locals.user = oauthUser;
    }
    
    return next();
  } else {
    return res.redirect("/login");
  }
};

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt || req.isAuthenticated()) {
    try {
      const token = req.cookies.jwt;
      let oauthId, decode, localUser, oauthUser;
      if (req.cookies.jwt) {
        decode = jwt.verify(token, process.env.JWT_SECRET);
        localUser = await User.findById(decode.id);
      } else {
        oauthId = req.session.passport.user;
        oauthUser = await User.findById(oauthId);
      }
      if (!localUser && !oauthUser) return next();
      if (localUser) {
        req.user = localUser;
        res.locals.user = localUser;
      } else if (oauthUser) {
        req.user = oauthUser;
        res.locals.user = oauthUser;
      }
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.logout = (req, res, next) => {
  if (req.cookies.jwt) {
    res.clearCookie("jwt");
    return res.redirect("/login");
  } else {
    return req.logout(() => {
      res.redirect("/login");
    });
  }
};

exports.forgotPassword = async (req, res, next) => {
  const email = req.body.email;
  const user = await User.findOne({ email });
  if (!email) {
    req.flash("error", "Vui lòng nhập địa chỉ email");
    return res.redirect("/forgotPassword");
  }
  if (!user) {
    req.flash("error", "Email không tồn tại");
    return res.redirect("/forgotpassword");
  }
  const resetToken = user.createResetPassword();
  await user.save();

  try {
    const resetUrl = `${req.protocol}://${req.get("host")}/user/confirmEmail`;
    await new Email(user, resetUrl).sendResetPassword();
    res.cookie("resetToken", resetToken, {
      expires: new Date(Date.now() + 10 * 60 * 1000),
      httpOnly: true,
    });
    res.redirect("/announcement");
  } catch (error) {
    console.log(error);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    return res.redirect("/forgotpassword");
  }
};

exports.confirmEmail = async (req, res, next) => {
  return res.redirect("/resetpassword");
};

exports.resetPassword = async (req, res, next) => {
  const { newPassword, confirmPassword } = req.body;
  if (!newPassword || !confirmPassword) {
    req.flash("error", "Vui lòng nhập đầy đủ thông tin các trường");
    return res.redirect("/resetpassword");
  } else if (newPassword !== confirmPassword) {
    req.flash("error", "Mật khẩu nhập lại không chính xác");
    return res.redirect("/resetpassword");
  }
  const token = req.cookies.resetToken;
  console.log(token);
  const hashToken = crypto.createHash("sha256").update(token).digest();
  const user = await User.findOne({
    passwordResetToken: hashToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    req.flash(
      "error",
      "Token không tồn tại hoặc hết hạn. Vui lòng thử lại sau!!!"
    );
    return res.redirect("/resetpassword");
  }

  user.password = newPassword;
  user.passwordConfirm = confirmPassword;
  await user.save();
  createSendToken(user, res);
  return res.redirect("/login");
};

exports.updateProfile = async (req, res, next) => {
  const { name, email, address, city, phone, image } = req.body;
  const file = req.file;
  if (!name || !email || !address || !city || !phone) {
    req.flash("error", "Vui lòng nhập đầy đủ thông tin");
    req.flash("name", name);
    req.flash("email", email);
    req.flash("address", address);
    req.flash("city", city);
    req.flash("phone", phone);
    return res.redirect("/updateProfile");
  }
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, email, address, phone, city, image: file.filename },
    {
      new: true,
    }
  );
  if (user.image == "") {
    user.image = "default.jpg";
    await user.save();
  }
  if (!user) {
    req.flash("error", "Không tìm thấy người dùng");
    return res.redirect("/updateProfile");
  }
  res.redirect("/profile");
};

exports.updatePassword = async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const user = await User.findOne(req.user._id).select("+password");
  if (!oldPassword || !newPassword || !confirmPassword) {
    req.flash("error", "Vui lòng nhập tất cả thông tin các trường");
    return res.redirect("/updatePassword");
  }
  if (!(await user.comparePassword(oldPassword, user.password))) {
    req.flash("error", "Mật khẩu cũ không chính xác");
    return res.redirect("/updatePassword");
  }
  if (newPassword != confirmPassword) {
    req.flash("error", "Mật khẩu nhập lại không chính xác");
    return res.redirect("/updatePassword");
  }

  user.password = newPassword;
  user.passwordConfirm = confirmPassword;
  await user.save();
  res.redirect("/profile");
};
