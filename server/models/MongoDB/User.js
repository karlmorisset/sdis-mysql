import { Schema, model } from 'mongoose';
import isEmail from 'validator/lib/isEmail';
import bcrypt from 'bcrypt';
import ValidationError from '@app/exceptions/ValidationError';

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Merci de saisir un email'],
    unique: [true, 'Cet email est déjà utilisé'],
    lowercase: [true, "l'email doit être en minuscule"],
    validate: [isEmail, "Merci d'entrer un email valide"],
  },
  password: {
    type: String,
    required: [true, 'Merci de saisir un mot de passe'],
    minlength: [6, 'Le mot de passe doit avoir 6 caractères minimum'],
  },
});

async function encryptPassword(next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
}

userSchema.pre('save', encryptPassword);

/**
 * Valide les informations de connexion de l'utilisateur
 *
 * @param {String} email
 * @param {String} password
 * @returns
 */
userSchema.statics.login = async function login(email, password) {
  const user = await this.findOne({ email });

  const invalidCredentials = {
    email: {
      value: email,
      message: 'Email ou mot de passe invalide',
    },

    password: {
      value: password,
      message: 'Email ou mot de passe invalide',
    },
  };

  // Si l'utilisateur n'existe pas
  if (!user) {
    throw new ValidationError('Invalid credentials', invalidCredentials);
  }

  // Vérification du mot de passe
  const validPassword = await bcrypt.compare(password, user.password);

  // Si l'utilisateur existe, mais que le mot de passe est incorrect
  if (!validPassword) {
    throw new ValidationError('Invalid credentials', invalidCredentials);
  }

  return user;
};

export default model('User', userSchema);
