const express = require("express");
const router = express.Router();
const cartController = require("../controller/cartController");
const authController = require("../controller/authController");

router.post("/remove-cart", cartController.removeFromCart);
router.post("/add-to-cart", cartController.addToCart);
router.post(
  "/checkout-session",
  authController.protect,
  cartController.createCheckoutSession
);
router.get("/removeCheckout", cartController.removeCheckout);
module.exports = router;
