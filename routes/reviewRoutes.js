const router = require("express").Router();
const reviewController = require("../controller/reviewController");

router.get("/getAllReview", reviewController.getReviewPopulate);
router.get("/getAllProduct", reviewController.getAllProduct);

module.exports = router;
