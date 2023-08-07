const Issue = require("../../models/Issue.model");
const Return = require("../../models/Return.model");

module.exports = {
    getBookings: async (type, date, after, before) => {
        if (type == "issue") {
            return await Issue.find({
                date,
                time: { $gte: after, $lte: before },
                "status.booking": true,
            })
                .populate({
                    path: "voucher_id",
                    select: { unit: 1, sto: 1 },
                })
                .select({
                    "status.bookingReason": 1,
                });
        }
        if (type == "return") {
            return await Return.find({
                date,
                "status.booking": true,
            })
                .populate({
                    path: "voucher_id",
                    select: { unit: 1, sto: 1 },
                })
                .select({
                    "status.bookingReason": 1,
                });
        }
    },
    updateBooking: async (book) => {
        const { id, reason } = book;
        const return_ = await Return.findById(id);
        if (!return_) {
            const issue = await Issue.findById(id);
            issue.status.bookingReason = reason;
            await issue.save();
        } else {
            return_.status.bookingReason = reason;
            await return_.save();
        }
    },
};
