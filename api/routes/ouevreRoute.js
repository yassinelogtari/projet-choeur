const router = require("express").Router();

const oeuvreController = require("../controllers/oeuvreController");
const middlewareOuvre = require("../middlewares/auth");

router.post("/addoeuvre", oeuvreController.addOeuvre);
router.get("/getAll", oeuvreController.fetchOeuvre);
router.get("/getOne/:id", oeuvreController.getByidOeuvre);
router.delete("/:id", oeuvreController.deleteOuvre);
router.patch("/update/:id", oeuvreController.updateOeuvre);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *   name: Oeuvre
 *   description: Oeuvre management
 * components:
 *   schemas:
 *     Oeuvre:
 *       type: object
 *       properties:
 *         titre:
 *           type: string
 *         compositeurs:
 *           type: array
 *           items:
 *             type: string
 *         arrangeurs:
 *           type: array
 *           items:
 *             type: string
 *         pupitre:
 *           type: array
 *           items:
 *             type: string
 *             enum: ['alto', 'soprano', 'basse', 'ténor']
 *         anneeComposition:
 *           type: number
 *         genre:
 *           type: string
 *         paroles:
 *           type: string
 *         partition:
 *           type: string
 *         presenceChoeur:
 *           type: boolean
 *       required:
 *         - titre
 *         - compositeurs
 *         - arrangeurs
 *         - pupitre
 *         - anneeComposition
 *         - genre
 *         - paroles
 *         - partition
 */

/**
 * @swagger
 * /api/oeuvre/addoeuvre:
 *   post:
 *     summary: Add a new oeuvre
 *     description: Add a new oeuvre to the database
 *     tags: [Oeuvre]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Oeuvre'
 *     responses:
 *       200:
 *         description: Oeuvre added successfully
 */

/**
 * @swagger
 * /api/oeuvre/getAll:
 *   get:
 *     summary: Get all oeuvres
 *     description: Retrieve a list of all oeuvres
 *     tags: [Oeuvre]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of oeuvres retrieved successfully
 */

/**
 * @swagger
 * /api/oeuvre/getOne/{id}:
 *   get:
 *     summary: Get an oeuvre by ID
 *     description: Retrieve details of an oeuvre by its ID
 *     tags: [Oeuvre]
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
 *         description: Oeuvre details retrieved successfully
 */

/**
 * @swagger
 * /api/oeuvre/{id}:
 *   delete:
 *     summary: Delete an oeuvre by ID
 *     description: Delete an oeuvre from the database by its ID
 *     tags: [Oeuvre]
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
 *         description: Oeuvre deleted successfully
 */

/**
 * @swagger
 * /api/oeuvre/update/{id}:
 *   patch:
 *     summary: Update an oeuvre by ID
 *     description: Update details of an oeuvre in the database by its ID
 *     tags: [Oeuvre]
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
 *           schema:
 *             $ref: '#/components/schemas/Oeuvre'
 *     responses:
 *       200:
 *         description: Oeuvre updated successfully
 */

module.exports = router;
