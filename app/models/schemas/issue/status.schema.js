const mongoose = require("mongoose");

const issueStatusSchema = new mongoose.Schema(
    {
        issued_by: {
            type: String,
            default: "Nil",
        },
        issued: {
            type: Boolean,
            default: false,
        },
        keyed: {
            type: Boolean,
            default: false,
        },
        booking: {
            type: Boolean,
            default: false,
        },
        bookingReason: {
            type: String,
            default: "Nil",
        },
    },
    { _id: false, minimize: false }
);
module.exports = issueStatusSchema;
