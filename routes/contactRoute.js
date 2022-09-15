const router = require("express").Router();
const contactController = require("../controller/contactController");

router.post("/sendfeedback", contactController.feedback);

module.exports = router;
