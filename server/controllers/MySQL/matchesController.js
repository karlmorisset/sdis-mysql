import ErrorService from '@app/services/errorService';
import Match from '@models/MySQL/Match';
import User from '@models/MySQL/User';
import Comment from '@models/MySQL/Comment';

export const index = async (req, res) => {
  try {
    res
      .status(200)
      .render('pages/matches/index', { matches: await Match.findAll() });
  } catch (error) {
    ErrorService.record(error, res, 500);
  }
};

export const show = async (req, res) => {
  try {
    const match = await Match.findByPk(req.params.id);
    if (match) {
      await Comment.sync();
      const comments = await Comment.findAll({
        where: {
          matchId: req.params.id,
        },
        include: [
          {
            model: User,
            as: 'author',
            required: true,
          },
          {
            model: Match,
            as: 'match',
            required: true,
          },
        ],
      });

      return res.status(200).render('pages/matches/show', {
        match,
        comments,
      });
    }

    return res.status(404).render('errors/404');
  } catch (error) {
    ErrorService.record(error, res, 500);
  }
};

export const getPlayedMatches = async (req, res) => {
  try {
    const matches = await Match.findAll({
      where: {
        played: true,
      },
    });

    res.status(200).render('pages/matches/played', { matches });
  } catch (error) {
    ErrorService.record(error, res, 500);
  }
};

export const getScheduledMatches = async (req, res) => {
  try {
    const matches = await Match.findAll({
      where: {
        played: false,
      },
    });

    res.status(200).render('pages/matches/played', { matches });
  } catch (error) {
    ErrorService.record(error, res, 500);
  }
};
