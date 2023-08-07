const Clearance = require("../../../models/Clearance.model");
const User = require("../../../models/User.model");

const moment = require("moment");
const util = require("util");


const {
    renderWeekendReturns,
    renderWeekdayReturns,
} = require("../printReturn.services");



const route = "clearance/printNYRbyReturn";

module.exports = {
    selectDate: async (req, res) => {
        const { date, endDate } = req.body;
        return res.redirect(`/clearance/printNYRbyReturn/${date}/${endDate}`);
    },
    renderReturnSummary: async (req, res) => {
        const { date, endDate } = req.params;
        const day = moment(new Date(date)).format("dddd");

        if (day == "Saturday") {
            const friDate = moment(date).day(5).format();
            const daysDiff = moment(date).diff(friDate, "days");

            let allDates = [];
            for (let i = 0; i < daysDiff + 1; i++) {
                allDates.push(
                    moment(date).subtract(i, "days").format("YYYY-MM-DD"),
                    moment(endDate).subtract(i, "days").format("YYYY-MM-DD")
                );
            }
            return await renderWeekendReturns(res, date, endDate, allDates, route);
        }

        if (day == "Sunday") {
            // This if 'Sunday' is important as sunday is treated as the next week and the format is diff
            const friDate = moment(date).day(5).subtract(1, "weeks").format();
            const daysDiff = moment(date).diff(friDate, "days");

            let allDates = [];
            for (let i = 0; i < daysDiff + 1; i++) {
                allDates.push(
                    moment(date).subtract(i, "days").format("YYYY-MM-DD"),
                    moment(endDate).subtract(i, "days").format("YYYY-MM-DD")
                );
            }
            return await renderWeekendReturns(res, date, endDate, allDates, route);
        } else {
            return await renderWeekdayReturns(res, date, endDate, route);
        }
    },
   
};

