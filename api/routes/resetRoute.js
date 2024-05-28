const router = require("express").Router();

const resetController = require("../controllers/resetController");

router.delete("/", resetController.deleteData);
router.get("/search", resetController.searchData);
/**
 * @swagger

 * /api/reset:
 *   delete:
 *     summary: Reset the database.
 *     description: Deletes all data from all collections in the database.
 *     responses:
 *       200:
 *         description: Successfully reset the database.
 *         content:
 *           application/json:
 *             example:
 *               msg: database reset successfully
 */

module.exports = router;
