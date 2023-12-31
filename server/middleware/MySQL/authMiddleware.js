import jwt from 'jsonwebtoken';
import User from '../../models/MySQL/User';

export const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.redirect('/auth/login');
  }

  jwt.verify(token, process.env.JWT_SALT, (err) => {
    if (err) return res.redirect('/auth/login');

    next();
  });
};

export const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    res.locals.user = null;
    next();
  } else {
    jwt.verify(token, process.env.JWT_SALT, async (err, decodedToken) => {
      try {
        if (err || !decodedToken) {
          res.locals.user = null;
          throw new Error('Invalid Token');
        }

        const user = await User.findByPk(decodedToken.id);
        if (user) {
          res.locals.user = {
            id: user.id,
            email: user.email,
          };
        }
      } catch (error) {
        console.warn(error.message);
      } finally {
        next();
      }
    });
  }
};
