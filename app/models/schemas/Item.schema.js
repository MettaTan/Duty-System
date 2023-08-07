const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
    {
        matDesc: {
            type: String,
            default: "Not Yet Filled",
        },
        lot: {
            type: String,
            default: "Not Yet Filled",
        },
        qty: {
            type: Number,
            default: "0",
        },
        denoms: [
            {
                ea: Number,
                qty: Number,
            },
        ],
    },
    { minimize: false, _id: false }
);

module.exports = itemSchema;
