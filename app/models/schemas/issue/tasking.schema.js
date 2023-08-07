const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
    {
        unit: String,
        sto: String,
        location: {
            type: String,
            default: "R2",
        },
        highRate: {
            type: Boolean,
            default: false,
        },
        shortfall: {
            type: Boolean,
            default: false,
        },
        discovery: {
            type: Boolean,
            default: false,
        },
        booked: {
            type: Boolean,
            default: false,
        },
    },
    { minimize: false }
);
module.exports = issueSchema;
