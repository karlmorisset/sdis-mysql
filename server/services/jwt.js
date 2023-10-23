import jwt from 'jsonwebtoken';

// Définition de la durée de validité du token en SECONDES
export const maxAge = 3 * 24 * 60 * 60;

export const createToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SALT, {
    expiresIn: maxAge,
  });

export const setTokenCookie = (res, token) => {
  res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
};

export const deleteTokenCookie = (res) => {
  res.cookie('jwt', '', { maxAge: 1 });
};
