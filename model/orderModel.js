const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  product: [{ type: mongoose.Schema.Types.ObjectId, ref: "product" }],
  shippingAddress: { type: String },
  phone: { type: Number },
  city: { type: String },
  status: { type: String, default: "Đã thanh toán" },
  totalPrice: { type: Number, default: 0 },
});

orderSchema.pre(/^find/, function (next) {
  this.populate([
    { path: "user", select: "name" },
    { path: "product", select: "name imageCover price" },
  ]);
  next();
});

orderSchema.virtual("id", function () {
  return this._id.toHexString();
});

orderSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("order", orderSchema);
