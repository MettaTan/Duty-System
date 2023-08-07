const mongoose = require("mongoose");

const personnelSchema = new mongoose.Schema(
    {
        appointment: {
            type: String,
            default: "DT",
        },
        rank: {
            type: String,
            default: "PTE",
        },
        name: {
            type: String,
            default: "",
        },
        remarks: {
            type: String,
            default: "",
        },
        sig: {
            type: String,
            default: "",
        },
    },
    { _id: false }
);
module.exports = personnelSchema;
