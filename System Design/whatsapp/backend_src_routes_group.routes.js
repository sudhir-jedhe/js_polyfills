import express from 'express';
import { createGroup, getGroup, updateGroup, deleteGroup, addMember, removeMember } from '../controllers/group.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', authMiddleware, createGroup);
router.get('/:groupId', authMiddleware, getGroup);
router.put('/:groupId', authMiddleware, updateGroup);
router.delete('/:groupId', authMiddleware, deleteGroup);
router.post('/member', authMiddleware, addMember);
router.delete('/member', authMiddleware, removeMember);

export default router;

