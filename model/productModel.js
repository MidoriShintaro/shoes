const mongoose = require("mongoose");
const slugify = require("slugify");
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    name: { type: String, required: [true, "Sản phẩm bắt buộc phải bao gồm tên"] },
    price: { type: String, required: [true, "Sản phẩm bắt buộc phải bao gồm giá"] },
    isSale: { type: Boolean, default: false },
    sale: { type: Number, default: 0 },
    description: { type: String, default: "", trim: true },
    descriptionDetail: { type: String, default: "", trim: true },
    ratingAverage: { type: Number, default: 4.5 },
    ratingQuantity: { type: Number, default: 0 },
    unitInStock: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isRecent: { type: Boolean, default: false },
    slug: String,
    imageCover: String,
    images: [String],
    brand: { type: String, required: [true, "Sản phẩm bắt buộc phải bao gồm thương hiệu"] },
    createAt: { type: Date, default: Date.now },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//populate virtual
productSchema.virtual("reviews", {
  ref: "review",
  foreignField: "product",
  localField: "_id",
});

module.exports = mongoose.model("product", productSchema);
