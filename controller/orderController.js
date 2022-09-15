const Order = require("../model/orderModel");
const User = require("../model/userModel");
// const Product = require("../model/productModel");

exports.createNewOrder = async (req, res, next) => {
  const listProduct = Object.values(req.session.cart.items);
  let idList = [];
  listProduct.forEach((el) => {
    idList.push(el.item.id);
  });
  let cart = req.session.cart;
  const newOrder = new Order({
    user: req.user._id,
    product: idList,
    phone: req.body.phone,
    city: req.body.city,
    shippingAddress: req.body.address,
    totalPrice: cart.totalPrice,
  });
  await newOrder.save();
  idList = [];
  res.redirect("/checkoutOrder");
};

exports.getOrder = async (req, res, next) => {
  console.log(req.session.cart);
  const order = await Order.find();
  res.status(200).json({
    status: "success",
    data: order,
  });
};

exports.updateCheckout = async (req, res, next) => {
  const crruser = await User.findOne({ user: req.user._id });
  console.log(req.user, crruser);
  await Order.findOneAndUpdate({ user: req.user.id }, req.body, {
    new: true,
  });
  res.redirect("/checkoutOrder");
};
