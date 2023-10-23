import Comment from '../../models/MySQL/Comment';
import Match from '../../models/MySQL/Match';
import User from '../../models/MySQL/User';
import ErrorService from '../../services/errorService';

/**
 * Ajoute un commentaire
 *
 * @param {Request} req
 * @param {Response} res
 * @returns Response
 */
export const store = async (req, res) => {
  try {
    const { comment, match: matchId } = req.body;
    const match = await Match.findByPk(matchId);

    if (match) {
      await Comment.sync();

      const freshComment = await Comment.create({
        body: comment,
        authorId: res.locals.user.id,
        matchId: match.id,
      });

      const newComment = await Comment.findByPk(freshComment.id, {
        include: [{ model: User, as: 'author' }],
      });

      return res.status(201).json(newComment);
    }

    throw new Error("Aucun match n'existe avec cet identifiant");
  } catch (error) {
    ErrorService.record(error, res, 500);
  }
};

/**
 * Met à jour un commentaire
 *
 * @param {Request} req
 * @param {Response} res
 * @returns Response
 */
export const update = async (req, res) => {
  const { commentId, body } = req.body;
  const currentUserId = res.locals.user.id;
  try {
    const comment = await Comment.findByPk(commentId, {
      include: [
        {
          model: User,
          as: 'author',
          required: true,
        },
      ],
    });

    if (comment && comment.author.id.toString() === currentUserId) {
      comment.body = body;
      await comment.save();
      return res.sendStatus(204);
    }
    return res.sendStatus(500);
  } catch (error) {
    ErrorService.record(error, res, 500);
  }
};

/**
 * Supprime un commentaire
 *
 * @param {Request} req
 * @param {Response} res
 * @returns Response
 */
export const destroy = async (req, res) => {
  const { commentId } = req.body;
  const currentUserId = res.locals.user.id;

  try {
    const comment = await Comment.findByPk(commentId, {
      include: [
        {
          model: User,
          as: 'author',
          required: true,
        },
      ],
    });

    const canBeDestroyed = comment && comment.author.id === currentUserId;

    if (canBeDestroyed) {
      try {
        await comment.destroy();
        return res.status(200).json(comment);
      } catch (error) {
        return res.status(500).send(error.message);
      }
    }
    return res.status(500).send("L'utilisateur ne peut pas être supprimé");
  } catch (error) {
    ErrorService.record(error, res, 500);
  }
};
