const express = require("express");
const router = express.Router();
const auditionController = require("../controllers/auditionController");
const authMiddleware = require("../middlewares/auth");

router.post("/generate",authMiddleware.loggedMiddleware,authMiddleware.isAdmin, auditionController.generateSchedule);
router.post("/generate/additional",authMiddleware.loggedMiddleware,authMiddleware.isAdmin, auditionController.generateAdditionalSchedule);
router.get("/",authMiddleware.loggedMiddleware,authMiddleware.isAdmin, auditionController.fetshAuditions);
router.post("/addinfo",auditionController.addAuditionInfo);
router.patch('/update-audition/:auditionId',authMiddleware.loggedMiddleware,authMiddleware.isAdmin, auditionController.updateAudition);
router.delete('/deleteaudition/:auditionId',authMiddleware.loggedMiddleware,authMiddleware.isAdmin, auditionController.deleteAudition);
router.get('/:auditionId', auditionController.getAuditionById);


/**
 * @swagger
 * tags:
 *   name: Audition
 *   description: Audition management
 * components:
 *   schemas:
 *     Audition:
 *       type: object
 *       properties:
 *         candidats:
 *           type: array
 *           items:
 *             type: string
 *             format: ObjectId
 *         DateAud:
 *           type: string
 *           format: date
 *         HeureDeb:
 *           type: string
 *           format: time
 *         HeureFin:
 *           type: string
 *           format: time
 *         booked:
 *           type: boolean
 *           default: false
 *         archived:
 *           type: boolean
 *           default: false
 *         candidatsInfo:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               extraitChante:
 *                 type: string
 *               tessiture:
 *                 type: string
 *                 enum: [alto, basse, soprano, ténor]
 *               evaluation:
 *                 type: string
 *                 enum: [A, B, C]
 *               decision:
 *                 type: string
 *                 enum: [Retenu, Refusé, En attente]
 *               remarque:
 *                 type: string
 *       required:
 *         - DateAud
 *         - HeureDeb
 *         - HeureFin
 *   parameters:
 *     auditionId:
 *       in: path
 *       name: auditionId
 *       required: true
 *       schema:
 *         type: string
 *         format: ObjectId
 *   requestBody:
 *     Audition:
 *       description: Audition object
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Audition'
 */

/**
 * @swagger
 * /api/auditions/generate:
 *   post:
 *     summary: Generate audition schedule
 *     description: Generate audition schedule and save it to the database
 *     tags: [Audition]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Audition'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/Audition'
 */

/**
 * @swagger
 * /api/auditions/generate/additional:
 *   post:
 *     summary: Generate additional audition schedule
 *     description: Generate additional audition schedule and save it to the database
 *     tags: [Audition]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Audition'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/Audition'
 */

/**
 * @swagger
 * /api/auditions/:
 *   get:
 *     summary: Fetch all auditions
 *     description: Retrieve a list of all auditions
 *     tags: [Audition]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/Audition'
 */

/**
 * @swagger
 * /api/auditions/addinfo:
 *   post:
 *     summary: Add information to an audition
 *     description: Add information to an audition in the database
 *     tags: [Audition]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Audition'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/Audition'
 */

/**
 * @swagger
 * /api/auditions/update-audition/{auditionId}:
 *   patch:
 *     summary: Update audition details by ID
 *     description: Update details of an audition in the database by its ID
 *     tags: [Audition]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/auditionId'
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Audition'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/Audition'
 */

/**
 * @swagger
 * /api/auditions/deleteaudition/{auditionId}:
 *   delete:
 *     summary: Delete an audition by ID
 *     description: Delete an audition from the database by its ID
 *     tags: [Audition]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/auditionId'
 *     responses:
 *       200:
 *         $ref: '#/components/schemas/Audition'
 */


module.exports = router;
