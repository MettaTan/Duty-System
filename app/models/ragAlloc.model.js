const mongoose = require("mongoose");

const ragAllocSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      default: new Date(null),
    },
    MMRC: { type: Array, default: [] },
    DG: { type: Array, default: [] },
    CollectReturn: { type: Array, default: [] },
    R2: { type: Array, default: [] },
    R3: { type: Array, default: [] },
    DIST: { type: Array, default: [] },
    Salvage: { type: Array, default: [] },
    Others: { type: Array, default: [] },
  },
  { minimize: false }
);

const ragAlloc = mongoose.model("ragAlloc", ragAllocSchema);

module.exports = ragAlloc;
