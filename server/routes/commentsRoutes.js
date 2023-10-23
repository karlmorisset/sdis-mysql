import { Router } from 'express';
import { store, destroy, update } from '../controllers/MySQL/commentController';
import { requireAuth } from '../middleware/MySQL/authMiddleware';

const router = Router();

// Routes accessibles à partir de /comments
router.post('/', requireAuth, store);
router.put('/', requireAuth, update);
router.delete('/', requireAuth, destroy);

export default router;
