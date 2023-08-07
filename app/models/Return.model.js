const mongoose = require("mongoose");
const Handover = require("./schemas/Handover.schema");
const statusSchema = require("./schemas/return/status.schema");

const returnSchema = new mongoose.Schema(
    {
        voucher_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Voucher",
        },
        date: {
            type: Date,
            default: new Date(null),
        },
        time: { type: String, default: "23:59" },
        remarks: { type: String, default: "Nill" },
        location: { type: String, default: "Nill" },
        type: { type: String, default: "unit" },
        handover: Handover,
        status: statusSchema,
        personnels: [],
    },
    { minimize: false }
);

const Return = mongoose.model("Return", returnSchema);

module.exports = Return;
