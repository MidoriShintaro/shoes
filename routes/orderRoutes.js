const router = require("express").Router();
const orderController = require("../controller/orderController");
const authController = require("../controller/authController");

router.use(authController.protect);
router.get("/getOrder", orderController.getOrder);
router.post("/createOrder", orderController.createNewOrder);
router.post("/updateOrderCheckout", orderController.updateCheckout);
module.exports = router;
