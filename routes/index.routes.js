const { Router } = require("express");
const router = Router();

router.use("/client", require("./client.routes"));
router.use("/otp", require("./otp.routes"));


module.exports = router;
