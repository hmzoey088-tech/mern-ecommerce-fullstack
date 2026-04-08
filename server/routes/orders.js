import express from 'express';
import { verifyAccessToken } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(verifyAccessToken);
router.get('/', (req, res) => res.json({ message: 'Orders list placeholder.' }));
export default router;
