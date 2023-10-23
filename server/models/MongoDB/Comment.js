import { Schema, SchemaTypes, model } from 'mongoose';

const commentSchema = new Schema(
  {
    body: {
      type: String,
      required: [true, 'Le commentaire ne peut pas être vide'],
    },
    author: {
      type: SchemaTypes.ObjectId,
      ref: 'User',
    },
    match: {
      type: SchemaTypes.ObjectId,
      ref: 'Match',
    },
  },
  { timestamps: true },
);

export default model('Comment', commentSchema);
