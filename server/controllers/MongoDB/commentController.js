import Comment from '@models/MongoDB/Comment';
import Match from '@models/MongoDB/Match';
import ErrorService from '@services/errorService';

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
    const match = await Match.findById(matchId);

    if (match) {
      await Comment.create({
        body: comment,
        author: res.locals.user.id,
        match: match.id,
      });
    }

    return res.redirect('back');
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
    const comment = await Comment.findById(commentId);
    // eslint-disable-next-line no-underscore-dangle
    if (comment && comment.author._id.toString() === currentUserId) {
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
  console.warn(currentUserId);

  try {
    const comment = await Comment.findById(commentId);

    // eslint-disable-next-line no-underscore-dangle
    if (comment && comment.author._id.toString() === currentUserId) {
      await Comment.deleteOne({ _id: commentId });
      return res.sendStatus(204);
    }
    return res.sendStatus(500);
  } catch (error) {
    ErrorService.record(error, res, 500);
  }
};
