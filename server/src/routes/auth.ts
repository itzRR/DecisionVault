import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { createOrUpdateUser, getUser, updatePreferences, deleteUser } from '../services/userService';

const router = Router();

router.post('/session', authMiddleware, async (req, res, next) => {
  try {
    const user = req.user!;
    const dbUser = await createOrUpdateUser(user.uid, user.email || '', user.name, user.picture);
    res.json({ success: true, data: dbUser });
  } catch (error) {
    next(error);
  }
});

router.get('/me', authMiddleware, async (req, res, next) => {
  try {
    const dbUser = await getUser(req.user!.uid);
    if (!dbUser) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, data: dbUser });
  } catch (error) {
    next(error);
  }
});

router.put('/preferences', authMiddleware, async (req, res, next) => {
  try {
    const updated = await updatePreferences(req.user!.uid, req.body);
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

router.delete('/account', authMiddleware, async (req, res, next) => {
  try {
    await deleteUser(req.user!.uid);
    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
