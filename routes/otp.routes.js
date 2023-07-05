const { Router } = require("express");
const {
  newOTP,
  verifyOTP,
  deleteOTP,
} = require("../controllers/otp.controller");

const router = Router();

router.post("/newotp", newOTP);
router.post("/verify", verifyOTP);

// router.put("/:id", updateClient);
// router.delete("/:id", deleteClient);

module.exports = router;
