const mongoose = require("mongoose");

const discoverySchema = new mongoose.Schema(
    {
        date: { type: Date, default: new Date() },
        voucher_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Voucher",
            default: null,
        },
        return_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Return",
            default: null,
        },
        title: { type: String },
        location: { type: String },
        tag: { type: String },
        discover_id: { type: String },
        items: { type: String },
        type: { type: String },
    },
    { minimize: false }
);

const Discovery = mongoose.model("Discovery", discoverySchema);

module.exports = Discovery;
