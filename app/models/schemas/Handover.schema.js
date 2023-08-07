const mongoose = require("mongoose");

const handoverSchema = new mongoose.Schema(
    {
        supervised_by: {
            type: String,
            default: "-",
        },
        return_keyed_by: {
            type: String,
            default: "-",
        },
        handover_to: {
            type: String,
            default: "-",
        },
    },
    { _id: false, minimize: false }
);
module.exports = handoverSchema;
