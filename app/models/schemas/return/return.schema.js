const mongoose = require("mongoose");

const returnSchema = new mongoose.Schema(
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
    { _id: false }
);
module.exports = returnSchema;
