const mongoose = require("mongoose");

const ragPersonnelSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      default: Date.now(),
    },
    personnel: [
      {
        nric: String,
        rank: String,
        name: String,
      },
    ],
  },
  { minimize: false, _id: false }
);

module.exports = ragPersonnelSchema;
