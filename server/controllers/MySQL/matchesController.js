import ErrorService from '../../services/errorService';
import Match from '../../models/MySQL/Match';
import User from '../../models/MySQL/User';
import Comment from '../../models/MySQL/Comment';

export const index = async (req, res) => {
  try {
    const rawMatches = await Match.findAll();

    const castedMatches = rawMatches.map((m) => {
      if (typeof m.formated === 'string') {
        return {
          ...m.dataValues,
          formated: JSON.parse(m.formated),
          played: !!m.played,
        };
      }

      return m;
    });

    res.status(200).render('pages/matches/index', { matches: castedMatches });
  } catch (error) {
    ErrorService.record(error, res, 500);
  }
};

export const show = async (req, res) => {
  try {
    const match = await Match.findByPk(req.params.id);

    if (match) {
      let castedMatch = match;

      if (typeof match.formated === 'string') {
        castedMatch = {
          ...match.dataValues,
          formated: JSON.parse(match.formated),
          played: !!match.played,
        };
      }

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
        match: castedMatch,
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
