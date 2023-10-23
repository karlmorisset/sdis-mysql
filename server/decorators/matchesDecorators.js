/**
 * Retourne une version mis en forme des données de tous matches
 * @returns {Array}
 */
export const allMatches = (matches) =>
  matches.map((m) => ({
    formated: {
      teams: `${m.teams[0].name} / ${m.teams[1].name}`,
      date: `${m.time.label}`,
      venue: `${m.venue.city} / ${m.venue.name}`,
    },
    teams: [
      {
        name: m.teams[0].name,
      },
      {
        name: m.teams[1].name,
      },
    ],
    scores: [m.scores[0], m.scores[1]],
    time: {
      label: m.time.label,
    },
    venue: {
      name: m.venue.name,
      city: m.venue.city,
    },
  }));

/**
 * Retourne une version mis en forme des données des matches joués
 * @returns {Array}
 */
export const playedMatches = (matches) =>
  matches.map((m) => ({
    formated: {
      teams: `${m.teams[0].name} / ${m.teams[1].name}`,
      scores: `${m.scores[0]} / ${m.scores[1]}`,
      date: `${m.time.label}`,
      venue: `${m.venue.city} / ${m.venue.name}`,
      winner: `<span class="winner">${m.teams[0].name}</span>`,
    },
    teams: [
      {
        name: m.teams[0].name,
      },
      {
        name: m.teams[1].name,
      },
    ],
    scores: [m.scores[0], m.scores[1]],
    time: {
      label: m.time.label,
    },
    venue: {
      name: m.venue.name,
      city: m.venue.city,
    },
  }));

export const matchDetails = (m) => ({
  id: m.id,
  formated: {
    teams: `${m.teams[0].name} / ${m.teams[1].name}`,
    scores: `${m.scores[0]} / ${m.scores[1]}`,
    date: `${m.time.label}`,
    venue: `${m.venue.city} / ${m.venue.name}`,
    winner: `<span class="winner">${m.teams[0].name}</span>`,
  },
  teams: [
    {
      name: m.teams[0].name,
    },
    {
      name: m.teams[1].name,
    },
  ],
  scores: [m.scores[0], m.scores[1]],
  time: {
    label: m.time.label,
  },
  played: m.status === 'C',
  venue: {
    name: m.venue.name,
    city: m.venue.city,
  },
  comment: m.comment,
});

/**
 * Retourne une version mis en forme des données des matches programmés
 * @returns {Array}
 */
export const scheduledMatches = (matches) =>
  matches.map((m) => ({
    formated: {
      teams: `${m.teams[0].name} / ${m.teams[1].name}`,
      date: `${m.time.label}`,
      venue: `${m.venue.city} / ${m.venue.name}`,
    },
    teams: [
      {
        name: m.teams[0].name,
      },
      {
        name: m.teams[1].name,
      },
    ],
    scores: [m.scores[0], m.scores[1]],
    time: {
      label: m.time.label,
    },
    venue: {
      name: m.venue.name,
      city: m.venue.city,
    },
  }));
