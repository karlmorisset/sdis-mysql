import { DataTypes } from 'sequelize';
import User from '@models/MySQL/User';
import Match from '@models/MySQL/Match';
import { sequelize } from '../../config/db/mysql';

const Comment = sequelize.define(
  'Comment',
  {
    body: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Le commentaire ne peut pas être vide',
        },
      },
    },
  },
  { timestamps: true },
);

Comment.belongsTo(User, { as: 'author', foreignKey: 'authorId' });
User.hasMany(Comment, { foreignKey: 'authorId' });

Comment.belongsTo(Match, { as: 'match', foreignKey: 'matchId' });
Match.hasMany(Comment, { foreignKey: 'matchId' });

export default Comment;
