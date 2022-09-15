const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      // required: [true, "Vui lòng điền tên của bạn"],
      trim: true,
    },
    facebookId: String,
    googleId: String,
    email: {
      type: String,
      // required: [true, "Vui lòng điền email của bạn"],
      trim: true,
      unique: true,
      // validate: [validator.isEmail, "Vui lòng cung cấp đúng định dạng email"],
    },
    image: { type: String, default: "default.jpg" },
    active: { type: Boolean, default: true, select: false },
    password: {
      type: String,
      // required: "Vui lòng điền mật khẩu",
      select: false,
    },
    passwordConfirm: {
      type: String,
      // required: [true, "Vui lòng nhập lại mật khẩu"],
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    phone: Number,
    address: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

userSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();
  this.password = bcrypt.hashSync(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.comparePassword = async (password, userPassword) => {
  return await bcrypt.compare(password, userPassword);
};

userSchema.methods.createResetPassword = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest();
  // console.log(resetToken, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

userSchema.virtual("id", function () {
  return this._id.toHexString();
});

userSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("user", userSchema);
