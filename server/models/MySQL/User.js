import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import { sequelize } from '../../config/db/mysql';
import ValidationErrorSQL from '../../exceptions/ValidationErrorSQL';

async function encryptPassword(user) {
  const salt = await bcrypt.genSalt();

  const hashedPassword = await bcrypt.hash(user.getDataValue('password'), salt);
  user.setDataValue('password', hashedPassword);

  return hashedPassword;
}

const User = sequelize.define(
  'User',
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Merci de saisir un email',
        },
        isEmail: {
          args: true,
          msg: "Merci d'entrer un email valide",
        },
      },
      unique: {
        msg: 'Cet email est déjà utilisé',
      },
      set(value) {
        this.setDataValue('email', value.toLowerCase());
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Merci de saisir un mot de passe',
        },
      },
      len: {
        args: 6,
        msg: 'Le mot de passe doit avoir 6 caractères minimum',
      },
    },
  },
  {
    timestamps: false,
    hooks: {
      beforeCreate: encryptPassword,
    },
  },
);

User.login = async function login(email, password) {
  const user = await this.findOne({ where: { email } });

  const invalidCredentials = {
    email: {
      value: email,
      path: 'email',
      message: 'Email ou mot de passe invalide',
    },

    password: {
      value: password,
      path: 'password',
      message: 'Email ou mot de passe invalide',
    },
  };

  // Si l'utilisateur n'existe pas
  if (!user) {
    throw new ValidationErrorSQL('Invalid credentials', invalidCredentials);
  }

  // Vérification du mot de passe
  const validPassword = await bcrypt.compare(password, user.password);

  // Si l'utilisateur existe, mais que le mot de passe est incorrect
  if (!validPassword) {
    throw new ValidationErrorSQL('Invalid credentials', invalidCredentials);
  }

  return user;
};

export default User;
