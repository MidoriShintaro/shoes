const mongoose = require("mongoose");
const { Schema } = mongoose;

const categoriesSchema = new Schema({
  name: { type: String, required: [true, "The categories must have a name"] },
  brand: { type: String, required: [true, "The categories must have a brand"] },
  unitInStock: { type: Number, default: 0 },
  imageCover: { type: String },
});

module.exports = mongoose.model("categories", categoriesSchema);
