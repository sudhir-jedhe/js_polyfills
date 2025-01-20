import express from 'express';
import { getProfile, updateProfile, addContact, removeContact, getContacts, addAccount, removeAccount, getAccounts } from '../controllers/user.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.post('/contact', authMiddleware, addContact);
router.delete('/contact', authMiddleware, removeContact);
router.get('/contacts', authMiddleware, getContacts);
router.post('/account', authMiddleware, addAccount);
router.delete('/account', authMiddleware, removeAccount);
router.get('/accounts', authMiddleware, getAccounts);

export default router;

