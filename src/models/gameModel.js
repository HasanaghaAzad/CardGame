import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const DecksSchema = new Schema({
  type: {
    type: String,
    required: "FULL | SHORT",
  },

  shuffled: {
    type: Boolean,
    required: "true | false",
  },
  remaining: {
    type: Number,
  },
  cards: [
    {
      value: {
        type: String,
      },
      suit: {
        type: String,
      },
      code: {
        type: String,
      },
    },
  ],
});
