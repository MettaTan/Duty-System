const moment = require("moment");

const Report = require("../../../models/Report.model");
const Clearance = require("../../../models/Clearance.model");
const Voucher = require("../../../models/Voucher.model");

const Issue = require("../../../models/Issue.model");
const Return = require("../../../models/Return.model");
const Discovery = require("../../../models/Discovery.model");

const util = require("util");

const { getIssues, updateIssueStatus } = require("../issue.services");
const { getBookings, updateBooking } = require("../booking.services");
const { createTask, updateTask, deleteTask } = require("../task.services");

const {
    getReturns,
    createReturn,
    updateReturn,
    deleteReturn,
    updateReturnStatus,
} = require("../return.services");

const {
    createDiscovery,
    updateDiscovery,
    deleteDiscovery,
} = require("../discovery.services");

module.exports = {
    selectDate: async (req, res) => {
        const { date } = req.body;
        return res.redirect(`/report/edit/${date}`);
    },
    renderIndex: async (req, res) => {
        const { date } = req.params;

        let clearance = await Clearance.findOne({ date });
        let report = await Report.findOne({ date });

        if (!clearance) {
            throw new Error("Clearance not found, Edit Clearance First");
        }
        if (clearance && !report) {
            report = new Report({ date });
            await report.save();
        }

        const { currentTeam } = clearance;
        const { incomingTeam } = report;

        return res.render("report/edit/Index", {
            header: `Edit Report For ${moment(date).format("DD/MM/YYYY")}`,
            currentTeam,
            incomingTeam,
            date,
        });
    },
    updatePersonnels: async (req, res) => {
        const { date } = req.params;
        const { incomingTeam } = req.body;
        await Report.findOneAndUpdate(
            { date },
            {
                incomingTeam,
            }
        );

        return res.redirect(`/report/edit/${date}/issue`);
    },
    renderIssue: async (req, res) => {
        const { date } = req.params;
        const nextDay = moment(date).add(1, "days").format("YYYY-MM-DD");

        const after9a = await getIssues(date, "09:00", "23:59");
        const after9b = await getIssues(nextDay, "00:00", "04:59");
        const after9 = [...after9a, ...after9b];
        const after5 = await getIssues(nextDay, "05:00", "08:59");

        const taskings = await Issue.find({ date, type: "tasking" }).populate(
            "voucher_id"
        );
        const eshs = await Issue.find({ date, type: "esh" }).populate(
            "voucher_id"
        );

        return res.render("report/edit/Issue", {
            header: `Edit Report For ${moment(date).format("DD/MM/YYYY")}`,
            date,
            type: "issue",
            after9,
            after5,
            taskings,
            eshs,
        });
    },
    updateIssue: async (req, res) => {
        const { date } = req.params;
        const { after9, after5, tasking, esh } = req.body;

        for (const task of tasking || []) {
            if (task.id) {
                if (task.delete) {
                    await deleteTask(task.id);
                } else {
                    await updateTask(task);
                }
            } else if (!task.id && !task.delete) {
                await createTask(task, date, "tasking");
            }
        }

        for (const task of esh || []) {
            if (task.id) {
                if (task.delete) {
                    await deleteTask(task.id);
                } else {
                    await updateTask(task);
                }
            } else if (!task.id && !task.delete) {
                await createTask(task, date, "esh");
            }
        }

        await updateIssueStatus(after5);
        await updateIssueStatus(after9);

        return res.redirect(`/report/edit/${date}/return`);
    },
    renderReturn: async (req, res) => {
        const { date } = req.params;
        const unitTypes = ["unit", "esh", "tasking"];

        const mmrcReturns = await getReturns(date, "mmrc", "RETURNS");
        const unitReturns = await getReturns(date, unitTypes, "RETURNS");
        const dropAndGo = await getReturns(date, unitTypes, "DROP & GO");
        const fullExpand = await getReturns(date, unitTypes, "FULLY EXPENDED");

        return res.render("report/edit/Return", {
            header: `Edit Report For ${moment(date).format("DD/MM/YYYY")}`,
            date,
            type: "return",
            unitReturns,
            dropAndGo,
            fullExpand,
            mmrcReturns,
        });
    },
    updateReturns: async (req, res) => {
        const { date } = req.params;
        const { mmrc, unit, dropAndGo, fullExpand } = req.body;

        for (const mmrc1 of mmrc || []) {
            if (mmrc1.id) {
                if (mmrc1.delete) {
                    await deleteReturn(mmrc1.id);
                } else {
                    await updateReturn(mmrc1);
                }
            } else if (!mmrc1.id && !mmrc1.delete) {
                await createReturn(mmrc1, date, "mmrc", "RETURNS");
            }
        }

        await updateReturnStatus(unit);
        await updateReturnStatus(dropAndGo);
        await updateReturnStatus(fullExpand);

        return res.redirect(`/report/edit/${date}/others/1`);
    },
    renderOthers1: async (req, res) => {
        const { date } = req.params;
        const nextDay = moment(date).add(1, "days").format("YYYY-MM-DD");

        const after9a = await getBookings("issue", date, "09:00", "23:59");
        const after9b = await getBookings("issue", nextDay, "00:00", "04:59");
        const after5 = await getBookings("issue", nextDay, "05:00", "08:59");
        const returns = await getBookings("return", date);
        const allBookings = [...after9a, ...after9b, ...after5, ...returns];

        const allDiscrepancies = await Return.find({
            date,
            "status.discrepStatus.discrepancy": true,
        })
            .populate({
                path: "voucher_id",
                select: { unit: 1, sto: 1 },
            })
            .select({ "status.discrepStatus": 1 });

        const allRecovery = await Return.find({
            date,
            "status.discovery": true,
            type: "mmrc",
        })
            .populate({ path: "voucher_id", select: "sto" })
            .select({ status: 1 });

        const allDiscovery = await Return.find({
            date,
            "status.discovery": true,
            type: "unit",
        })
            .populate({ path: "voucher_id", select: "sto" })
            .select({ status: 1 });

        const allMmrcDiscoveries = await Discovery.find({
            date,
            type: "mmrc",
        }).populate("voucher_id");

        const allUnitDiscoveries = await Discovery.find({
            date,
            type: "unit",
        }).populate("voucher_id");

        return res.render("report/edit/Others1", {
            header: `Edit Report For ${moment(date).format("DD/MM/YYYY")}`,
            date,
            type: "others1",
            allBookings,
            allDiscrepancies,
            allRecovery,
            allDiscovery,
            allMmrcDiscoveries,
            allUnitDiscoveries,
        });
    },
    updateOthers1: async (req, res) => {
        const { date } = req.params;
        const { discrepancy, discovery, recovery, late, booking } = req.body;

        for (const { id, items, ammoIC } of discrepancy || []) {
            const return_ = await Return.findById(id);
            return_.status.discrepStatus.ammoIC = ammoIC;
            return_.status.discrepStatus.items = items;
            await return_.save();
        }
        for (const book of booking || []) {
            await updateBooking(book);
        }

        for (const recover of recovery || []) {
            if (recover._id) {
                if (recover.delete) {
                    await deleteDiscovery(recover);
                } else {
                    await updateDiscovery(recover);
                }
            } else if (!recover._id && !recover.delete)
                await createDiscovery(date, recover, "mmrc");
        }
        for (const discover of discovery || []) {
            if (discover._id) {
                if (discover.delete) {
                    await deleteDiscovery(discover);
                } else {
                    await updateDiscovery(discover);
                }
            } else if (!discover._id && !discover.delete)
                await createDiscovery(date, discover, "unit");
        }

        return res.redirect(`/report/edit/${date}/others/2`);
    },
    renderOthers2: async (req, res) => {
        const { date } = req.params;
        const report = await Report.findOne({ date });

        return res.render("report/edit/Others2", {
            header: `Edit Report For ${moment(date).format("DD/MM/YYYY")}`,
            date,
            report,
            type: "others2",
        });
    },
    updateOthers2: async (req, res) => {
        const { date } = req.params;
        const { outstandingTask, feedback, others } = req.body;
        const report = await Report.findOne({ date });
        report.others.outstandingTask = outstandingTask;
        report.others.feedback = feedback;
        report.others.others = others;
        await report.save();

        return res.redirect(`/report/edit/${date}/final`);
    },
    renderFinal: async (req, res) => {
        const { date } = req.params;
        const nextDay = moment(date).add(1, "days").format("YYYY-MM-DD");

        const report = await Report.findOne({ date });

        const after9a = await getIssues(date, "09:00", "23:59");
        const after9b = await getIssues(nextDay, "00:00", "04:59");
        const after9 = [...after9a, ...after9b];
        const after5 = await getIssues(nextDay, "05:00", "08:59");

        const taskings = await Issue.find({ date, type: "tasking" }).populate(
            "voucher_id"
        );

        const eshs = await Issue.find({ date, type: "esh" }).populate(
            "voucher_id"
        );

        const allIssues = [...after9, ...after5];
        const r2Issued = [];
        const r3Issued = [];
        const notYetIssued = [];
        const keyed = [];

        allIssues.forEach((issue) => {
            if (issue.location === "R2" && issue.status.issued === true) {
                r2Issued.push(issue);
            }
            if (issue.location === "R3" && issue.status.issued === true) {
                r3Issued.push(issue);
            }
            if (issue.status.issued === false) {
                notYetIssued.push(issue);
            }
            if (issue.status.keyed === true) {
                keyed.push(issue);
            }
        });

        const mmrcReturns = await getReturns(date, "mmrc", "RETURNS");
        const unitReturns = await getReturns(date, "unit", "RETURNS");
        const dropAndGo = await getReturns(date, "unit", "DROP & GO");
        const r2Drop = [];
        const r3Drop = [];

        dropAndGo.forEach((drop) => {
            if (drop.location === "R2") {
                r2Drop.push(drop);
            }
            if (drop.location === "R3") {
                r3Drop.push(drop);
            }
        });
        const fullExpand = await getReturns(date, "unit", "FULLY EXPENDED");

        const allReturns = [
            ...mmrcReturns,
            ...unitReturns,
            ...dropAndGo,
            ...fullExpand,
        ];
        const discreps = [];
        const highRates = [];

        allReturns.forEach((return_) => {
            if (return_.status.discrepStatus.discrepancy === true) {
                discreps.push(return_);
            }
            if (return_.status.highRate === true) {
                highRates.push(return_);
            }
        });

        const discoveries = await Discovery.find({ date, type: "unit" });
        const recoveries = await Discovery.find({ date, type: "mmrc" });

        const allVouchers = [...allIssues, ...allReturns, ...taskings, ...eshs];
        const bookings = [];
        allVouchers.forEach((voucher) => {
            if (voucher.status.booking === true) {
                bookings.push(voucher);
            }
        });

        const safekeeps = await Return.find({
            "status.safekeepStatus.sk": true,
        }).populate("voucher_id");

        // console.log(
        //     util.inspect(discreps, {
        //         showHidden: false,
        //         depth: null,
        //         colors: true,
        //     })
        // );

        return res.render("report/edit/Final", {
            header: `Edit Report For ${moment(date).format("DD/MM/YYYY")}`,
            date,
            nextDay,
            report,
            after9,
            after5,
            taskings,
            eshs,
            r2Issued,
            r3Issued,
            notYetIssued,
            keyed,
            unitReturns,
            dropAndGo,
            r2Drop,
            r3Drop,
            fullExpand,
            discreps,
            highRates,
            discoveries,
            recoveries,
            bookings,
            safekeeps,
        });
    },
};
