const mongoose = require("mongoose");
const itemSchema = require("./schemas/Item.schema");

const Issue = require("./Issue.model");
const Return = require("./Return.model");

const voucherSchema = new mongoose.Schema({
    unit: String,
    sto: String,
    matDoc: String,
    items: [itemSchema],
    issue_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Issue",
        default: null,
    },
    return_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Return",
        default: null,
    },
});

voucherSchema.pre("findOneAndDelete", async function (next) {
    const id = this._conditions._id;
    await Issue.findOneAndDelete({ voucher_id: id }).exec();
    await Return.findOneAndDelete({ voucher_id: id }).exec();
    next();
});

const Voucher = mongoose.model("Voucher", voucherSchema);

module.exports = Voucher;
