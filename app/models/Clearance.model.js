const mongoose = require("mongoose");

const personnelSchema = require("./schemas/Personnel.schema");
const detailSchema = require("./schemas/Detail.schema");

const clearanceSchema = new mongoose.Schema(
    {
        date: Date,
        currentTeam: [personnelSchema],
        type: {
            type: String,
            default: "weekday",
        },
        detailing: [detailSchema],
        submitted_by: {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            sig: { type: String, default: "" },
        },
        approved_by: {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            sig: { type: String, default: "" },
        },
        handover_by: {
            rankName: { type: String, default: "" },
            sig: { type: String, default: "" },
        },
        cleared_by: {
            rankName: { type: String, default: "" },
            sig: { type: String, default: "" },
        },
    },
    { minimize: false }
);

const Clearance = mongoose.model("Clearance", clearanceSchema);

module.exports = Clearance;
