import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { generateInsights } from '../services/insightService';

const router = Router();

router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const data = await generateInsights(req.user!.uid);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

export default router;
