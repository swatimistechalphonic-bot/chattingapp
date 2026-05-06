const router = require("express").Router();
const authController = require("../controllers/authController");

/**
 * @swagger
 * /api/auth/check-user:
 *   post:
 *     summary: Check if a user exists by their custom user_id
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: User status
 */
router.post("/check-user", authController.checkUser);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user with a custom user_id and passkey
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *               passkey:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registered successfully
 */
router.post("/register", authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login with user_id and passkey
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *               passkey:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns token
 */
router.post("/login", authController.login);

module.exports = router;
