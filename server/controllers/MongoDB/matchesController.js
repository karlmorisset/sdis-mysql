import ErrorService from '@services/errorService';
import Match from '@models/MongoDB/Match';
import Comment from '@models/MongoDB/Comment';
import {
  playedMatches,
  scheduledMatches,
  matchDetails,
  allMatches,
} from '@app/decorators/matchesDecorators';

export const index = async (req, res) => {
  try {
    const matches = await Match.find();

    res
      .status(200)
      .render('pages/matches/index', { matches: allMatches(matches) });
  } catch (error) {
    ErrorService.record(error, res, 500);
  }
};

export const show = async (req, res) => {
  try {
    const { team1, team2 } = req.params;

    // const { matches } = await getData(matchesUrl);
    const match = await Match.findOne({
      teams: [
        {
          name: team1,
        },
        {
          name: team2,
        },
      ],
    });

    const comments = await Comment.find({
      match: match.id,
    }).populate(['match', 'author']);

    res
      .status(200)
      .render('pages/matches/show', { match: matchDetails(match), comments });
  } catch (error) {
    ErrorService.record(error, res, 500);
  }
};

export const getPlayedMatches = async (req, res) => {
  try {
    const matches = await Match.find({ played: true });
    // const { matches } = await getData(matchesUrl);
    // const filteredData = matches.filter((m) => m.played);
    res
      .status(200)
      .render('pages/matches/played', { matches: playedMatches(matches) });
  } catch (error) {
    ErrorService.record(error, res, 500);
  }
};

export const getScheduledMatches = async (req, res) => {
  try {
    const matches = await Match.find({ played: false });
    // const { matches } = await getData(matchesUrl);
    // const filteredData = matches.filter((m) => m.status === 'U');
    res.status(200).render('pages/matches/scheduled', {
      matches: scheduledMatches(matches),
    });
  } catch (error) {
    ErrorService.record(error, res, 500);
  }
};
