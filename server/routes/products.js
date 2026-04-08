import express from 'express';

const router = express.Router();

router.get('/', (req, res) => res.json({ message: 'Product listing coming soon.' }));
router.get('/:slug', (req, res) => res.json({ message: `Product detail for ${req.params.slug}` }));

export default router;
