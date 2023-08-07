const mongoose = require("mongoose");

const returnStatusSchema = new mongoose.Schema(
    {
        ragStatus: {
            status: { type: String, default: "NYR" },
            remarks: { type: String, default: "" },
        },
        discrepStatus: {
            discrepancy: { type: Boolean, default: false },
            ammoIC: { type: String, default: "" },
            items: [
                {
                    name: { type: String, default: "" },
                    declaredQty: { type: Number, default: 0 },
                    returnQty: { type: Number, default: 0 },
                },
            ],
        },
        safekeepStatus: {
            sk: { type: Boolean, default: false },
            skDate: { type: Date, default: new Date(null) },
            skCollect: { type: Date, default: new Date(null) },
            skDT: [
                {
                    rankName: { type: String, default: "" },
                },
            ],
        },
        highRate: { type: Boolean, default: false },
        shortfall: { type: Boolean, default: false },
        discovery: { type: Boolean, default: false },
        discovery_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Discovery",
            default: null,
        },
        booking: { type: Boolean, default: false },
        bookingReason: { type: String, default: "" },
    },
    { _id: false, minimize: false }
);
module.exports = returnStatusSchema;
