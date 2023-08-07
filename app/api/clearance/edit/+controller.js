const User = require("../../../models/User.model");
const Clearance = require("../../../models/Clearance.model");
const Return = require("../../../models/Return.model");

const { editIndex } = require("../index.services");

const {
    renderWeekday,
    renderWeekend,
    updateDenoms,
    weekdayRoutes,
    weekendRoutes,
} = require("../issue.services");

const {
    renderWeekendReturns,
    renderWeekdayReturns,
} = require("../return.services");

const moment = require("moment");

const util = require("util");
const route = "clearance/edit";

module.exports = {
    selectDate: async (req, res) => {
        const { date } = req.body;
        return res.redirect(`/clearance/edit/${date}`);
    },
    renderIndex: async (req, res) => {
        const { date } = req.params;

        const clearance = await editIndex(date);
        const { currentTeam } = clearance;

        return res.render("clearance/edit/Index", {
            header: `Edit Clearance For ${moment(date).format("DD/MM/YYYY")}`,
            currentTeam,
            date,
        });
    },
    updateIndex: async (req, res) => {
        const { date } = req.params;
        let currentTeam = [];

        for (const [key, value] of Object.entries(req.body)) {
            currentTeam.push(value);
        }
        await Clearance.findOneAndUpdate(
            { date },
            {
                currentTeam,
            }
        );

        return res.redirect(`/clearance/edit/${date}/detailing`);
    },
    renderDetailing: async (req, res) => {
        const { date } = req.params;
        const clearance = await Clearance.findOne({ date });
        const { currentTeam, detailing, type } = clearance;

        return res.render("clearance/edit/detailing", {
            header: `Edit Clearance For ${moment(date).format("DD/MM/YYYY")}`,
            date,
            currentTeam,
            detailing,
            type,
        });
    },
    updateDetailing: async (req, res) => {
        const { date } = req.params;

        const { type, detailing } = req.body;

        const shifts = [];
        for (const [key, value] of Object.entries(detailing)) {
            shifts.push(value);
        }
        await Clearance.findOneAndUpdate(
            { date },
            {
                type,
                detailing: shifts,
            }
        );

        return res.redirect(
            `/clearance/edit/${date}/issueSummary/${date}/R2/after9`
        );
    },
    renderIssueSummary: async (req, res) => {
        const { date } = req.params;
        const day = moment(new Date(date)).format("dddd");

        if (day == "Friday" || day == "Saturday") {
            const mondayDate = moment(date).day(1).add(1, "weeks").format();
            const daysDiff = moment(mondayDate).diff(date, "days");

            let weekendDates = [];
            for (let i = 0; i < daysDiff + 1; i++) {
                weekendDates.push(
                    moment(date).add(i, "days").format("YYYY-MM-DD")
                );
            }
            return renderWeekend(res, req.params, weekendDates, route);
        }

        if (day == "Sunday") {
            const mondayDate = moment(date).day(1).format();
            const daysDiff = moment(mondayDate).diff(date, "days");

            let weekendDates = [];
            for (let i = 0; i < daysDiff + 1; i++) {
                weekendDates.push(
                    moment(date).add(i, "days").format("YYYY-MM-DD")
                );
            }
            return renderWeekend(res, req.params, weekendDates, route);
        } else {
            return renderWeekday(res, req.params, (weekendDates = []), route);
        }
    },
    updateIssueSummary: async (req, res) => {
        const { date } = req.params;
        await updateDenoms(req.body);

        const day = moment(new Date(date)).format("dddd");
        if (day == "Friday" || day == "Saturday" || day == "Sunday") {
            await weekendRoutes(res, req.params, route);
        } else {
            await weekdayRoutes(res, req.params, route);
        }
    },
    renderReturnSummary: async (req, res) => {
        const { date } = req.params;
        const day = moment(new Date(date)).format("dddd");

        if (day == "Saturday") {
            const friDate = moment(date).day(5).format();
            const daysDiff = moment(date).diff(friDate, "days");

            let allDates = [];
            for (let i = 0; i < daysDiff + 1; i++) {
                allDates.push(
                    moment(date).subtract(i, "days").format("YYYY-MM-DD")
                );
            }
            return await renderWeekendReturns(res, date, allDates, route);
        }

        if (day == "Sunday") {
            // This if 'Sunday' is important as sunday is treated as the next week and the format is diff
            const friDate = moment(date).day(5).subtract(1, "weeks").format();
            const daysDiff = moment(date).diff(friDate, "days");

            let allDates = [];
            for (let i = 0; i < daysDiff + 1; i++) {
                allDates.push(
                    moment(date).subtract(i, "days").format("YYYY-MM-DD")
                );
            }
            return await renderWeekendReturns(res, date, allDates, route);
        } else {
            return await renderWeekdayReturns(res, date, route);
        }
    },
    updateReturnSummary: async (req, res) => {
        const { date } = req.params;
        const { mmrc, r2, r3, esh } = req.body;
        if (mmrc) {
            for (const id of mmrc.id) {
                await Return.findByIdAndUpdate(id, { handover: mmrc.handover });
            }
        }
        for (const { id, handover } of r2 || []) {
            await Return.findByIdAndUpdate(id, { handover });
        }
        for (const { id, handover } of r3 || []) {
            await Return.findByIdAndUpdate(id, { handover });
        }
        for (const { id, handover } of esh || []) {
            await Return.findByIdAndUpdate(id, { handover });
        }
        res.redirect(`/`);
    },
};
