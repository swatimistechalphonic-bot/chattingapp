const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

/**
 * @swagger
 * /api/messages/send:
 *   post:
 *     summary: Send a message via API
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               room_id:
 *                 type: string
 *               sender_id:
 *                 type: integer
 *               receiver_id:
 *                 type: integer
 *               message:
 *                 type: string
 *               message_type:
 *                 type: string
 *                 enum: [text, image, document]
 *               file_url:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message sent successfully
 */
router.post('/send', messageController.sendMessageAPI);

/**
 * @swagger
 * /api/messages/read:
 *   post:
 *     summary: Mark messages in a room as read
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               room_id:
 *                 type: string
 *               user_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Messages marked as read
 */
router.post('/read', messageController.markReadAPI);

/**
 * @swagger
 * /api/messages/recent/{user_id}:
 *   get:
 *     summary: Retrieve list of recent chats for a user
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: List of recent chats
 */
router.get('/recent/:user_id', messageController.getRecentChats);

/**
 * @swagger
 * /api/messages/{room_id}:
 *   get:
 *     summary: Retrieve message history for a specific room
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: room_id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: List of messages
 */
router.get('/:room_id', messageController.getMessageHistory);

module.exports = router;
