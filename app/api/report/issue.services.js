const Issue = require("../../models/Issue.model");

module.exports = {
    getIssues: async (date, after, before) => {
        return await Issue.find({
            date,
            time: {
                $gte: after,
                $lte: before,
            },
            type: "unit",
        })
            .populate("voucher_id")
            .sort({ location: 1 });
    },
    updateIssueStatus: async (obj) => {
        if (!obj || obj.length == 0) {
            return;
        } else {
            for (const eachIssue of obj) {
                const { id, status } = eachIssue;
                const issue = await Issue.findById(id);

                if (!status) {
                    issue.status.issued = false;
                    issue.status.keyed = false;
                    issue.status.booking = false;
                } else {
                    issue.status.issued = status.issued || false;
                    issue.status.keyed = status.keyed || false;
                    issue.status.booking = status.booking || false;
                }

                await issue.save();
            }
        }
        return;
    },
};
