import express from 'express';
import {
  connection,
  login,
  logout,
  register,
  signUp,
} from '@controllers/MySQL/authController';
import { getUser } from '../controllers/MySQL/authController';

const router = new express.Router();

router.get('/signup', signUp);
router.get('/get-user', getUser);
router.post('/signup', register);
router.get('/login', login);
router.post('/login', connection);
router.post('/logout', logout);

export default router;
