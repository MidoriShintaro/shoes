const numeral = require("numeral");
const Order = require("../model/orderModel");
const User = require("../model/userModel");
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const Email = require("../utils/email");

exports.addToCart = (req, res, next) => {
  if (!req.session.cart) {
    req.session.cart = {
      items: {},
      totalQty: 0,
      totalPrice: 0,
    };
  }
  let cart = req.session.cart;
  const currentPrice = numeral(req.body.price).value();
  const salePrice = (currentPrice * req.body.sale) / 100;
  let price = currentPrice - salePrice;
  let isSale = req.body.isSale ? price : currentPrice;
  if (!cart.items[req.body._id]) {
    cart.items[req.body._id] = {
      item: req.body,
      qty: 1,
      price: isSale,
    };
    cart.totalQty += 1;
    cart.totalPrice += isSale;
  } else {
    cart.items[req.body._id].qty += 1;
    cart.items[req.body._id].price += isSale;
    cart.totalQty += 1;
    cart.totalPrice += isSale;
  }
  return res.status(200).json({ totalQty: req.session.cart.totalQty });
};

exports.removeFromCart = (req, res, next) => {
  let cart = req.session.cart;
  cart.totalQty -= cart.items[req.body._id].qty;
  cart.totalPrice -= cart.items[req.body._id].price;
  delete cart.items[req.body._id];
  res.status(200).json({ status: "done", totalQty: req.session.cart.totalQty });
};

exports.createCheckoutSession = async (req, res, next) => {
  let listNameProduct = Object.values(req.session.cart.items); //get list name of product for stripe payment
  // arrName.map(el => {
  //   console.log(el)
  // })
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    cancel_url: `${req.protocol}://${req.get("host")}/cart`,
    success_url: `${req.protocol}://${req.get("host")}/cart/removeCheckout`,
    customer_email: req.user.email,
    currency: "vnd",
    line_items: listNameProduct.map((el) => {
      return {
        price_data: {
          currency: "vnd",
          unit_amount: el.price,
          product_data: {
            name: el.item.name,
            images: [el.item.imageCover],
          },
        },
        quantity: el.qty,
      };
    }),
  });
  res.status(200).json({
    status: "success",
    session,
  });
};

exports.removeCheckout = async (req, res, next) => {
  delete req.session.cart;
  const url = `${req.protocol}://${req.get("host")}/`;
  await new Email(req.user, url).sendThankForCustomer();
  res.redirect("/");
};
