module.exports = {
    updateVoucher: async (voucher, voucher_id) => {
        voucher.unit = voucher_id.unit;
        voucher.sto = voucher_id.sto;
        voucher.matDoc = voucher_id.matDoc;

        if (voucher_id.items) {
            voucher_id.items.forEach((item, i) => {
                voucher.items[i].matDesc = item.matDesc;
                voucher.items[i].lot = item.lot;
                voucher.items[i].qty = item.qty;
            });
        }
        await voucher.save();
        return;
    },
    updateIssue: async (issue, issue_id) => {
        issue.location = issue_id.location;
        issue.date = issue_id.date;
        issue.time = issue_id.time;
        await issue.save();
        return;
    },
    updateReturn: async (return1, return_id) => {
        return1.date = return_id.date;
        return1.time = return_id.time;
        return1.status.ragStatus = return_id.ragStatus;
        return1.status.safekeepStatus = return_id.safekeepStatus;

        await return1.save();
        return;
    },
};
