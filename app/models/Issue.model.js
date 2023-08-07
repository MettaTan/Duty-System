const mongoose = require("mongoose");
const statusSchema = require("./schemas/issue/status.schema");

const issueSchema = new mongoose.Schema(
    {
        voucher_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Voucher",
            default: null,
        },
        date: {
            type: Date,
            default: new Date(null),
        },
        time: { type: String, default: "05:00" },
        location: { type: String, default: "R2" },
        type: { type: String, default: "unit" },
        status: statusSchema,
    },
    { minimize: false }
);

const Issue = mongoose.model("Issue", issueSchema);

module.exports = Issue;
