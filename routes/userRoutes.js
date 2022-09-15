const express = require("express");
const router = express.Router();
const passport = require("passport");
const authController = require("../controller/authController");
const userController = require("../controller/userController");

router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/forgotpassword", authController.forgotPassword);
router.post("/resetpassword", authController.resetPassword);
// router.post("/createUser", authController.createUser);
router.post(
  "/updateProfile",
  authController.protect,
  userController.uploadAvatar,
  userController.resizeUserImage,
  authController.updateProfile
);
router.post(
  "/updatePassword",
  authController.protect,
  authController.updatePassword
);
router.get("/confirmEmail", authController.confirmEmail);
router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);
// router.get("/getAllUser", authController.getAllUser);
router.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: "email" })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    successRedirect: "/",
  })
);
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get("/logout", authController.logout);
router.get("/getAllUser", userController.getAllUser);
module.exports = router;
