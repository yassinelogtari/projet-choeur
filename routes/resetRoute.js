const router = require("express").Router();

const resetController = require("../controllers/resetController");

router.put("/reset", resetController);

module.exports = router;
