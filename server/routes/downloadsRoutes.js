import { Router } from 'express';
import index from '../controllers/AppController';
import { requireAuth } from '../middleware/MySQL/authMiddleware';

const router = Router();

router.get('/', requireAuth, index);

export default router;
