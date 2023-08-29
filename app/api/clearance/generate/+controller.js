const Clearance = require("../../../models/Clearance.model");
const User = require("../../../models/User.model");

const moment = require("moment");
const util = require("util");

const {
  renderWeekday,
  renderWeekend,
  weekdayRoutes,
  weekendRoutes,
} = require("../issue.services");

const {
  renderWeekendReturns,
  renderWeekdayReturns,
} = require("../return.services");

const { genIndex } = require("../index.services");

const route = "clearance/generate";

module.exports = {
  selectDate: async (req, res) => {
    const { date } = req.body;
    return res.redirect(`/clearance/generate/${date}`);
  },
  renderIndex: async (req, res) => {
    const { date } = req.params;
    const nextDay = moment(date).add(1, "days").format("YYYY-MM-DD");

    const clearance = await Clearance.findOne({ date })
      .populate("submitted_by.user")
      .populate("approved_by.user");

    if (!clearance) {
      throw new Error("Clearance not edited yet, Edit Clearance First!");
    }

    const { issueSummary, returnSummary } = await genIndex(date);
    const { scheduledIssues, issuedVouchers, unissuedVouchers, keyedVouchers } =
      issueSummary;

    const {
      scheduledReturns,
      returnedVouchers,
      fullExpand,
      safekeeps,
      discoveries,
      dropAndGo,
      r2Drop,
      r3Drop,
    } = returnSummary;

    const { currentTeam, detailing, type, submitted_by, approved_by } =
      clearance;

    return res.render("clearance/generate/Index", {
      header: `Clearance For ${moment(date).format("DD/MM/YYYY")}`,
      date,
      nextDay,
      currentTeam,
      detailing,
      type,
      submitted_by,
      approved_by,
      scheduledIssues,
      issuedVouchers,
      unissuedVouchers,
      keyedVouchers,
      scheduledReturns,
      returnedVouchers,
      fullExpand,
      safekeeps,
      discoveries,
      dropAndGo,
      r2Drop,
      r3Drop,
    });
  },
  updateIndex: async (req, res) => {
    const { date } = req.params;
    const { submitted_by, approved_by } = req.body;

    if (submitted_by) {
      const admin = await User.findById(submitted_by.id);
      if (approved_by) {
        const approver = await User.findById(approved_by.id);
        await Clearance.findOneAndUpdate(
          { date },
          {
            submitted_by: {
              user: admin,
              sig: submitted_by.sig,
            },
            approved_by: {
              user: approver,
              sig: approved_by.sig,
            },
          }
        );
      } else {
        await Clearance.findOneAndUpdate(
          { date },
          {
            submitted_by: {
              user: admin,
              sig: submitted_by.sig,
            },
          }
        );
      }
    }

    return res.redirect(
      `/clearance/generate/${date}/issueSummary/${date}/R2/after9`
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
        weekendDates.push(moment(date).add(i, "days").format("YYYY-MM-DD"));
      }
      return renderWeekend(res, req.params, weekendDates, route);
    }

    if (day == "Sunday") {
      const mondayDate = moment(date).day(1).format();
      const daysDiff = moment(mondayDate).diff(date, "days");

      let weekendDates = [];
      for (let i = 0; i < daysDiff + 1; i++) {
        weekendDates.push(moment(date).add(i, "days").format("YYYY-MM-DD"));
      }
      return renderWeekend(res, req.params, weekendDates, route);
    } else {
      return renderWeekday(res, req.params, (weekendDates = []), route);
    }
  },
  updateIssueSummary: async (req, res) => {
    const { date } = req.params;

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
        allDates.push(moment(date).subtract(i, "days").format("YYYY-MM-DD"));
      }
      await renderWeekendReturns(res, date, allDates, route);
    }

    if (day == "Sunday") {
      // This if 'Sunday' is important as sunday is treated as the next week and the format is diff
      const friDate = moment(date).day(5).subtract(1, "weeks").format();
      const daysDiff = moment(date).diff(friDate, "days");

      let allDates = [];
      for (let i = 0; i < daysDiff + 1; i++) {
        allDates.push(moment(date).subtract(i, "days").format("YYYY-MM-DD"));
      }
      await renderWeekendReturns(res, date, allDates, route);
    } else {
      await renderWeekdayReturns(res, date, route);
    }
  },
  updateReturnSummary: async (req, res) => {
    const { date } = req.params;
    const { handover_by, cleared_by } = req.body;

    await Clearance.findOneAndUpdate(
      { date },
      {
        handover_by,
        cleared_by,
      }
    );

    return res.redirect(`/`);
  },
};
