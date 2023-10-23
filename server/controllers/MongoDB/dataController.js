import axios from 'axios';
import { fr } from 'date-fns/locale';
import { format, parseISO } from 'date-fns';
import Match from '@models/MongoDB/Match';
import ErrorService from '@services/errorService';

const matchesUrl = process.env.MATCHES_URI;

/**
 * Permet de retourner des données brutes de l'API de la WRC
 * @returns {Array}
 */
export const getData = async (url) => {
  const { data } = await axios.get(url);

  return data;
};

export const updateDataFromAPI = async (req, res) => {
  try {
    const { matches } = await getData(matchesUrl);

    await Match.deleteMany({});

    matches.forEach(async (m) => {
      await Match.create({
        teams: `${m.teams[0].name} / ${m.teams[1].name}`,
        scores: `${m.scores[0]}, ${m.scores[1]}`,
        time: format(parseISO(m.time.label), 'dd MMMM yyyy', { locale: fr }),
        venue: `${m.venue.name} / ${m.venue.city}`,
        status: m.status,
        played: m.status === 'C',
      });
    });

    return res.redirect('back');
  } catch (error) {
    ErrorService.record(error);
  }
};

export default getData;
