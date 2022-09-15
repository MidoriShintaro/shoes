const express = require("express");
const router = express.Router();
const viewController = require("../controller/viewController");
const authController = require("../controller/authController");

//auth
router.get("/register", viewController.register);
router.get("/forgotpassword", viewController.forgotPassword);
router.get("/announcement", viewController.announcement);
router.get("/resetpassword", viewController.resetPassword);
router.get("/login", viewController.login);
router.get("/profile", authController.protect, viewController.profile);
router.get(
  "/updateProfile",
  authController.protect,
  viewController.updateProfile
);
router.get(
  "/updatePassword",
  authController.protect,
  viewController.updatePassword
);
// router.use(authController.protect);
//contact
router.get("/contact", viewController.contact);
router.get("/feedback", viewController.feedback);
//product
router.get(
  "/checkoutOrder",
  authController.protect,
  viewController.checkoutOrder
);
router.get(
  "/updateOrderCheckout",
  authController.protect,
  viewController.updateOrderCheckout
);
router.get("/myOrder", authController.protect, viewController.myOrder);
router.get(
  "/search",
  authController.isLoggedIn,
  viewController.getProductSearch
);
router.get("/", authController.isLoggedIn, viewController.getHome);
router.get(
  "/all-product",
  authController.isLoggedIn,
  viewController.getAllProduct
);
router.get("/cart", authController.isLoggedIn, viewController.cart);
router.get("/:slug", authController.isLoggedIn, viewController.getProduct);

module.exports = router;
