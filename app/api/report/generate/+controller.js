const moment = require("moment");

const { renderFinal } = require("../edit/+controller");

module.exports = {
    selectDate: async (req, res) => {
        const { date } = req.body;
        return res.redirect(`/report/generate/${date}`);
    },
    renderFinal: async (req, res) => {
        await renderFinal(req, res);
    },
};
