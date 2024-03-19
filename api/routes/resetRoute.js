const router = require("express").Router();

const resetController = require("../controllers/resetController");

router.delete("/", resetController.deleteData);

<<<<<<< HEAD
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

=======
>>>>>>> b857dbd4cce43430b3b097398c7cf9a274db7fb3
module.exports = router;
