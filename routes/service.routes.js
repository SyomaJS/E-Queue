const { Router } = require("express");
const router = Router();
const serviceController = require("../controllers/service.controller");

router.post("/add", serviceController.addService);
router.get("/", serviceController.getService);
router.delete("/:id", serviceController.deleteService);
router.put("/:id", serviceController.updateService);

module.exports = router;
