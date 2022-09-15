const Product = require("../model/productModel");
const moment = require("moment");
const Categories = require("../model/categoriesModel");
const Order = require("../model/orderModel");
const numeral = require("numeral");
const Features = require("../utils/features");

exports.getHome = async (req, res, next) => {
  const products = await Product.find();
  const categories = await Categories.find();
  res.status(200).render("content", {
    title: "Homepage",
    products,
    categories,
    numeral,
  });
};

exports.getProduct = async (req, res, next) => {
  const products = await Product.find();
  const slug = req.params.slug;
  const product = await Product.findOne({ slug }).populate({ path: "reviews" });
  res
    .status(200)
    .render("detail", { title: "Sản phẩm", product, products, moment });
};

exports.getAllProduct = async (req, res, next) => {
  const features = new Features(Product.find(), req.query)
    .filterFields()
    .sort()
    .pagination();
  const category = await Categories.find();
  const products = await features.query;
  const productList = await Product.find();
  const currentPage = req.query.page * 1 || 1;
  const pages = Math.ceil(productList.length / 9);
  res.status(200).render("shop", {
    title: "Danh sách sản phẩm",
    category,
    products,
    productList,
    pages,
    currentPage,
  });
};

exports.getProductSearch = async (req, res, next) => {
  const products = await Product.find();
  const name = req.query.name;
  const productSearch = products.filter((item) => {
    return item.name.toLowerCase().indexOf(name.toLowerCase()) !== -1;
  });
  res
    .status(200)
    .render("search", { title: "Danh sách sản phẩm", productSearch });
};

exports.register = (req, res, next) => {
  res.status(200).render("auth/register", { title: "Tạo tài khoản" });
};

exports.login = (req, res, next) => {
  res.status(200).render("auth/login", { title: "Đăng nhập" });
};

exports.cart = (req, res, next) => {
  res.status(200).render("cart", { title: "Giỏ hàng" });
};

exports.forgotPassword = (req, res, next) => {
  res.status(200).render("emails/forgotPassword", { title: "Quên mật khẩu" });
};

exports.announcement = (req, res, next) => {
  res
    .status(200)
    .render("emails/announcement", { title: "Đặt lại mật khẩu của bạn" });
};

exports.resetPassword = (req, res, next) => {
  res.status(200).render("emails/resetPassword", { title: "Đặt lại mật khẩu" });
};

exports.profile = (req, res, next) => {
  res.status(200).render("auth/profile", { title: "Tài khoản của bạn" });
};

exports.updateProfile = (req, res, next) => {
  res.status(200).render("auth/updateProfile", { title: "Cập nhật thông tin" });
};

exports.updatePassword = (req, res, next) => {
  res.status(200).render("auth/updatePassword", { title: "Đổi mật khẩu" });
};

exports.contact = (req, res, next) => {
  res.status(200).render("contact", { title: "Liên hệ với chúng tôi" });
};

exports.feedback = (req, res, next) => {
  res.status(200).render("feedback", { title: "Phản hồi" });
};

exports.checkoutOrder = async (req, res, next) => {
  const order = await Order.findOne({ user: req.user.id });
  console.log(order);
  res.status(200).render("order", { title: "Thông tin thanh toán", order });
};

exports.updateOrderCheckout = (req, res, next) => {
  res.status(200).render("updateCheckout", { title: "Cập nhật thông tin" });
};

exports.myOrder = async (req, res, next) => {
  const order = await Order.findOne({ user: req.user.id });
  res
    .status(200)
    .render("auth/myorder", { title: "Danh sách mua hàng", order });
};
