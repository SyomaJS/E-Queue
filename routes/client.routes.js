const { Router } = require("express");
const router = Router();
const clientController = require("../controllers/client.controller");
const ClientPolice = require("../middlewares/clientPolice");

router.post("/add", clientController.addClient);
router.get("/", ClientPolice, clientController.getClient);
router.delete("/:id", clientController.deleteClient);
router.put("/:id", clientController.updateClient);


module.exports = router;
