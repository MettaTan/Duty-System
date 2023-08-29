const mongoose = require("mongoose");

const ragMemberSchema = new mongoose.Schema(
  {
    nric: { type: String, default: "" },
    rank: { type: String, default: "" },
    name: { type: String, default: "" },
  },
  { minimize: false }
);

const ragMember = mongoose.model("ragMember", ragMemberSchema);

module.exports = ragMember;
