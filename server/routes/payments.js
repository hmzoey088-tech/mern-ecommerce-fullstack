import express from 'express';

const router = express.Router();
router.post('/create-intent', (req, res) => res.json({ message: 'Stripe intent placeholder.' }));
router.post('/webhook', (req, res) => res.json({ message: 'Webhook endpoint placeholder.' }));
export default router;
