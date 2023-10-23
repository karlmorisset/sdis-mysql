import User from '@models/MongoDB/User';
import ErrorService from '@services/errorService';
import { setTokenCookie, createToken, deleteTokenCookie } from '@services/jwt';

/**
 * Permet d'afficher la page de création d'un utilisateur
 *
 * @param {Request} req
 * @param {Response} res
 */
export const signUp = async (req, res) => {
  try {
    res.status(200).render('pages/auth/signup');
  } catch (error) {
    ErrorService.record(error, res, 500);
  }
};

/**
 * Permet d'enregister un nouvel utilisateur
 *
 * @param {Request} req
 * @param {Response} res
 */
export const register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.create({ email, password });

    res.status(201).json({ user: user.email });
  } catch (error) {
    const errors = await ErrorService.handleValidationError(error, res);
    res.status(403).json(errors);
  }
};

/**
 * Permet d'afficher la page de connexion d'un utilisateur
 *
 * @param {Request} req
 * @param {Response} res
 */
export const login = async (req, res) => {
  try {
    res.status(200).render('pages/auth/login');
  } catch (error) {
    ErrorService.record(error, res, 500);
  }
};

/**
 * Permet de connecter un utilisateur en vérifiant ses credentials
 *
 * @param {Request} req
 * @param {Response} res
 */
export const connection = async (req, res) => {
  let user;

  try {
    const { email, password } = req.body;

    user = await User.login(email, password);
  } catch (error) {
    const errors = await ErrorService.handleValidationError(error, res);

    res.status(403).json(errors);
  }

  try {
    if (user) {
      // eslint-disable-next-line no-underscore-dangle
      const token = createToken(user._id);

      setTokenCookie(res, token);

      // eslint-disable-next-line no-underscore-dangle
      res.status(200).json({ user: user._id });
    }
  } catch (error) {
    ErrorService.record(error, res, 500);
  }
};

/**
 * Permet de déconnecter un utilisateur
 *
 * @param {Request} req
 * @param {Response} res
 */
export const logout = async (req, res) => {
  try {
    res.locals.user = null;
    deleteTokenCookie(res);
    res.status(200).end();
  } catch (error) {
    ErrorService.record(error, res, 500);
  }
};
