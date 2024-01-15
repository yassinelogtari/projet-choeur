const router = require("express").Router()
const placementController = require("../controllers/placementController")
const middlewareDate=require("../middlewares/auth")
router.post("/placerMembre",middlewareDate.loggedMiddleware,middlewareDate.isAdmin,placementController.addPlacement)
router.get("/getPlacementById/:id",middlewareDate.loggedMiddleware,middlewareDate.isAdmin,placementController.getPlacementById)
router.patch("/updatePlacement/:id",middlewareDate.loggedMiddleware,middlewareDate.isAdmin,placementController.updatePlacement)

/**
 * @swagger
 * tags:
 *   name: Placement
 *   description: Placement management
 */

/**
 * @swagger
 * /api/placement/placerMembre:
 *   post:
 *     summary: Place members in a concert
 *     description: Place members in a concert based on provided parameters
 *     tags: [Placement]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             concert_id: "60b4ff685083192a288c979c"
 *             nombreDePlacesParRangée: 5
 *             nombreDeRangées: 3
 *     responses:
 *       200:
 *         description: Members placed successfully in the concert
 *       404:
 *         description: No members to place or not enough places available
 */

/**
 * @swagger
 * /api/placement/getPlacementById/{id}:
 *   get:
 *     summary: Get placement by ID
 *     description: Retrieve details of a placement by its ID
 *     tags: [Placement]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Placement details retrieved successfully
 *       404:
 *         description: Placement not found
 */

/**
 * @swagger
 * /api/placement/updatePlacement/{id}:
 *   patch:
 *     summary: Update placement details by ID
 *     description: Update placement details in the database by its ID
 *     tags: [Placement]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             row: 2
 *             column: 3
 *             membre: "60b4ff685083192a288c979d"
 *     responses:
 *       200:
 *         description: Placement details updated successfully
 *       404:
 *         description: Placement not found or member not found in the current placement
 */


module.exports=router;