const Clearance = require("../../models/Clearance.model");
const User = require("../../models/User.model");
const Return = require("../../models/Return.model");
const Discovery = require("../../models/Discovery.model");
const moment = require("moment");
const { getIssues } = require("../report/issue.services");
const { getReturns } = require("../report/return.services");

// This is a blank sig
const sig =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAAAXNSR0IArs4c6QAABGhJREFUeF7t1IEJADAMAsF2/6EtdIuHywRyBu+2HUeAAIGAwDVYgZZEJEDgCxgsj0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIgYLD8AAECGQGDlalKUAIEDJYfIEAgI2CwMlUJSoCAwfIDBAhkBAxWpipBCRAwWH6AAIGMgMHKVCUoAQIGyw8QIJARMFiZqgQlQMBg+QECBDICBitTlaAECBgsP0CAQEbAYGWqEpQAAYPlBwgQyAgYrExVghIg8ACBlFZdWYR+vQAAAABJRU5ErkJggg==";

const personnel = [
    {
        rankName: "",
        sig,
    },
    {
        rankName: "",
        sig,
    },
];

async function editIndex(date) {
    let clearance = await Clearance.findOne({ date });

    const admin = await User.findOne({ username: "RAGIC" });
    const approver = await User.findOne({ username: "DCCIC" });

    if (!clearance) {
        clearance = new Clearance({
            date,
            currentTeam: [],
            detailing: [
                {
                    timing: "1700 - 2000",
                    personnel,
                },
                {
                    timing: "2000 - 2300",
                    personnel,
                },
                {
                    timing: "2300 - 0200",
                    personnel,
                },
                {
                    timing: "0200 - 0500",
                    personnel,
                },
            ],
            submitted_by: {
                user: admin,
                sig,
            },
            approved_by: {
                user: approver,
                sig,
            },
            handover_by: {
                rankName: "",
                sig,
            },
            cleared_by: {
                rankName: "",
                sig,
            },
        });
        await clearance.save();
    }
    return clearance;
}

async function getIssueSummary(date, nextDay) {
    const after9a = await getIssues(date, "09:00", "23:59");
    const after9b = await getIssues(moment(date).add(1, "days").format("YYYY-MM-DD"), "00:00", "04:59");
    const after5 = await getIssues(moment(date).add(1, "days").format("YYYY-MM-DD"), "05:00", "08:59");
    const scheduledIssues = [...after9a, ...after9b, ...after5];
    const issuedVouchers = [];
    const unissuedVouchers = [];
    const keyedVouchers = [];

    scheduledIssues.forEach((issue) => {
        if (issue.status.issued === true) {
            issuedVouchers.push(issue);
        }
        if (issue.status.issued === false) {
            unissuedVouchers.push(issue);
        }
        if (issue.status.keyed === true) {
            keyedVouchers.push(issue);
        }
    });

    return { scheduledIssues, issuedVouchers, unissuedVouchers, keyedVouchers };
}

async function getReturnSummary(date) {
    const scheduledReturns = await Return.find({ date, type: "unit" });
    const returnedVouchers = await getReturns(date, "unit", "RETURNS");
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

    const fullExpand = await getReturns(date, "unit", "FULL EXPAND");
    const safekeeps = await Return.find({
        "status.safekeepStatus.sk": true,
    }).populate("voucher_id");

    const discoveries = await Discovery.find({ date, type: "unit" });

    return {
        scheduledReturns,
        returnedVouchers,
        fullExpand,
        safekeeps,
        discoveries,
        dropAndGo,
        r2Drop,
        r3Drop,
    };
}

async function genIndex(date, nextDay) {
    const issueSummary = await getIssueSummary(date, nextDay);
    const returnSummary = await getReturnSummary(date);
    return { issueSummary, returnSummary };
}

module.exports = {
    editIndex,
    genIndex,
};
