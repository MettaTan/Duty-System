const mongoose = require("mongoose");

const detailSchema = new mongoose.Schema(
    {
        timing: String,
        personnel: [
            {
                rankName: String,
                sig: String,
            },
        ],
    },
    { minimize: false, _id: false }
);

module.exports = detailSchema;
