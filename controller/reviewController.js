const Product = require("../model/productModel");
const Review = require("../model/reviewModel");

exports.getReviewPopulate = async (req, res, next) => {
  const reviews = await Review.find();
  for (let review of reviews) {
    console.log(review.user.image);
  }
  res.status(200).json({
    status: "success",
    data: reviews,
  });
};

exports.getAllProduct = async (req, res, next) => {
  const product = await Product.find().populate({ path: "reviews" });
  res.status(200).json({
    status: "success",
    data: product,
  });
};
