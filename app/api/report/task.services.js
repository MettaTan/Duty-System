const Issue = require("../../models/Issue.model");
const Return = require("../../models/Return.model");
const Voucher = require("../../models/Voucher.model");

module.exports = {
    createTask: async (task, date, type) => {
        const newVoucher = new Voucher({
            unit: task.unit,
            sto: task.sto,
            items: [],
        });

        const newTasking = new Issue({
            date,
            time: "10:00",
            location: task.location,
            type,
            voucher_id: newVoucher._id,
            status: {},
        });

        const newReturn = new Return({
            location: task.location,
            type,
            voucher_id: newVoucher._id,
            handover: {},
            status: {},
        });

        newVoucher.issue_id = newTasking._id;
        newVoucher.return_id = newReturn._id;

        if (!task.status) {
            newTasking.status.issued = false;
            newTasking.status.keyed = false;
            newTasking.status.booking = false;
        } else {
            newTasking.status.issued = task.status.issued || false;
            newTasking.status.keyed = task.status.keyed || false;
            newTasking.status.booking = task.status.booking || false;
        }

        await newVoucher.save();
        await newTasking.save();
        await newReturn.save();
        return;
    },
    updateTask: async (task) => {
        const tasking = await Issue.findById(task.id).populate("voucher_id");
        if (!task.status) {
            tasking.status.issued = false;
            tasking.status.keyed = false;
            tasking.status.booking = false;
        } else {
            tasking.status.issued = task.status.issued || false;
            tasking.status.keyed = task.status.keyed || false;
            tasking.status.booking = task.status.booking || false;
        }

        tasking.voucher_id.unit = task.unit;
        tasking.voucher_id.sto = task.sto;
        tasking.location = task.location;

        await tasking.voucher_id.save();
        await tasking.save();
        return;
    },
    deleteTask: async (id) => {
        const issue = await Issue.findById(id).populate({
            path: "voucher_id",
            populate: "return_id",
        });
        const voucher_id = issue.voucher_id._id;
        const return_id = issue.voucher_id.return_id._id;
        await Voucher.findByIdAndDelete(voucher_id);
        await Return.findByIdAndDelete(return_id);
        await Issue.findByIdAndDelete(id);
        return;
    },
};
