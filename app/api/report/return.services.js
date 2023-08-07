const Voucher = require("../../models/Voucher.model");
const Return = require("../../models/Return.model");
const Discovery = require("../../models/Discovery.model");

module.exports = {
    getReturns: async (date, type, status) => {
        return await Return.find({
            date,
            type: { $in: type },
            "status.ragStatus.status": status,
        }).populate("voucher_id");
    },
    createReturn: async (mmrc, date, type, ragStatus) => {
        const newVoucher = new Voucher({
            unit: mmrc.unit,
            sto: mmrc.sto,
            items: [],
        });
        const newReturn = new Return({
            date,
            time: "10:00",
            type,
            voucher_id: newVoucher._id,
            status: {},
            handover: {},
        });
        newVoucher.return_id = newReturn._id;

        if (!mmrc.status) {
            newReturn.status.ragStatus.status = ragStatus;
            newReturn.status.highRate = false;
            newReturn.status.shortfall = false;
            newReturn.status.discovery = false;
            newReturn.status.booking = false;
        } else {
            newReturn.status.ragStatus.status = ragStatus;
            newReturn.status.highRate = mmrc.status.highRate || false;
            newReturn.status.shortfall = mmrc.status.shortfall || false;
            newReturn.status.discovery = mmrc.status.discovery || false;
            newReturn.status.booking = mmrc.status.booking || false;
        }

        await newReturn.save();
        await newVoucher.save();
        return;
    },

    updateReturn: async (mmrc) => {
        const tasking = await Return.findById(mmrc.id).populate("voucher_id");
        if (!mmrc.status) {
            tasking.status.highRate = false;
            tasking.status.shortfall = false;
            tasking.status.discovery = false;
            tasking.status.booking = false;
        } else {
            tasking.status.highRate = mmrc.status.highRate || false;
            tasking.status.shortfall = mmrc.status.shortfall || false;
            tasking.status.discovery = mmrc.status.discovery || false;
            tasking.status.booking = mmrc.status.booking || false;
        }

        tasking.voucher_id.unit = mmrc.unit;
        tasking.voucher_id.sto = mmrc.sto;
        tasking.location = mmrc.location;

        if (tasking.status.discovery === false) {
            tasking.status.discovery_id = null;
            const discovery = await Discovery.findOne({
                return_id: tasking._id,
            });
            if (discovery) {
                await Discovery.findByIdAndDelete(discovery._id);
            }
        }

        await tasking.voucher_id.save();
        await tasking.save();
        return;
    },
    deleteReturn: async (id) => {
        const return1 = await Return.findById(id);
        const voucher_id = return1.voucher_id;
        await Voucher.findByIdAndDelete(voucher_id);
        await Return.findByIdAndDelete(id);
        return;
    },
    updateReturnStatus: async (obj) => {
        if (!obj || obj.length == 0) {
            return;
        } else {
            for (const eachReturn of obj) {
                const { id, status } = eachReturn;
                const return_ = await Return.findById(id);

                if (!status) {
                    return_.status.highRate = false;
                    return_.status.shortfall = false;
                    return_.status.discovery = false;
                    return_.status.booking = false;
                    return_.status.discrepStatus.discrepancy = false;
                } else {
                    return_.status.highRate = status.highRate || false;
                    return_.status.shortfall = status.shortfall || false;
                    return_.status.discovery = status.discovery || false;
                    return_.status.booking = status.booking || false;
                    return_.status.discrepStatus.discrepancy =
                        status.discrepancy || false;
                }
                if (return_.status.discovery === false) {
                    return_.status.discovery_id = null;
                    const discovery = await Discovery.findOne({
                        return_id: return_._id,
                    });
                    if (discovery) {
                        await Discovery.findByIdAndDelete(discovery._id);
                    }
                }
                await return_.save();
            }
        }
        return;
    },
};
