const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewSchema = new Schema(
  {
    review: { type: String, default: "" },
    rating: { type: Number, max: 5, min: 1 },
    createAt: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate([
    { path: "user", select: "name image" },
    { path: "product", select: "name" },
  ]);
  next();
});

module.exports = mongoose.model("review", reviewSchema);
