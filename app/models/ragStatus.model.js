const mongoose = require("mongoose");

const ragStatusSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      default: new Date(null),
    },
    present: { type: Array, default: [] },
    leave: { type: Array, default: [] },
    MC: { type: Array, default: [] },
    AO: { type: Array, default: [] },
  },
  { minimize: false }
);

const ragStatus = mongoose.model("ragStatus", ragStatusSchema);

module.exports = ragStatus;
