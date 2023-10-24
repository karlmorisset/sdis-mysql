import ErrorService from '../../services/errorService';
import Match from '../../models/MySQL/Match';
import User from '../../models/MySQL/User';
import Comment from '../../models/MySQL/Comment';

const castData = (rawData) => {
  if (typeof rawData.formated === 'string') {
    return {
      ...rawData.dataValues,
      formated: JSON.parse(rawData.formated),
      played: !!rawData.played,
    };
  }

  return rawData;
};

export const index = async (req, res) => {
  try {
    const rawMatches = await Match.findAll();

    const castedMatches = rawMatches.map((m) => castData(m));

    res.status(200).render('pages/matches/index', { matches: castedMatches });
  } catch (error) {
    ErrorService.record(error, res, 500);
  }
};

export const show = async (req, res) => {
  try {
    const match = await Match.findByPk(req.params.id);

    if (match) {
      const castedMatch = castData(match);
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
    const rawMatches = await Match.findAll({
      where: {
        played: true,
      },
    });

    const castedMatches = rawMatches.map((m) => castData(m));

    res.status(200).render('pages/matches/played', { matches: castedMatches });
  } catch (error) {
    ErrorService.record(error, res, 500);
  }
};

export const getScheduledMatches = async (req, res) => {
  try {
    const rawMatches = await Match.findAll({
      where: {
        played: false,
      },
    });

    const castedMatches = rawMatches.map((m) => castData(m));

    res.status(200).render('pages/matches/played', { matches: castedMatches });
  } catch (error) {
    ErrorService.record(error, res, 500);
  }
};
