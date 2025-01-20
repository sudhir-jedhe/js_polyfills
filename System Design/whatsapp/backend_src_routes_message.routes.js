import express from 'express';
import { sendMessage, getMessages, updateMessageStatus, forwardMessage, starMessage, unstarMessage, getStarredMessages } from '../controllers/message.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', authMiddleware, sendMessage);
router.get('/:receiverId/:receiverModel', authMiddleware, getMessages);
router.patch('/:messageId/status', authMiddleware, updateMessageStatus);
router.post('/forward', authMiddleware, forwardMessage);
router.post('/:messageId/star', authMiddleware, starMessage);
router.post('/:messageId/unstar', authMiddleware, unstarMessage);
router.get('/starred', authMiddleware, getStarredMessages);

export default router;

