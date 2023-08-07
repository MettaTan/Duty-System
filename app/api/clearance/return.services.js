const Clearance = require("../../models/Clearance.model");
const Voucher = require("../../models/Voucher.model");
const Return = require("../../models/Return.model");
const moment = require("moment");

async function getReturns(date, location) {
    return await Return.find({
        date,
        type: { $nin: "mmrc" },
        location,
        "status.ragStatus.status": { $nin: ["NYR", ""] },
    }).populate("voucher_id");
}

async function getSafekeep(date, location) {
    return await Return.find({
        type: { $nin: "mmrc" },
        location,
        "status.safekeepStatus.sk": true,
        "status.safekeepStatus.skDate": date,
    }).populate("voucher_id");
}

async function getNyr() {
    return await Return.find({
        type: { $nin: "mmrc" },
        "status.ragStatus.status": { $in: ["NYR", ""] },
    })
        .populate({
            path: "voucher_id",
            populate: "issue_id",
        })
        .sort({ location: 1 });
}

async function getDay(date) {
    const allMmrc = await Return.find({
        date,
        type: "mmrc",
    }).populate("voucher_id");

    const r2Returns = await getReturns(date, "R2");
    const r2Safekeep = await getSafekeep(date, "R2");

    const r3Returns = await getReturns(date, "R3");
    const r3Safekeep = await getSafekeep(date, "R3");

    const eshReturns = await getReturns(date, "ESH");
    const eshSafekeep = await getSafekeep(date, "ESH");

    const allR2 = [...r2Returns, ...r2Safekeep];
    const allR3 = [...r3Returns, ...r3Safekeep];
    const allEsh = [...eshReturns, ...eshSafekeep];

    const allNYR = await getNyr();

    return { allMmrc, allR2, allR3, allEsh, allNYR };
}

async function renderWeekdayReturns(res, date, route) {
    const clearance = await Clearance.findOne({ date });


    const nextDay = moment(date).add(1, "days").format("YYYY-MM-DD");
    const mmrcReturns = [];
    const r2 = [];
    const r3 = [];
    const esh = [];
    const nyr = [];

    const { allMmrc, allR2, allR3, allEsh, allNYR } = await getDay(date);
    mmrcReturns.push(...allMmrc);
    r2.push(...allR2);
    r3.push(...allR3);
    esh.push(...allEsh);
    nyr.push(...allNYR);

    return res.render(`${route}/returnSummary`, {
        header: `Clearance For ${moment(date).format("DD/MM/YYYY")}`,
        date,
        nextDay,
        mmrcReturns,
        r2,
        r3,
        esh,
        nyr,

    });
}

async function renderWeekendReturns(res, date, allDates, route) {
    const clearance = await Clearance.findOne({ date });
    const { handover_by, cleared_by } = clearance;

    const nextDay = moment(date).add(1, "days").format("YYYY-MM-DD");
    const mmrcReturns = [];
    const r2 = [];
    const r3 = [];
    const esh = [];
    const nyr = [];

    for (let i = 0; i < allDates.length; i++) {
        const { allMmrc, allR2, allR3, allEsh, allNYR } = await getDay(
            allDates[i]
        );
        mmrcReturns.push(...allMmrc);
        r2.push(...allR2);
        r3.push(...allR3);
        esh.push(...allEsh);

        if (i == 0) {
            // This if block prevents nyr duplication
            nyr.push(...allNYR);
        }
    }

    return res.render(`${route}/returnSummary`, {
        header: `Clearance For ${moment(date).format("DD/MM/YYYY")}`,
        date,
        nextDay,
        handover_by,
        cleared_by,
        mmrcReturns,
        r2,
        r3,
        nyr,
        esh,
    });
}

module.exports = {
    getReturns,
    getSafekeep,
    getNyr,
    renderWeekendReturns,
    renderWeekdayReturns,
};
