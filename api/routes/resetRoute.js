const router = require("express").Router();

const resetController = require("../controllers/resetController");

router.delete("/", resetController.deleteData);

module.exports = router;
