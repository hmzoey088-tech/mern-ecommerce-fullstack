import express from 'express';
import { verifyAccessToken, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(verifyAccessToken, requireRole('admin'));
router.get('/', (req, res) => res.json({ message: 'Admin dashboard placeholder.' }));
export default router;
