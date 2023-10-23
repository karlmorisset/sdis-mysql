import { Router } from 'express';
import { updateDataFromAPI } from '@controllers/MySQL/dataController';
import {
  getPlayedMatches,
  getScheduledMatches,
  index,
  show,
} from '@controllers/MySQL/matchesController';

import { requireAuth } from '@app/middleware/MySQL/authMiddleware';

const router = Router();

// Routes accessibles à partir de /matches
router.get('/', requireAuth, index);
router.get('/update', requireAuth, updateDataFromAPI);
router.get('/show/:id', requireAuth, show);
router.get('/played', requireAuth, getPlayedMatches);
router.get('/scheduled', requireAuth, getScheduledMatches);

export default router;
