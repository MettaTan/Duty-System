const Issue = require("../../models/Issue.model");
const Voucher = require("../../models/Voucher.model");
const Return = require("../../models/Return.model");

module.exports = {
    createCollection: async (req, res) => {
        const { date, collections } = req.body;

        for (const [key, value] of Object.entries(collections)) {
            const { time, location, unit, sto, matDoc, items } = value;

            const newVoucher = new Voucher({
                unit,
                sto,
                matDoc,
            });

            for (const item of items) {
                newVoucher.items.push(item);
            }

            const newIssue = new Issue({
                voucher_id: newVoucher._id,
                date,
                time,
                location,
                status: {},
            });

            const newReturn = new Return({
                voucher_id: newVoucher._id,
                location,
                handover: {},
                status: {},
            });

            newVoucher.issue_id = newIssue;
            newVoucher.return_id = newReturn;

            await newVoucher.save();
            await newReturn.save();
            await newIssue.save();
        }
        return res.redirect(`/displayBoard/schedule/issue/${date}`);
    },
};
