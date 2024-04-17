const router = require("express").Router();
const membreController = require("../controllers/membreController");
const middlewareDate = require("../middlewares/auth");
router.patch(
  "/modifierTessiture/:id",
  middlewareDate.loggedMiddleware,
  middlewareDate.isAdmin,
  membreController.modifierTessiture
);
router.post(
  "/register",
  middlewareDate.loggedMiddleware,
  middlewareDate.isAdmin,
  membreController.register
);
router.post("/login", membreController.login);
router.get(
  "/getMembreById/:id",
  middlewareDate.loggedMiddleware,
  middlewareDate.isAdmin,
  membreController.getMemberById
);
router.get(
  "/getAllMembers",
  /*middlewareDate.loggedMiddleware,
  middlewareDate.isAdmin,*/
  membreController.getAllMembers
);
router.post(
  "/getMembersByPupitre",
  /*middlewareDate.loggedMiddleware,
  middlewareDate.isAdmin,*/
  membreController.getMembersByPupitre
);
router.delete(
  "/deleteMember/:id",
  middlewareDate.loggedMiddleware,
  middlewareDate.isAdmin,
  membreController.deleteMember
);
router.patch(
  "/updateMember/:id",
  middlewareDate.loggedMiddleware,
  middlewareDate.isAdmin,
  membreController.updateMember
);

/**
 * @swagger
 * tags:
 *   name: Membre
 *   description: Membre management
 * components:
 *   schemas:
 *     Membre:
 *       type: object
 *       properties:
 *         nom:
 *           type: string
 *         prenom:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         sexe:
 *           type: string
 *           enum: [Homme, Femme]
 *         dateNaissance:
 *           type: string
 *         nationalite:
 *           type: string
 *         CIN:
 *           type: string
 *         taille:
 *           type: number
 *         situationPerso:
 *           type: string
 *         connaissanceMusic:
 *           type: boolean
 *         activite:
 *           type: boolean
 *         telephone:
 *           type: string
 *         notifications:
 *           type: array
 *           default: []
 *         role:
 *           type: string
 *           enum: [choriste, manager, chef du pupitre, chef de choeur, admin]
 *         statut:
 *           type: string
 *           enum: [Inactif, Junior, Sénior, Vétéran, En congé, Choriste, éliminé]
 *         pupitre:
 *           type: string
 *           enum: [soprano, alto, ténor, basse]
 *         historiqueStatut:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               saison:
 *                 type: string
 *                 format: ObjectId
 *               status:
 *                 type: string
 *       required:
 *         - nom
 *         - prenom
 *         - email
 *         - password
 *         - sexe
 *         - dateNaissance
 *         - nationalite
 *         - CIN
 *         - role
 *         - statut
 */

/**
 * @swagger
 * /api/membre/modifierTessiture/{id}:
 *   patch:
 *     summary: Modify tessiture of a member by ID
 *     description: Modify tessiture of a member in the database by its ID
 *     tags: [Membre]
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
 *             $ref: '#/components/schemas/Membre'
 *     responses:
 *       200:
 *         description: Member's tessiture modified successfully
 */

/**
 * @swagger
 * /api/membre/register:
 *   post:
 *     summary: Register a new member
 *     description: Register a new member in the database
 *     tags: [Membre]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Membre'
 *     responses:
 *       200:
 *         description: Member registered successfully
 */

/**
 * @swagger
 * /api/membre/login:
 *   post:
 *     summary: Member login
 *     description: Member login to the system
 *     tags: [Membre]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Member logged in successfully
 */

/**
 * @swagger
 * /api/membre/getMembreById/{id}:
 *   get:
 *     summary: Get a member by ID
 *     description: Retrieve details of a member by its ID
 *     tags: [Membre]
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
 *         description: Member details retrieved successfully
 */

/**
 * @swagger
 * /api/membre/getAllMembers:
 *   get:
 *     summary: Get all members
 *     description: Retrieve a list of all members
 *     tags: [Membre]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of members retrieved successfully
 */

/**
 * @swagger
 * /api/membre/deleteMember/{id}:
 *   delete:
 *     summary: Delete a member by ID
 *     description: Delete a member from the database by its ID
 *     tags: [Membre]
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
 *         description: Member deleted successfully
 */

/**
 * @swagger
 * /api/membre/updateMember/{id}:
 *   patch:
 *     summary: Update details of a member by ID
 *     description: Update details of a member in the database by its ID
 *     tags: [Membre]
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
 *             $ref: '#/components/schemas/Membre'
 *     responses:
 *       200:
 *         description: Member details updated successfully
 */

module.exports = router;
