import { Schema, model } from 'mongoose';

export default model(
  'Match',
  new Schema({
    teams: {
      type: Array,
      required: true,
    },
    scores: {
      type: Array,
      required: true,
    },
    time: {
      type: Object,
      required: true,
    },
    venue: {
      type: Object,
      required: true,
    },
    status: {
      type: Object,
      required: true,
    },
    played: {
      type: Boolean,
      required: true,
    },
  }),
);
