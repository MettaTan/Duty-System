const Clearance = require("../../models/Clearance.model");
const Voucher = require("../../models/Voucher.model");
const Issue = require("../../models/Issue.model");
const Return = require("../../models/Return.model");
const moment = require("moment");

async function getVouchers(date, location, after, before) {
    return await Issue.find({
        date,
        location,
        time: {
            $gte: after,
            $lte: before,
        },
    })
        .populate("voucher_id")
        .sort({ time: 1 });
}

async function renderWeekend(res, params, weekendDates, route) {
    const { date, location, issueDate, type } = params;
    const nextDay = moment(date).add(1, "days").format("YYYY-MM-DD");

    if (type == "after9") {
        await renderAfter9(res, params, weekendDates, route);
    }
    if (type == "after5") {
        renderAfter5(res, params, weekendDates, route);
    }
    if (type == "nextdayAfter9") {
        renderNextdayAfter9(res, params, weekendDates, route);
    }
}

async function renderWeekday(res, params, weekendDates, route) {
    const { date, location, issueDate, type } = params;
    const nextDay = moment(date).add(1, "days").format("YYYY-MM-DD");

    if (type == "after9") {
        await renderAfter9(res, params, weekendDates, route);
    }
    if (type == "after5") {
        renderAfter5(res, params, weekendDates, route);
    }
    if (type == "nextdayAfter9") {
        renderNextdayAfter9(res, params, weekendDates, route);
    }
}

async function renderAfter9(res, params, weekendDates, route) {
    const { date, location, issueDate, type } = params;
    const nextDay = moment(date).add(1, "days").format("YYYY-MM-DD");

    const dayIssue = await getVouchers(issueDate, location, "09:00", "23:59");
    const midnightIssue = await getVouchers(
        nextDay,
        location,
        "00:00",
        "04:59"
    );
    const allIssues = [...dayIssue, ...midnightIssue];

    return res.render(`${route}/IssueSummary`, {
        header: `Clearance For ${moment(date).format("DD/MM/YYYY")}`,
        date,
        location,
        issueDate,
        type,
        nextDay,
        weekendDates,
        allIssues: JSON.stringify(allIssues),
    });
}

async function renderAfter5(res, params, weekendDates = [], route) {
    const { date, location, issueDate, type } = params;

    const allIssues = await getVouchers(issueDate, location, "05:00", "08:59");

    return res.render(`${route}/IssueSummary`, {
        header: `Clearance For ${moment(date).format("DD/MM/YYYY")}`,
        date,
        location,
        issueDate,
        type,
        nextDay: issueDate,
        weekendDates,
        allIssues: JSON.stringify(allIssues),
    });
}

// Does not render past 00:00 unlike renderAfter9
async function renderNextdayAfter9(res, params, weekendDates = [], route) {
    const { date, location, issueDate, type } = params;

    const allIssues = await getVouchers(issueDate, location, "09:00", "23:59");

    return res.render(`${route}/IssueSummary`, {
        header: `Clearance For ${moment(date).format("DD/MM/YYYY")}`,
        date,
        location,
        issueDate,
        type,
        nextDay: issueDate,
        weekendDates,
        allIssues: JSON.stringify(allIssues),
    });
}

async function updateDenoms(body) {
    for (const [key, values] of Object.entries(body)) {
        for (const value of values) {
            const { matDoc, matDesc, ea, qty, lot } = value;

            if (typeof matDoc == "object") {
                const voucher = await Voucher.findOne({
                    matDoc: matDoc[0],
                });
                const denoms = [];
                for (let i = 0; i < ea.length; i++) {
                    //find for matDesc in voucher.items
                    const item = voucher.items.find(
                        (item) =>
                            item.matDesc == matDesc[0] && item.lot == lot[i]
                    );
                    denoms.push({ ea: ea[i], qty: qty[i] });
                    item.denoms = denoms;
                }
                await voucher.save();
            }

            if (typeof matDoc == "string") {
                const voucher = await Voucher.findOne({ matDoc });
                //find for matDesc in voucher.items
                const item = voucher.items.find(
                    (item) => item.matDesc == matDesc && item.lot == lot
                );
                item.denoms = [{ ea, qty }];
                await voucher.save();
            }
        }
    }
}
async function weekdayRoutes(res, params, route) {
    const { date, location, issueDate, type } = params;
    const nextDay = moment(issueDate).add(1, "days").format("YYYY-MM-DD");

    if (location == "R2") {
        if (type == "after9") {
            return res.redirect(
                `/${route}/${date}/issueSummary/${nextDay}/R2/after5`
            );
        }
        if (type == "after5") {
            return res.redirect(
                `/${route}/${date}/issueSummary/${issueDate}/R2/nextdayAfter9`
            );
        }
        if (type == "nextdayAfter9") {
            return res.redirect(
                `/${route}/${date}/issueSummary/${date}/R3/after9`
            );
        }
    }
    if (location == "R3") {
        if (type == "after9") {
            return res.redirect(
                `/${route}/${date}/issueSummary/${nextDay}/R3/after5`
            );
        }
        if (type == "after5") {
            return res.redirect(
                `/${route}/${date}/issueSummary/${issueDate}/R3/nextdayAfter9`
            );
        }
        if (type == "nextdayAfter9") {
            return res.redirect(`/${route}/${date}/returnSummary`);
        }
    }
}

async function weekendRoutes(res, params, route) {
    const { date, location, issueDate, type } = params;
    const nextDay = moment(issueDate).add(1, "days").format("YYYY-MM-DD");

    const day = moment(new Date(date)).format("dddd");
    let tuesDate;
    if (day == "Sunday") {
        // This if 'Sunday' is important as sunday is treated as the next week and the format is diff
        tuesDate = moment(date).day(2).format("YYYY-MM-DD");
    } else {
        tuesDate = moment(date).day(2).add(1, "weeks").format("YYYY-MM-DD");
    }

    if (location == "R2") {
        if (nextDay == tuesDate && type == "after9") {
            return res.redirect(
                `/${route}/${date}/issueSummary/${date}/R3/after9`
            );
        }
        if (type == "after9") {
            return res.redirect(
                `/${route}/${date}/issueSummary/${nextDay}/R2/after5`
            );
        }
        if (type == "after5") {
            return res.redirect(
                `/${route}/${date}/issueSummary/${issueDate}/R2/after9`
            );
        }
    }
    if (location == "R3") {
        if (nextDay == tuesDate && type == "after9") {
            return res.redirect(`/${route}/${date}/returnSummary`);
        }
        if (type == "after9") {
            return res.redirect(
                `/${route}/${date}/issueSummary/${nextDay}/R3/after5`
            );
        }
        if (type == "after5") {
            return res.redirect(
                `/${route}/${date}/issueSummary/${issueDate}/R3/after9`
            );
        }
    }
}

module.exports = {
    renderWeekday,
    renderWeekend,
    updateDenoms,
    weekdayRoutes,
    weekendRoutes,
};
