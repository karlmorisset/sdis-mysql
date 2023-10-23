import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/db/mysql';

const Match = sequelize.define(
  'Match',
  {
    team1: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Merci de saisir le nom de l'équipe",
        },
      },
    },
    team2: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Merci de saisir le nom de l'équipe",
        },
      },
    },
    score1: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '0',
    },
    score2: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '0',
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Merci de saisir une date',
        },
      },
    },
    stadium: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Merci de préciser le statut',
        },
      },
    },
    played: {
      type: DataTypes.STRING,
      allowNull: false,
      get() {
        return !!this.getDataValue('played');
      },
    },
    formated: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  { timestamps: false },
);

export default Match;
