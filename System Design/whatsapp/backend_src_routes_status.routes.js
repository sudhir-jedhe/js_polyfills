import express from 'express';
import { createStatus, getStatusUpdates, viewStatus } from '../controllers/status.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', authMiddleware, createStatus);
router.get('/', authMiddleware, getStatusUpdates);
router.post('/:statusId/view', authMiddleware, viewStatus);

export default router;

